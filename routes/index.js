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

var mock = new Workout("Workout example", "scheduled for today");
// scheduled everyday
mock.week = [true,true,true,true,true,true,true];
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

// Add exercise
router.post('/exercise', function(req, res){
  var obj = JSON.parse(req.body.data);
  if (noDuplicateExercise(obj.title)){
    var exercise = new Exercise(obj.title, obj.sets, obj.reps, obj.time, obj.details);
    exercise.timed = obj.timed;
    exercises.push(exercise);
    res.status(200);
  } else{
      res.status(400).send("No duplicate title allowed");
  }
});

//schedule workouts
router.post('/schedule', function(req,res){
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

//unschedule workout
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

// add workout
router.post('/workout', function(req, res){
  var raw = JSON.parse(req.body.array);
  var title = req.body.title;
  var detail = req.body.detail;
  if (noDuplicateWorkout(title)){
    var newWorkout = new Workout(title, detail);
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
    workouts.push(newWorkout);

    res.status(200);
  } else {
    res.status(400).send("No duplicate title allowed");
  }
});

// edit workout
router.post('/editWorkout', function(req, res){
  var title = JSON.parse(req.body.oldTitle);
  var newTitle = JSON.parse(req.body.newTitle);
  var newDetails = JSON.parse(req.body.newDetails);
  for (var k in workouts){
    if (workouts[k] != null && workouts[k].title == title){
       if(newTitle!= ""){
        workouts[k].title = newTitle;
       }
       if (newDetails!= ""){
        workouts[k].details = newDetails;
       }
      }
    }
  res.status(200);
});
  

// delete or edit exercise
router.post('/modifyExercise', function(req, res){
  var title = JSON.parse(req.body.title);
  var remove = JSON.parse(req.body.remove);
  // remove from exercises
  if (title != null) {
    for(var i in exercises){
      if(exercises[i].title==title){
        if(remove){    
          exercises.splice(i,1);
        } else {
          //edit
        }
      }
    }

    // remove from workouts
    for (var i in workouts){  
      for (var k in workouts[i].list){
        if (workouts[i].list[k].title == title){
          if(remove){    
            workouts[i].list.splice(k,1);
          } else {
            // edit
          }   
        }
      }
    }
    res.status(200);  
  } else {
    res.status(400);
  } 
});

// delete a workout
router.post('/deleteWorkouts', function(req, res){
  var titles = JSON.parse(req.body.titles);
  for (var i in titles){
    for (var k in workouts){
      if (workouts[k] != null && workouts[k].title == titles[i]){
        workouts.splice(k,1);
      }
    }
  }
  res.status(200);
});

module.exports = router;