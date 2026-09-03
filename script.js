const form = document.getElementById("studentForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("studentName").value;
    let email = document.getElementById("studentEmail").value;
    let phone = document.getElementById("studentPhone").value;
    let dob = document.getElementById("studentDob").value;
    let course = document.getElementById("course").value;
    let about = document.getElementById("aboutStudent").value;

    let gender = document.querySelector('input[name="gender"]:checked');
    let skills = document.querySelectorAll('input[name="skills"]:checked');

    if (name == "") {
        alert("Please enter student name");
        return;
    }

    if (email == "") {
        alert("Please enter email");
        return;
    }


    
    if (phone == "") {
        alert("Please enter phone");
        return;
    }

    if (dob == "") {
        alert("Please select date of birth");
        return;
    }

    if (!gender) {
        alert("Please select gender");
        return;
    }

    if (course == "") {
        alert("Please select course");
        return;
    }

    if (skills.length == 0) {
        alert("Please select at least one skill");
        return;
    }

    if (about == "") {
        alert("Please write something about the student");
        return;
    }

    alert("Student registered successfully!");

    form.reset();
});