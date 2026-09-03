const students = [];

const form = document.querySelector("#studentForm");

const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const photo = document.querySelector("#photo");

const charCount = document.querySelector("#charCount");


const mode = document.querySelector("#mode");

let isDark = false;

let body = document.querySelector("body");

const bacGroColor = () => {

    if (!isDark) {

        body.classList.remove("white-mode");
        body.classList.add("dark-mode");

        isDark = true;

    } else {

        body.classList.remove("dark-mode");
        body.classList.add("white-mode");

        isDark = false;
    }

};

mode.addEventListener("click", bacGroColor);


/* Character Counter */

about.addEventListener("input", function () {

    charCount.textContent = about.value.length + " / 200";

});


/* Form Submit */

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Remove old error messages

    const oldErrors = document.querySelectorAll(".error");

    oldErrors.forEach(function (error) {
        error.remove();
    });


    let isValid = true;


    /* Student Name */

    let name = studentName.value.trim();

    if (name === "") {

        showError(studentName, "Student name is required");
        isValid = false;

    }
    else if (name.length < 3) {

        showError(studentName, "Name must be at least 3 characters");
        isValid = false;

    }
    else if (name.length > 40) {

        showError(studentName, "Name cannot be more than 40 characters");
        isValid = false;

    }
    else if (!/^[A-Za-z ]+$/.test(name)) {

        showError(studentName, "Only letters and spaces are allowed");
        isValid = false;

    }


    /* Email */

    let emailValue = email.value.trim();

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {

        showError(email, "Email is required");
        isValid = false;

    }
    else if (!emailPattern.test(emailValue)) {

        showError(email, "Enter a valid email address");
        isValid = false;

    }


    /* Phone */

    let phoneValue = phone.value.trim();

    if (phoneValue === "") {

        showError(phone, "Phone number is required");
        isValid = false;

    }
    else if (!/^[0-9]{10}$/.test(phoneValue)) {

        showError(phone, "Phone number must contain exactly 10 digits");
        isValid = false;

    }


    /* Date of Birth */

    let dobValue = dob.value;

    if (dobValue === "") {

        showError(dob, "Date of birth is required");
        isValid = false;

    }
    else {

        let birthDate = new Date(dobValue);
        let today = new Date();

        if (birthDate > today) {

            showError(dob, "Future date is not allowed");
            isValid = false;

        }

        let age = today.getFullYear() - birthDate.getFullYear();

        let month = today.getMonth() - birthDate.getMonth();

        if (
            month < 0 ||
            (month === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (age < 15) {

            showError(dob, "Student must be at least 15 years old");
            isValid = false;

        }
        
    }


    /* Gender */

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        showError(
            document.querySelector(".radio-group"),
            "Please select a gender"
        );

        isValid = false;
    }


    /* Course */

    if (course.value === "") {

        showError(course, "Please select a course");
        isValid = false;

    }


    /* Skills */

    let skillList = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (skillList.length === 0) {

        showError(
            document.querySelector(".skills"),
            "Please select at least one skill"
        );

        isValid = false;
    }


    /* About Student */

    let aboutValue = about.value.trim();

    if (aboutValue === "") {

        showError(about, "About student is required");
        isValid = false;

    }
    else if (aboutValue.length < 20) {

        showError(
            about,
            "About student must be at least 20 characters"
        );

        isValid = false;

    }
    else if (aboutValue.length > 200) {

        showError(
            about,
            "About student cannot be more than 200 characters"
        );

        isValid = false;

    }


    /* Profile Photo */

    if (photo.files.length === 0) {

        showError(photo, "Profile photo is required");
        isValid = false;

    }
    else {

        let file = photo.files[0];

        let allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {

            showError(
                photo,
                "Only JPG, JPEG and PNG images are allowed"
            );

            isValid = false;
        }
    }


    /* Store Student */

    if (isValid) {

        let skills = [];

        skillList.forEach(function (skill) {

            skills.push(skill.value);

        });


        let student = {

            id: students.length + 1,
            name: name,
            email: emailValue,
            phone: phoneValue,
            dob: dobValue,
            gender: gender.value,
            course: course.value,
            skills: skills,
            about: aboutValue,
            photo: photo.files[0].name

        };


        students.push(student);

        console.log(students);

        alert("Student registered successfully!");

        form.reset();

        charCount.textContent = "0 / 200";

    }

});


/* Error Message Function */

function showError(element, message) {

    let error = document.createElement("span");

    error.className = "error";

    error.textContent = message;

    error.style.color = "red";
    error.style.fontSize = "13px";
    error.style.marginTop = "5px";

    element.parentElement.appendChild(error);

}