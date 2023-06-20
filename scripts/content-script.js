chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("CS: Message rcvd");
    alert("This website looks suspicious");
});