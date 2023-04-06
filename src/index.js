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

    async createUID(uname) {
        let path = "user_details/";
        console.log(`INDEX: Creating UID for ${uname}
            path: ${path}
        `);
        if (uname) {
            var listRef = await push(ref(this.db, path));
            var uid = listRef.key
            await set(listRef, {
                name: uname,
                created_on: new Date().toISOString()
            }).then(() => {
                console.log(`INDEX: UID created ${listRef.key}`);
            }).catch((err) => {
                console.log(err);
            });
            return uid;
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

    async rate(rateVal = -1, path = null) {
        if (path && this.db && uid) {
            console.log("Rating path " + path)
            var listRef = ref(this.db, path);
            await set(listRef, {
                time: new Date().toISOString(),
                rateVal: rateVal,
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

    async listenToNewMessage(path) {
        console.log("INDEX: listening")
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


    async getMessages(path = null) {
        var messages = ["START"];
        if (path && this.db) {
            this.listenToNewMessage(path);
            return null
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
