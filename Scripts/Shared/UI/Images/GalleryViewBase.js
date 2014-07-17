/*
* Image gallery  view implementation.
*
*/
define([
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone) {


    var view = Backbone.View.extend({
        _logger: null,
        /*
        * Template to be used for rendering.
        */
        template: null,

       
        /*
        */
        render: function () {
            this._logger.debug("rendering ...");

            this.$el.empty();

            this.$el.append(this.template);


            this._logger.debug("rendered");

            return this;
        }
    });

    return view;
});