'use strict';

import { combineReducers } from 'redux';
import { GPSReducer, TeamReducer } from './gps';
import AuthReducer from './auth';

const rootReducer = combineReducers({
    gps: GPSReducer,
    team: TeamReducer,
    authenticated: AuthReducer
});

export default rootReducer;
