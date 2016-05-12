$(document).ready(function () {
    var t = $('table').DataTable({
        "searching": false,
        dom: 'Bfrtip',
        select: {
            style: 'single'
        },
        responsive: true,
        columnDefs: [{
            responsivePriority: 1,
            targets: 0
    }, {
            responsivePriority: 2,
            targets: 3
    }, {
            responsivePriority: 3,
            targets: 4
    }, {
            responsivePriority: 4,
            targets: 2
    }],
        buttons: [{
            text: 'BUY',
            action: function (e, dt, node, config) {
                alert('Buy Ticker');
            }
    }, {
            text: 'SELL',
            action: function (e, dt, node, config) {
                alert('Sell Ticker');
            }
    }]
    });

    var stocks = ['DFE', 'MORL', 'FV'];
    var stocksUrl = stocks.join('%20');

    var url = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22' + stocksUrl + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';

    $.getJSON(url, function (data) {
        for (var i = 0; i < data.query.results.quote.length; i++) {
            var stockTickerId = '#stock-ticker-' + (i + 1);
            var stockChangeId = '#stock-change-' + (i + 1);
            var stockPriceId = '#stock-price-' + (i + 1);
            var change = data.query.results.quote[i].ChangeinPercent;
            var price = data.query.results.quote[i].LastTradePriceOnly;

            // TODO: color should be set for DataTable elements, not DOM

            if (change.slice(0, -1) < 0) {
                $(stockChangeId).css('color', '#db5959');
            } else if (change.slice(0, -1) > 0) {
                $(stockChangeId).css('color', '#68b665');
            } else if (change.slice(0, -1) == 0) {
                $(stockChangeId).css('color', '#fdca41');
            }

            t.cell(stockTickerId).data(data.query.results.quote[i].symbol).draw;
            t.cell(stockChangeId).data(change).draw;
            t.cell(stockPriceId).data('$' + price).draw;
        }
    });

    var password = "username";
    var salt = "password";
    var plaintext = "$44.00"
    var key = doPbkdf2(salt, password);
    var ct = doEncrypt(salt, plaintext, key);
    var pt = doDecrypt(JSON.parse(ct).ct, key);

});

// http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D%22%27MORL%27%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback
// See:
// http://www.sitepoint.com/responsive-data-tables-comprehensive-list-solutions
