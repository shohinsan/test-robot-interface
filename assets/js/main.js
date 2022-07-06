// ------------------------------------------------
//  https://leafletjs.com/index.html
const map = L.map("map").setView([37.29422, 238.08416], 13);
// https://leafletjs.com/reference.html#marker
const singleMarker = L.marker([37.29422, 238.08416]); // ignore
// ------------------------------------------------
// Tile layer
// ------------------------------------------------
// https://leaflet-extras.github.io/leaflet-providers/preview/
// Google Map Layer
// https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
googleStreets = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
);
// uncomment to recover map
// googleStreets.addTo(map);
// Satellite Layer
googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});
// uncomment to recover map
// googleSat.addTo(map);
// Layer Control
// https://leafletjs.com/reference.html#control-layers
var baseLayers = {
    "Satellite Google Map": googleSat,
    "Default Google Map": googleStreets,
};
var overlays = {}; // ignore, additional parameters if needed
L.control.layers(baseLayers, overlays).addTo(map);
// ------------------------------------------------
// GEOJSON
// https://geojson.io/#map=20/37.29419/238.08499]

var myLines = [
    {
        // LineString is a type of Geometry used for representing  both a polyline and a polygon on a map.
        type: "LineString",
        properties: {
            stroke: "#555555",
            "stroke-width": 2,
            "stroke-opacity": 1,
            fill: "#11ff00",
            "fill-opacity": 0.5,
            weight: 5,
            offset: 5,
        },
        // Have your coordinates of shapes here
        coordinates: [
            [238.01673889160156, 37.25929865437848],
            [238.15698623657224, 37.25929865437848],
            [238.15698623657224, 37.33413244661209],
            [238.01673889160156, 37.33413244661209],
            [238.01673889160156, 37.25929865437848],
        ],
        // coordinates2: [[..,..]],
    },
];
var myStyle = {
    color: "##ff7800",
    fill: "red",
    "fill-opacity": 0.5,
    weight: 5,
    opacity: 0,
    offset: 1.5,
};

// store markers here on map
var markers = new Map();
var routes = new Array();
var userMarker;

var length = 100;
var width = 100;

L.geoJson(myLines,
    {
        style: myStyle,
        onEachFeature: function (feature, layer) {
            var coords = feature.coordinates;
            var lengthOfCoordinates = feature.coordinates.length;
            var dl = (coords[2][0] - coords[0][0]) / length;
            var dw = (coords[2][1] - coords[0][1]) / width;

            // square or polygon
            layer.on("click", (e) => {

                console.log("hitOnClickHandler");
                // distance in meters [used for drawing the polygon]
                var y_axis_grid = Math.floor((e.latlng.lat - coords[2][0]) / dl);
                var x_axis_grid = Math.floor((e.latlng.lng - coords[2][1]) / dw);
                // combining x and y coordinate in pairs
                pair = {lat: y_axis_grid, lng: x_axis_grid};
                // create marker
                marker = L.marker(
                    {
                        lat: y_axis_grid * dl + dl / 2 + coords[2][0],
                        lng: x_axis_grid * dw + dw / 2 + coords[2][1],
                    },
                    e.pane
                );

                // push marker to array
                routes.push(marker.getLatLng());

                deleteMarkerOnMouseClick(marker);
                moveMarkerWithRouteOnMouseDrag(marker);

                if (routes.length === 1) {
                    initializeUserMarker(marker);
                }

                if (routes.length > 1) drawLineBetweenMarkers();
            });

            // the GeoJSON layer ends here


            let holdWorkArea;
            for (let i = 0; i < lengthOfCoordinates; i++) {
                // swap x and y, save x in var holdLon then drop back into second position
                holdWorkArea = coords[i][0];
                coords[i][0] = coords[i][1];
                coords[i][1] = holdWorkArea;
            }
            offset = L.polygon(coords, feature.properties).addTo(map);
        },
    }).addTo(map);
//You can just keep adding markers
let currentNumSteps = 0;
// number of steps to reach next marker
let maxNumSteps = 1;
/* User takes 1 step */
const step = (pointsObj) => {
    pathsAlgorithm(pointsObj);
};

// ---------------------------------------------------------------------------------------------------------------------
function polygonHandler() {
}

// ---------------------------------------------------------------------------------------------------------------------
// start the animation for the user icon
function runSimulation() {
    console.log("starting simulation");
    const seconds = 60;
    const numSteps = 20;
    let pointsObj = {
        i: 0,
    };
    setInterval(() => step(pointsObj), (seconds / numSteps) * 1000);
}

// ---------------------------------------------------------------------------------------------------------------------
function drawLineBetweenMarkers() {
    var polyline = L.polyline(
        [routes[routes.length - 1], routes[routes.length - 2]],
        {
            enableDraggableLines: true,
            color: "black",
            weight: 5,
            opacity: 0.5,
            smoothFactor: 1,
        }
    ).addTo(map);
}

// ---------------------------------------------------------------------------------------------------------------------
function pathsAlgorithm(pointsObj) {
    if (pointsObj.i < routes.length) {
        // move the user along the line by 1 step ()
        var pointA = routes[pointsObj.i];
        var pointB = routes[pointsObj.i++];
        // console.log(routes)
        // user moving gradually to the next point dynamically
        var lat = (pointA.lat + (pointB.lat - pointA.lat) / maxNumSteps);
        var lng = (pointA.lng + (pointB.lng - pointA.lng) / maxNumSteps);
        var newLatLng = new L.LatLng(lat, lng);
        userMarker.setLatLng(newLatLng);
        // number of steps user taking to move forward
        currentNumSteps--;
        // once the user reaches point B, set pointA = pointB and pointB = point C, it must go dinamically.
        if (currentNumSteps == maxNumSteps) pointsObj.i++;
    } else {
        // user has reached the end of the line
        console.log("user has reached the end of the line");
    }
}

// ---------------------------------------------------------------------------------------------------------------------
function moveMarkerWithRouteOnMouseDrag(marker) {
    marker.dragging.enable();
    marker.on("dragend", (e) => {
        console.log("Marker has been moved!!!");
        var lat = e.target.getLatLng().lat;
        var lng = e.target.getLatLng().lng;
        var pair = {lat: lat, lng: lng};
        markers.set(pair, marker);

        routes = [];
        const tempMarker = []
        markers.forEach((v, index) => {
            tempMarker.push(v.getLatLng())
        })
        console.log({tempMarker});

        for (let i in map._layers) {

            // if (i === 0) {
            //     userMarker.dragging.enable();
            // }

            if (map._layers[i]._path !== undefined) {
                map.removeLayer(map._layers[i]);
                try {
                    markers.removeLayer(map._layers[i]);




                    // markers.addLayer(map._layers[i]);

                } catch (e) {
                    console.log(e);
                }

            }





        }

        // loop markers and move polyline
        tempMarker.forEach((v, index) => {
            // const lt = marker.getLatLng();
            console.log('loop', v);

            if (tempMarker[index + 1]) {
                const nPolyline = L.polyline(
                    [v, tempMarker[index + 1]], {
                        enableDraggableLines: true,
                        color: "black",
                        weight: 5,
                        opacity: 0.5,
                        smoothFactor: 1,
                    }
                ).addTo(map);
                routes.push(nPolyline);
            }
        })
        console.log({map, routes, markers})
    });
}

// ---------------------------------------------------------------------------------------------------------------------
function deleteMarkerOnMouseClick(marker) {

    marker.on("click", () => {
        console.log("Marker has been deleted!!!");
        map.removeLayer(marker);
        markers.delete(pair);

    });
    marker.addTo(map);

}

// ---------------------------------------------------------------------------------------------------------------------
function initializeUserMarker(marker) {
    const UserIcon = L.Icon.extend({
        options: {
            iconSize: [38, 95],
            shadowSize: [0, 0],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76],
        },
    });
    // user icon
    var userIcon = new UserIcon({
        iconUrl: "./assets/images/sport-car.png",
        shadowUrl:
            "http://leafletjs.com/examples/custom-icons/leaf-shadow.png",
    });
    // add icon to map
    userMarker = L.marker(marker.getLatLng(), {icon: userIcon}).addTo(
        map
    );
}

// ---------------------------------------------------------------------------------------------------------------------
function showJsonOnButtonClick(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// Additional function for JSON
function showJSON() {
    showJsonOnButtonClick(JSON.stringify(myLines), "yourfile.json", "text/plain");
}

// ---------------------------------------------------------------------------------------------------------------------
