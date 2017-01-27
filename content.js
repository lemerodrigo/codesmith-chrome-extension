chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // alert(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    alert('\n\nCODESMITH REMINDER' + '\n' + '-------------------' + '\n\n' + 'Event coming!' + '\n\n' + request.action.summary + '\n' + request.action.start.dateTime);
    // if (request.action == "open_dialog_box") {
        // alert('inject de pop');
    // alert(request.reminderData.obj.summary);
        // injectReminder(request.reminderData);
        // sendResponse({farewell: "goodbye"});
    // }
});