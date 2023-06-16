chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type == "sw:warning") {
        alert("This website looks suspicious");
    }
    // return true <- this and the callback in background.js are what caused a crash in extensions page of my Google chrome
});