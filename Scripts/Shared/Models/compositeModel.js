/*
* Aggregate to load several models as one.
* 'success' callback is called if all models are loaded successfully, otherwise - 'error'.
*/
define([
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone, Portal) {

    var CompositeModel = function (models, extraModels) {
        /*
        * Models to load.
        * Key - value pairs. key - model's name, value - Backbone.Model
        */
        this.models = models;
        /// <summary>Extra models are models necessary to be in model's package, i.e. composite model but there is not need 
        /// to load them, they are already ready for work (cached, constant etc.)
        /// Extra models are automatically added to <see href="successModels"/>.
        ///</summary>
        this.extraModels = extraModels || {};
    };
    _.extend(CompositeModel.prototype, Backbone.Events);
    _.extend(CompositeModel.prototype, {

        /*
        * Key - value pairs. key - model's name, value - Backbone.Model
        */
        successModels: null,

        /*
        * Key - value pairs. key - model's name, value - Backbone.Model
        */
        errorModels: null,

        /// <field name="_options" type="Object">Success, error callbacks 
        /// and error processing strategy
        /// </field>
        _options: {
            success: function () { },
            error: function () { }
        },

        fetch: function (options) {
            /// <summary>Call fetch of each models by turns.</summary>
            /// <param name="_options" type="Object">Success, error callbacks 
            /// and error processing strategy
            /// </param>

            this._prepareFetch();

            if (!_.isUndefined(options)) {
                if (_.isFunction(options.success)) this._options.success = options.success;
                if (_.isFunction(options.error)) this._options.error = options.error;
            }

            var that = this;
            var modelKeys = _.keys(this.models);
            _.each(modelKeys, function (key) {
                var model = that.models[key];

                model.fetch({
                    success: function (model, response) {
                        that.successModels[key] = model;
                        that._tryToEndPolling();
                    },
                    error: function (model, response) {
                        that.errorModels[key] = model;
                        that._tryToEndPolling();
                    }
                });
            });
        },
        //#region Assisting 

        _prepareFetch: function () {
            this._triggerLock = false;
            this.successModels = {};
            _.extend(this.successModels, this.extraModels);

            this.errorModels = {};
        },

        /// <summary>true - some thread is already determined that all models are loaded and tries to report that fact</summary>
        _triggerLock: false,
        _tryToEndPolling: function () {
            /// <summary>If polling finished - call a callback function</summary>
            if (this._triggerLock) return;

            if (_.size(_.keys(this.models)) + _.size(_.keys(this.extraModels)) == _.size(_.keys(this.successModels)) + _.size(_.keys(this.errorModels))) {
                if (_.size(_.keys(this.errorModels)) == 0) {
                    //this.trigger("complete");
                    if (_.isFunction(this._options.success)) {
                        if (this._triggerLock) return;

                        this._triggerLock = true;
                        this._options.success(this.successModels);
                    }
                }
                else {
                    if (_.isFunction(this._options.error)) {
                        if (this._triggerLock) return;

                        this._triggerLock = true;
                        this._options.error(this.errorModels);
                    }
                }
            }
        }
        //#endregion
    });

    return CompositeModel;
});