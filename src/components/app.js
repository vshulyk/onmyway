'use strict';

import React, {Component} from 'react';
import Auth from './auth';

export default class App extends Component {
    render() {
        return (
        	<div>
        		<Auth />
        		{this.props.children}
        	</div>
        );
    }
}

App.propTypes = { children: React.PropTypes.element };

if (module.hot) {
    module.hot.accept();
}
