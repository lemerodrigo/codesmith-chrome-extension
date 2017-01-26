

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        alert("Message recieved!");
    console.log('open_dialog_message');
    if (msg.action == 'open_dialog_box') {
        alert("Message recieved!");
    }
});