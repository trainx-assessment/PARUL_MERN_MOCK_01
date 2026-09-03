const students = [];

const form = document.querySelector("#studentForm");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");

function showError(field, message) {
    document.querySelector(`#${field}Error`).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
    });
}

function updateCharacterCount() {
    document.querySelector("#characterCount").textContent = `${aboutInput.value.length} / 200`;
}

function validateForm() {
    const name = document.querySelector("#studentName").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const dob = document.querySelector("#dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const course = document.querySelector("#course").value;
    const skills = document.querySelectorAll('input[name="skills"]:checked');
    const about = aboutInput.value.trim();
    const photo = photoInput.files[0];
    let isValid = true;

    clearErrors();

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        showError("studentName", "Enter 3-40 letters and spaces only.");
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("email", "Enter a valid email address.");
        isValid = false;
    }

    if (!/^\d{10}$/.test(phone)) {
        showError("phone", "Phone number must contain exactly 10 digits.");
        isValid = false;
    }

    if (!dob) {
        showError("dob", "Date of birth is required.");
        isValid = false;
    } else if (new Date(dob) > new Date()) {
        showError("dob", "Future dates are not allowed.");
        isValid = false;
    }

    if (!gender) {
        showError("gender", "Select a gender.");
        isValid = false;
    }

    if (!course) {
        showError("course", "Select a course.");
        isValid = false;
    }

    if (skills.length === 0) {
        showError("skills", "Select at least one skill.");
        isValid = false;
    }

    if (about.length < 20 || about.length > 200) {
        showError("about", "About Student must be between 20 and 200 characters.");
        isValid = false;
    }

    if (!photo || !["image/jpeg", "image/png"].includes(photo.type)) {
        showError("photo", "Upload a JPG, JPEG, or PNG image.");
        isValid = false;
    }

    return isValid;
}

function resetForm() {
    form.reset();
    clearErrors();
    updateCharacterCount();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const student = {
        id: Date.now(),
        name: document.querySelector("#studentName").value.trim(),
        email: document.querySelector("#email").value.trim(),
        phone: document.querySelector("#phone").value.trim(),
        dob: document.querySelector("#dob").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        course: document.querySelector("#course").value,
        skills: [...document.querySelectorAll('input[name="skills"]:checked')].map((skill) => skill.value),
        about: aboutInput.value.trim(),
        photo: photoInput.files[0].name
    };

    students.push(student);
    resetForm();
});

aboutInput.addEventListener("input", updateCharacterCount);
document.querySelector("#resetButton").addEventListener("click", resetForm);

updateCharacterCount();
