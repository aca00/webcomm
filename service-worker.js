var userName = null;
var uid = null;
var utype = null;
var currURL = null;
var rateVal = null;
var cred = null;
var isAuthenticated = false;
var emailVerified = null;
var authInProgress = false;

try {
    importScripts('./dist/bundle.js');
    console.log("Script imported");
} catch (e) {
    console.log("couldn't import script");
}

const worker = new Worker.Worker();

authenticate();

async function authenticate() {
    authInProgress = true;
    console.log("SW: Authenticating")
    await chrome.storage.local.get(["userDetails"]).then(async (result) => {
        if (result.userDetails == undefined) {
            cred = await worker.anonymousSignIn();
            if (cred == -1) {
                console.log("SW: Anonymous sign in error");
            } else {
                await worker.updateUserProfile(cred.user, { displayName: createRandomUserName() })
                await writeToChromeStorage({
                    userDetails: {
                        type: 'Anon',
                        uid: cred.user.uid,
                        name: cred.user.displayName,
                        email: null,
                        password: null
                    }
                })
            }
        } else {
            console.log(result);
            uid = result.userDetails.uid;
            userName = result.userDetails.name;
            utype = result.userDetails.type;
            console.log(`utype: ${utype}`)

            if (utype == "Anon") {
                cred = await worker.anonymousSignIn();
            } else {
                console.log("UTYPE is not anon");
                console.log(utype)
                cred = await signIn(result.userDetails.email, result.userDetails.password);
            }

            isAuthenticated = true;
            authInProgress = false;
            worker.listenToAuthChange();
            emailVerified = worker.auth.currentUser.emailVerified;

            console.log("SW: Auth: ");
            console.log(worker.auth);
            // await worker.resetPassword("akhilca2000@gmail.com");
            // if (!worker.auth.currentUser.emailVerified) {
            //     await worker.verifyEmail();
            // }
        }
    });

    // sendToPopUp(
    // })
}

// email = "akhilca@gmail.com", password = "123abcdre"
// signUp(email = "akhilca2000@gmail.com", password = "123abcdre")

async function signIn(email = null, password = null) {
    let temp_cred = await worker.signInWithEmail(email, password);
    if (temp_cred != 0 || temp_cred != -1 || temp_cred != undefined) {
        utype = "Signed";
        cred = temp_cred;
        await writeToChromeStorage({
            userDetails: {
                email: email, password: password, type: 'Signed',
                name: cred.user.displayName,
                uid: cred.user.uid
            }
        });
    } else {
        console.log(`SW: sign in error ${temp_cred}`)
    }
    return cred;
}

async function signUp(email = null, password = null, name = null) {
    console.log(`SW: Signing up ${email}`);
    let temp_cred = await worker.signUpWithEmail(email = email, password = password);
    if (temp_cred != 0 && temp_cred != -1 && temp_cred != undefined) {
        utype = "Signed";
        cred = temp_cred;
        await worker.updateUserProfile(cred.user, { displayName: createRandomUserName() });
        await writeToChromeStorage({
            userDetails: {
                email: email,
                password: password,
                type: 'Signed',
                name: cred.user.displayName,
                uid: cred.user.uid
            }
        });
        authenticate();
        await worker.verifyEmail();
        sendToPopUp({ type: 'signup-success' })
    } else {
        console.log(`SW: sign up error ${temp_cred}`)
        sendToPopUp({ type: 'signup-error' });
    }

}

async function checkURL() {
    console.log("SW: Checking url");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
            url = tabs[0].url;
        } else {
            console.log("SW: No active tab found")
        }

        if (url === undefined) {
            url = "undefined-url";
            console.log(url)
        }

        if (url.match(new RegExp("http[s]?\:\/\/.*", "gi"))) {
            console.log(`SW: valid_url: ${url}`);
            url = new URL(url)
            domain = url.hostname.split(".").join("<dot>"); // replace all . with <dot>
            path = url.pathname.split("/").join("<sep>"); // replace al / with <sep>
            currURL = `${domain}/${path}`;
            chatPath = `chats/${currURL}`;
            message = {
                type: "ack",
                data: {
                    type: "progress",
                    status: 0,
                    message: `valid chatpath${chatPath}`
                }
            }
            getRating();
            sendToPopUp(message);
            refreshChats(chatPath);
        } else {
            console.log(`invalid_url: ${url}`)
        }
    });
}

async function refreshChats(chatPath) {

    if (await worker.collectionExists(chatPath)) {
        console.log("collection exists");
    } else {
        await worker.createNewCollection(chatPath);
    }
    chats = await worker.getMessages(chatPath);
    message = {
        type: "allChats",
        data: {
            domain: domain,
            path: path,
            url: url,
            chats: chats
        }
    };
}

async function getRating(rateVal = 0) {
    rateVal = await worker.rate(rateVal, `userRating/${uid}/${currURL}`);
    sendToPopUp({ type: "rating", data: { rateVal: rateVal } });
}

async function getUserDetails() {
    if (!userName) {
        await chrome.storage.local.get(["userDetails"]).then(async (result) => {
            userName = result.userDetails.uname;
            if (userName == undefined) {
                await createUser();
            }
        });
    }
}

async function sendNewMessage(data) {
    await getUserDetails();
    worker.sendMessage(
        uid = uid,
        uname = userName,
        utype = utype,
        message = data.message,
        path = `chats/${currURL}`,
        msgCount = data.msgCount,
        time = data.time,
    );
}

function sendToPopUp(message) {
    console.log(`sending to popup 
    type: ${message.type}
    data: ${message.data}`
    )
    chrome.runtime.sendMessage(message);
}

function createRandomUserName() {
    let randomNumber = Math.floor(Math.random() * 9000) + 1000; // between 1000-9999
    return `User${randomNumber}`;
}

async function writeToChromeStorage(object) {
    await chrome.storage.local.set(object).then(() => {
        console.log(`SW: wrote to storage ${object}`);
    })
}

async function createUser() {
    await chrome.storage.local.get(["userDetails"]).then(async (result) => {
        if (result.userDetails == undefined) { // create new user profile
            userName = createRandomUserName();
            let userAuth = await worker.anonymousSignIn();
            uid = userAuth.currentUser.uid;
            console.log(`SW: Writing to chome storgae ${userName} and ${uid}`)
            if (userName && uid) {
                await writeToChromeStorage({ userDetails: { uname: userName, uid: uid } })
            }

        } else {
            uid = result.userDetails.uid;
            userName = result.userDetails.uname;
        }
        console.log(`SW: User details exist: ${userName} ${uid}`)
        return userName
    });
}

async function checkIfEmailVerified() {
    await worker.reload();
    emailVerified = worker.auth.currentUser.emailVerified;
    sendToPopUp({
        type: "email-verified-status", data: {
            emailVerified: emailVerified,
            emailAddress: worker.auth.currentUser.email
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("SW: Oninstall called");
    // authenticate();
});

async function singOff() {
    await worker.signOff();
    console.log("SW: singOff: signed out and signing in anonymously")
    await worker.anonymousSignIn();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`SW: onMessageListener: type: ${message.type}`)
    if (message.type == 'refresh') {
        response = {
            type: "ack",
            data: {
                type: "request-recieved",
                status: 0,
                message: "Refresh request recieved"
            }
        }
        checkURL();
    } else if (message.type == "send-message") {
        console.log("SW: send message request received")
        sendNewMessage(message.data)
        response = {
            type: "ack",
            data: {
                type: "message-submitted",
                status: 0,
                message: "New message submitted"
            }
        }
    } else if (message.type == "rate-website") {
        console.log(`SW: rate request received ${message.data.rateVal}`);
        getRating(message.data.rateVal);
    } else if (message.type == "get-auth-status") {
        console.log(`SW: auth status request received.`);
        response = {
            type: "auth-status",
            data: {
                isAuthenticated: isAuthenticated
            }
        }
    } else if (message.type == "get-user-details") {

        response = {
            type: "user-details",
            data: {
                "userName": userName,
                "userId": uid,
                "userType": utype,
                "isAuthenticated": isAuthenticated,
                "emailVerified": emailVerified
            }
        }
    } else if (message.type == "signup") {
        signUp(message.data.email, message.data.password, null)
    } else if (message.type == "check-email-verified") {
        checkIfEmailVerified();
    } else if (message.type == "sign-off") {
        signOff();
    }


    sendToPopUp(response);
    return true;

});


// TODO: issue fix two times reload for showing u detaisl