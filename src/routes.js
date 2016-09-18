import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Map from './components/map';
import require_auth from './components/require_auth';

export default (
	<Route path="/" component={App}>
		<Route path="map/:teamId" component={Map} />
	</Route>
);
