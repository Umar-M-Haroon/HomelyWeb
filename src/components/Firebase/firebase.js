import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import Chore from '../../Model/Chore';
import Supply from '../../Model/Supply';
import Payment from '../../Model/Payment';
const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
}
class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(config);
            this.auth = app.auth();
            this.db = app.firestore();
            this.functions = app.functions();
            this.storage = app.storage();
            this.db.enablePersistence()
                .catch(err => {
                    console.log("Error setting persistence");
                    console.log(err);
                });
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

    userData = () => {
        return 
    };

    getImage = (userID) => {
        var reference = this.storage.ref('images/' + userID + ".png");
        return reference.getDownloadURL()
    }

    homes = () => {
        this.auth.currentUser.providerData.forEach(element => {
            this.db.collection('Homes').where("userIDs", "array-contains", element.uid).get().then((result) => {
                result.docs.forEach((querySnapshot) => {

                })
            }).catch((error) => {
            });
        });
        return this.db.collection('Homes').where("userIDs", "array-contains", this.auth.currentUser.uid).get();
    }
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
                            console.log(this.auth.currentUser.uid);
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
    addItem(state, type) {
        const { title, quantity } = state
        if (title == null || title === "") {
            console.log("Title is null or empty")
            return
        }
        if (type !== "Chores" && quantity == null) {
            return
        }
        var firebaseFriendlyItem, historyItem;

        switch (type) {
            case "Chores":
                var chore = new Chore(state.title, state.choreDeadlineDate, state.choreUsers, false, null);
                firebaseFriendlyItem = chore.toFirestore()
                historyItem = chore.toHistory(this.auth.currentUser.uid, false)
                break;
            case "Supplies":
                var supply = new Supply(state.title, state.supplyQuantity, state.supplyDescription, false, null, null);
                firebaseFriendlyItem = supply.toFirestore()
                historyItem = supply.toHistory(this.auth.currentUser.uid, false)
                break
            case "Payments":
                var payment = new Payment(state.title, state.paymentDeadlineDate, state.paymentQuantity, state.paymentUsers, state.paymentDescription, false, null, null)
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
        this.db.collection("Homes").doc(this.defaultHome).update(homeData).then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
}
export default Firebase