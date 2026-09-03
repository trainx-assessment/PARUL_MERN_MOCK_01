const students = [];

const form = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");

const charCounter = document.getElementById("charCounter");

about.addEventListener("input", function () {

    charCounter.textContent = about.value.length + " / 200";

});


function clearErrors() {

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("dobError").textContent = "";
    document.getElementById("genderError").textContent = "";
    document.getElementById("courseError").textContent = "";
    document.getElementById("skillsError").textContent = "";
    document.getElementById("aboutError").textContent = "";
    document.getElementById("photoError").textContent = "";

}

function validateForm() {

    clearErrors();

    let valid = true;



    const name = studentName.value.trim();

    const namePattern = /^[A-Za-z ]{3,40}$/;

    if (name === "") {

        document.getElementById("nameError").textContent =
            "Student name is required.";

        valid = false;

    }
    else if (!namePattern.test(name)) {

        document.getElementById("nameError").textContent =
            "Name must contain only letters and spaces (3-40 characters).";

        valid = false;

    }

    const emailValue = email.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {

        document.getElementById("emailError").textContent =
            "Email is required.";

        valid = false;

    }
    else if (!emailPattern.test(emailValue)) {

        document.getElementById("emailError").textContent =
            "Enter a valid email address.";

        valid = false;

    }

    const phoneValue = phone.value.trim();

    const phonePattern = /^\d{10}$/;

    if (phoneValue === "") {

        document.getElementById("phoneError").textContent =
            "Phone number is required.";

        valid = false;

    }
    else if (!phonePattern.test(phoneValue)) {

        document.getElementById("phoneError").textContent =
            "Phone number must contain exactly 10 digits.";

        valid = false;

    }



    const dobValue = dob.value;

    if (dobValue === "") {

        document.getElementById("dobError").textContent =
            "Date of birth is required.";

        valid = false;

    }
    else {

        const selectedDate = new Date(dobValue);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {

            document.getElementById("dobError").textContent =
                "Future date of birth is not allowed.";

            valid = false;

        }

        let age =
            today.getFullYear() - selectedDate.getFullYear();

        const monthDifference =
            today.getMonth() - selectedDate.getMonth();


        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < selectedDate.getDate()
            )
        ) {

            age--;

        }


        if (age < 15) {

            document.getElementById("dobError").textContent =
                "Student must be at least 15 years old.";

            valid = false;

        }

    }



    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        document.getElementById("genderError").textContent =
            "Please select a gender.";

        valid = false;

    }


  
    if (course.value === "") {

        document.getElementById("courseError").textContent =
            "Please select a course.";

        valid = false;

    }



    const selectedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (selectedSkills.length === 0) {

        document.getElementById("skillsError").textContent =
            "Please select at least one skill.";

        valid = false;

    }



    const aboutValue = about.value.trim();

    if (aboutValue === "") {

        document.getElementById("aboutError").textContent =
            "About section is required.";

        valid = false;

    }
    else if (aboutValue.length < 20) {

        document.getElementById("aboutError").textContent =
            "About must contain at least 20 characters.";

        valid = false;

    }
    else if (aboutValue.length > 200) {

        document.getElementById("aboutError").textContent =
            "About cannot exceed 200 characters.";

        valid = false;

    }


    if (photo.files.length === 0) {

        document.getElementById("photoError").textContent =
            "Profile photo is required.";

        valid = false;

    }
    else {

        const selectedPhoto = photo.files[0];

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(selectedPhoto.type)) {

            document.getElementById("photoError").textContent =
                "Only JPG, JPEG and PNG images are allowed.";

            valid = false;

        }

    }


    return valid;

}

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {

        return;

    }

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    ).value;

    const checkedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    const skills = [];

    checkedSkills.forEach(function (skill) {

        skills.push(skill.value);

    });

    const photoFile = photo.files[0];

    const student = {

        id: Date.now(),

        name: studentName.value.trim(),

        email: email.value.trim(),

        phone: phone.value.trim(),

        dob: dob.value,

        gender: gender,

        course: course.value,

        skills: skills,

        about: about.value.trim(),

        photo: photoFile.name

    };
    students.push(student);


    console.log(student);

    console.log(students);

    alert("Student registered successfully!");


    form.reset();
    charCounter.textContent = "0 / 200";

});

// DARK MODE

const darkModeButton = document.getElementById("darkModeButton");

darkModeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

});