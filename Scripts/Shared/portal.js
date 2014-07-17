/*
* Portal-wide common functions.
* 
* Important: 
*      1. path to JS file is relative to baseUrl, because portal.js is places in "path" configuration of RequireJS,
*            but dependencies of portal's dependencies will be relative to them
*      2. order! is important because without explicitly defined order dependencies are loaded in unpredictable order. 
*            Problems can take place in other places, even not here.
*
*/
define([
    "order!Underscore",
    "order!jQuery",
    "order!./consts",
    "order!./known-url",
    "order!./logger",
    "order!./texts",
    "order!./helpers",
    "order!./Vocabularies/vocabularies",
    "order!./Models/model",
    "order!./ui/ui",
    "order!./controller"
], function (
    _, $,
    Consts,
    KnownUrl,
    Logger,
    Texts,
    Helpers,
    Vocabularies,
    Models,
    UI,
    Controller) {

    var Portal = {
        Consts: Consts,
        URLs: KnownUrl,
        Logger: Logger,
        Texts: Texts,
        Helpers: Helpers,
        Vocabularies: Vocabularies,
        Models: Models,
        UI: UI,
        Controller: Controller
    };


    /*
    * Converts JSON passed time into JavaScript Date.
    * @param jsonDate {string} Format: "/Date(1245398693390)/
    */
    Portal.fromJsonDate = function (jsonDate) {
        if (_.str.startsWith(jsonDate, "/Date")) {
            return new Date(Number(+jsonDate.replace(/\D/g, '')));
        }

        return new Date(jsonDate);
    };
    /*
    * Converts JavaScript Date to JSON.
    * Result:  Format: "/Date(1245398693390)/   
    * @param date {Date}
    */
    Portal.toJsonDate = function (date) {
        return "/Date(" + date.getTime().toString() + ")/";
    };


    Portal.toYesNo = function (value, options) {
        if (!options) options = {};
        if (_.isUndefined(options.False)) options.False = Portal.Texts.No;
        if (_.isUndefined(options.True)) options.True = Portal.Texts.Yes;

        if (value == true) return options.True;
        return options.False;
    };

    /// <summary>Formats and returns data string in default format.</summary>
    /// <param name="date" type="Date">Date to format as string.</param>
    Portal.formatDate = function (date, defaultText) {
        if (_.isUndefined(date)) return defaultText;
        var toFormat = _.isDate(date) ? date : Portal.fromJsonDate(date);

        //#region Convert into Local from UTC 

        var newDate = new Date(toFormat.getTime());

        var offset = toFormat.getTimezoneOffset() / 60;
        var hours = toFormat.getHours();

        newDate.setHours(hours - offset);

        //#endregion


        return $.datepicker.formatDate("dd.mm.yy", newDate);
    };

    //    /*
    //    This method was standardized in ECMA-262 5th edition.  Engines which have not been updated to support this method can work around the absence of this method using the following shim
    //    */
    //    if (!Date.prototype.toISOString) {
    //        (function () {
    //            function pad(number) {
    //                var r = String(number);
    //                if (r.length === 1) {
    //                    r = '0' + r;
    //                }
    //                return r;
    //            }

    //            Date.prototype.toISOString = function () {
    //                return this.getUTCFullYear()
    //                + '-' + pad(this.getUTCMonth() + 1)
    //                + '-' + pad(this.getUTCDate())
    //                + 'T' + pad(this.getUTCHours())
    //                + ':' + pad(this.getUTCMinutes())
    //                + ':' + pad(this.getUTCSeconds())
    //                + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
    //                + 'Z';
    //            };
    //        } ());
    //    }
    if (!Date.prototype.today) {
        (function () {
            Date.prototype.today = function () {
                return new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate());
            };
        } ());
    }


    Date.prototype.addDays = function (days) {
        var ms = new Date().getTime() + (86400000 * days);
        var added = new Date(ms);
        return added;
    }

    Portal.Settings = {
        Matches: {
            /// <summary>Defines period for checking new matches for shown issue. Measurement: ms.</summary>
            CheckPeriodInMs: 120000
        }
    };

    Portal.Html = {
        A: function (href, text) {
            return _.str.sprintf("<a href='%s'>%s</a>", href, text);
        }
    };


    //#region jDataTables extensions 

    //#region Sort for: 234/22/22, 23(23), etc

    jQuery.fn.dataTableExt.oSort['formatted-numeric-value-asc'] = function (x, y) {
        return Portal.Helpers.SortExt.sortByFormattedNumbers(x, y, true);
    };

    jQuery.fn.dataTableExt.oSort['formatted-numeric-value-desc'] = function (x, y) {
        return Portal.Helpers.SortExt.sortByFormattedNumbers(x, y, false);
    };

    //#endregion

    //#region Sort for:  <..>2</..>, <..>52/34/22</..>, <..>52(34)</..>

    jQuery.fn.dataTableExt.oSort['tag-formatted-numeric-value-asc'] = function (x, y) {
        return Portal.Helpers.SortExt.sortByTagValueWithFormattedNumbers(x, y, true);
    };

    jQuery.fn.dataTableExt.oSort['tag-formatted-numeric-value-desc'] = function (x, y) {
        return Portal.Helpers.SortExt.sortByTagValueWithFormattedNumbers(x, y, false);
    };

    //#endregion

    //#region Sort for:  23.02.2012

    jQuery.fn.dataTableExt.oSort['dd.mm.yyyy-asc'] = function (x, y) {
        return Portal.Helpers.SortExt.sortByShortDate(x, y, true);
    };

    jQuery.fn.dataTableExt.oSort['dd.mm.yyyy-desc'] = function (x, y) {
        return Portal.Helpers.SortExt.sortByShortDate(x, y, false);
    };

    //#endregion
    //#endregion



    return Portal;
});