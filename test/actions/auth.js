import expect from 'expect';
import * as actions from '../../src/actions/index';
import * as types from '../../src/actions/types';

export default function() {
	describe('Auth', () => {
	    it('should create an action to change authenticated state', () => {
	        const expectedActionPos = {
	            type: types.AUTHENTICATE,
	            payload: true
	        };
	        const expectedActionNeg = {
	            type: types.AUTHENTICATE,
	            payload: false
	        };
	        expect(actions.authenticate(true)).toEqual(expectedActionPos);
	        expect(actions.authenticate(false)).toEqual(expectedActionNeg);
	    });
	});
}	
