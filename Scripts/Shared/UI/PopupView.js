define(["Backbone"], function (Backbone) {



    var PopupView = Backbone.View.extend({
        _popupIsShown: false,

        el: "#popup-dialog",


        /*
        * Default implementation. Just for reference purposes, must be overriden in 
        * descendant view.
        */
        render: function () {
            this.$el.empty();

            //add something like
            // this.$el.append(popupTemplate);

            this.showPopup({
                //title: Cabinet.Texts.AddNewIssuePopupTitle,
                modal: true
            });
        },


        /*
        * Function ensures only one popup dialog is open at a time.
        * @param options {UI.PopupDialog} jQuery dialog's options
        */
        showPopup: function (options) {
            if (this._popupIsShown) throw "Popup dialog is already open";

            var that = this;
            options.close = function () {
                that._popupIsShown = false;
            };

            this.$el.dialog(options);
            this._popupIsShown = true;
        },         

        /*
        * Closes open popup dialog.
        *
        */
        closePopup: function () {
            if (this._popupIsShown) {
                this.$el.dialog("close");
            }
        }
    });


    return PopupView;
});