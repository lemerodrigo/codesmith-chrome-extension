let button = document.getElementById('button');

// button.addEventListener('click', setTimeout(() => {
//   let w = 440;
//   let h = 220;
//   let left = (screen.width / 2) - (w / 2);
//   let top = (screen.height / 2) - (h / 2);
//
//   chrome.windows.create({
//     type: 'popup',
//     focused: true,
//     url: 'popup.html',
//     width: w,
//     height: h,
//     left: left,
//     top: top
//   });
//
// }, 5000));

function saveChanges() {
  console.log('hi');
  // Get a value saved in a form.
  let sel = document.getElementById('calendar');
  let theValue = sel.options[sel.selectedIndex].value;
  console.log(theValue);
  // Check that there's some code there.
  if (!theValue) {
    message('Error: No value specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({
    'value': theValue
  }, function () {
    // Notify that we saved.
    message('Settings saved');
  });
}
saveChanges();
