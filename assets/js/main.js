// ------------------------------------------------
// Create a new map
// ------------------------------------------------
//  https://leafletjs.com/index.html
const map = L.map("map").setView([37.29422, 238.08416], 13);
// https://leafletjs.com/reference.html#marker
// const singleMarker = L.marker([37.29422, 238.08416]); // ignore
// ------------------------------------------------
// Tile layer
// ------------------------------------------------
// https://leaflet-extras.github.io/leaflet-providers/preview/
// ------------------------------------------------
// Google Map API Layer
// ------------------------------------------------
// https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer
googleStreets = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
);
// ------------------------------------------------
// Google Satellite Map
// ------------------------------------------------
googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

smoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; ' +
        '<a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; ' +
        '<a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; ' +
        '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
// googleSat.addTo(map); // uncomment to recover map
smoothDark.addTo(map); // uncomment to recover map
// ------------------------------------------------
// Layer control
// ------------------------------------------------
// https://leafletjs.com/reference.html#control-layers
var baseLayers = {
    "Satellite Google Map": googleSat,
    "Default Google Map": googleStreets,
    "Smooth Dark": smoothDark,
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

var markers = new Map();
var routes = [];
var lines = [];
var atomicCounter = 1;
let userMarker; // this variable for the purpose of not creating second robot icon inside runSimulation function

L.geoJson(myLines,
    {
        style: myStyle,
        onEachFeature: function (feature, layer) {
            var coords = feature.coordinates;
            var lengthOfCoordinates = feature.coordinates.length;
            // square or polygon
            layer.on("click", (e) => {
                console.log("hitOnClickHandler");

                // create marker
                let marker = L.marker(
                    e.latlng,
                    e.pane
                );

                // give both the marker and the path a unique id
                var route = {
                    "id": atomicCounter,
                    "marker": marker
                }

                // push marker to array
                routes.push(route);
                atomicCounter++
                deleteMarkerOnMouseClick(route);
                moveMarkerWithRouteOnMouseDrag(route);
                if (routes.length > 1) drawLineBetweenMarkers(routes[routes.length - 2], routes[routes.length - 1]);
            });

            // helps to draw the line the polygon
            let holdWorkArea;
            for (let i = 0; i < lengthOfCoordinates; i++) {
                holdWorkArea = coords[i][0];
                coords[i][0] = coords[i][1];
                coords[i][1] = holdWorkArea;
            }
            offset = L.polygon(coords, feature.properties).addTo(map);
        },
    }).addTo(map);
// ---------------------------------------------------------------------------------------------------------------------

//You can just keep adding markers
let currentNumSteps = 0;
// number of steps to reach next marker
let maxNumSteps = 1;
/* User takes 1 step */
const step = (pointsObj) => {
    pathsAlgorithm(pointsObj);
};

// ---------------------------------------------------------------------------------------------------------------------
// start the animation for the user icon

function runSimulation(button) {
    let buttonId = button.id;
    const seconds = 60;
    const numSteps = 20;
    let pointsObj;

    if (userMarker === undefined) {
        initializeUserMarker(routes[0].marker);
    }

    switch (buttonId) {
        case "forward":
            pointsObj = { i: 0, j: 1 };
            setInterval(() => step(pointsObj), (seconds / numSteps) * 1000);
            break;
        case "backward":
            pointsObj = { i: 1,};
            setInterval(() => step(pointsObj), (seconds / numSteps) * 1000);
            break;
        default:
            console.log("starting simulation");
    }
}


// ---------------------------------------------------------------------------------------------------------------------
function drawLineBetweenMarkers(fromRoute, toRoute) {

    // switch case polyline case 1

    var polyline = L.polyline([
            fromRoute.marker.getLatLng(),
            toRoute.marker.getLatLng(),
        ],
        {
            enableDraggableLines: true,
            color: "white",
            weight: 5,
            opacity: 0.5,
            smoothFactor: 1,
        }
    ).addTo(map);

    lines.push({
        "polyline": polyline,
        "from": fromRoute.id,
        "to": toRoute.id,
    });


    console.log("routes: ", routes);
    console.log("lines: ", lines);


    fromRouteLat = fromRoute.marker.getLatLng().lat;
    fromRouteLng = fromRoute.marker.getLatLng().lng;
    toRouteLat = toRoute.marker.getLatLng().lat;
    toRouteLng = toRoute.marker.getLatLng().lng;

    polyline.bindPopup("<b>Distance:</b> "
        + haversineDistance(fromRouteLat, fromRouteLng, toRouteLat, toRouteLng)
            .toFixed(2)
        + " km");

}

// ---------------------------------------------------------------------------------------------------------------------
function pathsAlgorithm(pointsObj) {

    if (pointsObj.i < routes.length) {
        // move the user along the line by 1 step ()
        let pointA = routes[pointsObj.i].marker.getLatLng();
        let pointB = routes[pointsObj.i++].marker.getLatLng();

        // user moving gradually to the next point dynamically
        let lat = (pointA.lat + (pointB.lat - pointA.lat) / maxNumSteps);
        let lng = (pointA.lng + (pointB.lng - pointA.lng) / maxNumSteps);
        let newLatLng = new L.LatLng(lat, lng);

        userMarker.marker.setLatLng(newLatLng);
        // number of steps user taking to move forward
        currentNumSteps--;
        // once the user reaches point B, set pointA = pointB and pointB = point C, it must go dinamically.

        switch (pointsObj.i) {
            case "forward":
                if (currentNumSteps === maxNumSteps) pointsObj.i++;
                break;
            case "backward":
                if (currentNumSteps === maxNumSteps) pointsObj.i--;
                break;
        }

        // remove switch case if needed
        // if (currentNumSteps === maxNumSteps) pointsObj.i++;
    }
}

// ---------------------------------------------------------------------------------------------------------------------
function moveMarkerWithRouteOnMouseDrag(route) {
    route.marker.dragging.enable();
    route.marker.on("dragend", (e) => {

        route.marker.setLatLng(e.target.getLatLng())

        for (let i = 0; i < lines.length; i++) {

            if (lines[i].from === route.id) {
                lines[i].polyline.setLatLngs([
                    e.target.getLatLng(),
                    lines[i].polyline.getLatLngs()[1]
                ]);
            }

            if (lines[i].to === route.id) {
                lines[i].polyline.setLatLngs([
                    lines[i].polyline.getLatLngs()[0],
                    e.target.getLatLng()

                ]);
            }

            // update the distance of the line on drag
            let fromLinesLat = lines[i].polyline.getLatLngs()[0].lat;
            let fromLinesLng = lines[i].polyline.getLatLngs()[0].lng;
            let toLinesLat = lines[i].polyline.getLatLngs()[1].lat;
            let toLinesLng = lines[i].polyline.getLatLngs()[1].lng;

            lines[i].polyline.bindPopup("<b>Distance:</b> "
                + haversineDistance(fromLinesLat, fromLinesLng, toLinesLat, toLinesLng)
                    .toFixed(2)
                + " km");

        }
    });
}

// ---------------------------------------------------------------------------------------------------------------------
function deleteMarkerOnMouseClick(route) {
    route.marker.on("click", () => {
        console.log("Marker has been deleted!!!");
        map.removeLayer(route.marker);

        let newFrom = 0;
        let newTo = 0;

        // deleting lines
        let i = 0;
        while (i < lines.length) {
            if (lines[i].from === route.id) {
                map.removeLayer(lines[i].polyline);
                newTo = lines[i].to;
                lines.splice(i, 1);
            } else if (lines[i].to === route.id) {
                map.removeLayer(lines[i].polyline);
                newFrom = lines[i].from;
                lines.splice(i, 1);
            } else {
                i++;
            }
        }

        console.log("lines: ", lines);
        console.log("newFrom: ", newFrom);
        console.log("newTo: ", newTo);

        if (newFrom !== 0 && newTo !== 0) {
            let fromRoute;
            let toRoute;

            for (let i = 0; i < routes.length; i++) {
                if (routes[i].id === newFrom) {
                    fromRoute = routes[i];
                } else if (routes[i].id === newTo) {
                    toRoute = routes[i];
                }
            }
            drawLineBetweenMarkers(fromRoute, toRoute);
        }

        for (let i = 0; i < routes.length; i++) {
            if (routes[i].id === route.id) {
                routes.splice(i, 1);
                break
            }
        }

    });
    route.marker.addTo(map);
}

// ---------------------------------------------------------------------------------------------------------------------
function initializeUserMarker(marker) {
    const UserIcon = L.Icon.extend({
        options: {
            // 38, 95
            iconSize: [50, 100],
            shadowSize: [0, 0],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76],
        },
    });

    // user icon
    var userIcon = new UserIcon({
        iconUrl: "./assets/images/robot.png",
        shadowUrl:
            "http://leafletjs.com/examples/custom-icons/leaf-shadow.png",
    });

    // add icon to map
    userMarker = {
        "id": atomicCounter,
        "marker": L.marker(marker.getLatLng(), {icon: userIcon}).addTo(map)
    };
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

    // const markers = [];
    routes.forEach(item => {
        markers.push(item.marker.getLatLng());
    })

    showJsonOnButtonClick(JSON.stringify(markers), "yourfile.json", "text/plain");
}

// ---------------------------------------------------------------------------------------------------------------------
function haversineDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    // miles = d * 0.62137; // feet = d * 3280.839895; // inches = d * 39370.078740;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// ---------------------------------------------------------------------------------------------------------------------

// return icon back to point in the beginning of the line
