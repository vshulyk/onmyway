'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function ( ComposedComponent ) {
    class Authentication extends Component {
        componentWillMount() {
            if ( !this.props.authenticated ) {
                this.context.router.push('/');
            }
        }

        componentWillUpdate(nextProps) {
            if ( !nextProps.authenticated ) {
                this.context.router.push('/');
            }
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    Authentication.contextTypes = {
        router: React.PropTypes.object
    };
    Authentication.propTypes = {
        authenticated: React.PropTypes.bool
    };

    function mapStateToProps(state) {
        return {
            authenticated: state.authenticated
        };
    }

    return connect(mapStateToProps)(Authentication);
}
