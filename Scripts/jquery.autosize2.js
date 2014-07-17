(function ($, undefined) {

    $.fn.extend({
        autosize2: function (settings) {
            settings = $.extend({
                maxHeight: 800, /*if this value is less that original box height then it will not be applied*/
                extraTail: 5 /*in pixels. extra space to get rid of line flicker, 
                   this value should be zero if padding is good enough or this 
                   value should be increased if padding is set to zero*/
            }, settings);
            var previousHeight = 0;
            var resize = function (el) {
                $(el).css('height', '0px');
                var h = Math.max(el.originalHeight, (el.scrollHeight));
                previousHeight = previousHeight || el.originalHeight;
                // smooth out maxheight
                settings.maxHeight = (settings.maxHeight < el.originalHeight) ? 0 : settings.maxHeight;
                // when should scrollbars appear? if maxHeight is set to ZERO they will never appear
                (h > settings.maxHeight && settings.maxHeight > 0) ? $(el).css('overflow', 'auto') : $(el).css('overflow', 'hidden');
                if (h > el.originalHeight && (h <= settings.maxHeight || settings.maxHeight == 0)) {
                    // add a bit of room to avoid line flickr
                    $(el).css('height', (h + settings.extraTail) + 'px');
                    previousHeight = h;
                }
                else if (h > el.originalHeight) {
                    $(el).css('height', settings.maxHeight + 'px');
                }
                else {
                    $(el).css('height', (el.originalHeight) + 'px');
                }
            };

            return this.each(function () {
                this.originalHeight = parseInt($(this).css('height').replace('px', ''));
                $(this).scrollHeight = 99999999;

                // just so that if text area already have some value      
                resize(this);

                $(this).bind('keydown', function () { resize(this) })
            });
        }
    });

})(jQuery);