'use strict';

import {
  CHANGE_COORDS,
  CHANGE_TEAM_COORDS
} from '../actions/types';

export function GPSReducer(state = {}, action) {
    switch(action.type) {
    case CHANGE_COORDS:
        return Object.assign({}, action.payload, {prev: state});
    default:
        return state;
    }
}
export function TeamReducer(state = {}, action) {
    switch(action.type) {
    case CHANGE_TEAM_COORDS:
        return Object.assign({}, state, action.payload);
    default:
        return state;
    }
}
