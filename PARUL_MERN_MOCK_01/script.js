function clearError() {

    error = document.getElementsByClassName("error");

    for (let item of error) {
        item.innerHTML = "";
    }

}


function setError(id, error) {

    document.getElementById(id).innerHTML = error;

}


function validateForm() {

    clearError();

    var returnval = true;


    // Name validation 

    var name = document.forms["Rform"]["studentName"].value;

    if (name.length == 0) {

        setError("nameError", "*Please enter your name");

        returnval = false;

    }

    else if (name.trim().length < 3) {

        setError("nameError", "*Name must contain at least 3 characters");

        returnval = false;

    }

    else if (name.length > 40) {

        setError("nameError", "*Name must be less than 40 characters");

        returnval = false;

    }

    else if (!/^[A-Za-z ]+$/.test(name)) {

        setError("nameError", "*Only letters and spaces are allowed");

        returnval = false;

    }


    // Email validation

    var email = document.forms["Rform"]["email"].value;

    if (email.length == 0) {

        setError("emailError", "*Please enter your email");

        returnval = false;

    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        setError("emailError", "*Enter a valid email");

        returnval = false;

    }


    // phoene validation

    var phone = document.forms["Rform"]["phone"].value;

    if (phone.length == 0) {

        setError("phoneError", "*Please enter phone number");

        returnval = false;

    }

    else if (phone.length != 10) {

        setError("phoneError", "*Phone number must contain 10 digits");

        returnval = false;

    }

    else if (!/^[0-9]+$/.test(phone)) {

        setError("phoneError", "*Only numbers are allowed");

        returnval = false;

    }


    // Birth validation

    var dob = document.forms["Rform"]["DOB"].value;

    if (dob.length == 0) {

        setError("dateError", "*Please select date of birth");

        returnval = false;

    }

    else {

        var today = new Date();
        var birthDate = new Date(dob);

        if (birthDate > today) {

            setError("dateError", "*Future date is not allowed");

            returnval = false;

        }

    }


    // gender validation

    var gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        setError("genderError", "*Please select gender");

        returnval = false;

    }


    // corse validation

    var course = document.forms["Rform"]["course"].value;

    if (course == "") {

        setError("courseError", "*Please select a course");

        returnval = false;

    }


    // Skills validation

    var skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (skills.length == 0) {

        setError("skillsError", "*Please select at least one skill");

        returnval = false;

    }


    // About validation

    var about = document.forms["Rform"]["about"].value;

    if (about.trim().length == 0) {

        setError("aboutError", "*Please enter something about the student");

        returnval = false;

    }

    else if (about.trim().length < 20) {

        setError("aboutError", "*Minimum 20 characters required");

        returnval = false;

    }


    // photo validation

    var photo = document.forms["Rform"]["photo"].value;

    if (photo.length == 0) {

        setError("photoError", "*Please select a profile photo");

        returnval = false;

    }
   // runs when all the validations are successful

    if (returnval == true) {
        alert("Form submitted successfully!");
    }

    return returnval;

}