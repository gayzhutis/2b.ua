/*
* Basic implementation of image description. 
*/
define([
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone, Portal) {

    var Model = Backbone.Model.extend({
        defaults: {
            /// <summary>Short description</summary>           
            title: "",

            /// <summary>URL to thumb view.</summary>
            thumbUrl: "",
            /// <summary>URL to view in gallery.</summary>            
            normalUrl: "",

            /// <summary>Image's category. Depends on context of use.</summary> 
            category : 0,
            /// <summary>Access level. </summary>
            access : 0
        }
    });

    return Model;
});

