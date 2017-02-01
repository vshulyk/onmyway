'use strict';

import {
  CHAT_UPDATE
} from '../actions/types';

var defaultState = [];

export default function ChatReducer(state = defaultState, action) {
    switch(action.type) {
    case CHAT_UPDATE:{
        if ( action.init )
            return [ ...action.payload ];
        return [ action.payload, ...state ];
    } default:
        return state;
    }
}
