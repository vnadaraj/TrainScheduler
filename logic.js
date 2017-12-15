
/* global firebase moment */


// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyA4dXhLYzz_-9goGOJgoDVqWK4kVEoqRKg",
    authDomain: "vickuacbc.firebaseapp.com",
    databaseURL: "https://vickuacbc.firebaseio.com",
    projectId: "vickuacbc",
    storageBucket: "vickuacbc.appspot.com",
    messagingSenderId: "478893839585"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// trainsRef references a specific location in our database.
// All of our trains will be stored in this directory.
var trainsRef = database.ref("/trains");

// 2. Create button for adding new trains - then update the html + update the database
// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFirstTime = moment($("#first-train-time").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    firsttime: trainFirstTime,
    frequency: trainFreq
  };

  // Uploads train data to the database
  database.ref("/trains").push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firsttime);
  console.log(newTrain.frequency);

  // Alert
  // alert("Employee successfully added");
  console.log("Train successfully added!");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time").val("");
  $("#frequency-input").val("");

});

// 3. Create a way to retrieve trains from the trains directory in the database.
// 3. Create Firebase event for adding trains as rows in the html when a user adds an entry
// This function allows you to update your page in real-time when a record is added within the firebase node "trains"
var currTime = "";
var nextArr = "";
var minsAway = "";

database.ref("/trains").on("child_added", function(childSnapshot, prevChildKey) {
  console.log("Database: " + childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirstTime = childSnapshot.val().firsttime;
  var trainFreq = childSnapshot.val().frequency;

  var fTime = moment(trainFirstTime, "X").format("HH:mm");

  // Train Info
  console.log("Database: " + trainName);
  console.log("Database: " + trainDestination);
  console.log("Database: " + trainFirstTime);
  console.log("Database: " + trainFreq);

  // Prettify the train first time
  // var trainFTPretty = moment.unix(trainFirstTime).format("HH:mm");

// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.

nextArrival(trainFreq, trainFirstTime);

console.log("==========================================================");


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFreq + "</td><td>" + fTime + "</td><td>" + currTime + "</td><td>" + nextArr + "</td><td>" + minsAway + "</td></tr>");

});

function nextArrival(freq, fttm) {

    currentTime = moment().unix();
    console.log("Current time: " + currentTime + " | " + moment(currentTime, "X").format("HH:mm"));
    console.log("First time: " + fttm + " | " + moment(fttm, "X").format("HH:mm"));
    freq=freq*60;
    console.log(freq);

    if (currentTime < fttm) {

      var newfttm = moment(fttm, "X").subtract(1, "days");      
      console.log("Adj. First time: " + moment(newfttm).format("X") + " | " + moment(newfttm, "X").format("HH:mm"));
      fttm = moment(newfttm).format("X");
    };

    for (var fwdTime = fttm; fwdTime < currentTime; fwdTime = parseInt(fwdTime) + freq) {
      console.log("foward time:  " + fwdTime + " | " + moment(fwdTime, "X").format("HH:mm"));
      console.log("current time: " + currentTime + " | " + moment(currentTime, "X").format("HH:mm"));
    };
    console.log("Next train: " + fwdTime);
    console.log("Next train: " + moment(fwdTime, "X").format("HH:mm"));

    currTime = moment(currentTime, "X").format("HH:mm");
    nextArr = moment(fwdTime, "X").format("HH:mm");
    //minsAway = moment((fwdTime - currentTime), "X").format("mm:ss");
    minsAway = Math.ceil((fwdTime - currentTime)/60);

}
