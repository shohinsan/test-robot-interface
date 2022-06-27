const expect = require('chai').expect;
const go = require('../src/index.js');

const offset = go.offset;
const randomOffset = go.randomOffset;

describe('offset()', () => {

  it('should work with Point Geometry.', () => {
    let geometry = { type: 'Point', coordinates: [0, 0] };
    offset(geometry, 1, 1);

    expect(geometry.coordinates).to.deep.equal([1, 1]);
  });

  it('should work with LineString Geometry.', () => {
    let geometry = { type: 'LineString', coordinates: [[0, 0], [1, 1]] };
    offset(geometry, 1, 1);

    expect(geometry.coordinates).to.deep.equal([[1, 1], [2, 2]]);
  });

  it('should work with Polygon Geometry.', () => {
    let geometry = { type: 'Polygon', coordinates: [[[0, 0], [1, 1], [0, 1]]] };
    offset(geometry, 1, 1);

    expect(geometry.coordinates).to.deep.equal([[[1, 1], [2, 2], [1, 2]]]);
  });

  it('should work with Feature', () => {
    let feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };

    offset(feature, 1, 1);
    expect(feature.geometry.coordinates).to.deep.equal([1, 1]);
  });

  it('should work with FeatureCollection', () => {
    let featureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          }
        }
      ]
    };

    offset(featureCollection, 1, 1);
    expect(featureCollection.features[0].geometry.coordinates).to.deep.equal([1, 1]);
  });

});

describe('randomOffset()', () => {

  it('should add a random offset to Point Geometry', () => {
    let geometry = { type: 'Point', coordinates: [0, 0] };
    randomOffset(geometry, [-1, 1], [-1, 1]);

    expect(geometry.coordinates[0]).to.be.within(-1, 1);
    expect(geometry.coordinates[1]).to.be.within(-1, 1);
  });

});
