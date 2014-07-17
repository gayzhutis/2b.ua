define([
// Load the original jQuery source file
  'order!../../../../Scripts/jquery-1.7.1.min.js',
//  'order!../../../../Scripts/jquery-1.7.1.js',
  'order!../../../../Scripts/jquery-ui.min.js',
  'order!../../../../Scripts/jquery.ui.datepicker-ru.js',


//TODO: минимизировать
  'order!../../../../Scripts/jquery.multiselect.js',
  'order!../../../../Scripts/jquery.multiselect.ru.js',
  'order!../../../../Scripts/jquery.multiselect.filter.min.js',
  'order!../../../../Scripts/jquery.multiselect.filter.ru.js',

  'order!../../../../Scripts/jquery.dataTables.min.js',
//'order!../../../../Scripts/jquery.dataTables.js',

  'order!../../../../Scripts/pure.min.js',

// 'order!../../../../Scripts/jquery.ui.widget.js',
  'order!../../../../Scripts/jquery.fileupload.min.js',
// 'order!../../../../Scripts/jquery.fileupload.js',
  'order!../../../../Scripts/jquery.fileupload-ui.min.js',
  'order!../../../../Scripts/jquery.fileupload-uix.min.js',

    "order!../../../../Scripts/jquery.autosize2.js"


//'order!../../../../Scripts/'

], function () {
    if (!window.jQuery) throw "window.jQuery is not defined";

    var datepickerSettings = $.datepicker.regional["ru"];
    datepickerSettings.dateFormat = "d.mm.yy";
    $.datepicker.setDefaults(datepickerSettings);



    // Tell Require.js that this module returns a reference to jQuery
    return $;
});