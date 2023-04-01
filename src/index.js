import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref,
    set,
    get,
    push,
    onChildAdded,
    query,
    orderByChild, limitToLast, onValue
} from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

export class Worker {
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.db = getDatabase(this.app);
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

    async sendMessage(uid = "XYZ", uname = "ABC", utype = "anon", message = "", path = null) {
        console.log(`
            path: ${path}
            name: ${uname}
            utype: ${utype}
            message: ${message}
            uid: ${uid}
        `);
        if (uid) {
            if (path && this.db) {
                var listRef = await push(ref(this.db, path));
                await set(listRef, {
                    name: uname,
                    time: new Date().toISOString(),
                    uid: uid,
                    message: message,
                    type: utype
                }).catch((error) => {
                    console.log("Error sending message", error);
                })
            } else {
                console.log("path-error-while-sending-message");
            }
        } else {
            console.log("user-not-registered");
        }
    }

    async rate(uid = "XYZ", uname = "ABC", utype = "anon", rating = -1, path = null) {
        if (path && this.db && uid) {
            console.log("Rating path " + path)
            var listRef = await push(ref(this.db, path));
            await set(listRef, {
                name: uname,
                time: new Date().toISOString(),
                uid: uid,
                rating: rating,
                type: utype
            }).then(() => {
                console.log("Added rating")
            }).catch((error) => {
                console.log("Error while rating website", error)
            })
        } else {
            console.log("Path invalid or user not registered")
        }
    }

    // TODO: Implement these functions
    async findAverageRating() { }

    async updateRating() { }

    listenToNewMessage(path) {
        var lastChatRef = query(
            ref(this.db, path),
            orderByChild('timestamp'),
            limitToLast(1)
        )
        onChildAdded(lastChatRef, (snapshot) => {
            chrome.runtime.sendMessage({ type: "child-added", data: snapshot.val() });
            console.log(`A new child was added with key ${snapshot.key} and data ${snapshot.val()}`);
        });
    }


    async getMessages(path = null) {
        var messages = ["START"];
        if (path && this.db) {

            this.listenToNewMessage(path);

            var queryRef = query(
                ref(this.db, path),
                orderByChild('timestamp'),
                limitToLast(50)
            )

            /*
                Since onValue is an asynchronous function, 
                the getMessages function will not wait for these functions to complete 
                before returning the messages array. One way to ensure that the 
                getMessages function waits for all the messages to be retrieved is to 
                use a Promise.
            */

            await new Promise((resolve, reject) => {
                onValue(queryRef, async (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        console.log(childSnapshot.val());
                        messages.push(childSnapshot.val());
                        console.log(`INDEX: messages-sub: ${messages.length}`);
                    });
                    resolve(); // resolve the promise once the messages array is populated.
                }, {
                    onlyOnce: true
                });
            });

        } else {
            console.log("path-error");
        }
        console.log(`messages-ready-to-return: ${messages}`)
        return messages;
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
