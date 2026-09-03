const students = [];

let editingStudentId = null;


// DOM ELEMENTS

const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");

const charCount = document.getElementById("charCount");

const studentContainer = document.getElementById("studentContainer");




aboutInput.addEventListener("input", function () {
    charCount.textContent = aboutInput.value.length;
});



function validateForm() {

    let isValid = true;

    clearErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const course = courseInput.value;
    const about = aboutInput.value.trim();

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );


    // NAME

    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "") {
        showError("nameError", "Name is required");
        isValid = false;
    }
    else if (name.length < 3 || name.length > 40) {
        showError(
            "nameError",
            "Name must be between 3 and 40 characters"
        );
        isValid = false;
    }
    else if (!nameRegex.test(name)) {
        showError(
            "nameError",
            "Name can contain only letters and spaces"
        );
        isValid = false;
    }


    // EMAIL

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showError("emailError", "Email is required");
        isValid = false;
    }
    else if (!emailRegex.test(email)) {
        showError("emailError", "Enter a valid email");
        isValid = false;
    }


    // PHONE

    const phoneRegex = /^\d{10}$/;

    if (phone === "") {
        showError("phoneError", "Phone number is required");
        isValid = false;
    }
    else if (!phoneRegex.test(phone)) {
        showError(
            "phoneError",
            "Phone must contain exactly 10 digits"
        );
        isValid = false;
    }


    // DOB

    if (dob === "") {

        showError("dobError", "Date of birth is required");
        isValid = false;

    }
    else {

        const birthDate = new Date(dob);
        const today = new Date();

        if (birthDate > today) {

            showError(
                "dobError",
                "Future dates are not allowed"
            );

            isValid = false;

        }
        else {

            const age = calculateAge(birthDate);

            if (age < 15) {

                showError(
                    "dobError",
                    "Student must be at least 15 years old"
                );

                isValid = false;
            }
        }
    }


    // GENDER

    if (!gender) {

        showError(
            "genderError",
            "Please select a gender"
        );

        isValid = false;
    }


    // COURSE

    if (course === "") {

        showError(
            "courseError",
            "Please select a course"
        );

        isValid = false;
    }


    // SKILLS

    if (skills.length === 0) {

        showError(
            "skillsError",
            "Select at least one skill"
        );

        isValid = false;
    }


    // ABOUT

    if (about === "") {

        showError(
            "aboutError",
            "About student is required"
        );

        isValid = false;

    }
    else if (about.length < 20) {

        showError(
            "aboutError",
            "About must contain at least 20 characters"
        );

        isValid = false;
    }


    // PHOTO

    if (editingStudentId === null && photoInput.files.length === 0) {

        showError(
            "photoError",
            "Profile photo is required"
        );

        isValid = false;

    }
    else if (photoInput.files.length > 0) {

        const file = photoInput.files[0];

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {

            showError(
                "photoError",
                "Only JPG, JPEG and PNG images are allowed"
            );

            isValid = false;
        }
    }


    return isValid;
}


// AGE CALCULATION

function calculateAge(birthDate) {

    const today = new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }

    return age;
}


// SHOW ERROR

function showError(id, message) {

    document.getElementById(id).textContent = message;
}


// CLEAR ERRORS

function clearErrors() {

    const errors = document.querySelectorAll(".error");

    errors.forEach(function (error) {
        error.textContent = "";
    });
}


// FORM SUBMIT

form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        ).value;

    const skills = [];

    document
        .querySelectorAll('input[name="skills"]:checked')
        .forEach(function (checkbox) {

            skills.push(checkbox.value);

        });


    let photoURL = "";

    if (photoInput.files.length > 0) {

        photoURL =
            URL.createObjectURL(photoInput.files[0]);

    }


    // EDIT

    