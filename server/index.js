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
    pub = redis.createClient()
    redisClient = redis.createClient(),
    subClients = {},
    subCounts = {};

io.on('connection', function(socket){
    console.log('user connected');
    var currentChannel = 'default',
        currentUserId = null;


    socket.on('disconnect', function(){
        console.log('user disconnected');
        subCounts[currentChannel]--;
        console.log('counts', subCounts[currentChannel])
        if (subCounts[currentChannel]<=0){
            console.log('no listeners in sub, closing...')
            subClients[currentChannel].quit();
            delete subClients[currentChannel];
        }
    });

    socket.on('chat message', function(msg){
        // console.log('got message form socket', msg)
        switch(msg.action) {
        case 'connect':
            currentChannel = msg.payload.teamId;
            if (!(currentChannel in subClients)){
                subClients[currentChannel] = redis.createClient();
                subCounts[currentChannel] = 1;
            } else {
                subCounts[currentChannel]++;
            }
            console.log('counts', subCounts[currentChannel])
            subClients[currentChannel].on('message', function (channel, message) {
                // console.log("message from redis channel " + channel + ": " + message);
                var parsedMessage = JSON.parse(message);
                if (parsedMessage.clientId !== socket.id) {
                    socket.emit('chat message', parsedMessage.message );
                }
            });
            currentUserId = msg.payload.userId;
            subClients[currentChannel].subscribe(currentChannel);
            redisClient.hgetallAsync('MEMBERS:' + currentChannel)
                .then(function(members){
                    Object.keys(members).forEach(function(mKey){
                        if ( mKey !== currentUserId ) {
                            socket.emit('chat message', JSON.parse(members[mKey]) );
                        }
                    })
                })
            break;
        case 'changeCoords':
            pub.publish(currentChannel, JSON.stringify({ message: msg, clientId: socket.id}));
            redisClient.hset('MEMBERS:' + currentChannel, msg.payload.userId, JSON.stringify(msg))
            break;

        default:
            return false;
        }
        // console.log('message:', msg, 'from', socket.id);
    });
});

server.listen(port);
console.log('Server listening on:', port);
