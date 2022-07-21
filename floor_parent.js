// classes for marker, routes, lines
// call from each hard coded coordinate system, I would create a all these objects
// new marker, new lines and etc.
// inside each floor
//

// let Floor = L.Class.extend({

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

Route = L.Class.extend({
        // Constructor
        initialize: function (route_id, route_name, route_coordinates) {
            this.route_id = route_id;
            this.route_name = route_name;
            this.route_coordinates = route_coordinates;
        }
    }, {
        // Static methods
        createRoute: function (route_id, route_name, route_coordinates) {
            return new Route(route_id, route_name, route_coordinates);
        },
        updateRoute: function (route_id, route_name, route_coordinates) {
            this.route_id = route_id;
            this.route_name = route_name;
            this.route_coordinates = route_coordinates;
        },
        // getters and setters
        getRouteId: function () {
            return this.route_id;
        },
        getRouteName: function () {
            return this.route_name;
            },
        getRouteCoordinates: function () {
            return this.route_coordinates;
            },
        setRouteId: function (route_id) {
            this.route_id = route_id;
            },
        setRouteName: function (route_name) {
            this.route_name = route_name;
        },
        setRouteCoordinates: function (route_coordinates) {
            this.route_coordinates = route_coordinates;
        }
    }
);

Lines = L.Class.extend({
        // Constructor
        initialize: function (lines_id, lines_name, lines_coordinates) {
            this.lines_id = lines_id;
            this.lines_name = lines_name;
            this.lines_coordinates = lines_coordinates;
        }
    }, {
        // Static methods
        createLines: function (lines_id, lines_name, lines_coordinates) {
            return new Lines(lines_id, lines_name, lines_coordinates);
        }
        ,
        updateLines: function (lines_id, lines_name, lines_coordinates) {
            this.lines_id = lines_id;
            this.lines_name = lines_name;
            this.lines_coordinates = lines_coordinates;
        }
    }

    // getter and setter
    , {
        getLinesId: function () {
            return this.lines_id;
        }
        ,
        getLinesName: function () {
            return this.lines_name;

        }
        ,
        getLinesCoordinates: function () {
            return this.lines_coordinates;

        }
        ,
        setLinesId: function (lines_id) {
            this.lines_id = lines_id;

        }
        ,
        setLinesName: function (lines_name) {
            this.lines_name = lines_name;
        },
        setLinesCoordinates: function (lines_coordinates) {
            this.lines_coordinates = lines_coordinates;
        }

    }
);


// class Lines {
//     constructor(polyline, fromRoute, toRoute) {
//         this.polyline = polyline;
//         this.fromRoute = fromRoute;
//         this.toRoute = toRoute;
//     }
//
//     lines = [];
// }
//
// class Routes {
//     constructor(id, marker) {
//         this.id = id;
//         this.marker = marker;
//     }
//
//     routes = [];
// }
//
// class userMarker {
//     constructor(id, marker) {
//         this.id = id;
//         this.marker = marker;
//     }
// }
