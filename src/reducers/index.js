'use strict';

import { combineReducers } from 'redux';
import { GPSReducer } from './gps';

const rootReducer = combineReducers({
    state: (state = {}) => state,
    gps: GPSReducer
});

export default rootReducer;
