'use strict';

import {
  SET_USER_VALUE,
  SET_USER_NAME
} from '../actions/types';

export default function UserReducer(state = {name:'', value:''}, action) {
    switch(action.type) {
	    case SET_USER_VALUE:
	        return {...state, value: action.payload};
	    case SET_USER_NAME:
	        return {...state, name: action.payload};
	    default:
	        return state;
    }
}
