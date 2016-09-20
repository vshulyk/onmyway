'use strict';

import React, { Component } from 'react';
import _ from 'lodash';
import { changeCoords, changeTeamCoords } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import uuid from 'uuid';
import config from '../config';

class Chat extends Component {
    componentDidMount(){
        var _this = this,
            serverCfg = config.chat.server,
            serverUrl = serverCfg.url;

        this.uuid = localStorage.getItem('uuid');
        if (!this.uuid){
            this.uuid = uuid.v4();
            localStorage.setItem('uuid', this.uuid);
        }

        this.socket = io.connect(serverUrl, {secure: true});
        this.socket.emit('chat message', { action: 'connect', payload: {teamId: this.props.teamId, userId: this.uuid, timestamp: Date.now()} });
        this.socket.on('chat message', function(msg){
            switch(msg.action) {
                case 'connect':
                    console.log('user connected:', msg.payload.userId);
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
        this.socket.emit('chat message', {action: 'changeCoords', payload: Object.assign(nextProps.gps, {userId: this.uuid, timestamp: Date.now()}) });
    }
    render() {
        return (
            <div />
        );
    }
}

Chat.propTypes = {
    gps: React.PropTypes.object,
    params: React.PropTypes.object,
    teamId: React.PropTypes.string,
    changeTeamCoords: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        gps: state.gps
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeTeamCoords: changeTeamCoords
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps )(Chat);
