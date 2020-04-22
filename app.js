'use strict';
// save our API KEY
var API_KEY = 'AIzaSyC6-H8TQVmTzq9V__fzmBQjq64kmXnfsHQ';
// CX ID
var cx = '002003324048511228750:tyjkgk4cyhe';
var form = document.querySelector('#search');
//Function which shows our results from searching
function LoadGooglePage(data) {
    //clear the search results
    document.getElementById('results').innerHTML = '';
    document.getElementById('images').innerHTML = '';
    // Parsa data, convert to JavaScript object
    var response = JSON.parse(data);
    //iterating over the response object
    for (var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        if (item.pagemap !== undefined && item.pagemap.cse_image !== undefined) {
            var src = item.pagemap.cse_image[0].src;
            //visible results from UL
            //added visible for heading
            document.getElementById('heading-results').style.visibility = 'visible';
            document.getElementById('results').style.visibility = 'visible';
            document.getElementById('results').innerHTML +=
                '<li> <a href=' +
                item.link +
                ' target=' +
                "'_blank'" +
                '>' +
                item.htmlTitle +
                ' </a></li>';
            document.getElementById('pages').style.visibility = 'visible';
            document.getElementById('images').innerHTML +=
                '<a href=' +
                item.link +
                ' target=' +
                "'_blank'" +
                '><img ' +
                "class='images'" +
                'src=' +
                src +
                ' /></a>';
        }
    }
}
//creating url with parameters which we need
function CreateUrl(index) {
    var start_value = index + (index - 1) * 9;
    // query from search-item, also removing whitespaces
    var query = document.getElementById('search-item').value.trim();
    var url =
        'https://www.googleapis.com/customsearch/v1?key=' +
        API_KEY +
        '&q=' +
        query +
        '&cx=' +
        cx +
        '&num=10' +
        '&start=' +
        start_value;
    console.log(url);
    return url;
}
//sending http request
function RequestSend(index) {
    //create new httprequest
    var Http = new XMLHttpRequest();
    var url = CreateUrl(index);
    //initialize
    Http.open('GET', url, true);
    //sending
    Http.send();
    Http.onreadystatechange = function(e) {
        // if XMLHttpRequest.readyState 4-Done  and  status 200-OK
        if (Http.readyState === 4 && Http.status === 200) {
            LoadGooglePage(Http.responseText);
        }
        try {
            // catching errors for status response 403, 400 , etc
            // and redirecting the user to error page.
            if (Http.readyState === 4 && Http.status !== 200) {
                //problem with status
                throw new Error(Http.status);
            }
        } catch (e) {
            /// alert for error
            alert("Error!");
        }
    };
}
//submit into form
form.addEventListener('submit', function(e) {
    //prevent
    e.preventDefault();
    var actual_page = 1;
    RequestSend(actual_page);
});
//switching to active pages
document.getElementById('pages').onclick = function(e) {
    var active_page = document.getElementsByClassName('active');
    active_page[0].classList.toggle('active');
    e.srcElement.classList.toggle('active');
    RequestSend(Number(e.srcElement.textContent));
};