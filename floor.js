Floor = L.Class.extend({
        // Constructor
        initialize: function (floor_id, floor_name, floor_coordinates) {
            this.floor_id = floor_id;
            this.floor_name = floor_name;
            this.floor_coordinates = floor_coordinates;
            this.floor_markers = new Map();
        },
        // getters and setters
        getFloorId: function () {
            return this.floor_id;
        },
        getFloorName: function () {
            return this.floor_name;
        },
        getFloorCoordinates: function () {
            return this.floor_coordinates;
        },
        getFloorMarkers: function () {
            return this.floor_markers;
        },
        setFloorId: function (floor_id) {
            this.floor_id = floor_id;
        },
        setFloorName: function (floor_name) {
            this.floor_name = floor_name;
        },
        setFloorCoordinates: function (floor_coordinates) {
            this.floor_coordinates = floor_coordinates;
        },
        setFloorMarkers: function (floor_markers) {
            this.floor_markers = floor_markers;
        },
        // methods
    }
);
