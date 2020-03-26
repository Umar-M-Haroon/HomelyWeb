import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import Chore from '../../Model/Chore';
import Payment from '../../Model/Payment';
import Supply from '../../Model/Supply';

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
            if (window.location.hostname === "localhost") {
                this.db.settings({
                    host: "localhost:8080",
                    ssl: false
                })
            }
            // this.db.enablePersistence()
            //     .catch(err => {
            //         console.log("Error setting persistence");
            //         console.log(err);
            //     });
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
        // this.auth.currentUser.providerData.forEach(element => {
        //     this.db.collection('Homes').where("userIDs", "array-contains", element.uid).get().then((result) => {
        //         result.docs.forEach((querySnapshot) => {
        //             console.log(querySnapshot.data())
        //         })
        //     }).catch((error) => {
        //     });
        // });
        var testHomeObject = {}
        testHomeObject.userIDs = [this.auth.currentUser.uid, "OfmzIC88wxYBsPXpUd4R3cgHwM12"]


        var basicChore = new Chore("Test", null, null, false, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 11, 0, 0, 0)))
        var basicChoreHistory = basicChore.toHistory(this.auth.currentUser.uid, false)
        basicChoreHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 8, 0, 0))

        var choreWithAssignedUsers = new Chore("Chore With Assigned Users", null, ["OfmzIC88wxYBsPXpUd4R3cgHwM12"], false, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 30, 0, 0)))
        var choreWithAssignedUsersHistory = choreWithAssignedUsers.toHistory(this.auth.currentUser.uid, false)
        choreWithAssignedUsersHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 9, 0, 0))

        var choreWithDeadline = new Chore("Chore with Deadline", new Date(2020, 4, 27, 0, 0, 0, 0), null, false, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 59, 0, 0)))
        var choreWithDeadlineHistory = choreWithDeadline.toHistory(this.auth.currentUser.uid, false)
        choreWithDeadlineHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 10, 0, 0, 0))

        var choreWithEverything = new Chore("Chore with Everything", new Date(2020, 4, 27, 0, 0, 0, 0), ["OfmzIC88wxYBsPXpUd4R3cgHwM12", "9cN3l0x3NQY95dx7zE3nJI4z0613"], false, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 1, 0, 0)))
        var choreWithEverythingHistory = choreWithEverything.toHistory(this.auth.currentUser.uid, false)
        choreWithEverythingHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 11, 0, 0))


        var basicSupply = new Supply("Test Supply", 1, null, false, null, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 2, 0, 0)))
        var basicSupplyHistory = basicSupply.toHistory(this.auth.currentUser.uid, false)
        basicSupplyHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 12, 0, 0))

        var supplyWithDescription = new Supply("Supply With Description", 10, "Lorem Ipsum", false, null, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 3, 0, 0)))
        var supplyWithDescriptionHistory = supplyWithDescription.toHistory(this.auth.currentUser.uid, false)
        supplyWithDescriptionHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 13, 0, 0, 0))


        var genericPayment = new Payment("Test Payment", null, 30, null, null, false, null, new Date(2020, 3, 25, 12, 4, 0, 0))
        var genericPaymentHistory = genericPayment.toHistory(this.auth.currentUser.uid, false)
        genericPaymentHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 14, 0, 0, 0))

        var paymentWithDescription = new Payment("Payment With Description", null, 15, null, "Lorem Ipsum", false, null, new Date(2020, 3, 25, 12, 5, 0, 0))
        var paymentWithDescriptionHistory = paymentWithDescription.toHistory(this.auth.currentUser.uid, false)
        paymentWithDescriptionHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 15, 0, 0, 0))

        var paymentWithAssignedUsers = new Payment("Payment with assigned users", null, 20, ["OfmzIC88wxYBsPXpUd4R3cgHwM12", "9cN3l0x3NQY95dx7zE3nJI4z0613"], null, false, null, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 6, 0, 0)))
        var paymentWithAssignedUsersHistory = paymentWithAssignedUsers.toHistory(this.auth.currentUser.uid, false)
        paymentWithAssignedUsersHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 16, 0, 0, 0))

        var paymentWithAllValues = new Payment("Full Payment", new Date(2020, 4, 27, 0, 0, 0, 0), 50, ["OfmzIC88wxYBsPXpUd4R3cgHwM12", "9cN3l0x3NQY95dx7zE3nJI4z0613"], "Payment Random Description", false, null, app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 12, 7, 0, 0)))
        var paymentWithAllValuesHistory = paymentWithAllValues.toHistory(this.auth.currentUser.uid, false)
        paymentWithAllValuesHistory.Timestamp = app.firestore.Timestamp.fromDate(new Date(2020, 3, 25, 17, 0, 0, 0))


        testHomeObject.Users = [
            {
                "Completed Items": [],
                "Display Name": "Jane Doe",
                "User ID": this.auth.currentUser.uid,
                "Venmo ID": "VENMO ID TEST"
            },
            {
                "Completed Items": [],
                "Display Name": "Johnny Appleseed",
                "User ID": "OfmzIC88wxYBsPXpUd4R3cgHwM12",
                "Venmo ID": "VENMO2"
            }
        ]
        testHomeObject.Chores = [
            basicChore.toFirestore(),
            choreWithAssignedUsers.toFirestore(),
            choreWithDeadline.toFirestore(),
            choreWithEverything.toFirestore()
        ]
        testHomeObject.Supplies = [
            basicSupply.toFirestore(),
            supplyWithDescription.toFirestore()
        ]
        testHomeObject.Payments = [
            genericPayment.toFirestore(),
            paymentWithDescription.toFirestore(),
            paymentWithAssignedUsers.toFirestore(),
            paymentWithAllValues.toFirestore()
        ]
        testHomeObject.History = [
            basicChoreHistory,
            choreWithAssignedUsersHistory,
            choreWithDeadlineHistory,
            choreWithEverythingHistory,
            basicSupplyHistory,
            supplyWithDescriptionHistory,
            genericPaymentHistory,
            paymentWithDescriptionHistory,
            paymentWithAssignedUsersHistory,
            paymentWithAllValuesHistory
        ]
        this.db.collection("Homes").doc("TESTHOME").set(testHomeObject).then(() => {
            console.log("Successfully set test home")
        }).catch((error) => {
            console.log(`Error writing document: ${error}`)
        })
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
        var provider = new app.auth.OAuthProvider('apple.com');
        provider.addScope('name');
        this.auth.currentUser.linkWithPopup(provider).catch((error) => {
            if (error.code === "auth/credential-already-in-use") {
                this.auth.signInWithCredential(error.credential).then((result) => {
                });
            }
        })
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
        console.log(this.defaultHome)
        console.log(this.auth.currentUser)
        this.db.collection("Homes").doc(this.defaultHome).set(homeData).then(function () {
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
}
export default Firebase