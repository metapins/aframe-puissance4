// Load required modules
import http = require('http'); // http server core module
import express = require('express'); // web framework external module
import socketIo = require('socket.io'); // web socket external module
import easyrtc = require('open-easyrtc'); // EasyRTC external module
import path = require('path');

// Set process name
process.title = 'networked-aframe-server';

// Get port or default to 8080
const port = process.env.PORT || 8080;

// Setup and configure Express http server.
const app = express();
app.use(express.static(path.join(__dirname, '../puissance4-aframe')));
app.get('/game*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../puissance4-aframe/index.html'));
});

// Start Express http server
const webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
const socketServer = socketIo.listen(webServer, { 'log level': 1 });
socketServer.pin;
const myIceServers = [
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  // {
  //   'urls':'turn:[ADDRESS]:[PORT]',
  //   'username':'[USERNAME]',
  //   'credential':'[CREDENTIAL]'
  // },
  // {
  //   'urls':'turn:[ADDRESS]:[PORT][?transport=tcp]',
  //   'username':'[USERNAME]',
  //   'credential':'[CREDENTIAL]'
  // }
];
easyrtc.setOption('appIceServers', myIceServers);
easyrtc.setOption('logLevel', 'debug');
easyrtc.setOption('demosEnable', false);
easyrtc.setOption('stillAliveInterval', 0);

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on(
  'easyrtcAuth',
  (socket, easyrtcid, msg, socketCallback, callback) => {
    easyrtc.events.defaultListeners.easyrtcAuth(
      socket,
      easyrtcid,
      msg,
      socketCallback,
      (err, connectionObj) => {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
          callback(err, connectionObj);
          return;
        }

        connectionObj.setField('credential', msg.msgData.credential, {
          isShared: false,
        });

        console.log(
          '[' + easyrtcid + '] Credential saved!',
          connectionObj.getFieldValueSync('credential')
        );

        callback(err, connectionObj);
      }
    );
  }
);

// To test, lets print the credential to the console for every room join!
easyrtc.events.on(
  'roomJoin',
  (connectionObj, roomName, roomParameter, callback) => {
    console.log(
      '[' + connectionObj.getEasyrtcid() + '] Credential retrieved!',
      connectionObj.getFieldValueSync('credential')
    );
    easyrtc.events.defaultListeners.roomJoin(
      connectionObj,
      roomName,
      roomParameter,
      callback
    );
  }
);

// Start EasyRTC server
easyrtc.listen(app, socketServer, null, (_err, rtcRef) => {
  console.log('Initiated');

  rtcRef.events.on(
    'roomCreate',
    (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
      console.log('roomCreate fired! Trying to create: ' + roomName);

      appObj.events.defaultListeners.roomCreate(
        appObj,
        creatorConnectionObj,
        roomName,
        roomOptions,
        callback
      );
    }
  );
});

// Listen on port
webServer.listen(port, () => {
  console.log('listening on http://localhost:' + port);
});
