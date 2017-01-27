let fakeData = {"Jan 26 2017": [{
    "kind":"calendar#event",
    "etag":"\"2970602537654000\"",
    "id":"m9sfaffjebjnkrsvh1c27sl3dk_20170126T170000Z",
    "status":"confirmed",
    "htmlLink":"https://www.google.com/calendar/event?eid=bTlzZmFmZmplYmpua3JzdmgxYzI3c2wzZGtfMjAxNzAxMjZUMTcwMDAwWiBjb2Rlc21pdGguaW9fcDVwaGM2dnNmZzJmcWVxcGNxcmgyYzFmdGtAZw",
    "created":"2017-01-24T23:41:08.000Z",
    "updated":"2017-01-24T23:41:08.827Z",
    "summary":"Daily Standups",
    "creator": {
        "email":"victoria@codesmith.io"
    },
    "organizer": {
        "email":"codesmith.io_p5phc6vsfg2fqeqpcqrh2c1ftk@group.calendar.google.com",
        "displayName":"Codesmith-12",
        "self":true
    },
    "start": {
        "dateTime":"2017-01-26T21:20:00-08:00",
        "timeZone":"America/Los_Angeles"
    },
    "end":{
        "dateTime":"2017-01-26T09:05:00-08:00",
        "timeZone":"America/Los_Angeles"
    },
    "recurringEventId":"m9sfaffjebjnkrsvh1c27sl3dk",
    "originalStartTime":{
        "dateTime":"2017-01-26T09:00:00-08:00",
        "timeZone":"America/Los_Angeles"},
        "iCalUID":"m9sfaffjebjnkrsvh1c27sl3dk@google.com",
        "sequence":0,
        "hangoutLink":"https://plus.google.com/hangouts/_/codesmith.io/daily-standups?hceid=Y29kZXNtaXRoLmlvX3A1cGhjNnZzZmcyZnFlcXBjcXJoMmMxZnRrQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20.m9sfaffjebjnkrsvh1c27sl3dk",
        "eventDateMoment":"2017-01-26T17:00:00.000Z"
    }
]}

// Constants.
const USE_FAKE = true;
const REMINDER_MINUTES = 10;

// My Object.
function CalendarReminder() {
    console.log('Background process initialization...');
    this.dataUrl = 'http://slack-server.elasticbeanstalk.com/calendar/12';
    this.todayEvents = [];
}

// Initializer.
CalendarReminder.prototype.init = function() {
    let self = this;
    this.startLoopers();
}

// Alarms Loopers.
CalendarReminder.prototype.startLoopers = function() {
    let self = this;
    console.log('Starting loopers...');

    chrome.alarms.create("looper", {
        delayInMinutes: 0.10,
        periodInMinutes: 0.10
        // delayInMinutes: 1.00,
        // periodInMinutes: 1.00
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
        if (USE_FAKE) {
            console.log('Using fake data');
            self.parseData(fakeData);
        } else {
            self.parseData(data);
        }
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

    console.log('Events length', this.todayEvents.length);

    for (let i = 0; i < this.todayEvents.length; i++) {
        let event = this.todayEvents[i];
        let eventMoment = this.todayEvents[i].eventDateMoment;

        console.log('Event date', eventMoment.format('YYYYMMDD HH:mm'));

       // Event in the past. Let's discard it.
        if (eventMoment < now) {
            continue;
        }

        let diff = eventMoment.diff(now, 'minutes');

        console.log('now', now.format('LTS'), 'event', eventMoment.format('LTS') ,'diff', diff, event);

        // We have an event that is going to happen in REMINDER_MINUTES minutes.
        if (diff === REMINDER_MINUTES) {
            this.triggerReminder(event);
        }
    }
}

// Reminder window trigger.
CalendarReminder.prototype.triggerReminder = function(event) {
    console.log('Sending message!');
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: event}, function(response) {
            console.log('Response from the message');
        });
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