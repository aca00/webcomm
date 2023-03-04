// Send a message to the background script to get the active tab's URL.
chrome.runtime.sendMessage('getTabUrl', (response) => {
    // Update the text of a <p> element in the popup to show the URL.
    const urlText = document.getElementById('para');
    urlText.textContent = response.url;
});