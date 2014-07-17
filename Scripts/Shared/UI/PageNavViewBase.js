/*
* Home index page view. 
*/
define([
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone) {


    var ViewImpl = {
        _logger: null,
        /*
        * Template to be used for rendering.
        */
        template: null,

        /// <summary>Gets or sets class name to query for selected tab. For instance, "matches"</summary>
        selectedTab: null,

        render: function (selectedTab) {
            /// <summary>Renders navigation tabs and marks specified as selected.</summary>            
            /// <param name="name" type="String">CSS class name of tab to be marked as selected. For instance, "matches"</param>
        //    this._logger.debug("rendering ...");

            this._renderNavs()
                ._selectActive(selectedTab);

        //    this._logger.debug("rendered");

            return this;
        },
        //#region Assisting 

        _selectActive: function (selectedTab) {            
            this.selectedTab = selectedTab;

            this.$("li").removeClass("active");
            this.$("li." + selectedTab).addClass("active");

            return this;
        },

        //#endregion

        /*
        * Virtual method. Renders navigation tabs, but not selecting anyone.
        * Could be overridden in derived classes to use necessary rendering approach.
        * @return this
        */
        _renderNavs: function () {
            this.$el.empty();
            this.$el.append(this.template);

            return this;
        }
    };
    var view = Backbone.View.extend(ViewImpl);

    return view;
});