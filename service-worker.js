try {
    importScripts('./dist/bundle.js');
    console.log("Loaded script successfully")


    let url = null;
    let message = {};
    const worker = new Worker.Worker();
    // worker.createNewCollection("a/b/c");

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message === 'refresh') {
            // Get the active tab in the current window.
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                url = tabs[0].url // string
                if (url && url.match(new RegExp("http[s]?\:\/\/.*", "gi"))) {
                    console.log("valid_url");
                    url = new URL(url)
                    var domain = url.hostname.split('.').slice(-2).join('.');
                    var path = url.pathname;
                    message = { type: "new_tab", data: { domain: domain, path: path, url: url } };
                    sendResponse(message);
                } else {
                    console.log("invalid-url")
                }

            });
            // Return true to indicate that the sendResponse callback will be called asynchronously.
            return true;
        }
    });

} catch (error) {
    console.error('Failed:', error);
}