/**
* User: fedo (studio fresh)
* Date: 28.08.13
* Time: 18:15
* Multiselect plugin
*/

$.fn.groupmultiselect = function (options) {

    var self = this;

    self.elements = {
        list: {},
        val: {},
        add: {},
        apply: {},
        clear: {},
        group: {},
        scroll: {}
    };

    self.store = {
        values: {}
    };

    self.debug = false;
    //Medvedev: 2013-09-23
    //to be invoked after "apply" action
    self.onApply = function (selected) {
        /// <param name="selected" type="Array">Array of selected values</param>
    };
    //

    var __construct = function (options) {
        $.extend(self, options, true);

        for (var _item in self.elements) {
            if ($.isEmptyObject(self.elements[_item])) {
                var el = self.find('[data-' + _item + ']');
                if (el.length >= 1) {
                    self.elements[_item] = el;
                } else {
                    console.warn('Not all elements of groupmultiselect define');
                }
            }
        }

        self.elements.inputs = self.elements.list.find('input[type=checkbox]');

        //actions
        self.elements.inputs.on('change', self.actions.inputChange);

        self.elements.apply.on('click', self.actions.apply);

        self.elements.clear.on('click', self.actions.clear);

        self.elements.add.on('click', self.actions.list.toggle);

        //Collapse multiselect if click detected elsewhere
        $(document).on('click', self.actions.documentClick);
        self.on('click', self.actions.selfClick);

        //Don't scroll window if scrollPane on the bottom position
        self.hover(
			self.actions.selfHover,
			self.actions.selfUnHover
		);

        //some hooks
        var i_width = self.width();
        self.elements.inputs.each(function () {
            var cur_width = $(this).next('span').width() + 64;
            if (cur_width > i_width) {
                i_width = cur_width;
            }
        });
        self.elements.list.width(i_width);

        //run scrollPane plugin
        self.elements.scroll.jScrollPane();

        self.actions.list.close();

        return self;
    }

    self.actions = {

        list: {
            //Medvedev: 2013-09-23
            syncWithSuppressed: function () {
                /// <summary>remove mark 'checked' for all suppressed + ensure they are visible</summary>
                self.elements.list.find("[data-suppressed=false]").show();
                self.elements.list.find("[data-suppressed=true] input[type=checkbox]:checked")
                                  .prop("checked", false);

            },
            //end
            open: function () {
                //close other opened multiselect list
                var o_lists = $('[data-list]');
                o_lists.each(function () {
                    var el = $(this);
                    if (el.hasClass('active')) {
                        el.find('[data-apply]').click();
                    }
                });

                //Medvedev: 2013-09-23
                //remove mark 'checked' for all suppressed + ensure they are visible
                this.syncWithSuppressed();
                //show only not suppressed elements
                self.elements.list.addClass('active');
                self.elements.list.find("[data-suppressed=true]").hide();
                //run scrollPane plugin
                self.elements.scroll.jScrollPane();

                //end
            },
            close: function () {
                self.elements.list.removeClass('active');
            },
            toggle: function () {
                if (self.elements.list.hasClass('active')) {
                    self.actions.list.close();
                } else {
                    self.actions.list.open();
                }
            }
        },

        status: {
            empty: function () {
                self.addClass('empty').removeClass('activated');
            },
            active: function () {
                self.addClass('activated').removeClass('empty');
            }
        },

        //Collapse multiselect if click detected elsewhere
        documentClick: function () {
            var el = $(this);
            //self.actions.list.close();
            self.actions.apply();
        },
        selfClick: function (e) {
            e.stopPropagation();
        },

        //Don't scroll window if scrollPane on the bottom position
        selfHover: function () {
            if (self.debug) console.log('Hover');
            $(window).on('mousewheel', function (e) {
                e.preventDefault();
            });
        },
        selfUnHover: function () {
            if (self.debug) console.log('UnHover');
            $(window).off('mousewheel');
        },

        //Checkbox change
        inputChange: function () {
            var el = $(this);

            if (el.is(":checked")) {

                //if el is group title
                if (typeof el.attr('data-parent') !== 'undefined') {
                    el.parents('[data-group]').find('input').each(function () { $(this).prop('checked', true); });
                } else {
                    var b_all_checked = true;
                    el.parents('[data-group]').find('input:not([data-parent])')
					.each(function () {
					    if (!$(this).is(':checked')) {
					        b_all_checked = false;
					        return true;
					    }
					});

                    if (b_all_checked) {
                        el.parents('[data-group]').find('[data-parent]').prop('checked', true);
                    }
                }

                if (self.elements.val.text() == self.elements.val.attr('data-default')) { }
                self.store.values[el.val()] = true;
            } else {
                if (typeof el.attr('data-parent') !== 'undefined') {
                    el.parents('[data-group]').find('input').each(function () { $(this).prop('checked', false); });
                } else {
                    el.parents('[data-group]').find('[data-parent]').prop('checked', false);
                }

                delete self.store.values[el.val()];
            }

            //Check default value in data-val holder
            if ($.isEmptyObject(self.store.values)) {
                //self.elements.val.text(self.elements.val.attr('data-default'));
                //Medvedev: 2013-09-14                
                self.elements.val.text(self.elements.val.attr('text-default'));
                //end

                self.actions.status.empty();
            }

            if (self.debug) console.log(self.store.values);
        },

        //Clear button of toolbar
        clear: function () {
            //clear store
            self.store.values = {};

            //Medvedev: 2013-09-12			
            //self.elements.val.text(self.elements.val.attr('data-default'));
            self.elements.val.text(self.elements.val.attr('text-default'));
            //end

            self.elements.inputs.each(function () {
                $(this).prop('checked', false);
            });

            self.actions.status.empty();
        },

        //Apply button of toolbar
        apply: function () {
            var count = 0;
            //Medvedev: 2013-09-22
            var msg = "";
            var selected = [];
            //end
            for (var i = 0; i < self.elements.inputs.length; i++) {
                var el = $(self.elements.inputs[i]);
                if (el.is(':checked')) {
                    if (el.parent().attr("class") != 'parent') {
                        count++;
                        //Medvedev:
                        selected.push(el.val());
                    }
                    //Medvedev: 2013-09-12
                    //self.elements.val.text(el.val());
                    msg = el.next("span").text();
                    //end

                    self.actions.status.active();
                }
            }

            //Medvedev: 2013-09-15      
            if (count > 1) {
                msg = 'Выбрано ' + count + ' эл.';
            }
            self.elements.val.text(msg);


            self.elements.val.parent().find("[type=hidden]").val(selected.join("OR"));

            self.onApply(selected);

            //end

            self.actions.list.close();
        }
    }


    return __construct(options);
}