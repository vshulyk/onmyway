'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './components/app';
import reducers from './reducers';
import routes from './routes';
import { Router, browserHistory, hashHistory } from 'react-router';

const createStoreWithMiddleware = applyMiddleware()(createStore);

//TODO: autoset, save/load to from localtorage
const initialData = {
    gps: {
        lat: 50.4176968,
        lng: 30.4697682
    }
};

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers, initialData)}>
    <Router history={hashHistory} routes={routes} />
  </Provider>
  , document.querySelector('.container'));
