import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import Chore from '../../Model/Chore';
import Payment from '../../Model/Payment';
import Supply from '../../Model/Supply.ts';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}
class Firebase {
    /**
     * initial constructor initializes firebase and the default home. 
     * The if ensures it Doesn't reinitialize firebase and cause issues
     */
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(config);
            this.auth = app.auth();
            this.db = app.firestore();
            this.functions = app.functions();
            this.storage = app.storage();
            //emulator setup. If you want to use firebase emulators, use the ./dir folder and keep this if statement in
            // if you dont, comment out this if statement and uncomment the persistence lines.
            if (window.location.hostname === "localhost") {
                this.db.settings({
                    host: "localhost:8080",
                    ssl: false
                })
            } else {
                this.db.enablePersistence()
                    .catch(err => {
                        console.log("Error setting persistence");
                        console.log(err);
                    });
            }
            this.defaultHome = null
        } else {
            return
        }
    }

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
    /**
     * @returns {string}
     */
    userData = () => {
        return this.auth.currentUser.uid
    };

    /**
     * @param {string} userID the userID that we want to get the image for
     * @returns {Promise<String, Error>}
     */
    getImage = (userID) => {
        //images are stored under a 'images' folder with the extension {userID}.png
        var reference = this.storage.ref('images/' + userID + ".png");
        return reference.getDownloadURL()
    }


    /**
     *
     * get the user's homes. Since users can be in multiple homes, we use the query ("where") clause
     * I havent implemented the multiple homes per provider id yet, but thats what all but the return does
     * @memberof Firebase
     */
    homes = () => {

        // if (this.auth.currentUser.providerData && this.auth.currentUser.providerData[0] && this.auth.currentUser.providerData[0].uid) {
        //     if (this.auth.currentUser.providerData[0].uid !== this.auth.currentUser.uid) {
        //         console.log("running alternate")
        //         return this.db.collection('Homes').where("userIDs", "array-contains", this.auth.currentUser.providerData[0].uid)
        //     }
        // }
        return this.db.collection('Homes').where("userIDs", "array-contains", this.auth.currentUser.uid)
    }
    /**
     *
     * Signs in a person with apple and just in case they've already signed in before, 
     * migrate them to the new id
     * @memberof Firebase
     */
    handleSignInWithApple = () => {
        var provider = new app.auth.OAuthProvider('apple.com');
        provider.addScope('name');
        this.auth.signInWithPopup(provider)
            .then((result) => {
                if (result.additionalUserInfo.isNewUser === false) {
                    let token = result.additionalUserInfo.profile.sub;
                    var createCustomToken = this.functions.httpsCallable('createCustomToken');
                    createCustomToken({ identifier: token }).then(result => {
                        var createdToken = result.data.token;
                        this.auth.signInWithCustomToken(createdToken).then(() => {
                            this.migrateUserToSignInWithApple();
                        });
                    }).catch((error) => {
                        console.log(error);
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            });
    }
    /**
     * For previous firebase instances, people can sign in with apple with a different id. If it does, then it migrates the id and links it with the new id
     *
     * @memberof Firebase
     */
    migrateUserToSignInWithApple = () => {
        // var provider = new app.auth.OAuthProvider('apple.com');
        // provider.addScope('name');
        // this.auth.currentUser.linkWithPopup(provider).catch((error) => {
        //     console.log("WE HERE MIGRATE")
        //     if (error.code === "auth/credential-already-in-use") {
        //         this.auth.signInWithCredential(error.credential).then((result) => {
        //         });
        //     }
        // })
    }
    /**
     *
     *
     * @param {*} state state is the add item form's state, 
     * for a chore form is a title, deadline, and assigned users
     * a state for a supply form is a title, quantity, and a description
     * a state for a payment is a title, amount/quantity, deadline, assigned users, and description
     * the only required values are the title and a quantity if it is a supply or payment
     * @param {*} type this is the item category, which can be a chore, supply, or payment
     * @memberof Firebase
     */
    addItem(state, type) {
        const { title, quantity } = state
        //checks if values fit the requirements of a valid item (aka valid title and non-empty quanity for supplies/payments)
        if (title == null || title === "") {
            console.log("Title is null or empty")
            return
        }
        if (type !== "Chores" && parseFloat(quantity).toFixed(2) === null) {
            console.log("Quantity is invalid")
            return
        }
        var firebaseFriendlyItem, historyItem;
        //depending on the category we have to create the correct model object. 
        //Each model object will then be converted to a firestore friendly object
        //A history object is also made from a model object
        switch (type) {
            case "Chores":
                var chore = new Chore(state.title, state.DeadlineDate, state.assignedUsers, false, null);
                firebaseFriendlyItem = chore.toFirestore()
                historyItem = chore.toHistory(this.auth.currentUser.uid, false)
                break;
            case "Supplies":
                var supply = new Supply(state.title, parseFloat(state.Quantity).toFixed(2), state.Description, false, null, null);
                firebaseFriendlyItem = supply.toFirestore()
                historyItem = supply.toHistory(this.auth.currentUser.uid, false)
                break
            case "Payments":
                var payment = new Payment(state.title, state.DeadlineDate, state.Quantity, state.assignedUsers, state.Description, false, null, null)
                firebaseFriendlyItem = payment.toFirestore()
                historyItem = payment.toHistory(this.auth.currentUser.uid, false)
                break
            default:
                break;
        }
        var typeString = type.toString()
        var homeData = {}
        homeData[typeString] = app.firestore.FieldValue.arrayUnion(firebaseFriendlyItem)
        homeData.History = app.firestore.FieldValue.arrayUnion(historyItem)
        //once the correct objects are made, a final object is created and sent to firebase, and the success of it is logged.
        this.db.collection("Homes").doc(this.defaultHome).update(homeData)
            .then(function () {
                console.log("Document successfully updated!");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
    getUserForItem(users, history, original) {
        var userID = this.getAuthorOfItem(history, original)
        var user = users.find(user => user["User ID"] === userID)
        return user
    }
    getAuthorOfItem(history, original) {
        var foundItem = history.find(item =>
            item["Item ID"].isEqual(original.Timestamp)
        )
        return foundItem.Author
    }
    completeItem(itemID, type) {
        let completeItemPromise = new Promise((resolve, reject) => {
            if (this.defaultHomeData === undefined) {
                reject("No Home Data")
            }
            if (this.defaultHome === undefined) {
                reject("No Home Data")
            }
            this.defaultHomeData.Users = this.defaultHomeData.Users.map((user) => {
                if (user["User ID"] === this.auth.currentUser.uid) {
                    user["Completed Items"].push(itemID)
                }
                return user
            })
            let newHistory
            let newItems
            switch (type) {
                case "Chores":
                    newItems = this.defaultHomeData.Chores.map((chore) => {
                        if (chore.Timestamp === itemID) {
                            chore.Completed = true
                            var x = new Chore(chore)
                            newHistory = x.toHistory(this.auth.currentUser.uid, true)
                            newHistory["Item ID"] = chore.Timestamp
                        }
                        return chore
                    })
                    break
                case "Supplies":
                    newItems = this.defaultHomeData.Supplies.map((supply) => {
                        if (supply.Timestamp === itemID) {
                            supply.Completed = true
                            var x = new Supply(supply)
                            newHistory = x.toHistory(this.auth.currentUser.uid, true)
                            newHistory["Item ID"] = supply.Timestamp
                        }
                        return supply
                    })
                    break
                case "Payments":
                    newItems = this.defaultHomeData.Payments.map((payment) => {
                        if (payment.Timestamp === itemID) {
                            payment.Completed = true
                            var x = new Payment(payment)
                            newHistory = x.toHistory(this.auth.currentUser.uid, true)
                            newHistory["Item ID"] = payment.Timestamp
                        }
                        return payment
                    })
                    break
                default:
                    break
            }
            var test = app.firestore.FieldValue.arrayUnion(newHistory)
            var newObject = {}
            newObject[type] = newItems
            newObject["History"] = test
            newObject["Users"] = this.defaultHomeData.Users
            console.log(newObject)
            this.db.collection("Homes").doc(this.defaultHome).update(newObject).then(() => {
                resolve("Successfully Completed Item")
            }).catch((err) => {
                console.log("Test Completion Failed")
                console.log(err)
                reject(err)
            })
        }
        )
        return completeItemPromise
    }
    joinHome(newID) {
        //FIXME: implement this LMAO
    }

    createHome(homeNameInput) {
        if (!this.auth.currentUser) { return }
        if (homeNameInput) {
            homeNameInput = ""
        }
        let defaultHomeObject = {
            "Home Name": homeNameInput,
            "userIDs": [this.auth.currentUser.uid],
            "Chores": [],
            "Supplies": [],
            "Payments": [],
            "History": [],
            "Users": [{
                "Display Name": this.auth.currentUser.displayName,
                "Completed Items": [],
                "Venmo ID": "",
                "User ID": this.auth.currentUser.uid
            }]
        }
        return this.db.collection('Homes').add(defaultHomeObject)
    }
}
export default Firebase