'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

export class UsersList extends Component {
    constructor( props ) {
        super( props )
        this.renderUsersList = this.renderUsersList.bind( this );
        this.renderUser = this.renderUser.bind( this );
        this.onUserClick = this.onUserClick.bind( this );
    }
    renderUsersList() {
        var me = this.props.myData,
            team = this.props.usersData;
        if ( me.userId ) {
            var myArr = [ this.renderUser(me.userId, me.username) ],
                users = Object.keys( this.props.usersData ).map( function( uid ) {
                    return this.renderUser(uid, team[ uid ].username);
                }, this );
            return myArr.concat( users );
        }
        return [];
    }
    renderUser( uid, uname ) {
        return (
            <li uid={uid} key={uid} onClick={this.onUserClick} > 
                { uname }
            </li>
        );
    }
    onUserClick( evt ) {
        console.log('Map should be centerer to', evt.target.innerHTML);
    }
    render() {
        return (
            <ul>
                {this.renderUsersList()}
            </ul>
        );
    }
}

// UsersList.propTypes = {
// };

function mapStateToProps( state ) {
    // console.log(state)
    return {
        myData: state.gps,
        usersData: state.team
    };
}

export default connect( mapStateToProps, actions )( UsersList );
