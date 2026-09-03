const form = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");

const todayString = today.toISOString().split("T")[0];

dob.max = todayString;

form.addEventListener("submit", function (event) {

    event.preventDefault();

    let isValid = true;

    nameError.textContent = "";
    emailError.textContent = "";


    const namePattern = /^[A-Za-z ]{3,40}$/;

    if (studentName.value.trim() === "") {

        nameError.textContent = "Student name is required.";
        isValid = false;

    } else if (!namePattern.test(studentName.value.trim())) {

        nameError.textContent =
            "Name must contain only letters and spaces (3-40 characters).";

        isValid = false;
    }

    const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (email.value.trim() === "") {

        emailError.textContent = "Email is required.";
        isValid = false;

    } else if (!emailPattern.test(email.value.trim())) {

        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
    }

});