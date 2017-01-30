'use strict';

import {
  SET_USER_VALUE,
  SET_USER_NAME,
  OPEN_USERNAME_MODAL,
  CLOSE_USERNAME_MODAL,
  SET_USER_ID
} from '../actions/types';

var defaultState = {
    name: '',
    value: '',
    modal: false,
    id: localStorage.getItem('uuid') || ''
};

export default function UserReducer(state = defaultState, action) {
    switch(action.type) {
    case SET_USER_VALUE:
        return {...state, value: action.payload};
    case SET_USER_NAME:
        return {...state, name: action.payload};
    case SET_USER_ID:
        return {...state, id: action.payload};
    case OPEN_USERNAME_MODAL:
        return {...state, modal: action.payload};
    case CLOSE_USERNAME_MODAL:
        return {...state, modal: action.payload};
    default:
        return state;
    }
}
