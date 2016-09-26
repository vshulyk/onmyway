'use strict';

import React, {Component} from 'react';
import Menu from './menu';

export default class App extends Component {
    render() {
        return (
            <div className="wrapper">
                <Menu />
                {this.props.children}
            </div>
        );
    }
}

App.propTypes = { children: React.PropTypes.element };

if (module.hot) {
    module.hot.accept();
}
