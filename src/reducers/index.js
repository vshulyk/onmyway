'use strict';

import { combineReducers } from 'redux';
import { GPSReducer, TeamReducer } from './gps';
import AuthReducer from './auth';
import UserReducer from './user';

const rootReducer = combineReducers({
    gps: GPSReducer,
    team: TeamReducer,
    authenticated: AuthReducer,
    username: UserReducer
});

export default rootReducer;
