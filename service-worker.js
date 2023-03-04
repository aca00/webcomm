try {
    importScripts('./dist/bundle.js');
    console.log("Loaded script successfully")


    let url = null;
    let response = {};
    let domain = "";
    let path = "";




    const worker = new Worker.Worker();
    worker.createNewCollection("a/b/c");
    async function Exist() {
        if (await worker.collectionExists("a/b/c") == true) {
            console.log("collection exists");
        } else {
            console.log("collection does not exist");
        }
    }

    Exist()

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message === 'refresh') {
            // Get the active tab in the current window.
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
                    domain = url.hostname.split('.').slice(-2).join('.');
                    path = url.pathname;
                    response = { type: "new_tab", data: { domain: domain, path: path, url: url } };

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