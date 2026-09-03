let form = document.getElementById("Registration_form");
let total = 0;

form.addEventListener("submit", function(event){

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let course = document.getElementById("course").value;

    if(name == "" || email == "" || phone == ""){
        alert("Please fill all fields");
        return;
    }

    total++;

    document.getElementById("totalStudent").innerHTML = "Total Students : " + total;

    document.getElementById("studentContainer").innerHTML +=
    "<div class='student-card'>" +
    "<h3>" + name + "</h3>" +
    "<p>Email : " + email + "</p>" +
    "<p>Phone : " + phone + "</p>" +
    "<p>Course : " + course + "</p>" +
    "</div>";

    form.reset();
});