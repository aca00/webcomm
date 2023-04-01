function createChatBubble(chat) {
    let chatBub = document.createElement('pre');
    chatBub.classList.add('chat_bubble')
    let chatContent = document.createTextNode(
        `Message: ${chat.message}\nUserName: ${chat.name}\n${chat.time}\nType: ${chat.type}\nUID: ${chat.uid}`
    )
    chatBub.appendChild(chatContent)
    return chatBub
}

function updateUI(type, args) {
    let chatFrame = document.getElementById(args.id);
    switch (type) {
        case "loadAllChats":
            for (let i = 1; i < args.chats.length; i++) {
                chatFrame.appendChild(createChatBubble(args.chats[i]))
            }
            break;
        case "newMessage":
            console.log("POPUP: Appending new child " + args.chat.name)
            chatFrame.appendChild(createChatBubble(args.chat));
            break;
        default:
            document.getElementById(args.id).textContent = "ERRO"
    }

}


chrome.runtime.sendMessage('refresh', (response) => {
    console.log("response")

    const urlText = document.getElementById('para');

    urlText.textContent = response.data.msg;

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
        console.log(message)
        console.log(message.data)
    }

});