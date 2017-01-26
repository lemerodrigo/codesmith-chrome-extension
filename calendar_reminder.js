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

let sel = document.getElementById('calendar');
let theValue = sel.options[sel.selectedIndex].value;



function saveChanges() {
  // Get a value saved in a form.
  let calSel = document.getElementById('calendar');
  let calValue = calSel.options[calSel.selectedIndex].value;
  console.log(calValue);
  let selSel = document.getElementById('selection');
  let selValue = selSel.options[selSel.selectedIndex].value;
  console.log(selValue);
  // Check that there's some code there.
  // if (!theValue) {
  //   message('Error: No value specified');
  //   return;
  // }
  // Save it using the Chrome extension storage API.
  chrome.storage.local.set({
    'calVal': calValue,
    'selVal': selValue
  });
}
saveChanges();

chrome.storage.local.get('calVal', (o) => {
  console.log(JSON.stringify(o));
})
