
var portal2b = window.portal2b || {};

portal2b.Consts = {
    Lexeme: {
        OR: "OR"
    }
};

var Consts = portal2b.Const;

portal2b.Helpers = {
    /// <summary>Different utility methods.</summary>


    //#region Arrays 

    arraysEqual: function (a1, a2) {
        /// <summary>Tests whether arrays are equal.</summary>
        return JSON.stringify(a1) == JSON.stringify(a2);
    },

    //#endregion

    //#region Numbers 


    formatNumber: function (number, decimals, dec_point, thousands_sep) {
        /// <summary>Formats number according to passed parameters. Example: formatNumber(price)</summary>
        /// <param name="number" type="Number">Number to format</param>
        /// <param name="decimals" type="Number">Optional. Default is 0</param>
        /// <param name="dec_point" type="String">Optional. Default is ","</param>
        /// <param name="thousands_sep" type="String">Optional. Default is " "</param>



        // Formats a number with grouped thousands
        //
        // version: 906.1806
        // discuss at: http://phpjs.org/functions/number_format           
        // *     example 1: number_format(1234.56);
        // *     returns 1: '1,235'
        // *     example 2: number_format(1234.56, 2, ',', ' ');
        // *     returns 2: '1 234,56'
        // *     example 3: number_format(1234.5678, 2, '.', '');
        // *     returns 3: '1234.57'
        // *     example 4: number_format(67, 2, ',', '.');
        // *     returns 4: '67,00'
        // *     example 5: number_format(1000);
        // *     returns 5: '1,000'
        // *     example 6: number_format(67.311, 2);
        // *     returns 6: '67.31'
        // *     example 7: number_format(1000.55, 1);
        // *     returns 7: '1,000.6'
        // *     example 8: number_format(67000, 5, ',', '.');
        // *     returns 8: '67.000,00000'
        // *     example 9: number_format(0.9, 0);
        // *     returns 9: '1'
        // *     example 10: number_format('1.20', 2);
        // *     returns 10: '1.20'
        // *     example 11: number_format('1.20', 4);
        // *     returns 11: '1.2000'
        // *     example 12: number_format('1.2000', 3);
        // *     returns 12: '1.200'
        var n = number, prec = (decimals) ? decimals : 0;
        if (!dec_point) dec_point = ",";
        if (!thousands_sep) thousands_sep = " ";

        var toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return (Math.round(n * k) / k).toString();
        };

        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
        var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

        var s = (prec > 0) ? toFixedFix(n, prec) : toFixedFix(Math.round(n), prec); //fix for IE parseFloat(0.55).toFixed(0) = 0;

        var abs = toFixedFix(Math.abs(n), prec);
        var _, i;

        if (abs >= 1000) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;

            _[0] = s.slice(0, i + (n < 0)) +
          _[0].slice(i).replace(/(\d{3})/g, sep + '$1');
            s = _.join(dec);
        } else {
            s = s.replace('.', dec);
        }

        var decPos = s.indexOf(dec);
        if (prec >= 1 && decPos !== -1 && (s.length - decPos - 1) < prec) {
            s += new Array(prec - (s.length - decPos - 1)).join(0) + '0';
        }
        else if (prec >= 1 && decPos === -1) {
            s += dec + new Array(prec).join(0) + '0';
        }
        return s;
    },


    //#endregion

    //#region Multiselect to int range 


    compileMultiAsNumberRangeReq: function (selected) {
        /// <param name="selected" type="String or Array">String must be as ',' delimited selected values to int number range. </param>
        /// <returns type="Object" />

        var result = {
            min: null,
            max: null
        };

        if (!selected) return result;

        var inputArray = selected;
        if (_.isString(selected)) {
            if (_.str.isBlank(selected)) return result;

            inputArray = selected.split(',');
        }

        //something is selected
        var hasMoreThan = false;
        var that = this;
        var ids = _.chain(inputArray)
                       .map(function (id) {
                           if (id.indexOf(">=") != -1) hasMoreThan = true;
                           return that.normalizeUiInt(id).value;
                       })
                       .value();

        var min = _.min(ids);
        var max = _.max(ids);

        if (hasMoreThan) {
            result.min = min;

            return result;
        }

        if (ids.length == 1) {
            result.min = min;
            result.max = max;

            return result;
        }

        result.min = min;
        result.max = max;
        return result;
    },

    //#endregion


    //#region Multiselects 


    compileAsMultiIntReq: function (selected) {
        /// <param name="selected" type="String">',' delimited selected values. </param>
        var req = "";
        if (selected) {
            req = String(selected).replace(/\s*,\s*/g, Consts.Lexeme.OR);
        }

        return req;
    },

    formatUiMultiIntReq: function (requirement) {
        /// <param name="selected" type="String">Consts.Lexeme.OR delimited selected values. 
        /// Opposite to compileAsMultiIntReq.
        /// </param>
        var selected = "";
        if (requirement) {
            selected = String(requirement).replace(new RegExp(Consts.Lexeme.OR, "g"), ",");
        }

        return selected;
    },

    getMultiSelectVal: function (multiselect) {
        /// <summary>Collects selected values and returns as "OR" string or empty string if nothing is selected.
        /// Special routine to process Multiselect control's input.
        /// </summary>
        /// <param name="multiselect" type="Object">Input element.</param>
        var $arg = $(multiselect);


        var selected = $arg.val();
        if (selected) {
            selected = String(selected).replace(/,/g, Consts.Lexeme.OR);
        } else {
            selected = "";
        }

        return selected;
    },

    parseLookupDalString: function (req) {
        /// <summary>Parse Consts.Lexeme.OR delimited list of simple integer numbers or numeric equations into array or returns empty array</summary>.
        /// <param name="req" type="String">Consts.Lexeme.OR delimited list of separate atomic number equations.
        /// Exaple, "3OR4OR>=10" will be returned as ["3", "4", ">=10"]
        /// </param>
        /// <returns type="Array" />

        if (!req) return [];

        if ($.isNumeric(req)) return [String(req)];

        var selectedIds = req.split(Consts.Lexeme.OR);

        return selectedIds;

        //            return _.chain(selectedIds)
        //                    .map(function (id) { return Number(id); })
        //                    .value();
    },

    //#endregion

    //#region Numeric ranges 

    normalizeUiInt: function (text) {
        /// <summary>
        /// Normalizes input text and returns both entered value as number and int text, formatted as excepted for system.
        /// If null or empty text is entered, then result.value = null .
        /// </summary>
        /// <param name="text" type="String or Number">String must be in any form.</param>
        /// <returns type="Object" />

        var result = {
            value: null,
            text: ""
        };

        if (!text) return result;


        if (_.isNumber(text)) {
            result.value = text;
        } else {
            if (_.str.isBlank(text)) return result;

            text = text.replace(/\D/g, "");
            if (_.str.isBlank(text)) return result;

            result.value = parseInt(text);
        }
        result.text = this.formatUiInt(result.value);

        return result;
    },

    normalizeUiFloat: function (text) {
        /// <summary>
        /// Normalizes input text and returns both entered value as number and dbl text, formatted as excepted for system.
        /// If null or empty text is entered, then result.value = null .
        /// </summary>
        /// <returns type="Object" />

        var result = {
            value: null,
            text: ""
        };

        if (!text || _.str.isBlank(text)) return result;

        var p = text.replace(/[^\d,.]/g, "");
        p = p.replace(/\,/g, ".");

        if (!p.match(/\d/)) return result;

        result.value = parseFloat(p);
        result.text = this.formatUiDbl(result.value);

        return result;
    },

    formatUiDbl: function (value) {
        /// <summary>Formats and returns double according to project's standards. </summary>
        /// <param name="value" type="Number">Double</param>

        if (!value) return "";

        value = (_.isNumber(value)) ? value : parseFloat(value);

        var p = value.toString();

        //number of decimals depends on original number, there is no predefined rules
        var decPos = p.lastIndexOf(".");
        var decimals = (decPos == -1) ? 0 : p.length - decPos - 1;
        return this.formatNumber(value, decimals);
    },

    compileDblRangeReq: function (min, max) {
        /// <summary>Compiles range requirement string. Returned is culture-invariant. Results are "", "10.5-20", ">=20", "<=20.4"</summary>
        /// <param name="min" type="String">Optinal. Min range limit. Some number string</param>
        /// <param name="max" type="String">Optinal. Max range limit. Some number string</param>
        /// <returns type="String" />

        var oMin = this.normalizeUiFloat(min);
        var oMax = this.normalizeUiFloat(max);

        if (oMin.value && oMax.value) return [oMin.value, oMax.value].join("-");
        if (oMin.value) return ">=" + oMin.value;
        if (oMax.value) return "<=" + oMax.value;

        return "";
    },

    compileIntRangeReq: function (min, max) {
        /// <summary>Compiles range requirement string. Results are "", "10-20", ">=20", "<=20"</summary>
        /// <param name="min" type="String">Optinal. Min range limit. Some number string</param>
        /// <param name="max" type="String">Optinal. Max range limit. Some number string</param>
        /// <returns type="String" />

        var oMin = this.normalizeUiInt(min);
        var oMax = this.normalizeUiInt(max);

        if (oMin.value && oMax.value) return [oMin.value, oMax.value].join("-");
        if (oMin.value) return ">=" + oMin.value;
        if (oMax.value) return "<=" + oMax.value;


        return "";
    },

    makeAsIntLookup: function (min, max, minLookup, maxLookup) {
        /// <summaryReturns OR'ed string with lookup values or empty string.</summary>
        /// <param name="min" type="String">Min range limit. Some number string</param>
        /// <param name="max" type="String">Optinal. Max range limit. Some number string</param>
        /// <param name="minLookup" type="Number">Lookup's min value.</param>
        /// <param name="maxLookup" type="Number">Lookup's max value represented as >=maxLookup.</param>
        /// <returns type="String" />           

        var result = "";

        if (!min && !max) return result;
        if (_.str.isBlank(min) && _.str.isBlank(max)) return result;

        if (!minLookup || !maxLookup) throw "Lookup ranges must be specified.";


        var oMin = this.normalizeUiInt(min);
        var oMax = this.normalizeUiInt(max);

        //only min specified
        if (oMin.value && !oMax.value) {
            oMax.value = maxLookup;
        }
        //only max specified
        if (!oMin.value && oMax.value) {
            oMin.value = minLookup;
        }

        //here, both are always specified                       
        if (oMax.value > maxLookup) oMax.value = maxLookup;

        var resultArray = [];
        for (var i = oMin.value; i <= oMax.value; i++) {
            if (i == maxLookup) {
                resultArray.push(">=" + i.toString());
            } else {
                resultArray.push(i.toString());
            }
        }
        result = resultArray.join(Consts.Lexeme.OR);

        return result;
    },

    parseRangeOrLessOrGreater: function (req) {
        /// <summary>Parses numeral requirement string and returns equation object.</summary>
        /// <param name="req" type="String">Equation like: "", "number", ">=number", "<=number", "number-number"</param>
        /// <returns type="Object" />

        if (!req) {
            return {
                min: "",
                max: ""
            };
        }

        var max = this.parseLessThanOrEqual(req);
        if (max != "") return {
            min: "",
            max: Number(max)
        };

        var min = this.parseGreaterThanOrEqual(req);
        if (min != "") return {
            min: Number(min),
            max: ""
        };

        var range = req.split("-");
        if (range.length === 2) return {
            min: Number(range[0]),
            max: Number(range[1])
        };

        if ($.isNumeric(req)) return {
            min: Number(req),
            max: Number(req)
        };

        return {
            min: "",
            max: ""
        };
    },

    parseGreaterThanOrEqual: function (req) {
        /// <summary>Parses equation like: "", ">=number"</summary>
        /// <param name="req" type="String">Equation like: "", ">=number"</param>

        //TODO: very strange parsing - fix it or refuse it. Reurn is very strange

        if (!req) return "";

        if (req.length < 2) return "";
        if (req.slice(0, 2) != ">=") return "";

        return req.slice(2);
    },

    parseLessThanOrEqual: function (req) {
        /// <summary>Parses equation like: "", ">=number"</summary>
        /// <param name="req" type="String">Equation like: "", ">=number"</param>

        //TODO: very strange parsing - fix it or refuse it. Reurn is very strange

        if (!req) return "";

        if (req.length < 2) return "";
        if (req.slice(0, 2) != "<=") return "";

        return req.slice(2);
    },



    //#endregion

    //#region Text requirements 


    compileTextReq: function (patterns) {
        /// <summary>Produces OR delimitered values</summary>
        /// <param name="patters" type="String">',' delimitered selected values. </param>
        /// <returns type="Object" />
        var result = {
            value: null,
            text: patterns
        };

        var arPatterns = _.str.words(patterns, ",");

        if (arPatterns.length <= 1) return result;


        result.value = _.map(arPatterns, function (s) { return "[" + _.str.trim(s) + "]"; })
                             .join(Consts.Lexeme.OR);

        return result;
    },

    parseTextReq: function (patterns) {
        /// <summary>Prodices human-readable version.</summary>
        /// <param name="patters" type="String">Result produced with <see href="_compileTextReq"/>. </param>

        if (!_.isString(patterns)) return "";

        if (patterns.charAt(0) == '[' && patterns.charAt(patterns.length - 1) == ']') {
            return patterns.substr(1, patterns.length - 2)
                               .split("]" + Consts.Lexeme.OR + "[")
                               .join(", ");
        }

        return patterns;
    },

    //#endregion

    //#region Price 

    formatHtmlInt: function (intValue) {
        /// <summary>Formats price's number as agreed for the project.
        /// Must be within HTML texts.
        /// </summary>
        /// <param name="intValue" type="Number">Integer</param>

        if (!intValue) return "";

        return this.formatNumber(
                (_.isNumber(intValue)) ? intValue : parseInt(intValue),
                0, ",", "&nbsp;"
            );
    },

    formatUiInt: function (intValue) {
        /// <summary>Formats price's number as agreed for the project</summary>
        /// <param name="intValue" type="Number">Integer</param>

        if (!intValue) return "";

        return this.formatNumber(
                (_.isNumber(intValue)) ? intValue : parseInt(intValue),
                0, ",", " "
            );
    },

    formatUiIntReq: function (intReq) {
        /// <summary>Formats price's requirement as agreed for the project</summary>
        /// <param name="intReq" type="String">Numeric equation</param>

        if (!intReq) return "";

        if ($.isNumeric(intReq)) return this.formatUiInt(intReq);

        var req = this.parseRangeOrLessOrGreater(intReq);

        var min = (_.isNumber(req.min)) ? this.formatUiInt(req.min) : null;
        var max = (_.isNumber(req.max)) ? this.formatUiInt(req.max) : null;


        if (min && max) {
            if (min == max) return min;

            return [min, " - ", max].join("");
        }
        if (min) return ">=" + min;

        return "<=" + max;
    },

    //#endregion

    hasAttr: function (control, name) {
        /// <summary>Checks whether control has specified attribute</summary>
        /// <param name="control" type="Object">jQuery-wrapped control.</param>
        /// <param name="name" type="String">Attribute's name.</param>

        var attr = control.attr(name);

        return (typeof attr !== 'undefined' && attr !== false);
    }

};
