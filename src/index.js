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
                    name: name,
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

    listenToChildAdded(path) {
        var dbRef = ref(this.db, path);
        console.log("listen to " + path);
        onChildAdded(dbRef, (snapshot) => {
            console.log(`A new child was added with key ${snapshot.key} and data ${snapshot.val()}`);
        });
    }




    async getMessages(path = null) {
        if (path && this.db) {
            var queryRef = query(
                ref(this.db, path),
                orderByChild('timestamp'),
                limitToLast(50)
            )
            onValue(queryRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    console.log(childSnapshot.key)
                    console.log(childSnapshot.val())
                    // ...
                });
            }, {
                onlyOnce: true
            });

            console.log("out")
        } else {
            console.log("path-error");
        }

        return "{}";
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
