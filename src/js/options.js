/*!
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 * Copyright (c) 2017 Oleksii Sapon
 * https://github.com/alexiuscrow/stackoverflow-visitor
 */

$(document).ready(function () {
    console.log("Options initializing");
    const timeInput = $('#fire-time');
    const interval = 30;
    const alarmName = 'TimeToFire';

    function calculateNextFireTime(fireTime) {
        var fireTimeMoment = moment(fireTime, "HH:mm");
        if (moment().isBefore(fireTimeMoment)) {
            return fireTimeMoment.valueOf();
        } else {
            return fireTimeMoment.add(1, "day").valueOf();
        }
    }

    function saveOptions() {
        const nextFireTime = calculateNextFireTime(timeInput.val());
        chrome.storage.sync.set({
            nextFire: nextFireTime
        });
    }

    function restoreOptions() {
        chrome.storage.sync.get('nextFire', function (items) {
            const nextFire = items['nextFire'];
            if (nextFire != null) {
                timeInput.val(moment(nextFire, 'x').format("HH:mm"));
            } else {
                timeInput.val('05:00');
                chrome.storage.sync.set({
                    nextFire: moment(timeInput.val(), "HH:mm").valueOf()
                });
            }
        });        
    }

    timeInput.mask("HH:mm", {
        placeholder: "HH:mm",
        translation: {
            H: {
                pattern: /[00-23]/
            },
            m: {
                pattern: /[00-59]/
            }
        },
        onChange: function (cep) {
            saveOptions();
            chrome.alarms.create(alarmName, {
                when: calculateNextFireTime(cep)
            });
        }
    });

    $('#minus-time').click(function () {
        var fireTimeMoment = moment(timeInput.val(), "HH:mm").subtract(interval, "minutes");
        timeInput.val(fireTimeMoment.format("HH:mm"));
        saveOptions();
        chrome.alarms.create(alarmName, {
            when: calculateNextFireTime(timeInput.val())
        });
    });

    $('#plus-time').click(function () {
        var fireTimeMoment = moment(timeInput.val(), "HH:mm").add(interval, "minutes");
        timeInput.val(fireTimeMoment.format("HH:mm"));
        saveOptions();
        chrome.alarms.create(alarmName, {
            when: calculateNextFireTime(timeInput.val())
        });
    });

    restoreOptions();
});
