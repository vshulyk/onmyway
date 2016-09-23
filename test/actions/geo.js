import expect from 'expect';
import * as actions from '../../src/actions/index';
import * as types from '../../src/actions/types';

describe('actions', () => {
    it('should create an action to change coords', () => {
        const latlng = {lat: 50, lng: 30};
        const expectedAction = {
            type: types.CHANGE_COORDS,
            payload: {lat: latlng.lat, lng: latlng.lng}
        };
        expect(actions.changeCoords(latlng)).toEqual(expectedAction);
    });
});
