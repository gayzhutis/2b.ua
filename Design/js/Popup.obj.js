
var Popup = {
    feedback: function(e) {
        e.preventDefault();
        Popup.loadPopup();
        return false;
    },
    loadPopup: function() {
        $('.b-popup.b-popup-callback, .b-overlay').fadeIn(200);
    },
    showMessage: function(message, additional_settings) {
        var o_settings = {};
        if (typeof SETTINGS.fancybox === 'undefined')
            console.warn('Default settings for fancybox not found');

        $.extend(o_settings, SETTINGS.fancybox, true);

        o_settings.content = message;

        if (typeof additional_settings === 'object') {
            $.extend(o_settings, additional_settings, true);
        }

        //Close old popup
        Popup.close();

        //Open New popup
        $.fancybox(o_settings);
        if (Popup.link == null)
            Popup.link = $.fancybox;
    },
    close: function(e) {
        if (typeof e === 'object')
            e.preventDefault();

        //Close old popup
        
        $("[data-overlay],[data-popup]").fadeOut(400, function() {
        });

        //$("[data-trigger=close_popup]").click();
    },
    closeSuc: function(e) {
        if (typeof e === 'object')
            e.preventDefault();

        //Close old popup
        
        $("[data-overlay],[data-popup]").fadeOut(400, function() {});
        $("[data-overlay],[data-popup]").delay(400).remove();

        //$("[data-trigger=close_popup]").click();
    }
}