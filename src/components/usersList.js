'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTarget } from '../actions';

export class UsersList extends Component {
    constructor( props ) {
        super( props );
    }
    renderUsersList() {
        var me = this.props.myData,
            team = this.props.usersData;
        if ( me.id ) {
            var myArr = [ this.renderUser(me.id, me.name) ],
                users = Object.keys( team ).map( function( uid ) {
                    return this.renderUser(uid, team[ uid ].username);
                }, this );
            return myArr.concat( users );
        }
        return '';
    }
    renderUser( uid, uname ) {
        return (
            <option uid={uid} key={uid} value={uid} >
                { uname }
            </option>
        );
    }
    onChangeTarget( evt ) {
        this.props.changeTarget( evt.target.value );
    }
    render() {
        if ( !this.props.myData.id ) {
            let style = {
                height: '40px',
                display: 'inline-block'
            };
            return <span style={style}>&nbsp;</span>;
        }
        return (
            <select className='select-target' onChange={ ( evt ) => this.onChangeTarget( evt ) }>
                { this.renderUsersList() }
            </select>
        );
    }
}

UsersList.propTypes = {
    myData: React.PropTypes.object,
    usersData: React.PropTypes.object,
    changeTarget: React.PropTypes.func
};

function mapStateToProps( state ) {
    return {
        myData: state.user,
        usersData: state.team
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeTarget: changeTarget
    }, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( UsersList );
