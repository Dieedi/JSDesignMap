/*
 *  ==== GET LOCATION ====
 *  Source : Tout sur HTML5 et CSS3, Jean-Marie COCHETEAU & Laurent KHOURI, Ed. DUNOD
 */

// Wait for page load
$(document).ready(init);
var lat, lng;
// initialization
function init(e) {
    // testing compatibility
    if (navigator.geolocation) {
        /* get current position and display it or display error message. Use options
         * can use watchPosition instead of getCurrentPosition
         * var idGeoloc = navigato.geolocation.watchPosition(true, false, options);
         * New properties :
         *  - altitude
         *  - altitudeAccuracy
         *  - heading (angle to north pole)
         *  - speed
         * Display null if there is a problem with GPS
         * Stop watch with navigator.geolocation.clearWatch(idGeoloc);
         */
        navigator.geolocation.getCurrentPosition(geolocSuccess, geolocFail, geolocOptions);
        $('article').html('Wait for positioning...');
    } else {
        $('article').html("Your browser doesn't allow Geolocation");
    }
}

// If get successed display coords and accuracy
function geolocSuccess(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    accuracy = position.coords.accuracy
    $('article').html("Found your position !" + lat + ' ' + lng + ' accuracy ' + accuracy + ' meters');
    initializeMap();
}

// If get failed display error message
function geolocFail(e) {
    var errorMsg = {
        "1" : "Allow geolocation refused",
        "2" : "position not found",
        "3" : "Allow of geolocation expired"
    };
    $('article').html(erroMsg[e]);
}

// Options for geolocation
var geolocOptions = {
    enableHighAccuracy : true,
    timeout : 30000,
    maximumAge : 60000
};