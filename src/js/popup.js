$(document).ready(function () {
    const nextFireKey = 'nextFire';
    const lastFireKey = 'lastFire';

    const nextVisitDateBlock = $('#next-visit-date');
    const lastVisitedBlock = $('#last-visited');
    const lastVisitedDateBlock = $('#last-visited-date');

    chrome.storage.sync.get(nextFireKey, function (items) {
        const unixTimeValue = items[nextFireKey];
        if (unixTimeValue != null)
            $('#next-visit-date').text(moment(unixTimeValue, "x").format('DD MMM HH:mm'));
    });

    chrome.storage.sync.get(lastFireKey, function (items) {
        const unixTimeValue = items[lastFireKey];
        if (unixTimeValue != null) {
            lastVisitedDateBlock.text(moment(unixTimeValue, "x").format('DD MMM HH:mm'));
            lastVisitedBlock.show();
        }
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (key in changes) {
            const storageChange = changes[key];
            if (key === lastFireKey && storageChange.newValue !== null) {
                if (lastVisitedDateBlock.text() === 'UNKNOWN') {
                    lastVisitedBlock.addClass('animated fadeInDown');
                }
                lastVisitedDateBlock.text(moment(storageChange.newValue, "x").format('DD MMM HH:mm'));
                lastVisitedBlock.show();
            } else if (key === nextFireKey) {
                nextVisitDateBlock.text(moment(storageChange.newValue, "x").format('DD MMM HH:mm'));
            }
        }
    });
});
