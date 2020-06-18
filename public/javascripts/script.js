
// define an array to hold our data. Later will be stored on sever
var workouts = [Workout];
var exercises = [Exercise];

function reloadData() {
    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
        // update the li's on our homepage
        var listUl = document.getElementById("listUl");
        displayDaily(listUl)
    });
}

// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {
    
    reloadData();
    // this will refresh the data each time you navigate back to the Home page
    $(document).on('pagebeforeshow', '#Home', function () {
        let listUl = document.getElementById("listUl");
        displayDaily(listUl);
    });

    // this will refresh the data each time you navigate back to the Delete page
    $(document).on('pagebeforeshow', '#Delete', function () {
        let listUl = document.getElementById("deleteListUl");
        checkboxExercises(listUl);
    });

    $(document).on('pagebeforeshow', '#Edit', function () {
        let listUl = document.getElementById("editListUl");
        displayExercise(listUl);
    });

    // this will clear the text boxes each time you navigate back to the Add page
    $(document).on('pagebeforeshow', '#Add', function () {
        let listUl = document.getElementById("exerciseList");
        checkboxExercises(listUl);
        clear();
    });

    $(document).on('pagebeforeshow', '#Schedule', function () {
        let listUl = document.getElementById("scheduleListUl");
        checkboxWorkouts(listUl);
    });

    $(document).on('pagebeforeshow', '#Reports', function () {
        let listUl = document.getElementById("allExercisesListUl");
        listEditExercises(listUl);
    });

    // add a button event for adding new workout
    document.getElementById("addWorkout").addEventListener("click", function () {
        var title = document.getElementById("workoutTitle").value;
        var array = [Exercise];
        var checkboxes = document.getElementsByClassName("checkboxExercises"); 
        for (var i = 0; i < checkboxes.length; i++) {
            var item = checkboxes[i];
            if(item.checked){
            var ex = searchByTitle(item.name);
            if (ex != null) {
                array.push(ex);
            }
          }
        }
        clear();
        var arrstring = JSON.stringify(array);               
        $.post('/workout', {title: title, array: arrstring });
        window.location.replace("/");
    });

    // add a button event for adding new exercises
    document.getElementById("addExercise").addEventListener("click", function () { 
        var newExercise = new Exercise(document.getElementById("title").value, 
        document.getElementById("sets").value,
        document.getElementById("reps").value,
        document.getElementById("time").value, 
        document.getElementById("detail").value);
        clear();
        var datastring = JSON.stringify(newExercise);               
        $.post('/exercise', {data: datastring });
        window.location.replace("/");
     });

     // schedule workouts
     document.getElementById("scheduleBtn").addEventListener("click", function () { 
        var dayChecks = document.getElementsByClassName("daysOfWeek"); 
        var workChecks = document.getElementsByClassName("checkboxWorkouts");
        var days = [];
        var workoutTitles = [];

        // get days
        for (var i = 0; i < dayChecks.length; i++) {
            var item = dayChecks[i];
            if(item.checked){
                var d = parseInt(item.id);
                days.push(d);
            }
        }
        
      
        // get workouts
        for (var i = 0; i < workChecks.length; i++) {
            var item = workChecks[i];
            if(item.checked){  
                workoutTitles.push(item.name);
            }
        }   

        if(days.length==0  || workoutTitles.length ==0) {
            alert("Please choose at least one day and one workout to schedule");
        }
        else {
            var daysJson  = JSON.stringify(days);
            var titlesJson = JSON.stringify(workoutTitles);
            clear();          
            $.post('/schedule', {days: daysJson, titles: titlesJson });
            window.location.replace("/");
        }
     });
     
    // add a button even for deleting exercise
    document.getElementById("delete").addEventListener("click", function () { 

    });

    function clear() {
        document.getElementById("title").value = "";
        document.getElementById("reps").value = "";
        document.getElementById("sets").value = "";
        document.getElementById("time").value = "";
        document.getElementById("detail").value = "";
        document.getElementById("workoutTitle").value = "";
        //uncheck everything
        var checkboxes = document.getElementsByClassName("checkboxExercises"); 
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        checkboxes = document.getElementsByClassName("checkboxWorkouts"); 
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }

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
    this.week = [false, false, false, false, false, false, false];
    this.list = [Exercise];  
}

function searchByTitle(title) {
    for (var i = 0; i < exercises.length; i++){
        if(exercises[i] != null && title === exercises[i].title){
            return exercises[i];
            
        }
    }
    return null;
}


function displayExercise(whichElement) {
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

function listEditExercises(whichElement) {
    whichElement.innerHTML = "";

    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
    });

    exercises.forEach(function (item) {
        if(item != null) {
            var li = document.createElement('li');
            
            li.style.whiteSpace = "nowrap";  

            var editBtn = document.createElement('button');
            editBtn.innerHTML = "Edit";
            editBtn.style.display = "inline-block";   
            editBtn.style.marginLeft = "5px";
            editBtn.addEventListener("click", function(){
                var remove = false;
                $.post('/modifyExercise', {remove:JSON.stringify(remove), title: JSON.stringify(item.title)});
                reloadData();
                window.location.reload();        
            });editBtn.style.color = "blue";


            li.appendChild(editBtn);

            var deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = "Delete";
            deleteBtn.style.display = "inline-block";   
            deleteBtn.style.marginLeft = "30px";
            deleteBtn.style.color = "magenta";           
            deleteBtn.addEventListener("click", function(){
                var remove = true;
                $.post('/modifyExercise', {remove:JSON.stringify(remove), title: JSON.stringify(item.title)});
                reloadData();
                window.location.reload();        
            });


            li.appendChild(deleteBtn);

            var p = document.createElement('p');
            p.style.marginLeft = "20px";
            p.style.display = "inline-block";
            p.innerText = item.title + ":  " + item.sets + " sets of " + item.reps;
            li.appendChild(p);

          
            whichElement.appendChild(li);
        }
    });
}


function displayDaily(whichElement) {
    whichElement.innerHTML = "";
    var date = new Date;
    var today = date.getDay();

    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
    });

    workouts.forEach(function (item) {
        if(item != null && item.week[today]) { //  && item.week[today] remove it back later, it works so well i thought there was a bug
            var li = document.createElement('li');
            li.style.whiteSpace = "nowrap";  
            
            var p = document.createElement('p');
            p.innerText = item.title;
            p.style.display = "inline-block";
            

            var btn = document.createElement('button');
            btn.innerHTML = "Completed";
            btn.style.display = "inline-block";   
            btn.style.marginLeft = "30px";
            btn.style.color = "green";

            // unschedule the workout
            btn.addEventListener("click", function(){
                $.post('/', {title: JSON.stringify(item.title)});
                //window.location.replace("/");
                window.location.reload();        
            });

            li.appendChild(p);
            li.appendChild(btn);

            // maybe also show deets if you have time, and a link for exercises
            whichElement.appendChild(li);
            li.onmouseover = () => {
                // If time allows I will have a show view that will have details about the workouts 
                //alert(item.detail);
            };
        }
    });
}


function checkboxExercises(whichElement) {
    whichElement.innerHTML = "";

    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
    });

    exercises.forEach(function (item) {
        if(item != null) {
            var li = document.createElement('li');
            whichElement.appendChild(li);
            li.innerHTML = "<input type='checkbox' class='checkboxExercises' name='"+item.title+"'><label for='"+item.title+"'>" +item.title + ":  " + item.sets + " sets of " + item.reps+ "</label><br>";       
            // li.onmouseover = () => {
            //     // I will have a show view that will have details about the exercise
            //     //alert(item.detail);
            // };
        }
    });
}


function checkboxWorkouts(whichElement) {
    whichElement.innerHTML = "";
    
    $.get('/getData', function(data, status) {
        var serverData = data;
        workouts = serverData["workouts"];
        exercises = serverData["exercises"];
    });
    
    workouts.forEach(function (item) {
        if(item != null) {
            var li = document.createElement('li');
            whichElement.appendChild(li);
            li.innerHTML = "<input type='checkbox' class='checkboxWorkouts' name='"+item.title+"'><label for='"+item.title+"'>" +item.title+ "</label><br>";
                
            // li.onmouseover = () => {
            //     // I will have a show view that will have details about the workouts
            //     //alert(item.detail);
            // };
        }
    });
}




