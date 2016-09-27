'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { authenticate } from '../actions';
import { bindActionCreators } from 'redux';

class Menu extends Component {
    renderSignBtn() {
        if ( this.props.authenticated ) {
            return (
              <button type="button" className="btn btn-default" onClick={() => this.props.authenticate( false )}>SignOut</button>
          );
        }
        return (
          <button type="button" className="btn btn-default" onClick={() => this.props.authenticate( true )}>SignIn</button>
      );
    }
    render() {
        return (
            <div className="top-bar">
                <div className="top-bar-left">
                    <ul className="dropdown menu" data-dropdown-menu>
                        <li className="menu-text">OnMyWay</li>
                        <li><Link to="/" className="btn btn-default">Home</Link></li>
                        <li><Link to="/map/11" className="btn btn-default">Map</Link></li>
                    </ul>
                </div>
                <div className="top-bar-right">
                    <ul className="menu">
                        <li><input type="text" placeholder="Who are you?" /></li>
                        <li><button type="button" className="button">Submit</button></li>
                    </ul>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    children: React.PropTypes.element,
    authenticated: React.PropTypes.boolean,
    authenticate: React.PropTypes.function
};

function mapStateToProps( state ) {
    return {
        authenticated: state.authenticated
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ authenticate }, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( Menu );

if (module.hot) {
    module.hot.accept();
}
