
/*
 *  Knockout utility stringStartWith
 *  Not implemented in knockout min version
 */

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) return false;
    return string.substring(0, startsWith.length) === startsWith;
};

/*
 *  Map generator
 *  Takes current loc (or watch position) to center map
 */

/*
 *  ==== INITIALIZE MAP ====
 */
var geocoder;

function initializeMap() {
    var map;

    var bounds = new google.maps.LatLngBounds();

    geocoder = new google.maps.Geocoder();

    var mapOptions = {
        // center: new google.maps.LatLng(lat, lng),
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
            label: "Home",
        },
        {
            lat: 43.579640,
            lng: 5.000336,
            name: "Vap Shop",
            desc: "<h3>My favorite Vap Shop</h3><p>Most pleasant Vap Shop in town.</p>",
            label: "Vap Shop"
        },
        {
            lat: 43.589947,
            lng: 5.010917,
            name: "Plan d'eau Saint Suspi",
            desc: "<h3>Water Point</h3><p>Only the ducks can swim here !</p>",
            label: "Plan d'eau Saint Suspi"
        }
    ]);

    //  create objects with google map markers
    function createMarker(adresses) {
        var self = this;
        this.name = adresses.name;
        this.lat = adresses.lat;
        this.lng = adresses.lng;
        this.desc = adresses.desc;
        this.label = adresses.label;

        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.lat, self.lng),
            title: self.name,
            map: map,
            name: self.name,
            visible: true
        });

        bounds.extend(this.marker.position);

        google.maps.event.addListener(self.marker, 'click', function() {
            infoWindow.setContent(self.desc);
            infoWindow.open(map, self.marker);
        });
    }

    //  View Model
    function viewModel() {
        var self = this;

        self.nameSearch = ko.observable('');

        //  Add markers in array
        self.markers = [];

        //  push new marker in markers array
        for (var i = 0; i < addressesObservableArray().length; i++) {
            self.markers.push(new createMarker(addressesObservableArray()[i]));
        }

        //  Search through observableArray to update list
        self.filteredRecords = ko.computed(function() {
            return ko.utils.arrayFilter(self.markers, function(rec) {
                if (!(self.nameSearch().length == 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase()))) {
                    //  Set visibility of markers out of search to false
                    rec.marker.setVisible(false);
                }
                if (self.nameSearch().length == 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase())) {
                    rec.marker.setVisible(true);
                    return (self.nameSearch().length == 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase()));
                }
            });
        });

        self.centerMap = function() {
            map.setCenter(new google.maps.LatLng(this.lat, this.lng));
        }
    };

    //  JQuery UI autocomplete
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

    var infoWindow = new google.maps.InfoWindow();

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });

    //  Center to all markers
    map.fitBounds(bounds);
}
/*
// Wait for page load
$(document).ready(init);
function init(e) {
    var lat = 43.5867, lng = 5.0046;
}
*/