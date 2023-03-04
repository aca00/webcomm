try {
    importScripts('./dist/bundle.js');
    console.log("Loaded script successfully")

    let url = null;
    let response = {};
    let domain = "";
    let path = "";
    let userID = "user1";
    const worker = new Worker.Worker();

    // worker.createNewCollection("a/b/c");

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message === 'refresh') {
            // Get the active tab in the current window.
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                try {
                    url = tabs[0].url; // string
                } catch (e) {
                    url = "";
                    console.log(e);
                }
                if (url === undefined) {
                    url = "undefined-url";
                    console.log(url)
                }
                if (url.match(new RegExp("http[s]?\:\/\/.*", "gi"))) {
                    console.log(`valid_url: ${url}`);
                    url = new URL(url)
                    domain = url.hostname.split(".").join("<dot>"); // replace all . with <dot>
                    path = url.pathname;
                    chatPath = `chats/${domain}${path}/${userID}`

                    if (await worker.collectionExists(chatPath)) {
                        console.log("collection exists");
                    } else {
                        worker.createNewCollection(chatPath);
                    }


                    // response = { type: "new_tab", data: { domain: domain, path: path, url: url } };

                } else {
                    console.log(`invalid_url: ${url}`)
                }



            });
            // Return true to indicate that the sendResponse callback will be called asynchronously.
            sendResponse(response);
            return true;
        }
    });

} catch (error) {
    console.error('Failed:', error);
}