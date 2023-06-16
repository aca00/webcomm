chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("skjfljdslfjljljjl")
    console.log(message)
    if (message.type == "sw:warning") {
        console.log("CS: hsflsajdfladsfjj")
        alert("Thenga manga");
    }
    // return true <- this and the callback in background.js are what caused a crash in extensions page of my Google chrome
});