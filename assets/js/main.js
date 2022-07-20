// [238.01673889160156, 37.25929865437848],
// [238.15698623657224, 37.25929865437848],
// [238.15698623657224, 37.33413244661209],
// [238.01673889160156, 37.33413244661209],
// [238.01673889160156, 37.25929865437848],

// [238.02841186523438, 37.23388194398141],
// [237.9848098754883, 37.19095471582605],
// [238.0730438232422, 37.171807316143166],
// [238.07956695556643, 37.224314295273366],
// [238.02841186523438, 37.23388194398141],

// [238.12076568603516, 37.21583907837921],
// [238.07579040527344, 37.157306770819574],
// [238.1564712524414, 37.14061402065652],
// [238.18428039550778, 37.16770367048253],
// [238.12076568603516, 37.21583907837921],

// Define the map
const map = L.map("map",).setView([37.29422, 238.08416], 13);
// Google Maps Tile Layer
googleStreets = L.tileLayer(
    "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
);
// Google Satellite Tile Layer
googleSat = L.tileLayer("https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
});
// Smooth Dark Tile Layer
smoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; ' +
        '<a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; ' +
        '<a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; ' +
        '<a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});
// Permanently display tile layer on the map
smoothDark.addTo(map);
// Define coordinates
let floor1Area = [
    [37.25929865437848, 238.01673889160156],
    [37.25929865437848, 238.15698623657224],
    [37.33413244661209, 238.15698623657224],
    [37.33413244661209, 238.01673889160156],
    [37.25929865437848, 238.01673889160156],
]

let floor2Area = [
    [
        [37.23388194398141, 238.02841186523438],
        [37.19095471582605, 237.9848098754883],
        [37.171807316143166, 238.0730438232422],
        [37.224314295273366, 238.07956695556643],
        [37.23388194398141, 238.02841186523438],
    ],
    [
        [37.21583907837921, 238.12076568603516],
        [37.157306770819574, 238.07579040527344],
        [37.14061402065652, 238.1564712524414],
        [37.16770367048253, 238.18428039550778],
        [37.21583907837921, 238.12076568603516],
    ],
]

// Add coordinates to the array of polygons separately
let polyFloor1 = L.polygon(floor1Area, {color: 'aqua', strokeWidth: 3}).addTo(map);
let polyFloor2 = L.MultyPolygon = L.polygon(floor2Area, {color: 'yellow', strokeWidth: 3}).addTo(map);
// Draw polygons on the map = bracket inside polyFloor does the job
let floor1 = L.layerGroup([polyFloor1]).addTo(map);
let floor2 = L.layerGroup([polyFloor2]).addTo(map);
// Map Controller at Top Right Corner
// https://leafletjs.com/reference.html#control-layers
let baseLayers = {
    "Satellite Google Map": googleSat,
    "Default Google Map": googleStreets,
    "Smooth Dark": smoothDark,
};
// Additional Map Controller to choose different floors
let overlays = {
    "Floor 1": floor1,
    "Floor 2": floor2,
};
L.control.layers(baseLayers, overlays).addTo(map);
// GeoJSON styling for markers
let myStyle = {
    color: "##ff7800",
    fill: "red",
    "fill-opacity": 0.5,
    weight: 5,
    opacity: 0,
    offset: 1.5,
};

let markers = new Map(); // ds to store all the markers
let routes = []; // creating routes between markers
let lines = []; // redrawing the line on map after delete executed
let atomicCounter = 1; // create id helper
let userMarker; // runSimulation helper
let buttonId; // unique id for buttons to separate the difference inside runSimulation function

let Geometry = [{
    // Polygon is a type of Geometry used for representing  both a polyline and a polygon on a map.
    "type": "Polygon",
    "floor": "fullFloor1",
    "properties": {
        stroke: "#555555",
        "stroke-width": 2,
        "stroke-opacity": 1,
        fill: "#11ff00",
        "fill-opacity": 0.5,
        weight: 5,
        offset: 5,
    },

    "coordinates": [[

        [238.01673889160156, 37.25929865437848],
        [238.15698623657224, 37.25929865437848],
        [238.15698623657224, 37.33413244661209],
        [238.01673889160156, 37.33413244661209],
        [238.01673889160156, 37.25929865437848],

    ]]

},
    {
        "type": "Polygon",
        "floor": "fullFloor2",
        "properties": {
            stroke: "#555555",
            "stroke-width": 2,
            "stroke-opacity": 1,
            fill: "#11ff00",
            "fill-opacity": 0.5,
            weight: 5,
            offset: 5,
        },

        "coordinates": [[

            [238.02841186523438, 37.23388194398141],
            [237.9848098754883, 37.19095471582605],
            [238.0730438232422, 37.171807316143166],
            [238.07956695556643, 37.224314295273366],
            [238.02841186523438, 37.23388194398141],

            [238.12076568603516, 37.21583907837921],
            [238.07579040527344, 37.157306770819574],
            [238.1564712524414, 37.14061402065652],
            [238.18428039550778, 37.16770367048253],
            [238.12076568603516, 37.21583907837921],

        ]]

    }


];


// // Area to write certain abilities to the polygon offset
// L.geoJson(Geometry,{
//     style: myStyle, // access styling from above for markers
//     "onEachFeature": function (feature, layer) {
//         // for each polygon of floors 1 and 2 create separate markers
//             // Area where actual polygon starts
//             layer.on("click", (e) => {
//                 if (feature.floor === "fullFloor1") {
//                     // create marker
//                     let marker = L.marker(e.latlng, e.pane);
//                     // create id for both marker and route
//                     let route = {"id": atomicCounter, "marker": marker}
//                     // push marker and routes to the array
//                     routes.push(route);
//                     // increment atomic counter by one for next marker
//                     atomicCounter++
//                     deleteMarkerFromArrayOnMouseClick(route);
//                     moveMarkerWithRouteOnMouseDrag(route);
//                     // think of parameters inside drawLineBetweenMarkers function as "from" and "to"
//                     if (routes.length > 1) drawLineBetweenMarkers(routes[routes.length - 2], routes[routes.length - 1]);
//                 }
//             });
//     },
// }).addTo(map);

// Area to write certain abilities to the polygon offset

L.geoJson(Geometry, {
    style: myStyle, // access styling from above for markers
    "onEachFeature": onEachFeature,
    },
    ).addTo(map);


// ---------------------------------------------------------------------------------------------------------------------
function onEachFeature(feature, layer) {
    layer.on("click", (e) => {
        // create marker
        let marker = L.marker(e.latlng, e.pane);
        // create id for both marker and route
        let route = {"id": atomicCounter, "marker": marker}
        // push marker and routes to the array
        routes.push(route);
        // increment atomic counter by one for next marker
        atomicCounter++
        deleteMarkerFromArrayOnMouseClick(route);
        moveMarkerWithRouteOnMouseDrag(route);
        // think of parameters inside drawLineBetweenMarkers function as "from" and "to"
        if (routes.length > 1) drawLineBetweenMarkers(routes[routes.length - 2], routes[routes.length - 1]);
    });

    if (floor1 !== floor2 && feature.floor === "fullFloor1") {
        // hide markers

        layer.addTo(floor1);


    }
    if (floor2 !== floor1 && feature.floor === "fullFloor2") {
        layer.addTo(floor2);
    }





}

// ---------------------------------------------------------------------------------------------------------------------


function runSimulation(button) {

    buttonId = button.id;

    const seconds = 60;
    const numSteps = 20;
    // display user icon only on the first element of markers
    if (userMarker === undefined) {
        initializeUserMarker(routes[0].marker);
    }

    let idx
    // buttons on condition
    if (buttonId === "move forward clicked") {
        console.log(button.id);
        idx = 1
        document.getElementById("return back clicked").disabled = false;
    } else if (buttonId === "return back clicked") {
        idx = routes.length - 1
        console.log(button.id);
    }

    setInterval(() => step(pointsObj, button), (seconds / numSteps) * 100);

    const step = (pointsObj, button) => {
        pathsAlgorithm(pointsObj, button);
    };

    let pointsObj = {
        i: idx,
    };
}

// ---------------------------------------------------------------------------------------------------------------------
function drawLineBetweenMarkers(fromRoute, toRoute) {
    let polyline = L.polyline([
            fromRoute.marker.getLatLng(),
            toRoute.marker.getLatLng(),
        ], {
            enableDraggableLines: true,
            color: "white",
            weight: 5,
            opacity: 0.5,
            smoothFactor: 1,
        }
    ).addTo(map);
    // push polyline to the array lines to redraw the line on map after dragging and then delete executed
    lines.push({
        "polyline": polyline,
        "from": fromRoute.id,
        "to": toRoute.id,
    });

    console.log("routes: ", routes);
    console.log("lines: ", lines);

    // function to calculate distance between two markers - works on static mode
    let fromRouteLat = fromRoute.marker.getLatLng().lat;
    let fromRouteLng = fromRoute.marker.getLatLng().lng;
    let toRouteLat = toRoute.marker.getLatLng().lat;
    let toRouteLng = toRoute.marker.getLatLng().lng;

    polyline.bindPopup("<b>Distance:</b> "
        + haversineDistance(fromRouteLat, fromRouteLng, toRouteLat, toRouteLng)
            .toFixed(2)
        + " km");

}

// ---------------------------------------------------------------------------------------------------------------------

let currentNumSteps = 5;
// number of steps to reach next marker
let maxNumSteps = 1;

function pathsAlgorithm(pointsObj, button) {
    if (pointsObj.i < routes.length && pointsObj.i > 0) {
        document.getElementById('return back clicked').disabled = button.id !== 'move forward clicked';
        bidirectionalRouting(pointsObj, routes, maxNumSteps, button);
    }
}

function bidirectionalRouting(pointsObj, routes, maxNumSteps, button) {

    if (button.id === 'move forward clicked') {
        console.log('move pointsObj.i: ', pointsObj.i);
        let pointA = routes[pointsObj.i].marker.getLatLng();
        let pointB = routes[pointsObj.i++].marker.getLatLng();
        // user moving gradually to the next point of the line
        let lat = (pointA.lat + (pointB.lat - pointA.lat) / maxNumSteps);
        let lng = (pointA.lng + (pointB.lng - pointA.lng) / maxNumSteps);
        let newLatLng = new L.LatLng(lat, lng);
        userMarker.marker.setLatLng(newLatLng);
        // once the user reaches next point, set pointA = pointB, pointB = point C, and etc, dynamically.
        currentNumSteps++;
        if (currentNumSteps === maxNumSteps) pointsObj.i++;
    }


    if (button.id === 'return back clicked') {
        console.log("shrek: " + pointsObj.i)
        let pointA = routes[pointsObj.i--].marker.getLatLng();
        let pointB = routes[pointsObj.i].marker.getLatLng();

        // user moving gradually to the next point of the line
        let lat = (pointA.lat + (pointB.lat - pointA.lat) / maxNumSteps);
        let lng = (pointA.lng + (pointB.lng - pointA.lng) / maxNumSteps);
        let newLatLng = new L.LatLng(lat, lng);
        userMarker.marker.setLatLng(newLatLng);
        // once the user reaches next point, set pointC = pointB, pointB = point A, and etc, dynamically.

        if (maxNumSteps === currentNumSteps) pointsObj.i--;


        currentNumSteps = 0;
        console.log("print i after maxNumSteps", pointsObj.i)
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

            // function to calculate distance between two markers - works on drag mode
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
function deleteMarkerFromArrayOnMouseClick(route) {
    route.marker.on("click", () => {
        console.log("Marker has been deleted!!!");
        map.removeLayer(route.marker);

        // initializing new marker variables after deleting one
        let newFrom = 0;
        let newTo = 0;

        // deleting previous lines created from the map using splice
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

        // redrawing the line after deleting one with the help of newFrom and newTo
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
        // deleting routes  from the array
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
    // User Marker styling
    const UserIcon = L.Icon.extend({
        options: {
            iconSize: [50, 100],  // 38, 95 earlier
            shadowSize: [0, 0],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76],
        },
    });
    // Upload the user icon
    let userIcon = new UserIcon({
        iconUrl: "./assets/images/robot.png",
        shadowUrl:
            "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
    });
    // Add icon to map
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
    showJsonOnButtonClick(JSON.stringify(Geometry), "yourfile.json", "text/plain");

    // const markers = [];
    routes.forEach(item => {
        markers.push(item.marker.getLatLng());
    })

    showJsonOnButtonClick(JSON.stringify(markers), "yourfile.json", "text/plain");
}

// ---------------------------------------------------------------------------------------------------------------------
function haversineDistance(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in km
    // miles = d * 0.62137; // feet = d * 3280.839895; // inches = d * 39370.078740;
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// ---------------------------------------------------------------------------------------------------------------------
