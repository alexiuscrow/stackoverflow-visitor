/*!
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 * Copyright (c) 2017 Oleksii Sapon
 * https://github.com/alexiuscrow/stackoverflow-visitor
 */

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
        chrome.storage.sync.get({
            nextFire: (moment().add(2, 'm').seconds(0).milliseconds(0).valueOf())
        }, function (items) {
            var nextFireTimeMoment = moment(items.nextFire, "x");
            var nextFireTimeMillis;

            if (moment().isBefore(nextFireTimeMoment))
                nextFireTimeMillis = nextFireTimeMoment.valueOf();
            else
                nextFireTimeMillis = nextFireTimeMoment.add(1, "day").valueOf();

            console.log(nextFireTimeMoment.format() + " - " + nextFireTimeMoment.valueOf());

            chrome.alarms.create(this.alarmName, {
                when: nextFireTimeMillis
            });

            chrome.storage.sync.set({
                nextFire: nextFireTimeMillis
            });
        }.bind(this));
    }

    visitSite() {
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
                this.tabWasCreated = true;
            } else {
                chrome.tabs.reload(tabs[0].id);
            }
        }.bind(this));
    }

    addAlarmListener() {
        chrome.alarms.onAlarm.addListener(function (alarm) {
            console.log('this.alarmName ' + this.alarmName);
            if (alarm.name === this.alarmName) {
                this.visitSite();
                this.initAlarm();
            }
        }.bind(this));
    }

    addVisitListener() {
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

                console.log('this.tabWasCreated ' + this.tabWasCreated);

                if (this.tabWasCreated)
                    chrome.tabs.remove(tabId);

                chrome.storage.sync.set({
                    'lastFire': moment(date).valueOf()
                });
            }
        }.bind(this));
    }
}
