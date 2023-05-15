const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
app.use(express.static('public'));



// import routes
const dashboard1Router = require('./routes/patientDashboard');
const dashboard2Router = require('./routes/currentToken');


// We use the app.use() method to specify the base URL for each dashboard

app.use('/patientDashboard', dashboard1Router);
app.use('/currentToken', dashboard2Router);


// app is listening to port 3000 as specified above
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
