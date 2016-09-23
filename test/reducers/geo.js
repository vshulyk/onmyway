import expect from 'expect';
import { GPSReducer as reducer } from '../../src/reducers/gps';
import * as types from '../../src/actions/types';

describe('gps reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual({});
    });
    it('should handle CHANGE_COORDS', () => {
        expect(
            reducer({}, {
                type: types.CHANGE_COORDS,
                payload: {lat: 50, lng: 30}
            })
        ).toEqual({lat: 50, lng: 30, prev: {}});
    });
    it('should hold previous coords', () => {
        expect(
            reducer({lat: 49, lng: 29}, {
                type: types.CHANGE_COORDS,
                payload: {lat: 50, lng: 30}
            })
        ).toEqual({lat: 50, lng: 30, prev: {lat: 49, lng: 29}});
    });
});
