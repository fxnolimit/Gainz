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
  this.week = [false, false, false, false, false, false, false];
  this.details = details;
  this.list = [Exercise];  
}

var workouts = [Workout];
var exercises = [Exercise];

function noDuplicateExercise(title){
  for (var i in exercises){
    if (exercises[i].title == title){
      return false;
    }
  }
  return true;
}

function noDuplicateWorkout(title){
  for (var i in workouts){
    if (workouts[i].title == title){
      return false;
    }
  }
  return true;
}

exercises.push(new Exercise("Push-up", 5, 10, "", "Tut", ""));
exercises.push(new Exercise("Squat", 2, 25, "", "weighted-vest", ""));

var mock = new Workout("Tuesday Workout", "Upper body work");
// schedule for today and tomorrow
mock.week[3] = true;
mock.list.push(new Exercise("Push-up", 5, 10, "", "Tut", ""));
workouts.push(mock);

serverData["workouts"] = workouts;
serverData["exercises"] = exercises;

// GET data
router.get('/getData', function(req, res, next) {
  res.status(200).json(serverData);
});

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gainz' }) ;
});

router.post('/', function(req, res) {
  var title = JSON.parse(req.body.title);
  for(var j in workouts) {
    if (workouts[j].title == title){
      var date = new Date;
      var today = date.getDay();
      workouts[j].week[today] = false;
    }
  }
  
});

// Add exercise
router.post('/exercise', function(req, res){
  var obj = JSON.parse(req.body.data);
  if (noDuplicateExercise(obj.title)){
    var exercise = new Exercise(obj.title, obj.sets, obj.reps, obj.time, obj.details);
    exercise.timed = obj.timed;
    exercises.push(exercise);
    res.status(200);
  } else{
      console.log("Duplicate");
      res.status(400).send("No duplicate title allowed");
  }
});

router.post('/schedule', function(req,res){
  console.log("here");
  var titles = JSON.parse(req.body.titles);
  var days = JSON.parse(req.body.days);
  for(var i in titles) {
    if(titles[i]!=null){
     for(var j in workouts) {
       if (workouts[j].title == titles[i]){
        for (var k in days){
          workouts[j].week[days[k]] = true;
        } 
       }
     } 
    }
  }
  res.status(200);
});

router.post('/workout', function(req, res){
  var raw = JSON.parse(req.body.array);
  var title = req.body.title;
  if (noDuplicateWorkout(title)){
    var newWorkout = new Workout(title, "");
    var array = [Exercise];
    for(var i in raw) {
      if (raw[i] != null){
        var obj = raw[i];
        var temp = new Exercise(obj.title, obj.sets, obj.reps, obj.time, obj.details);
        temp.timed = obj.timed;
        array.push(temp);
      }
    }
    newWorkout.list = array;
    console.log(newWorkout);
    workouts.push(newWorkout);

    res.status(200);
  } else {
    console.log("DUplicate");
      res.status(400).send("No duplicate title allowed");
  }
});

module.exports = router;