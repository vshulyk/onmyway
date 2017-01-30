'use strict';

import React, { Component } from 'react';
import _ from 'lodash';
import { changeCoords, changeTeamCoords, setUserId } from '../actions';
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
            this.props.setUserId( this.uuid );
        }

        var socket = this.socket = io.connect(serverUrl, {secure: true});

        socket.emit('user connected', {
            teamId: this.props.teamId,
            userId: this.uuid,
            username: this.props.user.name,
            timestamp: Date.now()
        });
        socket.on('user update', function(data) {
            _this.props.changeTeamCoords(data);
        });
    }
    componentWillReceiveProps(nextProps){
        var payload = Object.assign(
            {},
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
        this.socket.emit('user update', payload);
    }
    componentWillUnmount() {
        this.socket.emit('user disconnected', {userId: this.uuid, timestamp: Date.now()});
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
    changeTeamCoords: React.PropTypes.func,
    setUserId: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        gps: state.gps,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeTeamCoords: changeTeamCoords,
        setUserId: setUserId
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps )(Chat);
