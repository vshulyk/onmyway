'use strict';

import React, { Component } from 'react';
import _ from 'lodash';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { changeCoords } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ChatService from './chat_service';
import UsersList from './usersList';
import Chat from './chat';

import { icon } from 'leaflet';
import { divIcon } from 'leaflet';
import geolib from 'geolib';
import config from '../config';

export class TrackingMap extends Component {
    componentDidMount(){
        var _this = this;
        // get initial coords
        navigator.geolocation.getCurrentPosition(function(position) {
            _this.GPSupdate.call(_this, position);
        });

        navigator.geolocation.watchPosition(function(position) {
            _this.GPSupdate.call(_this, position);
        });
    }

    GPSupdate(e){
        const coords = {
            lat: _.get(e, 'coords.latitude'),
            lng: _.get(e, 'coords.longitude')
        };
        if (this.props.gps.prev){ // We need no track move less than X meters (to avoid gps glitches etc)
            var distance = geolib.getDistance(
                 {latitude: this.props.gps.prev.lat, longitude: this.props.gps.prev.lng},
                 {latitude: coords.lat, longitude: coords.lng}
            );
            if (distance > config.gps.treshold){
                this.props.changeCoords(coords);
            }
        } else {
            this.props.changeCoords(coords);
        }
    }

    teamMarkers(){
        var _this = this,
            teamIcon = null;
        return Object.keys(_this.props.team).map(function(memberKey, i){
            var member = _this.props.team[memberKey];
            const iconPath = !_.get(member, 'meta.status') ? '/img/dead.png' : '/img/u.png';
            teamIcon = divIcon({
                className: 'vehicle-icon',
                html: getIcon( iconPath, member.username)
            });
            return <Marker className={status} position={[member.lat, member.lng]} key={i} icon={teamIcon} />;
        });
    }

    getBounds(){
        var bounds = [],
            _this = this;
        bounds.push([this.props.gps.lat, this.props.gps.lng]);
        Object.keys(_this.props.team).map(function(memberKey, i){
            var member = _this.props.team[memberKey];
            bounds.push([member.lat, member.lng]);
        });
        return bounds;
    }

    getCenter() {
        let id = this.props.target;
        if ( id && this.props.user.id !== id && id !== 'all' ) {
            let team = this.props.team;
            for (let k in team ) {
                if ( k === id ) {
                    return [ team[k].lat, team[k].lng ];
                }
            }
        };
        return [ this.props.gps.lat, this.props.gps.lng ];
    }

    map(){
        const tileURL = config.map.url + 'michae1.0jk7gngp' + '/{z}/{x}/{y}.png?access_token=' + config.map.token;

        var myIcon = divIcon({
            className: 'vehicle-icon',
            html: getIcon('/img/i.png', this.props.user.name)
        });
        // bounds={this.getBounds()} // should change this! TODO :)
        var inputProps = {
            zoom: 18,
            boundsOptions: {padding: [50, 50]}
        };

        if ( this.props.target === 'all' )
            inputProps.bounds = this.getBounds();
        else
            inputProps.center = this.getCenter();
        return (
            <Map
                {...inputProps}
            >
                <TileLayer url={tileURL} />
                <Marker position={[this.props.gps.lat, this.props.gps.lng]} icon={myIcon} title="me" />
                {this.teamMarkers()}
                {this.props.children}
            </Map>
        );
    }
    render() {
        return (
            <div className="content-wrapper">
                <UsersList />
                <Chat />
                <ChatService teamId={this.props.params.teamId} />
                <div className="map" id="map">{this.map()}</div>
            </div>
        );
    }
}

TrackingMap.propTypes = {
    changeCoords: React.PropTypes.func,
    gps: React.PropTypes.object,
    user: React.PropTypes.object,
    team: React.PropTypes.object,
    children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.bool
    ]),
    params: React.PropTypes.object,
    target: React.PropTypes.string
};

function getIcon(image, text){
    return '<div>'+text+'<img src="'+image+'"/></div>';
}

function mapStateToProps(state) {
    return {
        gps: state.gps,
        team: state.team,
        user: state.user,
        target: state.target
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeCoords: changeCoords
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps )(TrackingMap);
