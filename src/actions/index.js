'use strict';

import {
  CHANGE_COORDS,
  CHANGE_TEAM_COORDS,
  AUTHENTICATE
} from './types';


export function changeCoords(latlng) {
    return {
        type: CHANGE_COORDS,
        payload: {lat: latlng.lat, lng: latlng.lng}
    };
}

export function changeTeamCoords(payload) {
    var newPayload = {};
    newPayload[payload.userId] = payload;
    return {
        type: CHANGE_TEAM_COORDS,
        payload: newPayload
    };
}

export function authenticate( status ) {
    return {
        type: AUTHENTICATE,
        payload: status
    };
}
