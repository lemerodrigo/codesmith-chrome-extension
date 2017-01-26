
// My Object.
function CalendarReminder() {
    console.log('Background process initialization...');
    this.dataUrl = 'http://slack-server.elasticbeanstalk.com/calendar/12';
    this.todayEvents = [];
}

// Initializer.
CalendarReminder.prototype.init = function() {
    this.startLoopers();
}

// Alarms Loopers.
CalendarReminder.prototype.startLoopers = function() {
    let self = this;
    console.log('Starting loopers...');

    chrome.alarms.create("looper", {
        delayInMinutes: 0.05,
        periodInMinutes: 0.05
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === "looper") {
            self.getCalendarData();
        }
    });
}

// The requester.
CalendarReminder.prototype.getCalendarData = function() {
    let self = this;
    $.get(self.dataUrl)
    .then(function(data) {
        self.parseData(data);
    });
}

// Receiver parser.
CalendarReminder.prototype.parseData = function(data) { 
    let dataKeysFixed = this.fixDataKeys(data);
    this.todayEvents = this.getTodayEvents(dataKeysFixed);

    // Adding moment object to events.
    this.todayEvents.map((item) => {
        item['eventDateMoment'] = moment(item.start.dateTime);
    });

    this.eventsChecker();
}

// Do we have events in the next 10/n minutes?
CalendarReminder.prototype.eventsChecker = function() {
    let now = moment();
    this.todayEvents.forEach(function(event) {
        let eventMoment = event.eventDateMoment;
    });
}

// Data parser.
CalendarReminder.prototype.fixDataKeys = function(data) {
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

// Returns a string in the format YYYYMMDD.
CalendarReminder.prototype.getToday = function() {
    return moment().format('YYYYMMDD');
}

// Return an array of objects that corresponds to today events.
CalendarReminder.prototype.getTodayEvents = function(dataKeysFixed) {
    return dataKeysFixed[this.getToday()];
}

// Instantiation.
let cc = new CalendarReminder().init();


// function updateIcon() {
//     chrome.browserAction.setIcon({path:"images/icon" + currentIcon + ".png"});
//     currentIcon = currentIcon == lastIcon ? firstIcon : currentIcon + 1;
// }

//      chrome.browserAction.setBadgeText({text:data.unreadItems});
// var pollInterval = 1000 * 60; // 1 minute