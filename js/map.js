/*
 *  Map generator
 *  Takes current loc (or watch position) to center map
 */

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

/*
 *  ==== INITIALIZE MAP ====
 */
var geocoder;

function initializeMap() {
    var map;
    var bounds = new google.maps.LatLngBounds();

    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 14
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    /*
     *  ==== PLACE MARKER ====
     *  Source :
     *    for Markers
     *      - http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
     *    for Geocoding (finally unused due to amount of request this would generate !)
     *      - https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
     */

    //  Knockout observable array
    var addressesObservableArray = ko.observableArray([
        {
            lat: 43.584258,
            lng: 5.008602,
            name: "Home",
            desc: "<h3>My house</h3><p>This is where I live since 3 years now</p>",
            label: "Home"
        },
        {
            lat: 43.579640,
            lng: 5.000336,
            name: "Vap Shop",
            desc: "<h3>My favorite Vap Shop</h3><p>Most pleasant Vap Shop in town.</p>",
            label: "Vap Shop"
        }
    ]);

    //  View Model
    function viewModel() {
        var self = this;

        self.markers = addressesObservableArray();
        self.centerMap = function() {
            map.setCenter(new google.maps.LatLng(this.lat, this.lng));
        }
    }

    $(function() {
        $('#searchMarkers').autocomplete({
            delay: 0,
            source: addressesObservableArray(),
            select: function(event, ui) {
                map.setCenter(new google.maps.LatLng(ui.item.lat, ui.item.lng));
            }
        });
    });

    //  Apply bindings to array of markers
    ko.applyBindings(new viewModel());

    var infoWindow = new google.maps.InfoWindow(),
        marker;

    for (var i = 0; i < addressesObservableArray().length; i++) {
        var position = new google.maps.LatLng(addressesObservableArray()[i].lat,addressesObservableArray()[i].lng);
        bounds.extend(mapOptions.center);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: addressesObservableArray()[i].name
        });

         google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(addressesObservableArray()[i].desc);
                infoWindow.open(map, marker);
            }
        })(marker, i));
        // override center by fitting all marker in the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
}


