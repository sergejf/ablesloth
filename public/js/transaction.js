var Transaction = function () {

        var crypto = Crypto(),

        ciphertext = {
            text: String,
            iv: [Number]
        },

        plaintext = {
            symbol: String, // e.g. MORL
            exchange: String, // based on http://finance.yahoo.com/exchanges
            portfolioID: String, // portfolio ID
            txID: String, // transaction ID
            txType: String, // "BUY" or "SELL"
            txShareCount: Number, // number of shares bought/sold
            txDate: String, // YYYYMMDD
            txSharePrice: Number, // not including any commission paid
            txCommission: Number, // in the same currency as the transaction price
            txCurrency: String, // currency pairs from http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json
            txBroker: String, // broker's name
            txNote: String // free format note
        },

        init = function(salt, password) {
                crypto.init(salt, password);
        }

        encrypt = function () {
            ciphertext.iv = crypto.initVector();
            ciphertext.text = crypto.encrypt(JSON.stringify(this.plaintext), ciphertext.iv);
        },

        decrypt = function () {
            return crypto.decrypt(ciphertext.text, ciphertext.iv);
        };

    return {
        plaintext: plaintext,
        init: init,
        encrypt: encrypt,
        decrypt: decrypt
    };

};
