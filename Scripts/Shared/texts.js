/*
All text must not end with punctuation.
*/
define({
    Yes: "да",
    No: "нет",
    WaitWhileSaving: "Подождите, идет сохранение...",
    WaitWhileChanging: "Подождите, идет изменение данных на сервере...",
    FailedToChange: "В процессе изменения произошла ошибка",
    ChangeSucceeded: "Изменение успешно завершено",
    SaveSucceeded: "Сохранение успешно завершено",
    WaitWhileLoading: "Подождите, идет загрузка...",
    WaitWhileDeleting: "Подождите, идет удаление...",
    DeleteSucceeded: "Удаление успешно завершено",
    FailedToDelete: "В процессе удаления произошла ошибка",

    Data: {
        WaitWhileSaving: "Подождите, идет сохранение данных...",
        WaitWhileLoading: "Подождите, идет загрузка данных...",
        FailedToSave: "Во время сохранения данных произошла ошибка",
        SuccessfullySaved: "Данные успешно сохранены",
        FailedToLoad: "Во время загрузки данных произошла ошибка"
    },
    Filter: {
        WaitWhileSaving: "Подождите, идет сохранение фильтра...",
        WaitWhileLoading: "Подождите, идет загрузка фильтра...",
        FailedToSave: "Во время сохранения фильтра произошла ошибка. Попробуйте сохранить еще раз",
        SuccessfullySaved: "Фильтр успешно сохранен",
        FailedToLoad: "Во время загрузки фильтра произошла ошибка"
    },
    Photos: {
        WaitWhileSaving: "Подождите, идет сохранение фотографий...",
        WaitWhileLoading: "Подождите, идет загрузка фотографий...",
        FailedToSave: "Во время сохранения фотографий произошла ошибка. Попробуйте сохранить еще раз",
        SuccessfullySaved: "Фотографии успешно сохранены",
        FailedToLoad: "Во время загрузки фотографий произошла ошибка"
    },
    Mailing: {
        WaitAddingToMailing: "Подождите, обработка запроса на добавление в рассылку...",
        SuccessfullyAdded: "Заявка успешно добавлена в рассылку",
        FailedToAddToMailing: "Во время обработки запроса по добавлению в рассылку произошла ошибка",
        SuccessfullyMailed: "Заявка успешно отправлена получателям срочной рассылки",
        FailedToMakeUrgentMailing: "Во время отправки срочной рассылки произошла ошибка",
    },

    Instructions: {
        RefreshF5: "Попробуйте обновить страницу нажав F5",
        RepeatSave: "Попробуйте сохранить еще раз",
        RepeatLoad: "Попробуйте загрузить еще раз",
        RepeatDelete: "Попробуйте удалить еще раз",
        TryToRepeat: "Попробуйте еще раз"
    },
    access: {
        cmdCloseAccess: "закрыть доступ",
        cmdOpenAccess: "открыть доступ"
    },

    Titles: {
        Sales: "Продажи",
        Buys: "Покупки"
    },

    FailedToLoadFromServer: "Ошибка загрузки данных с сервера",

    // must be assigned to oLanguage property
    jDataTableTexts: {
        Issues: {
            "sProcessing": "Подождите...",
            "sLengthMenu": "Показать _MENU_ заявок",
            "sZeroRecords": "Заявки отсутствуют.",
            "sInfo": "Заявки с _START_ по _END_ из _TOTAL_",
            "sInfoEmpty": "0 заявок",
            "sInfoFiltered": "(отфильтровано из _MAX_ заявок)",
            "sInfoPostFix": "",
            "sSearch": "Быстрый фильтр:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Первая",
                "sPrevious": "",
                "sNext": "",
                "sLast": "Последняя"
            }
        },
        Records: {
            "sProcessing": "Подождите...",
            "sLengthMenu": "Показать _MENU_ записей",
            "sZeroRecords": "Записи отсутствуют.",
            "sInfo": "Записи с _START_ по _END_ из _TOTAL_",
            "sInfoEmpty": "0 записей",
            "sInfoFiltered": "(отфильтровано из _MAX_ записей)",
            "sInfoPostFix": "",
            "sSearch": "Быстрый фильтр:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Первая",
                "sPrevious": "",
                "sNext": "",
                "sLast": "Последняя"
            }
        },
        Matches: {
            "sProcessing": "Подождите...",
            "sLengthMenu": "Показать _MENU_ стыковок",
            "sZeroRecords": "Стыковки отсутствуют.",
            "sInfo": "Стыковки с _START_ по _END_ из _TOTAL_",
            "sInfoEmpty": "0 стыковок",
            "sInfoFiltered": "(отфильтровано из _MAX_ стыковок)",
            "sInfoPostFix": "",
            "sSearch": "Быстрый фильтр:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "Первая",
                "sPrevious": "",
                "sNext": "",
                "sLast": "Последняя"
            }
        }
    },



    Issues: {
        getLowCase: function (count) {
            /// <summary>Creates correct form for word "issues" for sentence like "5 issues"</summary>
            /// <param name="count" type="Number">Integer number of issues to get word for.</param>

            var lastDigit = count % 10;

            if (lastDigit == 1) return "заявка";
            if (lastDigit >= 2 && lastDigit <= 4) return "заявки";

            return "заявок";
        }
    },

    Currency: {
        Percent: "%",
        USD: "дол",
        GRN: "грн",
        EURO: "евро"
    }
});
