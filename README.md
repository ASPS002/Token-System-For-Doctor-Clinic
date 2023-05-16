# Token-System-For-Doctor-Clinic

To keep patient arrivals at the clinic organized, many doctors use a token system. When the patient arrives, he/she is given a token - usually a piece of paper with a number on it. The assistant takes note of the patient’s name and the token number. 

When the doctor is ready, the assistant starts calling patients, starting with the first token. When that patient is done, the next token becomes active. This keeps happening, and at the same time, new patients are also added and issued tokens.

It contains the patientDashboard and currentToken Dashboard. When the turn of the next patient comes, the next token becomes active on the patientDashboard and the current active token is displayed on the currentToken dashboard.

This web application generates tokens, maintains the current token, and announces when tokens change. 

## Folder Structure

- Token-System-For-Doctor-Clinic
    - public
       - index1.html
       - index2.html
       - styles1.css
       - styles2.css
       - images
     - src
         - server.js
         - routes
             - patientDashboard.js
             - currentToken.js

## Brief description of each file

- **index1.html**- It contains the HTML code displaying the patientDashboard page. It contains a script that runs whenever a particular event occurs like submit or click. The script is
responsible for calling various APis.
- **index2.html**- It contains the HTML code displaying the currentToken page. It establishes a connection with Websocket to broadcast token changes in real-time.
- **styles1.css**- It adds style to index1.html.
- **styles2.css**- It adds style to index2.html.
- **server.js**- It is the entry point of the web application. It imports/requires two routes namely patientDashboard and currenToken and specifies the base URL for each dashboard.
- **patientDashboard**- It contains the logic for various APIs responsible for interacting with the Postgresql database and the client. It renders the patientDashboard page using post API.
- **currentToken**- It renders the currentToken page. It creates a new WebSocket connection using the ws library. It sends a message to the required client whenever the nextToken button is pressed 
to display changes in real-time.  

## How to run on your pc

- Use git clone *URL_name* to clone the repository on your pc.
- Install pgAdmin 4 for the Postgresql database. Set up your username and password.
- Now open the terminal and go to the cloned directory.
- Install all the required dependencies mentioned in package.json
- Now open the folder using VS Code or any other compatible code editor.
- Replace your username and password with your username and password(that you have set up in the  2nd step) for accessing the Postgresql database. These changes should be made in the patientDashborad.js and currentToken.js files.
- Make sure you use the same name of the table and database as used in the provided code or make necessary changes everywhere.
- Now go to the terminal in the same directory and run the following command *node src/server.js*. This sets up the server.
- Now go to *localhost:3000/patientDashboard* in one browser and *localhost:3000/currentToken* in another browser. They should be displaying respective pages.
- Now enter the patient details on the patientDashboard page using the input box provided and press *GenerateToken*. 
- It generates a new token for the patient and subsequently adds the patient to the Postgresql database and also displays it on the table on the patientDashboard page.
- Now if you press the  NextToken button, it moves to the next available patient and marks that row as green i.e. active. 
- Whenever the Current Token number changes the corresponding changes are displayed on the currenToken page in real-time using ws the library. 

## Demo images

<!-- ![patientDashboard](/patientDashboard.png "Patient Dashboard") -->
<img align="left" src="/patientDashboard.png" width="450" height="300"> <img align="right" src="/currentToken.png" width="450" height="300">


<p align="center">
  <img width="400" height="200" src="/postgresqlDatabase.png">
</p>



           
