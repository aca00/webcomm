var userName = null;
var currURL = null;

try {
    importScripts('./dist/bundle.js');
    console.log("Script imported");
} catch (e) {
    console.log("couldn't import script");
}

const worker = new Worker.Worker()

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
            path = url.pathname;
            chatPath = `chats/${domain}${path}`;
            currURL = chatPath;
            message = {
                type: "ack",
                data: {
                    type: "progress",
                    status: 0,
                    message: `valid chatpath${chatPath}`
                }
            }
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
        uid = "XYZ",
        uname = userName,
        utype = 'Anon',
        message = data.message,
        path = currURL,
        msgCount = data.msgCount,
        time = data.time,
    );
}

function sendToPopUp(message) {
    console.log(`sending to popup ${message}`)
    chrome.runtime.sendMessage(message);
}

async function writeToChromeStorage(object) {
    await chrome.storage.local.set(object).then(() => {
        console.log("SW: wrote to storage " + object)
    })
}

async function createUser() {
    await chrome.storage.local.get(["userDetails"]).then(async (result) => {
        let uname = result.userDetails.uname;
        userName = uname;
        if (uname == undefined) { // create new user profile
            let randomNumber = Math.floor(Math.random() * 9000) + 1000; // between 1000-9999
            uname = `Anon${randomNumber}`;
            await writeToChromeStorage({ userDetails: { uname: uname } })
        }
        console.log("SW: uname: " + uname)
        return uname
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("SW: Oninstall called");
    createUser();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    }
    sendResponse(response);
    return true;

});
