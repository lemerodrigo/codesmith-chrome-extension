// chrome.extension.onMessage.addListener(function(message, messageSender, sendResponse) {
//     console.log('some message');
//     // message is the message you sent, probably an object
//     // messageSender is an object that contains info about the context that sent the message
//     // sendResponse is a function to run when you have a response
// });

// document.addEventListener('DOMContentLoaded', function () {
//     chrome.runtime.getBackgroundPage(function (bg) {
//         alert('some');
//     });
// });


chrome.storage.local.get(null, (data) => {
  if (data) {
    $('#calendar').val(data.calVal);
    $('#selection').val(data.selVal);
  }
})

$('select').on('change', function () {
  saveChanges();
})


function saveChanges() {
  let calValue = $("#calendar").val();
  let selValue = $("#selection").val();

  chrome.storage.local.set({
    'calVal': calValue,
    'selVal': selValue
  });
}
// $('.test').html();
// $(".test").html("Hello <b>world</b>!");

// let button = document.getElementById('button');
//
// button.addEventListener('click', () => {
//   let w = 440;
//   let h = 220;
//   let left = (screen.width / 2) - (w / 2);
//   let top = (screen.height / 2) - (h / 2);
//
//   chrome.windows.create({
//     type: 'popup',
//     focused: true,
//     url: 'popup_reminder.html',
//     width: w,
//     height: h,
//     left: left,
//     top: top
//   });
//
// });
