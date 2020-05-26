var express = require('express');
var router = express.Router();

var serverData = {};

// our constructor
function Exercise(title, sets, reps, time, detail, link) {
  this.title = title;
  this.sets = sets;
  this.reps = reps;
  this.time = time;
  if (time != "") {
      this.timed = true;
  } else {
      this.timed = false;
  }
  this.detail = detail;
  this.link = link;
  //this.icon = icon;
}

function Workout(title, details) {
  this.title = title;
  this.details = details;
  this.list = [Exercise];  
}

var workouts = [Workout];
var exercises = [Exercise];

exercises.push(new Exercise("Push-up", 5, 10, "", "Tut", ""));
exercises.push(new Exercise("Squat", 2, 25, "", "weighted-vest", ""));

serverData["workouts"] = workouts;
serverData["exercises"] = exercises;

/* GET page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Gainz' }) ;
});

// get all data
router.get('/getData', function(req, res, next) {
  res.status(200).json(serverData);
});
module.exports = router;