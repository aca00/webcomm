var msgCount = 0;
var txtbox = document.getElementById('tbox');
var sendButton = document.getElementById('myButton');

function createChatBubble(chat, counter) {
    console.log(`POPUP: New message count: ${counter}`)
    let chatBub = document.createElement('pre');
    chatBub.classList.add('chat_bubble');
    chatBub.setAttribute('id', `m${counter}`);
    let chatContent = document.createTextNode(
        `Message: ${chat.message}\nUserName: ${chat.name}\nTimestamp: ${chat.time}\nType: ${chat.type}\nUID: ${chat.uid}\nStatus: ${chat.status}\nMsgCount: ${msgCount}`
    );
    chatBub.appendChild(chatContent);
    return chatBub;
}

function updateUI(type, args) {
    let chatFrame = document.getElementById(args.id);
    switch (type) {
        case "loadAllChats":
            for (let i = 1; i < args.chats.length; i++) {
                chatFrame.appendChild(createChatBubble(args.chats[i]), msgCount++)
            }
            break;
        case "newMessage":
            console.log("POPUP: Appending new child by listener " + args.chat.name)
            chatFrame.appendChild(createChatBubble(args.chat), msgCount++);
            break;
        case "sendMessage":
            chatFrame.appendChild(createChatBubble(args.chat), args.chat.msgCount);
            break;

        case "updateStatus":
            console.log(`POPUP bubble id: ${args.id}`)
            let chatBubble = document.getElementById(args.id);
            console.log("POPUP: Inside update Status");
            if (chatBubble) {
                chatBubble.textContent = `Message: ${args.message}\nUserName: ${args.name}\nTimestamp: ${args.time}\nType: ${args.type}\nUID: ${args.uid}\nStatus: ${args.status}\nMsgCount: ${args.msgCount}`;
            }
            break;
        case "rating":
            chatFrame.innerHTML = `<pre>Rate value: ${args.rateVal}</pre>`
            break;

        default:
            document.getElementById(args.id).textContent = "ERRO";

    }
}

function send(text) {
    let currTime = new Date().toISOString();
    // let mcount = msgCount++;
    // updateUI("sendMessage", {
    //     id: "msg_res",
    //     chat: {
    //         message: text,
    //         time: currTime,
    //         name: "You",
    //         status: "Sending",
    //         msgCount: mcount
    //     }
    // });

    chrome.runtime.sendMessage(
        {
            type: "send-message",
            data: {
                message: text,
                time: currTime,
                msgCount: msgCount
            }
        }
    )
}

function rate(text) {
    let rateVal = Number(text);
    if (isNaN(rateVal)) {
        console.log("POPUP: Not a number");
    } else {
        chrome.runtime.sendMessage({ type: "rate-website", data: { rateVal: rateVal } })
    }
}

chrome.runtime.sendMessage({ type: "refresh" }, (response) => {
    console.log("response")

    // const urlText = document.getElementById('para');

    // urlText.textContent = response.data.msg;

    console.log(`
        response to popup.js
        ${typeof response}
        ${response}
    `)

    console.log(response);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type == "ack") {
        if (message.data.type == "progress") {
            console.log(`POPUP: ${message.data.message}`)
        }
    } else if (message.type == "allChats") {
        console.log("POPUP: receive all chats");
        console.log(message.data.chats)
        updateUI("loadAllChats", {
            id: "msg_res",
            chats: message.data.chats
        });
    } else if (message.type == 'child-added') {
        console.log("POPUP: Child added at index")
        updateUI("newMessage", {
            id: "msg_res",
            chat: message.data
        })
        console.log(message);
    } else if (message.type == 'message-sent') {
        console.log(`POPUP: Message sent count: ${message.data.msgCount}`);
        // updateUI("updateStatus", {
        //     id: `m${message.data.msgCount}`,
        //     data: message.data
        // })
    } else if (message.type == "rating") {
        console.log(`POPUP: rate value: ${message.data.rateVal}`)
        updateUI("rating", {
            id: "rate_res",
            rateVal: message.data.rateVal
        })
    }

});

sendButton.addEventListener('click', () => {
    console.log("POPUP: Button clicked")
    let text = txtbox.value;
    if (text == '') {
        console.log("POPUP: Type something")
    } else {
        console.log(`POPUP: Message to send: ${text}`);
        // send(text);
        rate(text);
    }
});