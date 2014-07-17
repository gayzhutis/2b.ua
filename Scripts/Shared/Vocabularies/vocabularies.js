/*
* Provides portal-wide vocabularies.
*
*/
define([
    "Backbone",
    "order!../texts",
    "order!../consts"
],
    function (Backbone, Texts, Consts) {
        var Vocabularies = {
            NOT_SELECTED_ID: 0,

            TextLookup: function (recordID, label) {
                /// <summary>Represents simple textual lookup value.</summary>
                /// <param name="recordID" type="Number">Lookup record's ID.</param>
                /// <param name="label" type="String">Textual value for record.</param>

                this.recordID = recordID;
                this.label = label;
            },

            TextXLookup: function (recordID, label, subrecords) {
                /// <summary>Represents lookup record with subrecords.</summary>
                /// <param name="recordID" type="Number">Lookup record's ID.</param>
                /// <param name="label" type="String">Textual value for record.</param>
                /// <param name="subrecords" type="Array">Array of subrecords as TextLookup </param>

                this.recordID = recordID;
                this.label = label;
                this.subrecords = subrecords;
            },


            //#region Currencies

            getCurrencies: function () {
                /// <summary>Returns all available currencies.</summary>
                return new Vocabularies.TextLookupCollection([
                    { recordID: Vocabularies.NOT_SELECTED_ID, label: "&nbsp;" },
                    { recordID: Consts.CurrencyEnum.Percent, label: Texts.Currency.Percent },
                    { recordID: Consts.CurrencyEnum.USD, label: Texts.Currency.USD },
                    { recordID: Consts.CurrencyEnum.GRN, label: Texts.Currency.GRN },
                    { recordID: Consts.CurrencyEnum.EURO, label: Texts.Currency.EURO }
                ]);
            },

            toCurrencyString: function (currency) {
                switch (currency) {
                    case Consts.CurrencyEnum.Percent: return Texts.Currency.Percent;
                    case Consts.CurrencyEnum.USD: return Texts.Currency.USD;
                    case Consts.CurrencyEnum.GRN: return Texts.Currency.GRN;
                    case Consts.CurrencyEnum.EURO: return Texts.Currency.EURO;
                    default:
                        return undefined;
                }
            }

            //#endregion
        };


        /*
        * Represents single-value record in lookup.
        */
        Vocabularies.TextLookupRecord = Backbone.Model.extend({
            defaults: {
                recordID: Vocabularies.NOT_SELECTED_ID,
                label: ""
            }
        });

        /*
        * Represents cache to store vocabulary with simple list of single-value records.    
        */
        Vocabularies.TextLookupCollection = Backbone.Collection.extend({
            model: Vocabularies.TextLookupRecord
        });

        /*
        * 
        * Represents lookup record with child records.Record could contain several
        * child Vocabularies.TextLookupRecord records.
        */
        Vocabularies.XTextLookupRecord = Backbone.Model.extend({
            /*
            * instance of TextLookupRecord
            */
            record: {},
            /*
            * instance of TextLookupCollection
            */
            subrecords: {}
        });

        /*
        * Represents cache to store Vocabularies.XTextLookupRecord items.
        */
        Vocabularies.XTextLookupRecordCollection = Backbone.Collection.extend({
            model: Vocabularies.XTextLookupRecord
        });


        return Vocabularies;
    });