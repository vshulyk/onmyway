import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Map from './components/map';

function Welcome() {
    return (
        <div className="content-wrapper welcome">
            <h1 className="subheader text-center">Welcome</h1>
            <img src="/img/i.png" />
        </div>
    );
}

export default (
    <Route component={App}>
        <Route path="/" component={Welcome} />
        <Route path="/map/:teamId" component={Map} />
    </Route>
);
