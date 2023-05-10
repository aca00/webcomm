import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    get,
    remove,
    push,
    onChildAdded,
    query,
    orderByChild, limitToLast, onValue, update
} from "firebase/database";

import {
    getAuth,
    signOut,
    signInWithEmailAndPassword,
    signInAnonymously,
    signInWithCredential,
    sendEmailVerification,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";


const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

const tf = require('@tensorflow/tfjs');
const path = require('path');

export class Worker {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.db = getDatabase(this.app);
        this.auth = getAuth();
    }

    async loadModel(sampleInput) {
        console.log(sampleInput)
        console.log("called loadModel");

        // Load the TensorFlow.js model from a local file using a relative path
        let fbpath = "https://firebasestorage.googleapis.com/v0/b/my-test-project-16705.appspot.com/o/model.json?alt=media&token=d2f4471c-d108-4f35-bb30-8325c0fd1c82"
        const model = await tf.loadLayersModel(fbpath);
        console.log(model);

        var pred = model.predict(tf.tensor2d(sampleInput));
        console.log(`prediction result: ${pred}`)

        return pred;
    }

    async listenToAuthChange() {
        onAuthStateChanged(this.auth, (user) => {
            console.log("INDEX: listenToAuthChange: Auth state changed")
            if (user) {
                console.log(user);
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    }

    async reload() {
        await this.auth.currentUser.reload();
    }

    async signInWithCred(cred) {
        console.log("INDEX: Signing in with cred")
        var ucred = await signInWithCredential(this.auth, cred).catch((err) => {
            console.log(`INDEX: signinwithcred: ${err.message}`)
        })
        return ucred;
    }

    async collectionExists(path) {
        console.log(`check if collection exist at ${path}`);
        if (path && this.db) {
            var snapshot = await get(ref(this.db, path));
            return snapshot.exists();
        } else {
            console.log("path error or db error")
            console.log(path)
        }
    }

    async sendMessage(uid = "XYZ", uname = "ABC", utype = "anon", message = "", path = null, msgCount = null, time = null) {
        console.log("INDEX: Adding new message");
        console.log(`INDEX:
            path: ${path}
            name: ${uname}
            utype: ${utype}
            message: ${message}
            uid: ${uid}
        `);
        if (!time) {
            time = new Date().toISOString();
        }
        if (uid) {
            console.log("INDEX: uid valid")
            if (path && this.db) {
                var listRef = await push(ref(this.db, path));
                await set(listRef, {
                    name: uname,
                    time: time,
                    uid: uid,
                    message: message,
                    type: utype
                }).then(() => {
                    console.log(`INDEX: New message added msg_count: ${msgCount}`)
                    if (msgCount) {
                        chrome.runtime.sendMessage({
                            type: "message-sent",
                            data: {
                                msgID: listRef.key,
                                msgCount: msgCount,
                                uid: uid,
                                time: time,
                                name: uname,
                                type: utype,
                                message: message,
                                status: "sent"
                            }
                        });
                    }
                }).catch((error) => {
                    console.log("INDEX: Error sending message", error);
                })
            } else {
                console.log("INDEX: path-error-while-sending-message");
            }
        } else {
            console.log("INDEX: user-not-registered");
        }
    }

    async rate(rateVal = 0, uid = null, path = null) {

        let rateData = { totalRating: 0, totalCount: 0, userRating: rateVal }

        if (path && this.db && uid) {
            console.log("INDEX: Rating path " + path)

            var listRef = ref(this.db, path);

            let anyOneRatedSnapshot = await get(listRef);
            let hasAnyOneRated = anyOneRatedSnapshot.exists();
            let userRatedSnapshot = await get(ref(this.db, `${path}/people/${uid}`));
            let hasUserRated = userRatedSnapshot.exists();

            if (hasAnyOneRated) {
                rateData.totalRating = anyOneRatedSnapshot.val().totalRating;
                rateData.totalCount = anyOneRatedSnapshot.val().totalCount;
            }

            if (hasUserRated) {
                rateData.userRating = userRatedSnapshot.val().rateVal;
            }



            if (rateVal == 0) { // get status without updating
                console.log("INDEX: rateVal = 0");

            } else if (rateVal == -1) { // remove rating
                await remove(userRatedSnapshot).then(async () => {
                    rateData.totalCount--;
                    rateData.totalRating -= rateData.userRating;
                    await update(listRef, {
                        totalRating: rateData.totalRating,
                        totalCount: rateData.totalCount
                    });
                    console.log(`INDEX: Removed rating from ${path}`);
                })
            } else { // update rating

                if (userRatedSnapshot) {
                    rateData.totalCount--;
                    rateData.totalRating -= rateData.userRating;
                }

                console.log(`INDEX: Update rating ${rateVal}`)
                await update(ref(this.db, `${path}/people/${uid}`), {
                    uid: uid,
                    time: new Date().toISOString(),
                    rateVal: rateVal
                });

                rateData.totalCount++;
                rateData.totalRating += rateVal;

                await update(listRef, {
                    totalCount: rateData.totalCount,
                    totalRating: rateData.totalRating
                }).then(() => {
                    console.log("INDEX: Added rating")
                }).catch((error) => {
                    console.log("Error while rating website", error)
                });


                return this.rate(0, uid, path);


            }

            return rateData;
        } else {
            console.log("INDEX: Path invalid or user not registered")
        }
    }

    async listenToNewMessage(path) {
        console.log(`INDEX: listening ${path}`);
        var lastChatRef = query(
            ref(this.db, path),
            orderByChild('time'), // doubtful
            limitToLast(50)
        )

        onChildAdded(lastChatRef, (snapshot) => {
            chrome.runtime.sendMessage({ type: "child-added", data: snapshot.val() });
            console.log(`INDEX: A new child was added with key ${snapshot.key} and data ${snapshot.val()}`);
        });
    }

    async verifyEmail() {
        console.log("INDEX: Sending email verification")
        await sendEmailVerification(this.auth.currentUser).then(() => {
            console.log("INDEX: Email verificagtion sent")
        }).catch((err) => {
            console.log(`INDEX: verifyEmail: ${err.message}`);
        });
    }

    async signOff() {
        console.log("INDEX: singnoff called");
        console.log(this.auth);
        await signOut(this.auth).then(() => { console.log("Signed out") }).catch((err) => {
            console.log(`INDEX: signOut: ${err}`)
        });
    }

    async updateUserProfile(user = null, object = null) {
        await updateProfile(user, object).catch((err) => {
            console.error("INDEX: Error updating display name:", err);
            return null;
        });
        console.log(`INDEX: User profile updated ${object}`);
    }


    async getMessages(path = null) {
        if (path && this.db) {
            this.listenToNewMessage(path);
            return null
        } else {
            console.log("INDEX: getMessages: Err: path-error");
        }
    }

    async signInWithEmail(email = null, password = null) {
        let cred = await signInWithEmailAndPassword(this.auth, email, password)
            .catch((error) => {
                console.log(`INDEX: signInWithEmail ${error.message}`);

                if (error.code == "auth/user-not-found") {
                    return 0;
                }

                console.log(`INDEX: signInWithEmail: Error: ${error.message}`);
                return -1;

            });

        return cred;
    }

    async signUpWithEmail(email = null, password = null) {
        var userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
            .catch((error) => {
                console.log(error);

                if (error.code == "auth/email-already-in-use") {
                    console.log("INDEX: auth/email-already-in-use");
                    return 0;
                }

                console.log(`INDEX: signUpWithEmail: Error: ${error.message}`);
                return -1;
            });

        return userCredential;

    }

    async anonymousSignIn() {
        var cred = await signInAnonymously(this.auth)
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return -1;
            });
        console.log(`INDEX: Signed up anonymously ${this.auth.currentUser.uid}`);
        return cred;

    }

    async resetPassword(email) {
        await sendPasswordResetEmail(this.auth, email).then(() => {
            console.log("pw reset mail sent")
        })
    }

    createNewCollection(path) {
        console.log("Calling create new collection at " + path);
        if (path && this.db) {
            var listRef = push(ref(this.db, path));
            set(listRef, { name: "system", time: new Date().toISOString(), uid: "", message: "", type: "system" }).then(() => {
                console.log("Created node successfully");
            }).catch((error) => {
                console.log("Error creating node", error);
            })
        } else {
            console.log("Error path or db does not exist");
            console.log(path);
            console.log(this.db);
        }
    }
}