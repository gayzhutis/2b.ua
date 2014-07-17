/*
* Defines logger.
*/
define([
    "jQuery",
    "Underscore",
    "order!./consts"
], function ($, _, Consts) {

    var Logger = function (name) {
        /*
        * Logger's name. Usually, module's name.
        */
        this._name = name || "";

    };
    var LoggerBody = {
        /*
        * Factory method. Easy to make logger with <fieldref name="name"/>extendede with <paramref name="subname"/>.
        */
        makeSubLogger: function (subname) {
            return new Logger(this._name + subname);
        },

        debug: function (msg, activityID) {
            if (Consts.DEBUG) {
                if (typeof activityID !== 'undefined') msg = activityID + ": " + msg;
                this._writeToLog(this._name + "(debug): " + msg);
            }
            return this;
        },

        log: function (msg) {
            /// <summary>Informs about something.</summary>
            this._writeToLog(this._name + ": " + msg);
            this._showToUser("alert alert-info", msg);

            return this;
        },

        success: function (msg) {
            /// <summary>Informs about some successful operation.</summary>
            this._writeToLog(this._name + ": " + msg);
            this._showToUser("alert alert-success", msg);

            return this;
        },

        //        warn: function (msg) {
        //            /// <summary>Informs about ???</summary>
        //            if (typeof console !== 'undefined' && typeof console.warn !== 'undefined') {
        //                console.error(this._name + ": " + msg);
        //            }

        //            this._showToUser("alert", msg);

        //            return this;
        //        },

        error: function (response, defaultMsg, instruction) {
            /// <summary>Shows error returned from server. If server response contains exception info, then exception message is show, otherwise - defaultMsg.</summary>
            /// <param name="response" type="Object">Either jqXHR returned by $.ajax() or error text to be shown.</param>
            /// <param name="defaultMsg" type="String">Optional. Error text to be shows if nothing more precise is not found within response.</param>
            /// <param name="instruction" type="String">Optional. What to do to user</param>


            var msg = defaultMsg;
            if (_.isString(response)) {
                msg = response;
            } else {
                if (response && response.responseText) {
                    try {
                        var parsedResponse = JSON.parse(response.responseText);

                        //sequence is important, because both fields could be contained within response, but Exception is more informative
                        if (parsedResponse.Message) msg = parsedResponse.Message;
                        if (parsedResponse.ExceptionMessage) msg = parsedResponse.ExceptionMessage;
                    } catch (e) { 
                    }
                }
            }

            msg = _.str.sprintf("%s. %s", msg, instruction);
            if (typeof console !== 'undefined' && typeof console.error !== 'undefined') {
                console.error(this._name + ": " + msg);
            }
            this._showToUser("alert alert-error", msg);

            return this;
        },

        clear: function () {
            /// <summary>Clears all messages visible for the user at the moment.</summary>

            $("#page-msgs").html("");
        },

        //#region Assisting 

        _showToUser: function (cssClass, msg) {
            /// <summary>Shows message at screen. User can see it.</summary>
            $("#page-msgs").html(_.str.sprintf("<div class='%s'>%s</div>", cssClass, msg));
        },

        _writeToLog: function (text) {
            /// <summary>Writes message into the DEBUG output stream.</summary>
            if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
                var t = new Date();
                console.log(t.toLocaleTimeString() + "." + t.getMilliseconds() + ": " + text);
            }
        }

        //#endregion
    };
    _.extend(Logger.prototype, LoggerBody);

    //returns constructor
    return Logger;
});