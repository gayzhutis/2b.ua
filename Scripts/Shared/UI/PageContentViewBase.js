define([
    "jQuery",
    "Backbone",
    "Underscore",
    "order!../helpers",
    "order!../Vocabularies/vocabularies"
], function ($, Backbone, _, Helpers, Vocabularies) {
    /*
    * Provides abstract base for data page context area.
    * Implements routines according to project-wide agreements:
    *   - to collect data
    *   - to show status messages, errors 
    *   - control read-only state and rendering according to it
    */
    var ViewBase = {
        /*
        * Logger to be used.
        */
        _logger: null,

        _cmdSearchRegExp: /-command\b/,

        /// <summary>
        /// Triggers event named as "*-command" specified as class selector for an element
        /// the target of event.
        /// Args of triggered event:
        ///     cmd - name of "*-command" class
        ///     viewModel - original view's model
        ///     sourceView - reference to original view produced the event
        ///     event - original event's arguments
        /// Could trigger several events.
        /// Example,
        /// <a href="" class="add-photos-command  cmd-enabled">Add</a>
        /// Would trigger event "add-photos-command"
        ///</summary>

        triggerCmds: function (event) {
            var $target = this.$(event.target);


            var allClasses = $target.attr('class');
            if (!_.isString(allClasses)) {
                allClasses = $target.parentsUntil('class=$"-command"')
                .map(function () {
                    return $(this).attr('class');
                })
                .get()
                .join(" ");
            }
            var classes = allClasses.split(' ');
            for (i = classes.length - 1; i >= 0; i--) {
                var className = classes[i];
                //is command
                if (this._cmdSearchRegExp.test(className)) {
                    this.trigger(className, this.model, this, event);
                }
            }

            return false;
        },

        /// <summary>
        /// Array of command names specified as "*-command" specified as class selector to be made invisible for client. 
        /// Could be null.        
        /// </summary>
        hiddenCommands: null,

        hideCommands: function () {
            /// <summary>Hide all commands specified within hiddenCommands.</summary>
            /// <returns type="this" />

            if (!this.hiddenCommands) return this;

            _.each(this.hiddenCommands, function (className) {
                this.$(className).hide();
            }, this);

            return this;
        },

        /*
        * Collects data from input elements and passes to Model. All changes are made in "silent" mode.
        *
        *@return {object} JSON with input values to be passed to server.         
        */
        updateModelWithFormValues: function (model) {
            this._collectTexts(model);
            this._collectHidden(model);
            this._collectTextAreas(model);
            this._collectSingleSelects(model);
            this._collectMultiSelects(model);
            this._collectCheckboxes(model);
        },
        //#region Assisting 

        _collectTexts: function (model) {
            _.each(this.$("input[type='text'].editor-field"),
                       function (arg) {
                           var $arg = this.$(arg);

                           var c = {};
                           c[$arg.attr("name")] = this._extractValueFromInput($arg);
                           model.set(c, { silent: true });
                       }
                , this);
        },
        //#region Assisting 

        _extractValueFromInput: function ($input) {
            /// <summary>Tries to get value from input according to meta-information, not just as text value.</summary>
            /// <param name="$input" type="Object">jQuery wrapped input control to be processed</param>

            var value = null;
            //if (Helpers.hasAttr($arg, "data-value")) {
            if (Helpers.hasAttr($input, "data-type")) {
                //value = $arg.attr("data-value");
                var dataType = $input.attr("data-type");

                //if (dataType == "float") value = parseFloat(value).toString(); //this is work around fpr MVC3 bug with deserializing double? passed as number
                if (dataType == "float") value = this.getFloat($input)
                if (dataType == "int") value = this.getInt($input);
                if (dataType == "string") value = this.getText($input);
            } else {
                value = $input.val();
            }

            return value;
        },

        //#endregion

        _collectHidden: function (model) {
            /// <summary>Collects values of hidden fields. Key - name's attribute. Value - value's attribute.</summary>
            _.each(this.$("input[type='hidden'].editor-field"),
                       function (arg) {
                           var $arg = this.$(arg);

                           var c = {};
                           c[$arg.attr("name")] = this._extractValueFromInput($arg);
                           model.set(c, { silent: true });
                       }
                , this);
        },
        _collectTextAreas: function (model) {
            _.each(this.$("textarea.editor-field"),
                       function (arg) {
                           var $arg = this.$(arg);

                           var c = {};
                           c[$arg.attr("name")] = $arg.val();
                           model.set(c, { silent: true });
                       }
                , this);
        },
        _collectSingleSelects: function (model) {
            _.each(this.$("select.single-select.editor-field"),
                       function (arg) {
                           var $arg = this.$(arg);

                           var c = {};
                           c[$arg.attr("name")] = Number($arg.val());
                           model.set(c, { silent: true });
                       }
                , this);
        },

        //#endregion
        _collectMultiSelects: function (model) {
            var self = this;
            _.each(this.$("select.multi-select.editor-field"),
                       function (arg) {
                           var $arg = this.$(arg);

                           var c = {};
                           c[$arg.attr("name")] = Helpers.getMultiSelectVal($arg);
                           model.set(c, { silent: true });
                       }
                , this);
        },
        //#region Assisting 

        getMultiSelectVal: function (multiselect) {
            return Helpers.getMultiSelectVal(multiselect);
        },

        //#endregion
        _collectCheckboxes: function (model) {
            _.each(this.$("input[type='checkbox'].editor-field"),
                       function (arg) {
                           var $arg = this.$(arg);

                           var c = {};
                           c[$arg.attr("name")] = $arg.is(":checked");
                           model.set(c, { silent: true });
                       }
                , this);
        },

        //#endregion

        //#region Msg related 


        /*
        * Shows errors message within issue's  area
        *@param error {string} Text to be shown.
        */
        showErrorMsg: function (error) {
            this._logger.error(error);
            //  this.$("#page-msgs").append("<span class='validation-summary-errors'>" + error + "</span><br/>");

            return this;
        },
        /*
        * Shows info message within issue's  area
        *@param error {string} Text to be shown.
        */
        showMsg: function (msg) {
            this._logger.log(msg);

            //this.$("#page-msgs").append("<span class='server-action-success'>" + msg + "</span><br/>");

            return this;
        },
        /*
        * Clears all messages shown either with showErrorMsg or  showMsg       
        */
        clearMsg: function () {
            // this.$("#page-msgs").empty();
            this._logger.clear();

            return this;
        },

        //#endregion

        //#region Read-only related 


        _isReadOnly: true,
        /*
        * Changes view mode and triggers re-rendering.
        */
        _setIsReadOnly: function (value) {
            if (this._isReadOnly == value) return;

            this._logger.debug("triggering read-only to " + value);

            this._isReadOnly = value;

            this._renderAccordingToReadStatus();
        },
        _renderAccordingToReadStatus: function () {
            if (this._isReadOnly) {
                this._makeFormAsReadOnly();
            } else {
                this._makeFormAsEditable();
            }
        },
        _makeFormAsReadOnly: function () {
            this.$(".editor-field").attr("readonly", "readonly");
            this.$(".intermediary-editor-field").attr("readonly", "readonly");

            this.$("input[type=checkbox].editor-field").attr("disabled", true);
            this.$("input[type=checkbox].intermediary-editor-field").attr("disabled", true);

            this.$("input[type=submit]").hide();
            this.$("select.editor-field").attr('disabled', true);
            this.$("select.intermediary-editor-field").attr('disabled', true);
            //multiselect widget
            this.$("select.multi-select.editor-field").multiselect('disable');
            this.$("select.multi-select.intermediary-editor-field").multiselect('disable');

            this.enableCmd(".page-edit-command");
            this.disableCmd(".page-save-command");
            this.disableCmd(".page-cancel-command");
            this._extSpecialCmdStatus();

            this._extSpecialElementStatus();
        },
        _makeFormAsEditable: function () {
            this.$(".editor-field").removeAttr("readonly");
            this.$(".intermediary-editor-field").removeAttr("readonly");

            this.$("input[type=checkbox].editor-field").removeAttr("disabled");
            this.$("input[type=checkbox].intermediary-editor-field").removeAttr("disabled");

            this.$("input[type=submit]").show();
            this.$("select.editor-field").removeAttr('disabled');
            this.$("select.intermediary-editor-field").removeAttr('disabled');
            //multiselect widget
            this.$("select.multi-select.editor-field").multiselect('enable');
            this.$("select.multi-select.intermediary-editor-field").multiselect('enable');


            this.disableCmd(".page-edit-command");
            this.enableCmd(".page-save-command");
            this.enableCmd(".page-cancel-command");
            this._extSpecialCmdStatus();

            this._extSpecialElementStatus();
        },

        //#endregion

        //#region In-place editing 

        startInPlaceEditDate: function (selector, modelField, context, onSubmittingCallback) {
            /// <summary>Starts editing datetime field. In case of success, the modelField will be silently changed and onSubmittingCallback called in specified context.</summary>
            /// <param name="selector" type="String">jQuery selector to select the container with input HTML tag.</param>
            /// <param name="modelField" type="String">Backbone's model's name to store datetime at.</param>
            /// <param name="context" type="Object">Context to be used to call callbacks</param>
            /// <param name="onSubmittingCallback" type="function">Optional. Callback to be called before submitting changes.</param>

            var container = this.$(selector);
            container.empty()
                     .html("<input type='text' />");

            var that = this;
            container.find("input").first().datepicker({
                // showOn: "button",
                onSelect: function (dateText, inst) {
                    var timeStamp = $(this).datepicker("getDate");
                    $(this).datepicker("hide");

                    if (timeStamp != that.model.get(modelField)) {

                        that.model.set(modelField, timeStamp, { silent: true });

                        //call to submit model's changes
                        if (context && onSubmittingCallback) onSubmittingCallback.call(context, that.model);
                    }
                },
                onClose: function (dateText, inst) {
                    that.render();
                }
            }).datepicker("show");
        },

        //#endregion

        /*
        * Ensures the status of specially treated elements is assigned as necessary.
        * For instance, some elements could be inactive or hidden even if form is in edit state, this is the place
        * where it is possible to override default behaviour.
        *
        */
        _extSpecialElementStatus: function () {
        },

        /*
        * Ensures the status of specially treated or form specific commands.
        *
        */
        _extSpecialCmdStatus: function () {
        },

        getInt: function (source) {
            /// <summary>
            /// Gets Integer value contained in control. 
            /// If value is cached in  "data-value" attribute, then it is returned, otherwise - from control's value.
            /// Returns null if no value is present.                    
            /// </summary>
            /// <param name="source" type="Object">jQuery-wrapped control .</param>
            /// <returns type="Number" />

            var text = (Helpers.hasAttr(source, "data-value")) ? source.attr("data-value") : source.val().replace(/\D/g, "");

            if (!text || _.str.isBlank(text)) return null;

            return parseInt(text);
        },

        getFloat: function (source) {
            /// <summary>
            /// Gets Integer value contained in control. 
            /// If value is cached in  "data-value" attribute, then it is returned, otherwise - from control's value.            
            /// Returns null if no value is present.
            /// </summary>
            /// <param name="source" type="Object">jQuery-wrapped control .</param>
            /// <returns type="Number" />

            if (!Helpers.hasAttr(source, "data-value")) {
                return Helpers.extractFromUiFloat(source.val());
            }

            //has something in data-value
            var text = source.attr("data-value");

            if (!text || _.str.isBlank(text)) return null;

            return parseFloat(text);
        },

        getText: function (source) {
            /// <summary>
            /// Gets text value contained in control. 
            /// If value is cached in  "data-value" attribute, then it is returned, otherwise - from control's value.                        
            /// </summary>
            /// <param name="source" type="Object">jQuery-wrapped control .</param>
            /// <returns type="Number" />

            return (Helpers.hasAttr(source, "data-value")) ? source.attr("data-value") : source.val();
        },


        preprocessEnteredFloat: function (source) {
            /// <summary>
            /// Normalizes entered text, then changes control's "data-value" attribute with entered invariant value
            /// and put normalized value back to control.
            /// Returns both value and normalized text.
            /// </summary>
            /// <param name="source" type="Object">jQuery-wrapped control .</param>
            /// <returns type="Object" />
            var original = source.val();

            var processed = Helpers.normalizeUiFloat(original);

            source.attr("data-value", processed.value);
            source.attr("data-type", "float");
            if (original !== processed.text) source.val(processed.text);

            return processed;
        },


        preprocessEnteredTextReq: function (source) {
            /// <summary>
            /// Changes control's "data-value" attribute with entered req value  
            /// and puts normalized value back to control.
            /// Returns both value and normalized text.
            /// </summary>
            /// <param name="source" type="Object">jQuery-wrapped control .</param>
            /// <returns type="Object" />
            var original = source.val();

            var processed = Helpers.compileTextReq(original);

            source.attr("data-value", processed.value);
            source.attr("data-type", "string");
            if (original !== processed.text) source.val(processed.text);

            return processed;
        },

        preprocessEnteredInt: function (source) {
            /// <summary>
            /// Normalizes entered text, then changes control's "data-value" attribute with entered invariant value
            /// and puts normalized value back to control.
            /// Returns both value and normalized text.
            /// </summary>
            /// <param name="source" type="Object">jQuery-wrapped control .</param>
            /// <returns type="Object" />
            var original = source.val();

            var processed = Helpers.normalizeUiInt(original);

            source.attr("data-value", processed.value);
            source.attr("data-type", "int");
            if (original !== processed.text) source.val(processed.text);

            return processed;
        },

        onIntInput: function (event) {
            /// <summary>
            /// Normalizes entered text, then changes control's "data-value" attribute with entered invariant Int value
            /// and puts normalized value back to control.
            /// </summary>

            var source = $(event.target);

            this.preprocessEnteredInt(source);
        },

        onFloatInput: function (event) {
            /// <summary>
            /// Normalizes entered text, then changes control's "data-value" attribute with entered invariant Dbl value
            /// and puts normalized value back to control.
            /// </summary>
            var source = $(event.target);

            this.preprocessEnteredFloat(source);
        },


        onTextReqInput: function (event) {
            /// <summary>
            /// Parses ',' delimited list of entered requirements, then changes control's "data-value" attribute with entered requirements 
            /// and puts normalized value back to control.
            /// </summary>
            var source = $(event.target);

            this.preprocessEnteredTextReq(source);
        },

        autosize: function (input, options) {
            /// <summary>Makes textarea autoresizable. See "../../jquery.textarea-autosize.js" /></summary>

            if (!options) options = {};

            $(input).autosize2(options);
        },

        //#region Autocomplete 


        autocomplete: function (input, options) {
            /// <summary>Triggers input into autocomplete on the based of field's entered values.</summary>
            /// <param name="input" type="Object">jQuery-wrapped input</param>
            /// <param name="options" type="Object">OPtions of autocomplete:
            ///     fields   {string}    Comma separated list of issue field keys containing source of values for autocomplete. Could be single field.
            ///     top     {Number}    Max number of values to show in autocomplete. Default: 15
            ///     multiple {Boolean}  Whether to provide multiple choice. Deafult: false
            /// </param>

            var options = _.extend({
                top: 15,
                multiple: false
            }, options);


            var that = this;

            if (!options.multiple) {
                input.autocomplete({
                    source: _.str.sprintf("/api/issues/autocomplete?fields=%s&top=%d", options.fields, options.top)
                });

                return;
            }

            //multiple

            //            input.bind("keydown", function (event) {
            //                if (event.keyCode === $.ui.keyCode.TAB &&
            //						this.$(this).data("autocomplete").menu.active) {
            //                    event.preventDefault();
            //                }
            //            })
            input.autocomplete({
                minLength: 0,
                source: function (request, response) {
                    $.getJSON(_.str.sprintf("/api/issues/autocomplete?fields=%s&top=%d", options.fields, options.top), {
                        term: that.extractLastTerm(request.term)
                    }, response);
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
                select: function (event, ui) {
                    var terms = that.splitTerms(this.value);
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push(ui.item.value);
                    // add placeholder to get the comma-and-space at the end
                    terms.push("");
                    this.value = terms.join(", ");
                    return false;
                }
            });
        },
        //#region Assisting 


        splitTerms: function (val) {
            /// <summary>Splits comma separated terms into array. Each term is trimmed automatically.</summary>
            /// <param name="val" type="String">Comma separated list of terms to be splitted.</param>

            return val.split(/,\s*/);
        },
        extractLastTerm: function (val) {
            /// <summary>Returns last term from comma separated list of terms.</summary>
            /// <param name="val" type="String">Comma separated list of terms to be splitted.</param>

            return this.splitTerms(val).pop();
        },

        //#endregion


        //#endregion

        //#region Multiselect 

        applyMultiselect: function (el, selectOptions) {
            /// <summary>Applies multiselect functionality and adjusts width according to CSS template.</summary>
            /// <param name="el" type="Object">jQuery wrapped</param>
            /// <param name="selectOptions" type="Object">Different settings for multiselect control.</param>

            selectOptions.width = el.width();

            el.multiselect(selectOptions);
        },

        _multiWithHeaderLongOptions: {
            multiple: true,
            header: true,
            selectedList: 10,
            height: 350
        },


        _multiWithoutHeaderOptions: {
            multiple: true,
            header: false,
            selectedList: 10,
            height: 150
        },

        _singleMultiOptions: {
            multiple: false,
            header: false,
            selectedList: 10,
            height: 150
        },

        //#endregion

        //#region Cmd related 

        /*
        * Styles the cmd as enabled
        * @param  cmd 
        */
        enableCmd: function (selector) {
            this.changeCmdStatus(selector, true);


            //            var href = link.attr('href');
            //            if (href) return;

            //            link.attr('href', link.attr('data-href'));
        },

        disableCmd: function (selector) {
            this.changeCmdStatus(selector, false);

            //            var href = link.attr('href');
            //            link.attr('data-href', href);
            //            link.removeAttr('href');
        },

        changeCmdStatus: function (selector, enabled) {
            /// <summary>Changes cmd state represented as <a> within <li>.</summary>
            /// <param name="selector" type="String">Any jQuery selector to find cmd element. </param>
            /// <param name="enabled" type="Object">Anything to be evaluated as 'true' to enable cmd, otherwise - disable.</param>

            var link = $(selector).parent('li');

            if (enabled) {
                link.removeClass("disabled");
            } else {
                link.addClass("disabled");
            }
        },

        //#endregion

        //#region PURE related 

        /*
        * Returns ready for use part of general PURE directive providing filling of 
        * <select> with <option> and selecting selected option on the base of model containing lookupProperty
        * with result of UI.prepareOptionViewModel.
        * @param optionLookupProperty {string} Property name
        */
        directiveFillOption: function (optionLookupProperty) {
            var directive = {};
            directive["key <- " + optionLookupProperty] = {
                ".": "key.label",
                "@value": "key.recordID",
                "@selected": "key.selected"
            };

            return directive;
        },


        /*
        * Returns ready for use part of general PURE directive providing filling of 
        * <select> with <optgroup> and <option> and selecting selected option on the base of model containing lookupProperty
        * with result of UI.prepareOptgroupViewModel.
        * @param optionLookupProperty {string} Property name
        */
        directiveFillOptgroup: function (groupsLookupProperty) {
            var directive = {};
            directive["group <- " + groupsLookupProperty] = {
                "@id": "group.recordID",
                "@label": "group.label",
                "option": this.directiveFillOption("group.options")
            };

            return directive;
        },


        /*
        * Prepares view model on the base of Vocabularies.TextLookupCollection to be used for 
        * rendering in <select> with <option>.
        * @param records {Vocabularies.TextLookupCollection} 
        * @param selected {object} (optional) Selected record's ID. DAL lookup string format.
        * @param  suppressNotSelected {boolean} (optional) true - ensure that return does not contain Vocabularies.NOT_SELECTED value.
        * @return Array of Vocabularies.TextLookupRecord.toJSON() objects. Selected object has property "selected" in true
        */
        prepareOptionViewModel: function (records, selected, suppressNotSelected) {
            if (!selected || selected == "") selected = Vocabularies.NOT_SELECTED_ID;
            selected = String(selected);

            var selectedIds = Helpers.parseLookupDalString(selected);

            var options = records.toJSON();

            if (suppressNotSelected) {
                options = _.filter(options,
                                function (model) {
                                    return model.recordID != Vocabularies.NOT_SELECTED_ID;
                                });
            }


            var selectedElements = _.filter(options,
                                    function (item) {
                                        return _.find(selectedIds,
                                                        function (selectedId) {
                                                            return selectedId == item.recordID;
                                                        }
                                        );
                                    }
                                );
            _.each(selectedElements, function (el) {
                el.selected = true;
            });

            return options;
        },


        /*
        * Prepares view model on the base of Vocabularies.TextLookupCollection to be used for 
        * rendering in <select> with <optgroup> and <option>.
        * @param xrecords {XTextLookupRecordCollection} 
        * @param selected {Array} (optional) Selected record's. Array of TextLookupRecord
        * @param  suppressNotSelected {boolean} (optional) true - ensure that return does not contain Vocabularies.NOT_SELECTED value.
        * @return Array of Vocabularies.TextLookupRecord.toJSON() objects. Selected object has property "selected" in true
        */
        prepareOptgroupViewModel: function (xrecords, selected, suppressNotSelected) {
            var filtered = xrecords.models;
            if (suppressNotSelected) {
                filtered = _.filter(xrecords.models,
                               function (model) {
                                   return model.get("record").get("recordID") != Vocabularies.NOT_SELECTED_ID;
                               });
            }

            var that = this;
            var optgroups = _.map(filtered,
                               function (xrecord) {
                                   var optgroup = xrecord.get("record").toJSON();

                                   optgroup.options = that.prepareOptionViewModel(xrecord.get("subrecords"), selected);

                                   return optgroup;
                               });

            return optgroups;
        }

        //#endregion 

    };

    var PageContentViewBase = Backbone.View.extend(ViewBase);

    return PageContentViewBase;
});