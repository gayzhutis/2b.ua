/*
* Represents multiple file upload view base.
* Implememts upload with:
*  - dialog based
*  - drag&drop
* Could be specialized with different layout, but requirement to layout are the following:
*
*   <button id="start-uploads"> Start uploads</button>
*   <button id="cancel-uploads"> Cancel uploads</button>
*
*   <form id="file-upload" enctype="multipart/form-data" action="Home/SaveFile/{B16B7A8D-2F70-4FFC-95E1-4A3883FAA989}" method="post">
*      <input type="file" name="file" multiple="true" />
*
*       <div>   Upload files</div>
*   </form>
*   <br />
*   <table id="files"></table>
*
*
*
*/
define([
  'jQuery',
  'Underscore',
  'Backbone'
], function ($, _, Backbone) {

    var ViewImpl = {
        _logger: null,
        template: null,

        events: {
            "click .start-uploads": "startUpload",
            "click .cancel-uploads": "cancelUpload"
        },
        //#region Assisting 
        startUpload: function () {
            this.$('.file_upload_start button').click();

            return false;
        },

        cancelUpload: function () {
            this.$('.file_upload_cancel button').click();
            $(".upload-cmds-pane").hide();

            return false;
        },

        //#endregion

        render: function () {
            this._logger.debug("rendering ...");

            this.$el.empty();

            var $template = $(this.template);
            this.$el.append($template);

            $('#file-upload').fileUploadUI({
                uploadTable: $('#files'),
                downloadTable: $('#files'),
                buildUploadRow: this._buildUploadRow,
                buildDownloadRow: this._buildDownloadRow,
                beforeSend: this._beforeSend
            });

            this._logger.debug("rendered");

            return this;
        },
        //#region Assisting 

        _buildUploadRow: function (files, index) {
            $(".upload-cmds-pane").show();

            return $('<tr><td class="file_upload_preview"><\/td>' +
                        '<td>' + files[index].name + '<\/td>' +
                        '<td class="file_upload_progress"><div><\/div><\/td>' +
                        '<td class="file_upload_start">' +
                        '<button class="ui-state-default ui-corner-all" title="Start Upload">' +
                        '<span class="ui-icon ui-icon-circle-arrow-e">Start Upload<\/span>' +
                        '<\/button><\/td>' +
                        '<td class="file_upload_cancel">' +
                        '<button class="ui-state-default ui-corner-all" title="Cancel">' +
                        '<span class="ui-icon ui-icon-cancel">Cancel<\/span>' +
                        '<\/button><\/td><\/tr>');
        },

        _buildDownloadRow: function (file) {
            return $('<tr><td>' + ((file)?file.name:"") + '  OK<\/td><\/tr>');
        },

        _beforeSend: function (event, files, index, xhr, handler, callBack) {
            handler.uploadRow.find('.file_upload_start button').click(callBack);
        }

        //#endregion

    };

    var view = Backbone.View.extend(ViewImpl);

    return view;
});