function updateUI(type, args) {
    switch (type) {
        case "loadAllChats":
            document.getElementById(args.id).textContent = (args.chats).toString();
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
        updateUI("loadAllChats", {
            id: "para",
            chats: message.data.chats
        });
    }

});