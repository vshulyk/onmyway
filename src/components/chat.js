'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { chatUpdate } from '../actions';
import _, { isEmpty } from 'lodash';

export class Chat extends Component {
    renderUsersChat() {
        var _this = this,
            chat = this.props.chat,
            name = this.props.myData.name;
        return chat.length && chat.reduce( function( m, e ) {
            let d = new Date( e.timestamp ),
                dateStr = `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
            m.push( _this.renderMessage( {
                uname: `${e.name}${ name === e.name ? ' (you)': '' }`,
                message: e.message,
                timestamp: e.timestamp,
                dateStr: dateStr
            } ) );
            return m;
        }, [] ) || '';
    }
    renderMessage( data ) {
        return (
            <div key={data.timestamp} >
                <div className='user-info'><span>User: {data.uname}</span><span className='msg-date'>{data.dateStr}</span></div>
                <div className='user-msg'>{data.message}</div>
            </div>
        );
    }
    sentMessage() {
        let value = this.refs.input.value;
        if ( value ) {
            this.props.chatUpdate( {
                name: this.props.myData.name,
                message: value,
                timestamp: ( new Date() ).getTime()
            } );
            this.refs.input.value = '';
        };
    }
    clearText() {
        this.refs.input.value = '';
        this.refs.input.focus();
    }
    render() {
        if ( !this.props.myData.name || !this.props.myData.id ) {
            return (<div style={{ display: 'none'}} />);
        }
        return (
            <div className='chat'>
                <div className='user-chat-wrapper'>
                    { this.renderUsersChat() }
                </div>
                <div className='message-wrapper'>
                    <textarea ref='input' rows="4" cols="50" />
                    <input type='button' value='Sent' onClick={()=>this.sentMessage()} />
                    <input type='button' value='Clear' onClick={()=>this.clearText()} />
                </div>
            </div>
        );
    }
}

Chat.propTypes = {
    myData: React.PropTypes.object,
    chatUpdate: React.PropTypes.func,
    chat: React.PropTypes.array
};

function mapStateToProps( state ) {
    return {
        myData: state.user,
        chat: state.chat
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        chatUpdate: chatUpdate
    }, dispatch);
}

export default connect( mapStateToProps, mapDispatchToProps )( Chat );
