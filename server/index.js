'use strict';

// Main starting point of the application
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const fs = require('fs');
const key = fs.readFileSync('../certs/track.key', 'utf8');
const cert = fs.readFileSync('../certs/track.crt', 'utf8');

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

// Server Setup
const port = process.env.PORT || 3090;
const server = https.createServer({key: key, cert: cert}, app);
var io = require('socket.io')(server),
    pub = redis.createClient(),
    redisClient = redis.createClient(),
    channels = {};

io.on('connection', function( socket ) {
    console.log('IO: user CONNECTED', socket.id);
    var currentChannel = 'default';

    socket.on('disconnect', function() {
        disconnectSocketClient( currentChannel );
    });
    socket.on('chat message', function(msg){
        // console.log('IO: action:    ', msg.action)
        switch(msg.action) {
            case 'connect':
                currentChannel = msg.payload.teamId;
                connectSocketClient( currentChannel, msg.payload.userId );
                subscribeSocketClient( currentChannel, msg.payload.userId, socket );
                break;
            case 'disconnect':
                setDisconnectedStatus( currentChannel, msg.payload.userId )
                    .then(function( msg) {
                        pub.publish(currentChannel, JSON.stringify({ message: msg, clientId: socket.id}));
                    });
                break;

            case 'changeCoords':
                pub.publish(currentChannel, JSON.stringify({ message: msg, clientId: socket.id}));
                redisClient.hset(
                    'MEMBERS:' + currentChannel, 
                    msg.payload.userId, 
                    JSON.stringify( msg )
                );
                break;

            default:
                return false;
        }
    });
});

function disconnectSocketClient( channelName ) {
    var channel = channels[ channelName ];
    if ( !channel || !channel.instance ) {
        return;
    }
    if (--channel.members <= 0){
        channel.instance.quit();
        delete channels[ channelName ];
    }
    console.log('IO: user DISCONNECTED.', channel.members || 'none' , 'left in channel');
}

function connectSocketClient( channelName, userId ) {
    // get channel 
    var channel = channels[ channelName ];
    // and create it if needed
    if ( !channel ) {
        console.log('IO: create channel', channelName);
        channel = channels[ channelName ] = {
            instance: redis.createClient(),
            members: 0
        }
    }
    // inc channel participants
    channel.members++;
    console.log('IO: user CONNECTED.', channel.members, 'now in channel', userId);
}

function subscribeSocketClient( channelName, userId, socket ) {
    // get channel 
    var instance = channels[ channelName ] && channels[ channelName ].instance;

    instance.subscribe( channelName );
    instance.on('message', function (channel, message) {
        var parsedMessage = JSON.parse(message);
        if (parsedMessage.clientId !== socket.id) {
            socket.emit('chat message', parsedMessage.message );
        }
    });

    redisClient.hgetallAsync('MEMBERS:' + channelName)
        .then(function( members ) {
            if ( members ) {
                Object.keys( members ).forEach(function( mKey ) {
                    if ( mKey !== userId ) {
                        socket.emit('chat message', JSON.parse( members[ mKey ] ) );
                    }
                })
            }
        })
}

function setDisconnectedStatus( channelName, userId ) {
    return redisClient.hgetAsync('MEMBERS:' + channelName, userId)
        .then(function( member ) {
            if ( member ) {
                var data = JSON.parse( member );
                data.payload.meta.status = 0;
                redisClient.hset(
                    'MEMBERS:' + channelName, 
                    userId, 
                    JSON.stringify( data )
                );
                return data;
            }
        })
}

server.listen(port);
console.log('Server listening on:', port);
