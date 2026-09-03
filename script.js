const form = document.querySelector("form");
form.setAttribute("novalidate", "true");

const students = [];
let nextId = 1;
let editId = null;
let editCard = null;

const submitBtn = form.querySelector('button[type="submit"]');
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone-number");
const dobInput = document.getElementById("dob");
const courseSelect = document.getElementById("course");
const aboutTextarea = document.getElementById("about");
const pfpInput = document.getElementById("pfp");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

const nameField = document.querySelector(".name-field");
const emailField = document.querySelector(".email-field");
const phoneField = document.querySelector(".phonenumber-field");
const dobField = document.querySelector(".dateofbirth-field");
const genderField = document.querySelector(".gender-field");
const courseField = document.querySelector(".course-field");
const skillField = document.querySelector(".skill-field");
const aboutField = document.querySelector(".about-field");
const profileField = document.querySelector(".profile-field");

const genderRadios = document.querySelectorAll('input[name="gender"]');
const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
const studentCardsContainer = document.getElementById("studentCardsContainer");
const statsSection = document.getElementById("statsSection");

const charCounter = document.getElementById("char-counter");

aboutTextarea.addEventListener("input", function () {
    if (charCounter) {
        charCounter.textContent = aboutTextarea.value.length + " / 200";
    }
    if (aboutField.querySelector(".error-message")) {
        validateAbout();
    }
});

function showError(container, message) {
    clearError(container);
    const error = document.createElement("span");
    error.className = "error-message";
    error.style.color = "red";
    error.style.fontSize = "12px";
    error.style.display = "block";
    error.style.marginTop = "4px";
    error.textContent = message;
    container.appendChild(error);
}

function clearError(container) {
    const error = container.querySelector(".error-message");
    if (error) {
        error.remove();
    }
}

function validateName() {
    const value = nameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    if (value === "") {
        showError(nameField, "Student name is required");
        return false;
    }
    if (value.length < 3) {
        showError(nameField, "Student name must be at least 3 characters");
        return false;
    }
    if (value.length > 40) {
        showError(nameField, "Student name must not exceed 40 characters");
        return false;
    }
    if (!nameRegex.test(value)) {
        showError(nameField, "Student name can only contain letters and spaces");
        return false;
    }
    clearError(nameField);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value === "") {
        showError(emailField, "Email is required");
        return false;
    }
    if (!emailRegex.test(value)) {
        showError(emailField, "Please enter a valid email address");
        return false;
    }
    clearError(emailField);
    return true;
}

function validatePhone() {
    const value = phoneInput.value.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (value === "") {
        showError(phoneField, "Phone number is required");
        return false;
    }
    if (!phoneRegex.test(value)) {
        showError(phoneField, "Phone number must be exactly 10 digits");
        return false;
    }
    clearError(phoneField);
    return true;
}

function validateDob() {
    const value = dobInput.value;
    if (!value) {
        showError(dobField, "Date of birth is required");
        return false;
    }
    const dobDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) {
        showError(dobField, "Future dates are not accepted");
        return false;
    }
    const age = today.getFullYear() - dobDate.getFullYear();
    if (age < 15) {
        showError(dobField, "Student must be at least 15 years old");
        return false;
    }
    clearError(dobField);
    return true;
}

function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    if (!selected) {
        showError(genderField, "Please select a gender");
        return false;
    }
    clearError(genderField);
    return true;
}

function validateCourse() {
    const value = courseSelect.value;
    if (!value || value === "select-course") {
        showError(courseField, "Please select a course");
        return false;
    }
    clearError(courseField);
    return true;
}

function validateSkills() {
    const selected = document.querySelectorAll('input[name="skills"]:checked');
    if (selected.length === 0) {
        showError(skillField, "Please select at least one skill");
        return false;
    }
    clearError(skillField);
    return true;
}

function validateAbout() {
    const value = aboutTextarea.value.trim();
    if (value === "") {
        showError(aboutField, "About student is required and cannot be empty spaces");
        return false;
    }
    if (value.length < 20) {
        showError(aboutField, "About student must be at least 20 characters");
        return false;
    }
    if (value.length > 200) {
        showError(aboutField, "About student must not exceed 200 characters");
        return false;
    }
    clearError(aboutField);
    return true;
}

function validatePhoto() {
    const files = pfpInput.files;
    if (editId !== null && files.length === 0) {
        clearError(profileField);
        return true;
    }
    if (files.length === 0) {
        showError(profileField, "Profile photo is required");
        return false;
    }
    const fileName = files[0].name.toLowerCase();
    if (!fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg") && !fileName.endsWith(".png")) {
        showError(profileField, "Only image files (.jpg, .jpeg, .png) are accepted");
        return false;
    }
    clearError(profileField);
    return true;
}

function resetForm() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    dobInput.value = "";
    for (let i = 0; i < genderRadios.length; i++) {
        genderRadios[i].checked = false;
    }
    courseSelect.value = "select-course";
    for (let i = 0; i < skillCheckboxes.length; i++) {
        skillCheckboxes[i].checked = false;
    }
    aboutTextarea.value = "";
    pfpInput.value = "";
    if (charCounter) {
        charCounter.textContent = "0 / 200";
    }
    const errorMessages = document.querySelectorAll(".error-message");
    for (let i = 0; i < errorMessages.length; i++) {
        errorMessages[i].remove();
    }
    editId = null;
    editCard = null;
    submitBtn.textContent = "Register Student";
}

function updateStats() {
    let total = students.length;
    let webDev = 0;
    let uiux = 0;
    let python = 0;
    let dataAnalytics = 0;
    let mernStack = 0;
    let cloudComputing = 0;

    for (let i = 0; i < students.length; i++) {
        const c = students[i].course;
        if (c === "Web Development") webDev++;
        else if (c === "UI/UX") uiux++;
        else if (c === "Python") python++;
        else if (c === "Data Analytics") dataAnalytics++;
        else if (c === "MERN Stack") mernStack++;
        else if (c === "Cloud Computing") cloudComputing++;
    }

    if (statsSection) {
        statsSection.innerHTML = `
            <h2>Student Statistics</h2>
            <p>Total Students: ${total}</p>
            <p>Web Development: ${webDev}</p>
            <p>UI/UX: ${uiux}</p>
            <p>Python: ${python}</p>
            <p>Data Analytics: ${dataAnalytics}</p>
            <p>MERN Stack: ${mernStack}</p>
            <p>Cloud Computing: ${cloudComputing}</p>
        `;
    }
}

function filterStudents() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedCourse = courseFilter ? courseFilter.value : "All Courses";
    const cards = studentCardsContainer.querySelectorAll(".student-card");
    let matchCount = 0;

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const studentId = parseInt(card.getAttribute("data-id"));
        let student = null;

        for (let j = 0; j < students.length; j++) {
            if (students[j].id === studentId) {
                student = students[j];
                break;
            }
        }

        if (student) {
            const matchesName = student.name.toLowerCase().includes(query);
            const matchesCourse = (selectedCourse === "All Courses" || student.course === selectedCourse);

            if (matchesName && matchesCourse) {
                card.style.display = "";
                matchCount++;
            } else {
                card.style.display = "none";
            }
        }
    }

    let noStudentsMsg = document.getElementById("noStudentsMsg");
    if (matchCount === 0 && (cards.length > 0 || query !== "" || selectedCourse !== "All Courses")) {
        if (!noStudentsMsg) {
            noStudentsMsg = document.createElement("p");
            noStudentsMsg.id = "noStudentsMsg";
            noStudentsMsg.textContent = "No students found";
            studentCardsContainer.appendChild(noStudentsMsg);
        }
    } else if (noStudentsMsg) {
        noStudentsMsg.remove();
    }
}

function renderStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = student.name;
    img.style.width = "100px";
    img.style.height = "100px";

    const name = document.createElement("h3");
    name.textContent = student.name;

    const email = document.createElement("p");
    email.textContent = "Email: " + student.email;

    const phone = document.createElement("p");
    phone.textContent = "Phone: " + student.phone;

    const dob = document.createElement("p");
    dob.textContent = "DOB: " + student.dob;

    const gender = document.createElement("p");
    gender.textContent = "Gender: " + student.gender;

    const course = document.createElement("p");
    course.textContent = "Course: " + student.course;

    const skills = document.createElement("p");
    skills.textContent = "Skills: " + student.skills.join(", ");

    const about = document.createElement("p");
    about.textContent = "About: " + student.about;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(dob);
    card.appendChild(gender);
    card.appendChild(course);
    card.appendChild(skills);
    card.appendChild(about);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);

    studentCardsContainer.appendChild(card);
}

studentCardsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.parentElement;
        const studentId = parseInt(card.getAttribute("data-id"));

        if (!confirm("Are you sure you want to delete this student?")) {
            return;
        }

        for (let i = 0; i < students.length; i++) {
            if (students[i].id === studentId) {
                students.splice(i, 1);
                break;
            }
        }

        card.remove();
        updateStats();
        filterStudents();

        if (editId === studentId) {
            resetForm();
        }
    }

    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.parentElement;
        const studentId = parseInt(card.getAttribute("data-id"));

        let student = null;
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === studentId) {
                student = students[i];
                break;
            }
        }

        if (!student) {
            return;
        }

        editId = studentId;
        editCard = card;

        nameInput.value = student.name;
        emailInput.value = student.email;
        phoneInput.value = student.phone;
        dobInput.value = student.dob;

        for (let i = 0; i < genderRadios.length; i++) {
            genderRadios[i].checked = (genderRadios[i].value === student.gender);
        }

        courseSelect.value = student.course;

        for (let i = 0; i < skillCheckboxes.length; i++) {
            skillCheckboxes[i].checked = student.skills.includes(skillCheckboxes[i].value);
        }

        aboutTextarea.value = student.about;
        if (charCounter) {
            charCounter.textContent = student.about.length + " / 200";
        }

        submitBtn.textContent = "Update Student";

        const errorMessages = document.querySelectorAll(".error-message");
        for (let i = 0; i < errorMessages.length; i++) {
            errorMessages[i].remove();
        }
    }
});

if (searchInput) {
    searchInput.addEventListener("input", filterStudents);
}

if (courseFilter) {
    courseFilter.addEventListener("change", filterStudents);
}

nameInput.addEventListener("input", function () {
    if (nameField.querySelector(".error-message")) {
        validateName();
    }
});

emailInput.addEventListener("input", function () {
    if (emailField.querySelector(".error-message")) {
        validateEmail();
    }
});

phoneInput.addEventListener("input", function () {
    if (phoneField.querySelector(".error-message")) {
        validatePhone();
    }
});

dobInput.addEventListener("input", function () {
    if (dobField.querySelector(".error-message")) {
        validateDob();
    }
});

dobInput.addEventListener("change", function () {
    if (dobField.querySelector(".error-message")) {
        validateDob();
    }
});

for (let i = 0; i < genderRadios.length; i++) {
    genderRadios[i].addEventListener("change", function () {
        if (genderField.querySelector(".error-message")) {
            validateGender();
        }
    });
}

courseSelect.addEventListener("change", function () {
    if (courseField.querySelector(".error-message")) {
        validateCourse();
    }
});

for (let i = 0; i < skillCheckboxes.length; i++) {
    skillCheckboxes[i].addEventListener("change", function () {
        if (skillField.querySelector(".error-message")) {
            validateSkills();
        }
    });
}

pfpInput.addEventListener("change", function () {
    if (profileField.querySelector(".error-message")) {
        validatePhoto();
    }
});

form.addEventListener("reset", function (event) {
    event.preventDefault();
    resetForm();
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();
    const isCourseValid = validateCourse();
    const isSkillsValid = validateSkills();
    const isAboutValid = validateAbout();
    const isPhotoValid = validatePhoto();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isDobValid || !isGenderValid || !isCourseValid || !isSkillsValid || !isAboutValid || !isPhotoValid) {
        return;
    }

    const selectedSkills = [];
    for (let i = 0; i < skillCheckboxes.length; i++) {
        if (skillCheckboxes[i].checked) {
            selectedSkills.push(skillCheckboxes[i].value);
        }
    }

    const selectedGender = document.querySelector('input[name="gender"]:checked').value;

    if (editId !== null) {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === editId) {
                students[i].name = nameInput.value.trim();
                students[i].email = emailInput.value.trim();
                students[i].phone = phoneInput.value.trim();
                students[i].dob = dobInput.value;
                students[i].gender = selectedGender;
                students[i].course = courseSelect.value;
                students[i].skills = selectedSkills;
                students[i].about = aboutTextarea.value.trim();
                if (pfpInput.files.length > 0) {
                    students[i].photo = URL.createObjectURL(pfpInput.files[0]);
                }
                break;
            }
        }

        if (editCard) {
            if (pfpInput.files.length > 0) {
                editCard.querySelector("img").src = URL.createObjectURL(pfpInput.files[0]);
            }
            editCard.querySelector("h3").textContent = nameInput.value.trim();
            const p = editCard.querySelectorAll("p");
            p[0].textContent = "Email: " + emailInput.value.trim();
            p[1].textContent = "Phone: " + phoneInput.value.trim();
            p[2].textContent = "DOB: " + dobInput.value;
            p[3].textContent = "Gender: " + selectedGender;
            p[4].textContent = "Course: " + courseSelect.value;
            p[5].textContent = "Skills: " + selectedSkills.join(", ");
            p[6].textContent = "About: " + aboutTextarea.value.trim();
        }

        updateStats();
        filterStudents();
        resetForm();
    } else {
        const student = {
            id: nextId++,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: selectedGender,
            course: courseSelect.value,
            skills: selectedSkills,
            about: aboutTextarea.value.trim(),
            photo: URL.createObjectURL(pfpInput.files[0])
        };

        students.push(student);
        renderStudentCard(student);
        updateStats();
        filterStudents();
        resetForm();
    }
});

updateStats();
