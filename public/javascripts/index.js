
// define an array to hold our data. Later will be stored on sever
var workouts = [Workout];
var exercises = [Exercise];

$.get('/getData', function(data, status) {
    var serverData = data;
    workouts = serverData["workouts"];
    exercises = serverData["exercises"];
});

// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {

    // update the li's on our homepage
    var listUl = document.getElementById("listUl");
    mockDisplay(listUl);  // call shared code with delete and home
    listUl = document.getElementById("exerciseList");
    mockDisplay(listUl);
    listUl = document.getElementById("deleteListUl");
    checkboxDisplay(listUl);
    listUl = document.getElementById("scheduleListUl");
    checkboxDisplay(listUl);


    // this will refresh the data each time you navigate back to the Home page
    $(document).on('pagebeforeshow', '#Home', function () {
        let listUl = document.getElementById("listUl");
        mockDisplay(listUl);
    });

    // this will refresh the data each time you navigate back to the Delete page
    $(document).on('pagebeforeshow', '#Delete', function () {
        let listUl = document.getElementById("deleteListUl");
        checkboxDisplay(listUl);
    });

    $(document).on('pagebeforeshow', '#Edit', function () {
        let listUl = document.getElementById("editListUl");
        mockDisplay(listUl);
    });


    // this will clear the text boxes  each time you navigate back to the Add page
    $(document).on('pagebeforeshow', '#Add', function () {
        let listUl = document.getElementById("exerciseList");
        checkboxDisplay(listUl);
        clear();
    });

    $(document).on('pagebeforeshow', '#Schedule', function () {
        let listUl = document.getElementById("scheduleListUl");
        checkboxDisplay(listUl);
    });

    

    // add a button event for adding new workout/exercises
    document.getElementById("newExercise").addEventListener("click", function () {
        Workouts.push(new Exercise(document.getElementById("title").value, 
        document.getElementById("sets").value,
        document.getElementById("reps").value,
        document.getElementById("time").value, 
        document.getElementById("detail").value));
        clear();
     });

     document.getElementById("newWorkout").addEventListener("click", function () {
        clear();
     });

    // add a button even for deleting exercise
    document.getElementById("delete").addEventListener("click", function () { });

    function clear() {
        document.getElementById("title").value = "";
        document.getElementById("reps").value = "";
        document.getElementById("sets").value = "";
        document.getElementById("time").value = "";
        document.getElementById("detail").value = "";
    }
});  // end of code that must wait for document to load before running

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

function mockDisplay(whichElement) {
    whichElement.innerHTML = "";

    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
    });

    exercises.forEach(function (item, index) {
        if(item != null) {
            var li = document.createElement('li');
            whichElement.appendChild(li);
            li.innerHTML = item.title + ":  " + item.sets + " sets of " + item.reps;
            
            li.onmouseover = () => {
                // I will have a show view that will have details about the exercise
                //alert(item.detail);
            };
        }
    });
}

function checkboxDisplay(whichElement) {
    whichElement.innerHTML = "";

    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
    });

    exercises.forEach(function (item, index) {
        if(item != null) {
            var li = document.createElement('li');
            whichElement.appendChild(li);
            li.innerHTML = "<input type='checkbox' class='checkLi' name="+item.title+"><label for="+item.title+">" +item.title + ":  " + item.sets + " sets of " + item.reps+ "</label><br>";
            
            li.onmouseover = () => {
                // I will have a show view that will have details about the exercise
                //alert(item.detail);
            };
        }
    });
}


