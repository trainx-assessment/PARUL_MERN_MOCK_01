const form = document.getElementById("student-form");

const studentName = document.getElementById("student-name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profile-photo");


// Create error message
function showError(input, message) {
    removeError(input);

    const error = document.createElement("small");
    error.className = "error-message";
    error.textContent = message;
    error.style.color = "red";

    input.parentElement.appendChild(error);
}


// Remove old error message
function removeError(input) {
    const oldError = input.parentElement.querySelector(".error-message");

    if (oldError) {
        oldError.remove();
    }
}


// Remove all old errors
function clearErrors() {
    document.querySelectorAll(".error-message").forEach(error => {
        error.remove();
    });
}


// About character counter
const counter = document.createElement("small");
counter.id = "character-counter";
counter.textContent = "0 / 200";
about.parentElement.appendChild(counter);

about.addEventListener("input", function () {
    counter.textContent = `${about.value.length} / 200`;
});


// Form submit
form.addEventListener("submit", function (event) {

    event.preventDefault();

    clearErrors();

    let isValid = true;


    // Student Name
    const nameValue = studentName.value.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (nameValue === "") {
        showError(studentName, "Student name is required.");
        isValid = false;
    } else if (nameValue.length < 3) {
        showError(studentName, "Name must be at least 3 characters.");
        isValid = false;
    } else if (nameValue.length > 40) {
        showError(studentName, "Name cannot exceed 40 characters.");
        isValid = false;
    } else if (!nameRegex.test(nameValue)) {
        showError(studentName, "Name can contain only letters and spaces.");
        isValid = false;
    }


    // Email
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showError(email, "Email is required.");
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError(email, "Please enter a valid email address.");
        isValid = false;
    }


    // Phone
    const phoneValue = phone.value.trim();
    const phoneRegex = /^\d{10}$/;

    if (phoneValue === "") {
        showError(phone, "Phone number is required.");
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError(phone, "Phone number must contain exactly 10 digits.");
        isValid = false;
    }


    // Date of Birth
    if (dob.value === "") {

        showError(dob, "Date of birth is required.");
        isValid = false;

    } else {

        const selectedDate = new Date(dob.value);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {

            showError(dob, "Future date is not allowed.");
            isValid = false;

        } else {

            // Bonus: minimum age 15
            const ageDate = new Date(selectedDate);
            ageDate.setFullYear(ageDate.getFullYear() + 15);

            if (ageDate > today) {
                showError(dob, "Student must be at least 15 years old.");
                isValid = false;
            }
        }
    }


    // Gender
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        const genderGroup = document.querySelector(
            'input[name="gender"]'
        ).parentElement.parentElement;

        const error = document.createElement("small");

        error.className = "error-message";
        error.textContent = "Please select a gender.";
        error.style.color = "red";

        genderGroup.appendChild(error);

        isValid = false;
    }


    // Course
    const course = document.getElementById("course");

    if (course.value === "") {

        showError(course, "Please select a course.");
        isValid = false;
    }


    // Skills
    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (skills.length === 0) {

        const skillInput = document.querySelector(
            'input[name="skills"]'
        );

        const skillGroup = skillInput.parentElement.parentElement;

        const error = document.createElement("small");

        error.className = "error-message";
        error.textContent = "Please select at least one skill.";
        error.style.color = "red";

        skillGroup.appendChild(error);

        isValid = false;
    }


    // About Student
    const aboutValue = about.value.trim();

    if (aboutValue === "") {

        showError(about, "About student is required.");
        isValid = false;

    } else if (aboutValue.length < 20) {

        showError(
            about,
            "About student must be at least 20 characters."
        );

        isValid = false;

    } else if (aboutValue.length > 200) {

        showError(
            about,
            "About student cannot exceed 200 characters."
        );

        isValid = false;
    }


    // Profile Photo
    if (profilePhoto.files.length === 0) {

        showError(profilePhoto, "Profile photo is required.");
        isValid = false;

    } else {

        const file = profilePhoto.files[0];

        if (!file.type.startsWith("image/")) {

            showError(
                profilePhoto,
                "Only image files are allowed."
            );

            isValid = false;
        }
    }


    // Final result
    if (isValid) {

        alert("Student registration successful!");

        form.reset();

        counter.textContent = "0 / 200";

        clearErrors();
    }
});


// Remove errors while user fixes input
studentName.addEventListener("input", () => removeError(studentName));
email.addEventListener("input", () => removeError(email));
phone.addEventListener("input", () => removeError(phone));
dob.addEventListener("change", () => removeError(dob));
about.addEventListener("input", () => removeError(about));
profilePhoto.addEventListener("change", () => removeError(profilePhoto));

document.getElementById("course").addEventListener("change", function () {
    removeError(this);
});


// Gender error remove
document.querySelectorAll('input[name="gender"]').forEach(input => {
    input.addEventListener("change", function () {
        const error = document
            .querySelector('input[name="gender"]')
            .parentElement
            .parentElement
            .querySelector(".error-message");

        if (error) {
            error.remove();
        }
    });
});


// Skills error remove
document.querySelectorAll('input[name="skills"]').forEach(input => {
    input.addEventListener("change", function () {

        const checkedSkills = document.querySelectorAll(
            'input[name="skills"]:checked'
        );

        if (checkedSkills.length > 0) {

            const skillGroup = input.parentElement.parentElement;
            const error = skillGroup.querySelector(".error-message");

            if (error) {
                error.remove();
            }
        }
    });
});


console.log("Student Application Management System loaded successfully.");