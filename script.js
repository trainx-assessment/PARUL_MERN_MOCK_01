document.getElementById("studentForm").addEventListener("submit", function(event) {

    // 1. Prevent default form submission
    event.preventDefault();

    // 2. Read values
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let course = document.getElementById("course").value;

    let valid = true;

    // Clear old error messages
    document.getElementById("nameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("phoneError").innerHTML = "";
    document.getElementById("dobError").innerHTML = "";
    document.getElementById("genderError").innerHTML = "";
    document.getElementById("courseError").innerHTML = "";

    // 3. Name validation
    // Only letters and spaces
    let namePattern = /^[A-Za-z ]+$/;

    if (name === "") {
        document.getElementById("nameError").innerHTML =
            " Name is required";
        valid = false;
    }
    else if (name.length < 3) {
        document.getElementById("nameError").innerHTML =
            " Name must contain at least 3 characters";
        valid = false;
    }
    else if (!namePattern.test(name)) {
        document.getElementById("nameError").innerHTML =
            " Name can contain only letters and spaces";
        valid = false;
    }


    // 4. Email validation
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        document.getElementById("emailError").innerHTML =
            " Email is required";
        valid = false;
    }
    else if (!emailPattern.test(email)) {
        document.getElementById("emailError").innerHTML =
            " Enter a valid email";
        valid = false;
    }


  
    let phonePattern = /^[0-9]{10}$/;

    if (phone === "") {
        document.getElementById("phoneError").innerHTML =
            " Phone number is required";
        valid = false;
    }
    else if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").innerHTML =
            " Phone number must contain exactly 10 digits";
        valid = false;
    }


    if (dob === "") {
        document.getElementById("dobError").innerHTML =
            " Date of birth is required";
        valid = false;
    }


    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {
        document.getElementById("genderError").innerHTML =
            " Please select gender";
        valid = false;
    }


    if (course === "") {
        document.getElementById("courseError").innerHTML =
            " Please select a course";
        valid = false;
    }


    if (valid) {
        alert("Student Registration Successful!");

       
    }

});