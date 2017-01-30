'use strict';

import {
  CHANGE_COORDS,
  CHANGE_TEAM_COORDS,
  SET_USER_NAME,
  SET_USER_VALUE,
  SET_USER_ID,
  AUTHENTICATE,
  OPEN_USERNAME_MODAL,
  CLOSE_USERNAME_MODAL,
  SET_TARGET
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

export function setUserName( name ) {
    return {
        type: SET_USER_NAME,
        payload: name
    };
}

export function setUserId( id ) {
    return {
        type: SET_USER_ID,
        payload: id
    };
}


export function updateNameValue( v ) {
    return {
        type: SET_USER_VALUE,
        payload: v.target.value
    };
}

export function openUsernameModal() {
    return {
        type: OPEN_USERNAME_MODAL,
        payload: true
    };
}

export function closeUsernameModal() {
    return {
        type: CLOSE_USERNAME_MODAL,
        payload: false
    };
}

export function changeTarget( id ) {
    return {
        type: SET_TARGET,
        payload: id
    };
}
