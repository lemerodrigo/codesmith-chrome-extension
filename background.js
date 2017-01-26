console.log('Background init');

// chrome.alarms.create("getter", {
//     // when: ,
//     delayInMinutes: 1,
//     periodInMinutes: 1
// });

// chrome.alarms.onAlarm.addListener(function(alarm) {
//     if (alarm.name === "getter") {
//         console.log('Alarm')
//     }
// });

const dataUrl = 'http://slack-server.elasticbeanstalk.com/calendar/12';

// LOAD DATA.
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = parseInput;
xhr.open("GET", dataUrl, true);
xhr.send(null);

function parseInput() { 
    if (xhr.readyState === 4) {
        if (xhr.responseText) {
            let json = JSON.parse(xhr.responseText);
            let dataKeysFixed = fixDataKeys(json);
            let todayEvents = getTodayEvents(dataKeysFixed);
            console.log('todayEvents', todayEvents);
        }
    }
}

function fixDataKeys(data) {
    let parsed = {};
    let months = {'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'Mai': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11};

    let keys = Object.keys(data);

    keys.forEach((item) => {
        let arr = item.split(' ');
        let obj = {day: parseInt(arr[1]), month: months[arr[0]], years: parseInt(arr[2])};
        let stringMonthNumber = (months[arr[0]] + 1).toString();
        let monthShifted = stringMonthNumber.length === 1 ? '0' + stringMonthNumber : stringMonthNumber;
        let newKey = arr[2] + monthShifted + arr[1];
        parsed[newKey] = Array.isArray(data[item]) ? data[item] : [data[item]];
    });
    return parsed;
}

function getToday() {
    let dateObj = new Date();
    let month = String(dateObj.getUTCMonth() + 1);
    let day = String(dateObj.getUTCDate());
    let year = String(dateObj.getUTCFullYear());
    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    console.log('year', year, 'month', month, 'day', day);
    return year + month + day;
}

function getTodayEvents(dataKeysFixed) {
    let today = getToday();
    console.log(dataKeysFixed);
    return dataKeysFixed[today];
}



        // if (!xhr.responseText || !urlsObj || urlsObj.urls.length == 0) {

// function toggleRunning() {
//     isRunning = isRunning == 1 ? 0 : 1;
//     updateIcon();
// }

// function updateIcon() {
//     chrome.browserAction.setIcon({path:"images/icon" + currentIcon + ".png"});
//     currentIcon = currentIcon == lastIcon ? firstIcon : currentIcon + 1;
// }

//      chrome.browserAction.setBadgeText({text:data.unreadItems});
// var pollInterval = 1000 * 60; // 1 minute

// function startRequest() {
//   updateBadge();
//   window.setTimeout(startRequest, pollInterval);
// }

// function stopRequest() {
//   window.clearTimeout(timerId);
// }

// onload='startRequest()'

// $.getJSON('URL which does NOT contain callback=?', ...);

// var fullURL = browser.extension.getURL("beasts/frog.html");

// var xhr = new XMLHttpRequest();
// xhr.setRequestHeader("Content-Type", "*/*");

// var resp;
// xhr.open("GET", "http://www.roblox.com/catalog/json?Subcategory=16&SortType=3&ResultsPerPage=10", true);
// xhr.onload = function () {
//     resp = JSON.parse(xhr.responseText);
// }
// xhr.send();


// var interval = setInterval(visitUrl, maxDefaultSleep);