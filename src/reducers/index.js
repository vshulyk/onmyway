'use strict';

import { combineReducers } from 'redux';
import { GPSReducer, TeamReducer, TargetReducer } from './gps';
import AuthReducer from './auth';
import UserReducer from './user';
import ChatReducer from './chat';

const rootReducer = combineReducers({
    gps: GPSReducer,
    team: TeamReducer,
    authenticated: AuthReducer,
    user: UserReducer,
    target: TargetReducer,
    chat: ChatReducer
});

export default rootReducer;
