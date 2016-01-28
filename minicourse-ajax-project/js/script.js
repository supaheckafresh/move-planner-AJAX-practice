// nytimes api key: 0c8b845367dad3f1c4ad7a110c3004b9:2:62066343


function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // get contents of street and city
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    // display greeting
    $greeting.text('So, you want to live at ' + address);

    // load streetview
    var $bgStreetView = $("<img class='bgimg' src='https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address + "'>");
    $body.append($bgStreetView);

    //build NyTimes request url
    var baseUri = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
    var queryParams = '?q=' +
            city.replace(', ', '+') +
            '&sort=newest' +
            //TODO remove API key before sharing
            '&api-key=' + '0c8b845367dad3f1c4ad7a110c3004b9\:2\:62066343';

    var builtUri = baseUri + queryParams;

    // fetch articles via AJAX request and display if response received
    $.getJSON(builtUri, function ( data ) {
            var docs = data.response.docs;
            var articles = [];

            $nytHeaderElem.text('New York Times Articles about ' + city);

            for (var docIdx in docs) {
                var doc = docs[docIdx];

                articles.push('<li id="' + doc._id + '">' +
                    '<a href="' + doc.web_url + '">' + doc.headline.main + '</a>' +
                    '<p>' + doc.snippet + '</p>' +
                    '</li>');
            }

            $nytElem.append(articles.join(''));
        }
    )
        .error(function () {
            $nytHeaderElem.text('New York Times Articles about ' + city + ' could not be loaded!');
        });


    // Wikipedia links AJAX request using JSONP
    $.ajax( {
        url: 'https://en.wikipedia.org/w/api.php?',
        data: {
            action: 'opensearch',
            search: city
            },
        dataType: 'jsonp',
        success: function (JSONdata) {
            $wikiElem.text('Wikipedia articles about ' + city + ':');

            var articles = JSONdata[3];
            for (var article in articles) {
                $wikiElem.append('<li><a href="' + articles[article] + '">'
                    + articles[article] + '</a></li>');
            }

        },
        error: function () {
            $wikiElem.text('Error retrieving Wikipedia articles on ' + city + '.');
        }
    });


    return false;
}

$('#form-container').submit(loadData);

