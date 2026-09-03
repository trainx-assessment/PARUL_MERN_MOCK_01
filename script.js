const form = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profilePhoto");

const characterCount = document.getElementById("characterCount");


const students = [];
let nextStudentId = 1;



// ================================
// ERROR FUNCTIONS
// ================================

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearError(id) {
    document.getElementById(id).textContent = "";
}


// ================================
// ABOUT CHARACTER COUNTER
// ================================

about.addEventListener("input", function () {
    characterCount.textContent = `${about.value.length} / 200`;

    if (about.value.trim().length >= 20) {
        clearError("aboutError");
    }
});


// ================================
// STUDENT NAME
// ================================

studentName.addEventListener("input", function () {

    const name = studentName.value.trim();

    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "") {
        showError("nameError", "Student name is required.");
    }
    else if (name.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.");
    }
    else if (name.length > 40) {
        showError("nameError", "Name cannot exceed 40 characters.");
    }
    else if (!nameRegex.test(name)) {
        showError("nameError", "Name can contain only letters and spaces.");
    }
    else {
        clearError("nameError");
    }
});


// ================================
// EMAIL
// ================================

email.addEventListener("input", function () {

    const emailValue = email.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showError("emailError", "Email is required.");
    }
    else if (!emailRegex.test(emailValue)) {
        showError("emailError", "Enter a valid email address.");
    }
    else {
        clearError("emailError");
    }
});


// ================================
// PHONE
// ================================

phone.addEventListener("input", function () {

    const phoneValue = phone.value.trim();

    const phoneRegex = /^\d{10}$/;

    if (phoneValue === "") {
        showError("phoneError", "Phone number is required.");
    }
    else if (!phoneRegex.test(phoneValue)) {
        showError("phoneError", "Phone number must contain exactly 10 digits.");
    }
    else {
        clearError("phoneError");
    }
});


dob.addEventListener("change", function () {

    const selectedDate = new Date(dob.value);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (!dob.value) {
        showError("dobError", "Date of birth is required.");
        return;
    }

    if (selectedDate > today) {
        showError("dobError", "Future dates are not allowed.");
        return;
    }

    let age = today.getFullYear() - selectedDate.getFullYear();

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
        showError("dobError", "Student must be at least 15 years old.");
    }
    else {
        clearError("dobError");
    }
});



const genderInputs = document.querySelectorAll(
    'input[name="gender"]'
);

genderInputs.forEach(function (gender) {

    gender.addEventListener("change", function () {
        clearError("genderError");
    });

});



course.addEventListener("change", function () {

    if (course.value === "") {
        showError("courseError", "Please select a course.");
    }
    else {
        clearError("courseError");
    }

});



const skillInputs = document.querySelectorAll(
    'input[name="skills"]'
);

skillInputs.forEach(function (skill) {

    skill.addEventListener("change", function () {

        const selectedSkills =
            document.querySelectorAll(
                'input[name="skills"]:checked'
            );

        if (selectedSkills.length > 0) {
            clearError("skillsError");
        }

    });

});




about.addEventListener("blur", function () {

    const aboutValue = about.value.trim();

    if (aboutValue === "") {
        showError("aboutError", "About student is required.");
    }
    else if (aboutValue.length < 20) {
        showError(
            "aboutError",
            "About student must contain at least 20 characters."
        );
    }
    else if (aboutValue.length > 200) {
        showError(
            "aboutError",
            "About student cannot exceed 200 characters."
        );
    }
    else {
        clearError("aboutError");
    }

});



profilePhoto.addEventListener("change", function () {

    const file = profilePhoto.files[0];

    if (!file) {
        showError("photoError", "Profile photo is required.");
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png"
    ];

    if (!allowedTypes.includes(file.type)) {
        showError(
            "photoError",
            "Only JPG, JPEG and PNG images are allowed."
        );
    }
    else {
        clearError("photoError");
    }

});


form.addEventListener("submit", function (event) {

    event.preventDefault();

    let isValid = true;

    const name = studentName.value.trim();
    const nameRegex = /^[A-Za-z ]+$/;

    if (name === "") {
        showError("nameError", "Student name is required.");
        isValid = false;
    }
    else if (name.length < 3) {
        showError(
            "nameError",
            "Name must contain at least 3 characters."
        );
        isValid = false;
    }
    else if (name.length > 40) {
        showError(
            "nameError",
            "Name cannot exceed 40 characters."
        );
        isValid = false;
    }
    else if (!nameRegex.test(name)) {
        showError(
            "nameError",
            "Name can contain only letters and spaces."
        );
        isValid = false;
    }
    else {
        clearError("nameError");
    }



    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
        showError("emailError", "Email is required.");
        isValid = false;
    }
    else if (!emailRegex.test(emailValue)) {
        showError(
            "emailError",
            "Enter a valid email address."
        );
        isValid = false;
    }
    else {
        clearError("emailError");
    }



    const phoneValue = phone.value.trim();
    const phoneRegex = /^\d{10}$/;

    if (phoneValue === "") {
        showError("phoneError", "Phone number is required.");
        isValid = false;
    }
    else if (!phoneRegex.test(phoneValue)) {
        showError(
            "phoneError",
            "Phone number must contain exactly 10 digits."
        );
        isValid = false;
    }
    else {
        clearError("phoneError");
    }


    if (!dob.value) {

        showError(
            "dobError",
            "Date of birth is required."
        );

        isValid = false;

    }
    else {

        const selectedDate = new Date(dob.value);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {

            showError(
                "dobError",
                "Future dates are not allowed."
            );

            isValid = false;

        }
        else {

            let age =
                today.getFullYear() -
                selectedDate.getFullYear();

            const monthDifference =
                today.getMonth() -
                selectedDate.getMonth();

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

                showError(
                    "dobError",
                    "Student must be at least 15 years old."
                );

                isValid = false;

            }
            else {
                clearError("dobError");
            }
        }
    }


    const selectedGender =
        document.querySelector(
            'input[name="gender"]:checked'
        );

    if (!selectedGender) {

        showError(
            "genderError",
            "Please select a gender."
        );

        isValid = false;

    }
    else {
        clearError("genderError");
    }


    if (course.value === "") {

        showError(
            "courseError",
            "Please select a course."
        );

        isValid = false;

    }
    else {
        clearError("courseError");
    }



    const selectedSkills =
        document.querySelectorAll(
            'input[name="skills"]:checked'
        );

    if (selectedSkills.length === 0) {

        showError(
            "skillsError",
            "Please select at least one skill."
        );

        isValid = false;

    }
    else {
        clearError("skillsError");
    }



    const aboutValue = about.value.trim();

    if (aboutValue === "") {

        showError(
            "aboutError",
            "About student is required."
        );

        isValid = false;

    }
    else if (aboutValue.length < 20) {

        showError(
            "aboutError",
            "About student must contain at least 20 characters."
        );

        isValid = false;

    }
    else if (aboutValue.length > 200) {

        showError(
            "aboutError",
            "About student cannot exceed 200 characters."
        );

        isValid = false;

    }
    else {
        clearError("aboutError");
    }


    const file = profilePhoto.files[0];

    if (!file) {

        showError(
            "photoError",
            "Profile photo is required."
        );

        isValid = false;

    }
    else {

        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {

            showError(
                "photoError",
                "Only JPG, JPEG and PNG images are allowed."
            );

            isValid = false;

        }
        else {
            clearError("photoError");
        }
    }

    if (isValid) {

    alert("Student registered successfully!");

    form.reset();

    characterCount.textContent = "0 / 200";
}

});


if (isValid) {

    // Get selected gender
    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        ).value;


    // Get selected skills
    const skills = [];

    document
        .querySelectorAll('input[name="skills"]:checked')
        .forEach(function (skill) {
            skills.push(skill.value);
        });


    // Create student object
    const student = {

        id: nextStudentId++,

        name: studentName.value.trim(),

        email: email.value.trim(),

        phone: phone.value.trim(),

        dob: dob.value,

        gender: gender,

        course: course.options[course.selectedIndex].text,

        skills: skills,

        about: about.value.trim(),

        photo: profilePhoto.files[0].name
    };


    // Store student in array
    students.push(student);


    console.log("Student Added:");
    console.log(student);

    console.log("All Students:");
    console.log(students);


    alert("Student registered successfully!");


    // Reset form
    form.reset();

    characterCount.textContent = "0 / 200";
}
