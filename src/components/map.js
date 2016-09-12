'use strict';

import React, { Component } from 'react';
import _ from 'lodash';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { changeCoords } from '../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chat from './chat';

class TrackingMap extends Component {
    componentDidMount(){
        var _this = this;
        console.log('Map was initialized for: ', this.props.params.teamId, ' team id.');
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
        this.props.changeCoords(coords);
    }

    teamMarkers(){
        var _this = this;
        return Object.keys(_this.props.team).map(function(memberKey, i){
            var member = _this.props.team[memberKey];
            return <Marker position={[member.lat, member.lng]} key={i} />;
        });
    }

    map(){
        const tileURL = 'https://api.tiles.mapbox.com/v4/' +
            'michae1.0jk7gngp' + '/{z}/{x}/{y}.png?access_token=' +
            'pk.eyJ1IjoibWljaGFlMSIsImEiOiJjaXFjZGdqNzUwMDQzaHNuaG55bXN5cHFsIn0.naFQmh7kn9ck9cX_TcH92w';

        return (<Map center={[this.props.gps.lat, this.props.gps.lng]} zoom={18}>
            <TileLayer
                url={tileURL} />
            <Marker position={[this.props.gps.lat, this.props.gps.lng]} />
            {this.teamMarkers()}
        </Map>);
    }
    render() {
        return (
            <div>
                <Chat teamId={this.props.params.teamId}/>
                <div className="map">{this.map()}</div>
            </div>
        );
    }
}

TrackingMap.propTypes = {
    changeCoords: React.PropTypes.func,
    gps: React.PropTypes.object,
    params: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        gps: state.gps,
        team: state.team
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeCoords: changeCoords
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps )(TrackingMap);
