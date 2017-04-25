var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
//var RateLimit = require('express-rate-limit');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded());

/*var limiter = RateLimit({
    // window, delay, and max apply per-ip unless global is set to true 
    windowMs: 60 * 1000, // miliseconds - how long to keep records of requests in memory 
    delayMs: 1000, // milliseconds - base delay applied to the response - multiplied by number of recent hits from user's IP 
    max: 100, // max number of recent connections during `window` miliseconds before (temporarily) bocking the user. 
    global: false // if true, IP address is ignored and setting is applied equally to all requests 
});*/

app.use(express.static(__dirname + '/docs'));

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/user/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed

// disabled limited 
app.all('/api/v1/user/*', [/*limiter ,*/ require('./utils/validateRequest')]);

app.use('/', require('./routes'));
// If no route is matched by now, it must be a 404

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Start the server

app.set('port', process.env.PORT || 3000);


var server=require('http').createServer(app)
//var crypto = require('crypto')
var websocket = require('socket.io')(server);
// Create a handler for incoming websocket connections

websocket.on('connection', function (socket) {
    console.log("New user connected");

    // Tell others a new user connected
    socket.broadcast.emit('UserConnectedEvent', null);

    // Bind event handler for incoming messages
    socket.on('MessageSentEvent', function (chatData) {
        console.log('Received new chat message');

        // By using the 'broadcast' connector, we will
        // send the message to everyone except the sender.
        socket.broadcast.emit('MessageReceivedEvent', chatData);
    });
});

server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
