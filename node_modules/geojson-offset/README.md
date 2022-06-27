# geojson-offset

Add coordinate offest to the GeoJSON

## Installation

``` bash
npm install geojson-offset
```

## Usage

Noted this function will **UPDATE** the input geojson. If there is a need to return a copy of original geojson, please let me know by openning an issue.

`geojson-offset` supports all GeoJSON types:

* FeatureCollection
* Feature
* Geometery
  * Point
  * MultiPoint
  * LineString
  * MultiLineString
  * Polygon
  * MultiPolygon

``` javascript
const offset = require('geojson-offset').offset;
const randomOffset = require('geojson-offset').randomOffset;

let geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-78, 48]
      },
      properties: {}
    }
  ]
};

/**
 * Pass the geojson and the x/y coordinate offset
 */
gejson = offset(geojson, -1, 1);

/**
 * Pass the geojson and x/y coordinate offset range. The same offset will be
 * applied to all features in the input GeoJSON.
 */
geojson = randomOffset(geojson, [0, 10], [-10, 10]);
```
