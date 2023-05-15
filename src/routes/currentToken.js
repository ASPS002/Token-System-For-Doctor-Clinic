//This is the currentToken page , here the tokennumber of that patient is displayed whose turn it is now
// that is the active token number currently

//Websocket ws library is used to broadcast live changes on currenttoken page as it is more efficiently and only gives message to client when token number is changed
// so polling is not required

const express = require('express');
const router = express.Router();
const axios = require('axios');
var currentTokenNumber = "T-101";//setting the currentTokenNumber as T-101
const WebSocket = require('ws');
const path = require('path');

const pg = require('pg');
const pool = new pg.Pool({
  user: 'yourname',
  host: 'localhost',
  database: 'patientDatabase',
  password: 'my-password',
  port: '5432',
});

router.get('/', (req, res) => {
  const parentDir = path.join(__dirname, '..', '..');
  res.sendFile(parentDir + "/public/index2.html");
});

// Create a new WebSocket server
const wss = new WebSocket.Server({ port: 8080 });//the port 8080 is the port number on which the WebSocket server is listening for incoming connections

// Listen for new connections
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Send initial token number to client
  ws.send('T-101');

  // Listen for messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });
});

//this indicates that now its turn of next patient and hence change the current token number

router.get('/setCurrentTokenNumber', (req, res) => {
  
  const getMaxTokenQuery = `SELECT * FROM patientsdata ORDER BY tokennumber DESC LIMIT 1;`;
  pool.query(getMaxTokenQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error getting max token');
    } else {
      var tokennumber = result.rows[0].tokennumber;
      var ActiveCurrentTokenNumber = currentTokenNumber;
      var areMorePatientsAvailable = 0;
      if (tokennumber == null || ActiveCurrentTokenNumber == tokennumber) {// if consultant presses the next token button when there are no more patients then it gives an alert
        res.send({ currentTokenNumber: currentTokenNumber, areMorePatientsAvailable: areMorePatientsAvailable, message: "Current Token Number has been updated" });
      }
      else {
        var valueOfNextActiveToken = parseInt(ActiveCurrentTokenNumber.slice(2, ActiveCurrentTokenNumber.length));
        valueOfNextActiveToken++;
        var stringValueOfNextActiveToken = valueOfNextActiveToken.toString();
        currentTokenNumber = "T-" + stringValueOfNextActiveToken;
        areMorePatientsAvailable = 1;
        
        //here tokennumber is getting changed and hence ws is sending all the open clients the currentTokenNumber
        // here the request is coming from another client i.e from index1.html and we are sending data to index2.html as per our need
        // We can even send the data only to the client who makes the above request 
        wss.clients.forEach((client) => {

          if (client.readyState === WebSocket.OPEN) {// if client is open
            client.send(currentTokenNumber);// send the token number, see index2.html for better understanding
            console.log(client);
          }
        });
        
       //This response is getting sent to the client who made the request to this api i.e index1.html
        res.send({ currentTokenNumber: currentTokenNumber, areMorePatientsAvailable: areMorePatientsAvailable, message: "Current Token Number has been updated" });
      }
    }

  });
});

module.exports = router;