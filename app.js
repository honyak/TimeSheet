var firebaseConfig = {
    apiKey: "AIzaSyAN0rF4c98vEqv9OK7bp_7P_NA21HfvHnA",
    authDomain: "bootcamp-e2723.firebaseapp.com",
    databaseURL: "https://bootcamp-e2723-default-rtdb.firebaseio.com",
    projectId: "bootcamp-e2723",
    storageBucket: "bootcamp-e2723.appspot.com",
    messagingSenderId: "858706631830",
    appId: "1:858706631830:web:8f0d12fb557d910dd7f6b7",
    measurementId: "G-4ERS3TK9RL"
};

firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();
var employeeRef = firebase.database().ref('/employeeData');

employeeRef.on("value", function (snapshot) {
    $("#employeeListArea").empty();

// Loops through all of the children of snapshot (the employee objects, named as unique sessions)
    snapshot.forEach(function (childSnapshot) {
        var name = childSnapshot.val().name;
        var role = childSnapshot.val().role;
        var date = childSnapshot.val().date;
        var rate = childSnapshot.val().rate;

        var empStartPretty = moment.unix(date).format("MM/DD/YYYY");

        // Calculate the months worked using hardcore math
        var monthsWorked = moment().diff(moment(date, "X"), "months");

        // Calculate the total billed rate
        var totalBilled = monthsWorked * rate;

        var tableRow = $("<tr>");
        var tableRow = tableRow.append("<td>" + name + "</td>" +
            "<td>" + role + "</td>" +
            "<td>" + empStartPretty + "</td>" +
            "<td>" + monthsWorked + "</td>" +
            "<td>" + rate + "</td>" +
            "<td>" + totalBilled + "</td>"
        );
        $("#employeeListArea").prepend(tableRow);

    });

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

$("#submitEmployee").on("click", function (event) {
    // prevent form from submitting
    event.preventDefault();

    var employeeName = $("#name-input").val().trim();
    var employeeRole = $("#role-input").val().trim();
    var startDate = moment($("#date-input").val().trim(), "MM/DD/YYYY").format("X");
    var monthlyRate = parseInt($("#rate-input").val().trim());

    if (employeeName && employeeRole && startDate && monthlyRate) {
        var newEmp = {
            name: employeeName,
            role: employeeRole,
            date: startDate,
            rate: monthlyRate
        }
        employeeRef.push(newEmp);

        //Clear all inputs
        $("input[type='text']").val("");
    }
    else {
        alert("You must enter all fields to submit!");
    }
});