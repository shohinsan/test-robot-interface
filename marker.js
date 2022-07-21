Marker = L.Class.extend({
        // Constructor
        initialize: function (marker_id, marker_name, marker_coordinates) {
            this.marker_id = marker_id;
            this.marker_name = marker_name;
            this.marker_coordinates = marker_coordinates;
        }
    }, {
        // Static methods
        createMarker: function (marker_id, marker_name, marker_coordinates) {
            return new Marker(marker_id, marker_name, marker_coordinates);
        },
        deleteMarker: function (marker_id) {
            this.marker_id = marker_id;
        },

        // getters and setters
        getMarkerId: function () {
            return this.marker_id;
        }
        ,
        getMarkerName: function () {
            return this.marker_name;
        }
        ,
        getMarkerCoordinates: function () {
            return this.marker_coordinates;
        }
        ,
        setMarkerId: function (marker_id) {
            this.marker_id = marker_id;

        }
        ,
        setMarkerName: function (marker_name) {
            this.marker_name = marker_name;
        }
        ,
        setMarkerCoordinates: function (marker_coordinates) {
            this.marker_coordinates = marker_coordinates;
        }
    }
);
