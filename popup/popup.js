chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log("Updated");
    if (tab.url && tab.url.match(new RegExp("http[s]?\:\/\/.*", "gi"))) {
        console.log("URL match");
        var url = new URL(tab.url);
        var domain = url.hostname.split('.').slice(-2).join('.');
        var path = url.pathname;

        const message = { type: "new_tab", data: { domain: domain, path: path, url: url } };
        chrome.runtime.sendMessage(message, (response) => {
            console.log("Received response from service worker:", response);
            // do something with the response
        });

        console.log("Message sent")
    }
});