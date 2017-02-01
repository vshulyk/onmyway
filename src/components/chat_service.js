'use strict';

import React, { Component } from 'react';
import { changeCoords, changeTeamCoords, setUserId, chatUpdate } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';
import uuid from 'uuid';
import config from '../config';
import _ from 'lodash';

export class ChatService extends Component {
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
        socket.on('chat update', function(data, init) {
            _this.props.chatUpdate(data, !!init);
        });
    }
    componentWillReceiveProps(nextProps){
        function getObjectDiff(obj1, obj2) {
            return Object.keys(obj1).reduce((result, key) => {
                if (!obj2.hasOwnProperty(key)) {
                    result.push(key);
                } else if (_.isEqual(obj1[key], obj2[key])) {
                    result.splice( result.indexOf(key), 1);
                }
                return result;
            }, Object.keys(obj2));
        }
        let diff = getObjectDiff( nextProps, this.props )[0],
            payload;

        if ( diff === 'chat' ) {
            let last = nextProps.chat[0];
            if ( last && last.name === nextProps.user.name && ( new Date() ).getTime() - last.timestamp < 50 ) {
                payload = Object.assign(
                    {},
                    last
                );
                this.socket.emit('chat update', payload);
            };
        } else {
            payload = Object.assign(
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

ChatService.propTypes = {
    gps: React.PropTypes.object,
    user: React.PropTypes.object,
    params: React.PropTypes.object,
    teamId: React.PropTypes.string,
    changeTeamCoords: React.PropTypes.func,
    setUserId: React.PropTypes.func,
    chatUpdate: React.PropTypes.func,
    chat: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        gps: state.gps,
        user: state.user,
        chat: state.chat
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeTeamCoords: changeTeamCoords,
        setUserId: setUserId,
        chatUpdate: chatUpdate
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps )(ChatService);
