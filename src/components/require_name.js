'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

export default function ( ComposedComponent ) {
    class UsernameInput extends Component {
    	constructor( props ) {
    		super( props );

    		this.submitUserName = this.submitUserName.bind(this);
    	}

        submitUserName() {
        	this.props.setUserName(this.props.username.value)
        }

        render() {
        	if ( !this.props.username.name ) {
        		return (<div id="WhoAreYou">
        					<br/><br/><br/><br/><br/>
							<input type="text" placeholder="Who are you?" onChange={this.props.updateNameValue} />
							<input type="submit" onClick={this.submitUserName}/>
						</div>
    			);
        	} else {
            	return <ComposedComponent {...this.props} />;
        	}
        }
    }

    function mapStateToProps(state) {
        return {
            username: state.username
        };
    }

    return connect(mapStateToProps, actions)(UsernameInput);
}
