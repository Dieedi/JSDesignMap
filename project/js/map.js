/*
 *  Knockout observable array
 *  Place first to easy edit infos
 */

var addressesObservableArray = ko.observableArray([
    {
        lat: 43.599548,
        lng: 5.019535,
        name: "Miramas Golf",
        desc: "18 holes golf under the sun !",
        label: "Golf",
    },
    {
        lat: 43.580706,
        lng: 4.999503,
        name: "Miramas gare sncf",
        desc: "Some old train to see here",
        label: "Gare"
    },
    {
        lat: 43.589947,
        lng: 5.010917,
        name: "Lac Saint Suspi",
        desc: "Only the ducks can swim here !",
        label: "Lac Saint Suspi"
    },
    {
        lat: 43.572448,
        lng: 4.966266,
        name: "Miramas autodrome",
        desc: "BMW 'secret' autodrome, who knows what happend there ?",
        label: "Autodrome"
    },
    {
        lat: 43.559568,
        lng: 5.029159,
        name: "Miramas poudrerie",
        desc: "An old gun-powder factory which is now a natural Park",
        label: "poudrerie"
    }
]);

var google, lat, lng, map, bounds, infoWindow;
/*
 *  Knockout utility stringStartWith
 *  Not implemented in knockout min version
 */

ko.utils.stringStartsWith = function(string, startsWith) {
    string = string || "";
    if (startsWith.length > string.length) {
        return false;
    }
    return string.substring(0, startsWith.length) === startsWith;
};

// Wait for page load
if (google !== undefined) {
    var infoWindow = new google.maps.InfoWindow();
    $(document).ready(initializeMap);
} else {
    ko.applyBindings(new viewModelwoMap());
}

/*
 *  Map generator
 */

/*
 *  ==== INITIALIZE MAP ====
 */
function initializeMap() {

    bounds = new google.maps.LatLngBounds();

    var mapOptions = {
        // center: new google.maps.LatLng(lat, lng),
        zoom: 14
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //  responsive map ! ^^
    google.maps.event.addDomListener(window, "resize", function() {
       var center = map.getCenter();
       google.maps.event.trigger(map, "resize");
       map.setCenter(center);
    });

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        // this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });

    //  Apply bindings to array of markers
    ko.applyBindings(new viewModel());

    //  Center to all markers
    map.fitBounds(bounds);
}

/*
 *  ==== PLACE MARKER ====
 *  Source :
 *    for Markers
 *      - http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
 *    for Geocoding (finally unused due to amount of request this would generate !)
 *      - https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
 */
function createMarker(adresses) {
    var self = this;

    this.name = adresses.name;
    this.lat = adresses.lat;
    this.lng = adresses.lng;
    this.desc = adresses.desc;
    this.label = adresses.label;

    if (google !== undefined) {
        this.marker = new google.maps.Marker({
            position: new google.maps.LatLng(self.lat, self.lng),
            title: self.name,
            map: map,
            name: self.name,
            visible: true
        });

        //  Add a position to map bounds
        bounds.extend(this.marker.position);

        //  create infoWindow content
        var content = '<div class="infoWindow"><h3>' +
                        adresses.name +
                        '</h3><p>' +
                        adresses.desc +
                        '</p></div>';

        google.maps.event.addListener(self.marker, 'click', function() {
            //  Apply infoWindow content and call addImage of flickr.js function
            infoWindow.setContent(content, addImage(adresses.name, adresses.desc));
            infoWindow.open(map, self.marker);
        });
    }
}

/*
 *  Apply View Model
 */
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
            if (!(self.nameSearch().length === 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase()))) {
                //  Set visibility of markers out of search to false
                rec.marker.setVisible(false);
            }
            if (self.nameSearch().length === 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase())) {
                rec.marker.setVisible(true);
                return (self.nameSearch().length === 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase()));
            }
        });
    });

    self.centerMap = function() {
        map.setCenter(new google.maps.LatLng(this.lat, this.lng));
    };

    self.map = '';
}

function viewModelwoMap() {
    var self = this;
    self.nameSearch = ko.observable('');

    self.markers = [];

    //  push new marker in markers array
    for (var i = 0; i < addressesObservableArray().length; i++) {
        self.markers.push(new createMarker(addressesObservableArray()[i]));
    }

    //  Search through observableArray to update list
    self.filteredRecords = ko.computed(function() {
        return ko.utils.arrayFilter(self.markers, function(rec) {
            if (self.nameSearch().length === 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase())) {
                return (self.nameSearch().length === 0 || ko.utils.stringStartsWith(rec.name.toLowerCase(), self.nameSearch().toLowerCase()));
            }
        });
    });

    self.centerMap = function() {
    };

    self.map = '<h1 class="errorMsg">Google Map can not be loaded ! Check your proxy and/or firewall.</h1>';
}

/*
// Wait for page load
$(document).ready(init);
function init(e) {
    var lat = 43.5867, lng = 5.0046;
}

//  JQuery UI autocomplete ... search finally done without it.
$(function() {
    $('#searchMarkers').autocomplete({
        delay: 0,
        source: addressesObservableArray(),
        select: function(event, ui) {
            map.setCenter(new google.maps.LatLng(ui.item.lat, ui.item.lng));
        }
    });
});
*/