'use strict';

import React, { Component } from 'react';
import _ from 'lodash';
import { changeCoords, changeTeamCoords } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import uuid from 'uuid';
import config from '../config';

export class Chat extends Component {
    componentDidMount(){
        var _this = this,
            serverCfg = config.chat.server,
            serverUrl = serverCfg.url;

        this.uuid = localStorage.getItem('uuid');
        if (!this.uuid){
            this.uuid = uuid.v4();
            localStorage.setItem('uuid', this.uuid);
        }

        var socket = this.socket = io.connect(serverUrl, {secure: true});

        socket.emit('chat message', { action: 'connect', payload: {
            teamId: this.props.teamId,
            userId: this.uuid,
            username: this.props.user.name,
            timestamp: Date.now()
        } });
        socket.emit('startup', {action: 'refactoring are coming'});
        socket.on('user connected', function(userId){
            console.log('NEW USER CONNECTED', userId);
        });
        socket.on('chat message', function(msg){
            switch(msg.action) {
            case 'connect':
                break;
            case 'changeCoords':
                _this.props.changeTeamCoords(msg.payload);
                break;
            default:
                return false;
            }
        });
    }
    componentWillReceiveProps(nextProps){
        var userData = Object.assign(
            nextProps.gps,
            {
                userId: this.uuid,
                username: nextProps.user.name,
                timestamp: Date.now(),
                meta: {
                    status: 1
                }
            }
        );
        this.socket.emit('chat message', {action: 'changeCoords', payload: userData });
    }
    componentWillUnmount() {
        this.socket.emit('chat message', {action: 'disconnect', payload: {userId: this.uuid, timestamp: Date.now()} });
        this.socket.disconnect();
    }
    render() {
        return (
            <div />
        );
    }
}

Chat.propTypes = {
    gps: React.PropTypes.object,
    user: React.PropTypes.object,
    params: React.PropTypes.object,
    teamId: React.PropTypes.string,
    changeTeamCoords: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        gps: state.gps,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeTeamCoords: changeTeamCoords
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps )(Chat);
