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
