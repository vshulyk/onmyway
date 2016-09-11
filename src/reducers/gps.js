'use strict';

import {
  CHANGE_COORDS
} from '../actions/types';

export function GPSReducer(state = {}, action) {
    switch(action.type) {
    case CHANGE_COORDS:
        return Object.assign({}, action.payload);
    default:
        return state;
    }
}
