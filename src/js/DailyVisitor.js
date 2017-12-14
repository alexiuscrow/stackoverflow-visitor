'use strict';

class DailyVisitor {
    constructor(url) {
        this.url = url;
        this.alarmName = 'TimeToFire';
        this.tabWasCreated = false;
        this.initAlarm();
        this.addAlarmListener();
        this.addVisitListener();
    }

    initAlarm() {
        const dailyVisitorObj = this;
        chrome.storage.sync.get({
            nextFire: (moment().add(2, 'm').seconds(0).milliseconds(0).valueOf())
        }, function (items) {
            var nextFireTimeMoment = moment(items.nextFire, "x");
            console.log(nextFireTimeMoment.format() + " - " + nextFireTimeMoment.valueOf());
            var nextFireTimeMillis;

            if (moment().isBefore(nextFireTimeMoment))
                nextFireTimeMillis = nextFireTimeMoment.valueOf();
            else
                nextFireTimeMillis = nextFireTimeMoment.add(1, "day").valueOf();

            chrome.alarms.create(dailyVisitorObj.alarmName, {
                when: nextFireTimeMillis
            });

            chrome.storage.sync.set({
                nextFire: nextFireTimeMillis
            });
        });
    }

    visitSite() {
        const dailyVisitorObj = this;
        chrome.tabs.query({
            url: this.url,
            index: 0
        }, function (tabs) {
            if (tabs.length === 0) {
                chrome.tabs.create({
                    url: url,
                    index: 0,
                    active: false
                });
                dailyVisitorObj.tabWasCreated = true;
            } else {
                chrome.tabs.reload(tabs[0].id);
            }
        });
    }

    addAlarmListener() {
        const dailyVisitorObj = this;
        chrome.alarms.onAlarm.addListener(function (alarm) {
            if (alarm.name === dailyVisitorObj.alarmName) {
                dailyVisitorObj.visitSite();
                dailyVisitorObj.initAlarm();
            }
        });
    }

    addVisitListener() {
        const dailyVisitorObj = this;
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (tab.url.indexOf(url) !== -1 && changeInfo.status === 'complete' && tab.index === 0) {
                const date = new Date();

                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon200.png',
                    title: 'Stackoverflow Visitor',
                    message: 'Visited at ' + moment(date).format('DD MMM HH:mm'),
                    requireInteraction: true
                });

                if (dailyVisitorObj.tabWasCreated)
                    chrome.tabs.remove(tabId);

                chrome.storage.sync.set({
                    'lastFire': moment(date).valueOf()
                });
            }
        });
    }
}
