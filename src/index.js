import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, push, onChildRemoved } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

var app = initializeApp(firebaseConfig);
var db = getDatabase(app);

function createNewCollection(path) {
    console.log("Calling create new collection at " + path);
    if (path && db) {
        var listRef = push(ref(db, path));
        set(listRef, { name: "", time: new Date().toISOString(), uid: "", message: "", type: "anon" }).then(() => {
            console.log("Created node successfully");
        }).catch((error) => {
            console.log("Error creating node", error);
        })
    } else {
        console.log("Error path or db does not exist");
        console.log(path);
        console.log(db);
    }
}
