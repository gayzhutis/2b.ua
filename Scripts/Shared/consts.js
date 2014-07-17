/*
* Defines application-wide settings.
*/
define({
    DEBUG: AppArgs.DEBUG,
    /// <summary>Gets actual user login.</summary>
    UserLogin: AppArgs.UserLogin,
    /// <summary>Gets actual user's ID.</summary>
    UserID: AppArgs.UserID,

    /// <summary>Gets Common Issue DB owner's ID.</summary>
    CommonDbID : AppArgs.CommonDbID,


    Lexeme: {
        OR: "OR"
    },

    CurrencyEnum: {
        /// <summary>Defines currencies supported by the system.</summary>                
        USD: 0,
        UAH: 10,
        EURO: 20,
        Percent: 30
    }


});