'use strict';

// Main starting point of the application
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const bluebird = require('bluebird');
const redis = require('redis');
const config = require('./config');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const fs = require('fs');

const https = require('https');
const http = require('http');

let key, cert;

if (config.ssl){
    key = fs.readFileSync('../certs/track.key', 'utf8');
    cert = fs.readFileSync('../certs/track.crt', 'utf8');
}

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

// Server Setup
const port = process.env.PORT || 3090;
let server;

if (config.ssl){
    server = https.createServer({key: key, cert: cert}, app);
} else {
    server = http.createServer(app);
}

var io = require('socket.io')(server),
    redisClient = redis.createClient();

io.on('connection', function( socket ) {
    var users = 0,
        channelName = 'default';
    // Connect user
    socket.on('user connected', function( data ) {
        users++;
        channelName = data.teamId;

        // socket.broadcast.emit('user connected', {message:'Someone left!', users: users});
        redisClient.hgetallAsync('MEMBERS:' + channelName)
            .then(function( members ) {
                if ( members ) {
                    Object.keys( members ).forEach(function( mKey ) {
                        if ( mKey !== data.userId ) {
                            socket.emit('user update', JSON.parse( members[ mKey ] ) );
                        }
                    })
                }
            })
    });

    // Change coordinate
    socket.on('user update', function( data ) {
        redisClient.hsetAsync(
            'MEMBERS:' + channelName, 
            data.userId, 
            JSON.stringify( data )
        ).then(function() {
            socket.broadcast.emit('user update', data);
        });
    });
    
    // Disconnect user
    socket.on('user disconnected', function(user) {
        users--;
        return redisClient.hgetAsync('MEMBERS:' + channelName, user.userId)
            .then(function( member ) {
                if ( member ) {
                    var data = JSON.parse( member );
                    data.meta.status = 0;
                    redisClient.hset(
                        'MEMBERS:' + channelName, 
                        user.userId, 
                        JSON.stringify( data )
                    );
                    socket.broadcast.emit('user update', data);
                }
            })
    });
});

server.listen(port);
console.log('Server listening on:', port);
