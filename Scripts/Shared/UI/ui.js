
define([
    'jQuery',
    'Underscore',
    'Backbone',
    "order!./PageContentViewBase",
    "order!./PopupView",
    "order!./PageNavViewBase",

    "order!./FileUploadViewBase",
//images    
    "order!./Images/GalleryViewBase"
], function ($, _, Backbone,
    PageContentViewBase,
    PopupView,
    PageNavViewBase,

    FileUploadViewBase,
//images  
    ImageGalleryViewBase
) {
    var Models = {
        PageContentViewBase: PageContentViewBase,
        PopupView: PopupView,
        PageNavViewBase: PageNavViewBase,


        FileUploadViewBase: FileUploadViewBase,

        Images: {
            GalleryViewBase: ImageGalleryViewBase
        },

        Models: {
            ShowMode: {
                Owner: 0,
                Foreigner: 1,
                CommonDB: 2
            }
        }
    };

    return Models;
});