'use strict';

import {
  AUTHENTICATE
} from '../actions/types';

export default function AuthReducer(state = false, action) {
    switch(action.type) {
    	case AUTHENTICATE:
        return action.payload;
    	default:
        return state;
    }
}