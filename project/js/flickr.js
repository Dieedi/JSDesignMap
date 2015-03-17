/*
 *  Flickr call to get image from places given by name
 *  Images are push to infoWindow div when loaded
 */

function addImage(text, desc) {
    var apiKey = '911669b928ba82a171fb5ff4612c0d09';
    var textPhoto = text;

    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' +
                apiKey +
                '&text=' +
                textPhoto +
            //  10 pictures max limited by per_page=10
                '&privacy_filter=1&safe_search=1&per_page=10&format=json&jsoncallback=?').done(
                function(items) {
                    //  randomize the photo but some search didn't have more than 5 photos so random depend
                    //  of array length
                    if (items.photos !== undefined) {
                        var photoNum = Math.floor(Math.random() * items.photos.photo.length);
                        console.log(photoNum);
                        $('.infoWindow').append('<img src="http://farm' +
                            items.photos.photo[photoNum].farm +
                            '.staticflickr.com/' +
                            items.photos.photo[photoNum].server +
                            '/' +
                            items.photos.photo[photoNum].id +
                            '_' +
                            items.photos.photo[photoNum].secret +
                            '_s.jpg" alt="' +
                            items.photos.photo[photoNum].title + '">');
                    }
                });
}