const form = document.querySelector("form");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const about = document.getElementById("about");
const photo = document.getElementById("profilePhoto");
const course = document.getElementById("course");

const nameRegex = /^[A-Za-z ]+$/;
const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(input, message) {
    let error = input.parentElement.querySelector(".error");

    if (!error) {
        error = document.createElement("small");
        error.className = "error";
        input.parentElement.appendChild(error);
    }

    error.textContent = message;
}

function removeError(input) {
    const error = input.parentElement.querySelector(".error");

    if (error) {
        error.remove();
    }
}

function validateName() {
    const value = studentName.value.trim();

    if (value === "") {
        showError(studentName, "Student name is required");
        return false;
    }

    if (value.length < 3) {
        showError(studentName, "Name must be at least 3 characters");
        return false;
    }

    if (value.length > 40) {
        showError(studentName, "Name must not exceed 40 characters");
        return false;
    }

    if (!nameRegex.test(value)) {
        showError(studentName, "Only letters and spaces are allowed");
        return false;
    }

    removeError(studentName);
    return true;
}

function validateEmail() {
    const value = email.value.trim();

    if (value === "") {
        showError(email, "Email is required");
        return false;
    }

    if (!emailRegex.test(value)) {
        showError(email, "Enter a valid email address");
        return false;
    }

    removeError(email);
    return true;
}

function validatePhone() {
    const value = phone.value.trim();

    if (value === "") {
        showError(phone, "Phone number is required");
        return false;
    }

    if (!phoneRegex.test(value)) {
        showError(phone, "Phone number must contain exactly 10 digits");
        return false;
    }

    removeError(phone);
    return true;
}

function validateDob() {
    const value = dob.value;

    if (value === "") {
        showError(dob, "Date of birth is required");
        return false;
    }

    const birthDate = new Date(value);
    const today = new Date();

    if (birthDate > today) {
        showError(dob, "Future date is not allowed");
        return false;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (
        month < 0 ||
        (month === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 15) {
        showError(dob, "Student must be at least 15 years old");
        return false;
    }

    removeError(dob);
    return true;
}

function validateGender() {
    const genders = document.querySelectorAll('input[name="gender"]');
    const selected = document.querySelector('input[name="gender"]:checked');

    if (!selected) {
        showError(genders[genders.length - 1], "Please select a gender");
        return false;
    }

    genders.forEach(gender => {
        const error = gender.parentElement.querySelector(".error");
        if (error) {
            error.remove();
        }
    });

    return true;
}

function validateCourse() {
    if (course.value === "") {
        showError(course, "Please select a course");
        return false;
    }

    removeError(course);
    return true;
}

function validateSkills() {
    const skills = document.querySelectorAll('input[name="skills"]');
    const selected = document.querySelectorAll('input[name="skills"]:checked');

    if (selected.length === 0) {
        showError(skills[skills.length - 1], "Please select at least one skill");
        return false;
    }

    skills.forEach(skill => {
        const error = skill.parentElement.querySelector(".error");
        if (error) {
            error.remove();
        }
    });

    return true;
}

function validateAbout() {
    const value = about.value.trim();

    if (value === "") {
        showError(about, "About student is required");
        return false;
    }

    if (value.length < 20) {
        showError(about, "Minimum 20 characters required");
        return false;
    }

    if (value.length > 200) {
        showError(about, "Maximum 200 characters allowed");
        return false;
    }

    removeError(about);
    return true;
}

function validatePhoto() {
    if (photo.files.length === 0) {
        showError(photo, "Profile photo is required");
        return false;
    }

    const file = photo.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
        showError(photo, "Only JPG, JPEG and PNG images are allowed");
        return false;
    }

    removeError(photo);
    return true;
}

about.addEventListener("input", function () {
    document.getElementById("aboutCounter").textContent =
        `${about.value.length} / 200`;
});

studentName.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
phone.addEventListener("input", validatePhone);
dob.addEventListener("change", validateDob);
course.addEventListener("change", validateCourse);
about.addEventListener("input", validateAbout);
photo.addEventListener("change", validatePhoto);

document.querySelectorAll('input[name="gender"]').forEach(input => {
    input.addEventListener("change", validateGender);
});

document.querySelectorAll('input[name="skills"]').forEach(input => {
    input.addEventListener("change", validateSkills);
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validDob = validateDob();
    const validGender = validateGender();
    const validCourse = validateCourse();
    const validSkills = validateSkills();
    const validAbout = validateAbout();
    const validPhoto = validatePhoto();

    if (
        validName &&
        validEmail &&
        validPhone &&
        validDob &&
        validGender &&
        validCourse &&
        validSkills &&
        validAbout &&
        validPhoto
    ) {
        alert("Form submitted successfully");
        form.submit();
    }
});