//This is the patient Dashboard where patient information is shown in the form of a table on the frontend which has column headers
// namely patientname, phonenumber and tokennumber and on the backend it is stored in PostgreSQL database

//Whenever a new patient arrives, the doctor's consultant enters his name and number in a form, then a new token number is generated
// for that patient and the patient is expected to wait until the tokennumber is shown on the currentToken page

const express = require('express');
const path = require('path');

const router = express.Router();
// In Express, Router is a middleware that allows us to define a set of routes for a specific endpoint or URL prefix.
// This means we can separate our routes into multiple files and then combine them into a single application.
// The const router = express.Router() line creates a new router object using the Router middleware provided by
// the Express framework. We can then define our routes on this router object and export it to use it in our main application
// Source GPT


// The fetch function is part of the web platform and can only be used in web browsers. 
// In Node.js, you can use axios to make HTTP requests.
const axios = require('axios');

// PostgreSQL configuration
const pg = require('pg');
const pool = new pg.Pool({
  user: 'your-name',
  host: 'localhost',
  database: 'patientDatabase',
  password: 'your-password',
  port: '5432',
});


router.get('/', (req, res) => {
  const parentDir = path.join(__dirname, '..', '..');// To move two parents up
  res.sendFile(parentDir + "/public/index1.html");
});



// Add new patient to the table
router.post('/addPatient', (req, res) => {
  const patientname = req.body.patientname;
  const phonenumber = req.body.phonenumber;

  axios.get('http://localhost:3000/patientDashboard/getNewToken')// it listens to some other default port that is why we have to specify the complete route // fetch doesn't work server side node.js
    .then(response => response.data)
    .then(data => {


      const tokennumber = data;

      const insertQuery = `INSERT INTO patientsdata (patientname, phonenumber, tokennumber) VALUES ('${patientname}', '${phonenumber}', '${tokennumber}');`;// Query to add new patient to the database table // patientsdata is the name of database table
      pool.query(insertQuery, (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).send('Error adding patient');
        } else {
          console.log('Patient added successfully');
          res.status(200).send({ message: 'Patient added to database.' });
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Error getting new token');
    });
});

//Get all the patients
router.get('/getPatients', (req, res) => {
  const query = `SELECT * FROM patientsdata;`;
  pool.query(query, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error getting patients');
    } else {
      res.json(result.rows);// the data on client side is expected in json format so res.json();
    }
  });
});

//Get last patient
router.get('/getLastPatient', (req, res) => {
  const query = `SELECT * FROM patientsdata ORDER BY tokennumber DESC LIMIT 1;`;

  pool.query(query, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error getting last patient');
    } else {

      res.json(result.rows[0]);
    }
  });
});

//Get NewToken for recently added patient, see index1.html to understand the logic
router.get('/getNewToken', (req, res) => {
  const getMaxTokenQuery = `SELECT * FROM patientsdata ORDER BY tokennumber DESC LIMIT 1;`;
  pool.query(getMaxTokenQuery, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error getting max token');
    } else {

      if (result.rows.length >= 1) {
        var intialToken = result.rows[0].tokennumber;
        intialToken = intialToken.slice(2, intialToken.length);
        var currenttokennumber = parseInt(intialToken);
        currenttokennumber++;
        var currenttokennumberToString = currenttokennumber.toString();
        var finalTokenString = "T-" + currenttokennumberToString;
        res.send(finalTokenString);
      } else {
        var finalTokenString = "T-101";
        res.send(finalTokenString);
      }
    }
  });
});


// module.exports = router; exports the router object as a module that can be imported into other files. 
// This allows you to define the routes in this file and then use them in other parts of your application by importing them with require
module.exports = router;


