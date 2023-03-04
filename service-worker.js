try {
    importScripts('./dist/bundle.js');
    console.log("Loaded script successfully")
    worker = new Worker.Worker();
    // worker.createNewCollection("a/b/c");

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message === 'getTabUrl') {
            // Get the active tab in the current window.
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // Send the URL to the popup.
                sendResponse({ url: tabs[0].url });
            });
            // Return true to indicate that the sendResponse callback will be called asynchronously.
            return true;
        }
    });

} catch (error) {
    console.error('Failed:', error);
}