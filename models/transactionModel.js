var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    symbol: String, // e.g. MORL
    exchange: String, // based on http://finance.yahoo.com/exchanges
    portfolioID: String, // portfolio ID
    txID: String, // transaction ID
    cipherBlock: {
        ciphertext: String,
        initVector: [Number]
    }
});

var Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
