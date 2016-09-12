'use strict';

import { combineReducers } from 'redux';
import { GPSReducer, TeamReducer } from './gps';

const rootReducer = combineReducers({
    state: (state = {}) => state,
    gps: GPSReducer,
    team: TeamReducer
});

export default rootReducer;
