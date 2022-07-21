Routes = L.Class.extend({
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
