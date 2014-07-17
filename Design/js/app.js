/// <reference path="../../Scripts/jquery-1.10.2.js" />
/// <reference path="helpers.js" />
/// <reference path="../../Scripts/underscore.js" />
/// <reference path="../../Scripts/underscore.string.js" />



//определяем функцию фильтрации клавиш
jQuery.fn.ForceNumericOnly =
function () {
    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            // Разрешаем backspace, tab, delete, стрелки, обычные цифры и цифры на дополнительной клавиатуре
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};

//Object contains collection of interactive UI-elements
var MODEL = {
    set: function (s_name, data) {
        //Create an empty object
        if (typeof s_name === 'string' || typeof s_name === 'number') {
            if (typeof this[s_name] === 'undefined') {
                this[s_name] = [];
            } else {
                //this[s_name].pushStack(data);
            }
        }

        //set data
        this[s_name].push(data);
    },
    get: function (s_name) {
        return typeof this[s_name] !== 'undefined' ? this[s_name] : false;
    }
};


$(function () {

    $(".from,.to,.b-id-search input").ForceNumericOnly();

    //имитация стандартного плейсхолдера для инпутов и текстовых полей
    if (!('placeholder' in document.createElement("input"))) {
        $(document)
			.on("focus", 'input[placeholder], textarea[placeholder]', function () { if (this.value == $(this).attr('placeholder')) { this.value = ''; $(this).removeClass("placeholder") }; })
			.on("blur", 'input[placeholder], textarea[placeholder]', function () { if (this.value == '') { this.value = $(this).attr('placeholder'); $(this).addClass("placeholder") }; });
        $('input[placeholder], textarea[placeholder]').blur();
        $('input[placeholder], textarea[placeholder]').each(function () { if (this.value == $(this).attr('placeholder')) $(this).addClass("placeholder"); });
    }

    var ua = navigator.userAgent;
    var isiPad = /iPad/i.test(ua) || /iPhone/i.test(ua);
    if (isiPad) $("body").addClass("ipad");

    // =================================================================

    /*tabs*/
    $("[data-tabs] [data-tab]").click(function () {
        id = $(this).parent().attr("data-tabs");
        $(this).parents("[data-tabs-container=" + id + "]").find("[data-tabs=" + id + "]>[data-tab], [data-tabs-content=" + id + "]>[data-tab-content]").removeClass("active");
        $(this).addClass("active");
        $(this).parents("[data-tabs-container=" + id + "]").find("[data-tabs-content=" + id + "]>[data-tab-content]").eq($(this).index()).addClass("active");
        if ($(this).parents("[data-tabs-container]").eq(0).hasClass("b-search-form")) {
            if ($(this).index() == 0) $("[data-tabs-container].b-search-form").addClass("first-tab-selected");
            else $("[data-tabs-container].b-search-form").removeClass("first-tab-selected");
        }
    });
    $("[data-tabs] [data-tab].active").click();

    // =================================================================

    /*select*/

    $("[data-select] select").change(function () {
        $(this).parents("[data-select]").find("[data-select-val]").html($(this).find("option:selected").html());
        //Medvedev: 2013-09-15
        //
        $(this).parents("[data-select]").find("[type=hidden]").val($(this).find("option:selected").val());
        //end
    });

    $(".b-search-form select").change(function () {
        var parent = $(this).parents('[data-select]');
        parent.addClass("activated");
        if ($(this).find("option:selected").attr("data-sel-empty") != undefined) {
            parent.addClass("empty");
        } else {
            parent.removeClass("empty");
        }
    });

    $("[data-select] select").each(function () {
        $(this).change();
    });

    $(".b-search-form input[type=text]").change(function () {
        $(this).addClass("activated");
        if ($(this).val() == "") $(this).removeClass("activated");
    });

    $("[data-from-clear]").click(function () {
        $(".b-search-form input[type=text]:not([data-search-by-number])").val("");
        $(".b-search-form input[type=text]:not([data-search-by-number])").removeClass("activated");
        $(".b-search-form .b-radio-box li").removeClass("active");
        //Medvedev: 2013-09-17
        $("input[data-radio-value]").val("");
        //end

        //clear select
        $(".b-search-form [data-select] select:not([name=region])").removeClass("activated");
        $(".b-search-form [data-select] select:not([name=region])")
        //firstly remove old selection
				.find('option').removeAttr("selected").end()
        //set default options
				.find('[data-sel-empty]').attr("selected", "selected");
        $(".b-search-form select:not([name=region]").change();

        //clear check-boxes
        $(".b-search-form input[type=checkbox]").prop('checked', false);

        //clear multiselects
        var a = MODEL.get('multiselect');
        for (var item in a) {
            a[item].actions.clear();
        }

        //clear groupmultiselect
        var a = MODEL.get('groupmultiselect');
        for (var item in a) {
            a[item].actions.clear();
        }
    });


    $("[data-extended-search-link]").click(function () {
        $(this).toggleClass("extended");
        $("[data-extended-params]").toggle();
    });


    // =================================================================
    /*radio multi*/
    $(document).on("click", "[data-radio-el]", function () {
        //Medvedev: 2013-09-17       
        //isActive = $(this).hasClass("active");        
        //        if (isActive) {
        //            $(this).parents("[data-radio]").find("[data-radio-value]").attr("value", -1);
        //            $(this).removeClass("active");
        //        }
        //        else {
        //            $(this).parents("[data-radio]").find("[data-radio-value]").attr("value", $(this).attr("data-radio-el"));
        //            $(this).addClass("active");
        //        }        

        var clicked = $(this);
        clicked.toggleClass("active");

        var selected = [];
        clicked.parent().find("[data-radio-el].active").each(function (index, el) {
            selected.push($(el).attr("data-radio-el"));
        });

        var range = portal2b.Helpers.compileMultiAsNumberRangeReq(selected.join());

        clicked.parents("[data-radio]")
               .find("[data-radio-value]")
               .val(portal2b.Helpers.compileIntRangeReq(range.min, range.max));
        //end
    })


    /*submit*/
    $("[data-submit-button]").click(function () {
        $(this).parents("form").submit();
    });

    $("[data-favorite-link]").click(function () {
        $(this).toggleClass("active");
    });

    // =================================================================

    $(document).on("click", '[data-photo-gallery-id]', function () {
        //$('[data-photo-gallery="wrap"]').fadeIn();
    });
    // =================================================================

    /* всплывающая фотогалерея */
    var b_trigger = true;
    $(document).on("click", '[data-photo-gallery-id]', function () {
        $(this).parents("ul").find("li").removeClass("active");
        $(this).parents("li").addClass("active");

        //если клик на странице машины - активируем нужную фотку в галерее по параметру data-photo-gallery-id
        if ($(this).parents('.b-view-page').length > 0) {
            $('[data-photo-gallery="list"] [data-photo-gallery-id="' + $(this).attr("data-photo-gallery-id") + '"]').click();
        }
        //console.log($(this).attr("href"))
        var tmpImg = new Image();
        tmpImg.onload = function () {
            $('[data-photo-gallery="photo"]').css("background-image", "url(" + tmpImg.src + ")");
            $('[data-photo-gallery="wrap"]').fadeIn(null, function () {
                //Включаем слушателя
                $(document).off('keyup').on('keyup', keyGallery);
            });

            if (b_trigger) {//run once
                getGalleryWidth();
                b_trigger = false;
            }

            //toggle arrow on left/right sideboard
            initBigArrows();
        };

        tmpImg.src = $(this).attr("href");
        return false;

        list = $('[data-photo-gallery="list"]');
        if ($(list).find("li:first").hasClass("active")) {
            $('[data-photo-gallery="prev"]').fadeOut("fast");
        }
        else {
            $('[data-photo-gallery="prev"]').fadeIn("fast");
        }

        if ($(list).find("li:last").hasClass("active")) {
            $('[data-photo-gallery="next"]').fadeOut("fast");
        }
        else {
            $('[data-photo-gallery="next"]').fadeIn("fast");
        }

        return false;
    });

    //считаем ширину нижней галереи по кол-ву фоток. ширина фоток стандартная, считается по первому элементу
    function getGalleryWidth() {
        list = $('[data-photo-gallery="list"]');

        //Medvedev: 2013-10-17
        //Problem: if first photo has portrait orientation, then its width is less then height and finally, total width will be calculated incorrectly
        //list.find('ul').css("width", list.find("li").length * (list.find("li").eq(0).outerWidth() + parseInt($(list).find("li").eq(0).css("margin-right"))));

        var totalWidth = 0;
        list.find("li")
            .each(function (index, el) {
                var $el = $(el);
                totalWidth += (parseInt($el.outerWidth()) + parseInt($el.css("margin-right")))
            });
        list.find('ul').css("width", totalWidth + 10);
        //end


        //console.log($(list).find("li").eq(0).html());
        if (parseInt($(list).find('ul').css("width")) > parseInt(list.width())) {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show();
        }
        else {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide();
        }

    }

    getGalleryWidth();

    var i_start = 1,
			i_end = 8,
			a_min_max_view = [i_start, i_end]; //Содержит диапазон видимых изображений карусели. По-умолчанию видны 0-й и 8-й элементы
    //двигаем нижний список фоток
    $(document).on("click", '[data-photo-gallery="list-next"], [data-photo-gallery="list-prev"]', function () {
        var gallery_scroll_count = 3; //кол-во элементов для прокрутки

        isnext = false;
        isprev = false;
        //выставляем флаги - какая кнопка нажата
        if ($(this).attr('data-photo-gallery') == "list-next") {
            isnext = true;
        }
        else {
            isprev = true;
        }

        list = $('[data-photo-gallery="list"]'); //родитель списка
        li_width = $(list).find("li").eq(0).outerWidth() + parseInt($(list).find("li").eq(0).css("margin-right")); //ширина одного элемента
        ul_width = $(list).find('ul').width(); //ширина всего списка
        pos = parseInt((list).find("ul").css("margin-left")); //текущая позиция прокрутки
        //прокручиваем на заданное кол-во элементов
        if (isnext) {
            pos -= gallery_scroll_count * li_width;

            if (
				list.find('[data-photo-gallery-id]').eq(a_min_max_view[1] + gallery_scroll_count).length
			) {
                a_min_max_view[1] += gallery_scroll_count;
                a_min_max_view[0] += gallery_scroll_count;
            } else {
                a_min_max_view[0] = list.find('[data-photo-gallery-id]').length - i_end;
                a_min_max_view[1] = list.find('[data-photo-gallery-id]').length;
            }
        }

        if (isprev) {
            pos += gallery_scroll_count * li_width;

            if (
				a_min_max_view[0] - gallery_scroll_count > 0
			) {
                a_min_max_view[0] -= gallery_scroll_count;
                a_min_max_view[1] -= gallery_scroll_count;
            } else {
                a_min_max_view[0] = i_start;
                a_min_max_view[1] = i_end;
            }
        }

        //определяем показывать ли кнопки туда/сюда
        if (pos < 0) {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').show();
        }
        else {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').hide();
        }

        if (pos + ul_width < list.width()) {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide(); //small arrow
        }
        else {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show(); //small arrow
        }

        //если справа/слева при прокрутке появляется дыра, делаем прокрутку на меньшее число элементов
        if (-pos > ul_width - $(list).width()) {
            pos = -(ul_width - $(list).width());
        }

        if (pos > 0) {
            pos = 0;
        }

        //делаем сдвиг
        $(list).find("ul").animate({ "margin-left": pos });
    });

    $(document).on("click", '[data-photo-gallery="next"], [data-photo-gallery="prev"]', function () {
        list = $('[data-photo-gallery="list"]');

        prev = list.find("li.active").prev();
        next = list.find("li.active").next();


        scroll_click = false;
        if ($(this).attr('data-photo-gallery') == "next") {
            next.find("a").click();
        }
        else {
            prev.find("a").click();
        }

        pos = parseInt((list).find("ul").css("margin-left")); //текущая позиция прокрутки
        li_width = $(list).find("li").eq(0).outerWidth() + parseInt($(list).find("li").eq(0).css("margin-right")); //ширина одного элемента
        ul_width = $(list).find('ul').width(); //ширина всего списка

        //считаем как двигать прокрутку
        if ($(list).find("li.active").offset().left - $(list).offset().left > $(list).width() - li_width * 2) {
            pos = -li_width * ($(list).find("li.active").index() + 2) + $(list).width();
        }
        if ($(list).find("li.active").offset().left - $(list).offset().left < li_width) {
            pos = -li_width * ($(list).find("li.active").index() - 1);
        }

        //определяем показывать ли кнопки туда/сюда
        if (pos < 0) {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').show();
        }
        else {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-prev"]').hide();
        }

        if (pos + ul_width <= list.width()) {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').hide(); //small arrow
        }
        else {
            $('[data-photo-gallery="list"] [data-photo-gallery="list-next"]').show(); //small arrow
        }

        //если справа/слева при прокрутке появляется дыра, делаем прокрутку на меньшее число элементов
        if (-pos > ul_width - $(list).width()) {
            pos = -(ul_width - $(list).width());
        }

        if (pos > 0) {
            pos = 0;
        }

        //делаем сдвиг
        $(list).find("ul").animate({ "margin-left": pos });



        //toggle arrow on left/right sideboard
        initBigArrows();
    });

    //toggle arrow on left/right sideboard
    function initBigArrows() {
        list = $('[data-photo-gallery="list"]');

        if (list.find("li.active").index() + 1 == list.find('[data-photo-gallery-id]').length) {
            $('[data-photo-gallery="next"]').hide();
        } else {
            $('[data-photo-gallery="next"]').show();
        }

        if (list.find("li.active").index() == 0) {
            $('[data-photo-gallery="prev"]').hide();
        } else {
            $('[data-photo-gallery="prev"]').show();
        }
    }

    /* кнопка закрыть */
    $(document).on("click", '[data-photo-gallery="close"]', function () {
        $('[data-photo-gallery="wrap"]').fadeOut();

        //Отключаем слушателя
        $(document).off('keyup', keyGallery);
    });


    //Слушаем хоткеи
    var keyGallery = function (e) {
        switch (e.keyCode) {
            case 27: //Esc
                $('[data-photo-gallery="close"]').click();
                break;
            case 39: //right row
                $('[data-photo-gallery="next"]').click();
                break;
            case 37: //left row
                $('[data-photo-gallery="prev"]').click();
                break;
            default:
                break;
        }
    }


    // =================================================================


    /*Table overflow cells*/
    //	var table = $("[data-table_overflow]");
    //	var tr = table.find('tr:not(:eq(0))');
    //
    //	table.addClass('b-gradient_overflow');
    //	tr.each(function(){
    //		var td  = $(this).find('td:eq(5), td:eq(7), td:eq(8)');
    //		td.each(function(){
    //			var i_width = parseInt($(this).css('max-width')) || 74;
    //			//console.log($(this).find('div').width() +'>='+ i_width);
    //			if($(this).find('div').width() >= i_width){
    //				var s_text = $(this).find('div').text();
    //				$(this).find('div').addClass('overflow').html($('<div>').text(s_text));
    //			}
    //		});
    //	});

    /*multiselect*/
    $('[data-multi-select]').each(function () {
        var el = $(this);
        var o = el.multiselect({/*debug: true*/
        });
        MODEL.set('multiselect', o);

        //Medvedev: 2013-09-17        
        el.actions.apply();
        //end
    });


    var subdistrictsControl = null;
    //Medvedev: 2013-09-23
    var onDistrictHandler = function (selected) {
        /// <param name="selected" type="Array">Array of selected district IDs</param>
        var divSubdistricts = $("[name=Subdistricts]").parent();

        //suppress all groups
        divSubdistricts.find("div[data-group][data-suppressed=false]").attr("data-suppressed", "true");

        //remove suppress from all selected districts
        _.each(selected, function (district) {
            var groupSelector = _.str.sprintf("div[data-group=%s]", district);

            var group = divSubdistricts.find(groupSelector);
            group.attr("data-suppressed", "false");
        }, this);

        //immitate 'apply' for subdistricts to remove 'check' from removed districts
        if (subdistrictsControl != null) {
            subdistrictsControl.actions.list.syncWithSuppressed();
            subdistrictsControl.actions.apply();
        }
    };

    //end


    /*group-multiselect*/
    $('[data-group-multi-select]').each(function () {
        var el = $(this);

        //Medvedev: 2013-09-23 - tracks changes of Districts
        var onApplyHandler = function () { };
        if (el.children("input[name=Districts]").length > 0) {
            onApplyHandler = onDistrictHandler;
        }

        if (el.children("input[name=Subdistricts]").length > 0) {
            subdistrictsControl = el;
        }

        //end

        var o = el.groupmultiselect({/*debug: true*/
            onApply: onApplyHandler
        });
        MODEL.set('groupmultiselect', o);

        //Medvedev: 2013-09-17        
        el.actions.apply();
        //end
    });
	

    //ScrollPane must be initialize
    $("[data-extended-params]").hide();

    //Medvedev: 2013-09-21
    //expand detailed parameters
    //$("[data-extended-params]").show();
    //end

    //Medvedev: 2013-09-22

    //separate checkboxes (not within select controls)
    $(".b-search-form label.checkbox input[type=checkbox]").click(function () {
        var el = $(this);

        el.val(el.is(":checked"));
    });

    //end
	
	$(".b-about-us-bottom .col-25 .hide-p p").each(function() {
        if ($(this).height() > $(this).parent().height()) {
            $(this).parent().siblings(".hide-p-link").css('visibility', 'visible');
        }
    });
    $(".b-about-us-bottom .col-25 .hide-p-link").click(function() {
        $(this).siblings(".hide-p").animate({
            height: '+=' + ($(this).siblings(".hide-p").children().height() - $(this).siblings(".hide-p").height())
        }, 500, "linear", function() {
// Animation complete.
        });
        $(this).css('display', 'none')
        return false;
    });
    
    $('.map-links a').click(function() {
        if(!$(this).hasClass('active')) {
            $('.map-links a').removeClass('active');
            $(this).addClass('active');
            $('.map-block .active').css('display', 'none');
            $('.map-block div').removeClass('active');
            $('.'+$(this).attr('data-map')).addClass('active');
            $('.'+$(this).attr('data-map')).fadeIn();
        }
        return false;
    });
    $(".b-popup-callback input").change(function () {
        $(this).addClass("activated");
        if ($(this).val() == "") $(this).removeClass("activated");
    });
    $(".b-popup-callback select").change(function () {
        $(this).addClass("activated");
        if ($(this).val() == "") $(this).removeClass("activated");
    });
    $(".b-popup-callback textarea").change(function () {
        $(this).addClass("activated");
        if ($(this).val() == "") $(this).removeClass("activated");
    });
    if($(".b-popup-callback select").val()==="") {
        $(this).css('color','#797979');
    }
    else {
        $(this).css('color','#000000');
    }
	
	$(".b-header .top-info .b-subnav .other-phones-link a").click(function() {
        $(".b-header .top-info .b-phones-tooltip").fadeToggle();
    });
	
	$(window).click(function(e) {
        if ($(e.target).parents(".b-header .top-info").length == 0) {
            $(".b-header .top-info .b-phones-tooltip").fadeOut();
        }
    });
});