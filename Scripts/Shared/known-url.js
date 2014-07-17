/*
* Defines application-wide well-known URLs.
*/
define(["order!Underscore"],
function (_) {

    var URLs = {
        Employee: {
            getPhoto: function (login) {
                /// <summary>Builds URL to get employee's photo.</summary>
                /// <param name="login" type="String">Employee's login.</param>

                return "/api/hrm/photo/" + login;
            },
            getIcon: function (login) {
                /// <summary>Builds URL to get employee's icon.</summary>
                /// <param name="login" type="String">Employee's login.</param>

                return "/api/hrm/icon/" + login;
            }
        },

        Issues: {
            toIssuePage: function (issue) {
                /// <summary>Builds URL to navigate to issue's main page</summary>
                /// <param name="issueNo" type="Number">Issue/// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>
                var No = _.isNumber(issue) ? issue : issue.id;

                return _.str.sprintf("#issues/%s", No);
            },
            toForeignIssuePage: function (issue) {
                /// <summary>Builds URL to navigate to foreign issue's main page</summary>
                /// <param name="issueNo" type="Number">Issue/// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>
                var No = _.isNumber(issue) ? issue : issue.id;

                return _.str.sprintf("#office/issues/%s", No);
            },
            toCommonDbIssuePage: function (issue) {
                /// <summary>To Main page of issue from Common DB</summary>
                /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                var No = _.isNumber(issue) ? issue : issue.id;
                return "#common/issues/" + No;
            },

            toOffersPage: function (issue) {
                /// <summary>Builds URL to navigate to page with new offers for the issue</summary>
                /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                var No = _.isNumber(issue) ? issue : issue.id;
                return _.str.sprintf("#issues/%s/matches", No);
            },
            toMatchesInProcessPage: function (issue) {
                /// <summary>Builds URL to navigate to page with in-process matches for the issue</summary>
                /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                var No = _.isNumber(issue) ? issue : issue.id;
                return _.str.sprintf("#issues/%s/matches/in-process", No);
            },

            toPhotosUploadPage: function (issue) {
                /// <summary>Builds URL to navigate to page to upload new issue's photos</summary>
                /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                var No = _.isNumber(issue) ? issue : issue.id;
                return _.str.sprintf("#issues/%s/photos/upload", No);
            },

            toPhotosEditPage: function (issue) {
                /// <summary>Builds URL to navigate to page to edit issue's photos</summary>
                /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                var No = _.isNumber(issue) ? issue : issue.id;
                return _.str.sprintf("#issues/%s/photos/edit", No);
            },

            toPhotosShowPage: function (issue) {
                /// <summary>Builds URL to navigate to page with issue's photos</summary>
                /// <param name="issue" type="Object"><reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                if (_.isNumber(issue)) throw "Can't generate URL to photos only by No";

                var No = issue.id;
                if (issue.isMyIssue()) return _.str.sprintf("#issues/%s/photos", No);
                if (issue.isForeignIssue()) return _.str.sprintf("#office/issues/%s/photos", No);

                return "#";
            },

            toIssuePhoto: function (issueID, fileName) {
                /// <summary>Builds URL to show single issue's photo.</summary>
                /// <param name="issueID" type="Number">Issue's ID</param>
                /// <param name="fileName" type="String">Photo's name with extension.</param>

                return _.str.sprintf("/api/photos/issues/image/%s/%s", issueID, fileName);
            },

            Cmds: {
                addToMailing: function (issue) {
                    /// <summary>Builds URL to POST request to put issue to mailing list</summary>
                    /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                    var No = _.isNumber(issue) ? issue : issue.id;
                    return _.str.sprintf("/api/issues/add-to-mailing/" + No);
                },
                mailUrgently: function (issue) {
                    /// <summary>Builds URL to POST request to send issue as urgent mailing </summary>
                    /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                    var No = _.isNumber(issue) ? issue : issue.id;
                    return _.str.sprintf("/api/issues/make-urgent-mailing/" + No);
                },

                copyToMyIssueDB: function (issue) {
                    /// <summary>Builds URL to POST request to copy not my issue to my issue DB</summary>
                    /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                    var No = _.isNumber(issue) ? issue : issue.id;
                    return _.str.sprintf("/api/issues/copy-to-mine/" + No);
                },

                markAsExistingInMine: function (issue) {
                    /// <summary>Builds URL to POST request to mark issue as contained within my issue DB</summary>
                    /// <param name="issue" type="Object">Either Number or  <reference path="../../Areas/CabinetsRealtors/Scripts/Debug/Issues/Models/Issue/IssueModelBase.js" /></param>

                    var No = _.isNumber(issue) ? issue : issue.id;
                    return _.str.sprintf("/api/issues/mark-as-existing-in-mine/" + No);
                }
            }
        },

        Contacts: {
            toCheck: function (pattern) {
                /// <summary>Checks phone pattern at server and returns results of check.</summary>
                /// <param name="pattern" type="String">Phone's pattern.</param>

                return _.str.sprintf("/api/contacts/all?pattern=%s&top=400", pattern);
            },
            toSaveNewMediatorPhone: function (number) {
                /// <summary>Creates new mediator's record with specified number in DB.</summary>
                /// <param name="number" type="String">Phone's number.</param>

                return _.str.sprintf("/api/contacts/common?number=%s", number);
            }
        }

    };

    return URLs;
});