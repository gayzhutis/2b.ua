define([
    "order!../../../../Scripts/underscore-min.js",
    "order!../../../../Scripts/underscore.string.min.js",
    
    "order!../../../../Scripts/json2.min.js",
    "order!../../../../Scripts/moment.min.js"
], function () {

    moment.lang("ru", {
        months: "Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь".split("_"),
        monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
        weekdays: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
        weekdaysShort: "Вс_Пн_Вт_Ср_Чт_Пт_Сб".split("_"),
        longDateFormat: {
            L: "DD/MM/YYYY",
            LL: "D MMMM YYYY",
            LLL: "D MMMM YYYY HH:mm",
            LLLL: "dddd, D MMMM YYYY HH:mm"
        },
        meridiem: {
            AM: 'AM',
            am: 'am',
            PM: 'PM',
            pm: 'pm'
        },
        calendar: {
            sameDay: "[Сегодня в] LT",
            nextDay: '[Demain à] LT',
            nextWeek: 'dddd [à] LT',
            lastDay: '[Hier à] LT',
            lastWeek: 'dddd [denier à] LT',
            sameElse: 'L'
        },
        relativeTime: {
            future: "in %s",
            past: "il y a %s",
            s: "secondes",
            m: "une minute",
            mm: "%d minutes",
            h: "une heure",
            hh: "%d heures",
            d: "un jour",
            dd: "%d jours",
            M: "un mois",
            MM: "%d mois",
            y: "une année",
            yy: "%d années"
        },
        ordinal: function (number) {
            return (~ ~(number % 100 / 10) === 1) ? 'er' : 'ème';
        }
    });



    // Tell Require.js that this module returns  a reference to Underscore
    return _;
});