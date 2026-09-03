// ===================================================
// Student Application Management System - script.js
// Plain Vanilla JavaScript Implementation
// ===================================================

// Task 5: Array to store all student records
let students = [];

// Track if currently editing a student (stores student ID or null)
let editingStudentId = null;

// Temporary holder for the photo data URL when registering/editing
let currentPhotoData = "";

// DOM Elements
const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const studentContainer = document.getElementById("studentContainer");
const noStudentsMsg = document.getElementById("noStudentsMsg");

// Form Inputs
const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("studentEmail");
const phoneInput = document.getElementById("studentPhone");
const dobInput = document.getElementById("studentDob");
const courseSelect = document.getElementById("studentCourse");
const aboutTextarea = document.getElementById("studentAbout");
const charCounter = document.getElementById("charCounter");
const photoInput = document.getElementById("studentPhoto");
const photoPreviewContainer = document.getElementById("photoPreviewContainer");
const photoPreview = document.getElementById("photoPreview");

// Error Spans
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dobError = document.getElementById("dobError");
const genderError = document.getElementById("genderError");
const courseError = document.getElementById("courseError");
const skillsError = document.getElementById("skillsError");
const aboutError = document.getElementById("aboutError");
const photoError = document.getElementById("photoError");

// Search & Filter Inputs
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

// Statistics Elements
const statTotal = document.getElementById("statTotal");
const statWebDev = document.getElementById("statWebDev");
const statUIUX = document.getElementById("statUIUX");
const statPython = document.getElementById("statPython");
const statDataAnalytics = document.getElementById("statDataAnalytics");
const statMern = document.getElementById("statMern");
const statCloud = document.getElementById("statCloud");

// Dark Mode Toggle Button
const themeToggleBtn = document.getElementById("themeToggleBtn");

// ===================================================
// 1. Initialize Application
// ===================================================
document.addEventListener("DOMContentLoaded", function () {
    // Load existing data from LocalStorage if available
    loadStudentsFromStorage();

    // Load saved dark mode preference
    const savedTheme = localStorage.getItem("theme_mode");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleBtn.textContent = "Light Mode";
    }

    // Render initial cards and statistics
    renderStudents();
    updateStatistics();
});

// Load from localStorage to preserve data across page refreshes
function loadStudentsFromStorage() {
    const savedData = localStorage.getItem("students_data");
    if (savedData) {
        try {
            students = JSON.parse(savedData);
        } catch (e) {
            students = [];
        }
    }
}

// Save students array to localStorage
function saveStudentsToStorage() {
    localStorage.setItem("students_data", JSON.stringify(students));
}

// ===================================================
// 2. Form Real-time Events
// ===================================================

// Character counter for About textarea (Task 4)
aboutTextarea.addEventListener("input", function () {
    const currentLength = aboutTextarea.value.length;
    charCounter.textContent = `${currentLength} / 200`;
    if (aboutTextarea.value.trim().length >= 20) {
        clearError(aboutTextarea, aboutError);
    }
});

// Photo selection & preview with FileReader (Task 4)
photoInput.addEventListener("change", function () {
    const file = photoInput.files[0];
    if (file) {
        // Validate image file type
        if (!file.type.startsWith("image/")) {
            showError(photoInput, photoError, "Please select an image file (.jpg, .jpeg, .png)");
            currentPhotoData = "";
            photoPreviewContainer.style.display = "none";
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            currentPhotoData = e.target.result;
            photoPreview.src = currentPhotoData;
            photoPreviewContainer.style.display = "block";
            clearError(photoInput, photoError);
        };
        reader.readAsDataURL(file);
    }
});

// Real-time error removal when user types
nameInput.addEventListener("input", function () {
    if (nameInput.value.trim().length >= 3) {
        clearError(nameInput, nameError);
    }
});

emailInput.addEventListener("input", function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value.trim())) {
        clearError(emailInput, emailError);
    }
});

phoneInput.addEventListener("input", function () {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(phoneInput.value.trim())) {
        clearError(phoneInput, phoneError);
    }
});

dobInput.addEventListener("change", function () {
    if (dobInput.value) {
        clearError(dobInput, dobError);
    }
});

courseSelect.addEventListener("change", function () {
    if (courseSelect.value !== "") {
        clearError(courseSelect, courseError);
    }
});

// ===================================================
// 3. Validation Helper Functions
// ===================================================
function showError(inputElement, errorElement, message) {
    if (inputElement && inputElement.classList) {
        inputElement.classList.add("input-error");
    }
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(inputElement, errorElement) {
    if (inputElement && inputElement.classList) {
        inputElement.classList.remove("input-error");
    }
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function clearAllErrors() {
    const errorSpans = document.querySelectorAll(".error-msg");
    errorSpans.forEach(span => span.textContent = "");

    const errorInputs = document.querySelectorAll(".input-error");
    errorInputs.forEach(input => input.classList.remove("input-error"));
}

// Calculate age from DOB
function calculateAge(dobString) {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// ===================================================
// 4. Form Validation Logic (Task 4)
// ===================================================
function validateForm() {
    let isValid = true;
    clearAllErrors();

    // 1. Student Name Validation
    const nameVal = nameInput.value.trim();
    const nameRegex = /^[A-Za-z\s]+$/;
    if (nameVal === "") {
        showError(nameInput, nameError, "Student Name is required");
        isValid = false;
    } else if (nameVal.length < 3) {
        showError(nameInput, nameError, "Name must be at least 3 characters");
        isValid = false;
    } else if (nameVal.length > 40) {
        showError(nameInput, nameError, "Name must not exceed 40 characters");
        isValid = false;
    } else if (!nameRegex.test(nameVal)) {
        showError(nameInput, nameError, "Only letters and spaces are allowed (no numbers or special characters)");
        isValid = false;
    }

    // 2. Email Validation
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === "") {
        showError(emailInput, emailError, "Email is required");
        isValid = false;
    } else if (!emailRegex.test(emailVal)) {
        showError(emailInput, emailError, "Please enter a valid email address");
        isValid = false;
    }

    // 3. Phone Number Validation
    const phoneVal = phoneInput.value.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneVal === "") {
        showError(phoneInput, phoneError, "Phone Number is required");
        isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
        showError(phoneInput, phoneError, "Phone Number must be exactly 10 digits (numbers only)");
        isValid = false;
    }

    // 4. Date of Birth Validation
    const dobVal = dobInput.value;
    if (!dobVal) {
        showError(dobInput, dobError, "Date of Birth is required");
        isValid = false;
    } else {
        const selectedDate = new Date(dobVal);
        const today = new Date();
        // Remove time component for comparison
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError(dobInput, dobError, "Future dates are not accepted");
            isValid = false;
        } else {
            // Bonus validation: Age at least 15 years
            const age = calculateAge(dobVal);
            if (age < 15) {
                showError(dobInput, dobError, "Student must be at least 15 years old");
                isValid = false;
            }
        }
    }

    // 5. Gender Validation
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
        genderError.textContent = "Please select a gender";
        isValid = false;
    }

    // 6. Course Validation
    const courseVal = courseSelect.value;
    if (!courseVal || courseVal === "") {
        showError(courseSelect, courseError, "Please select a course");
        isValid = false;
    }

    // 7. Skills Validation
    const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
    if (selectedSkills.length === 0) {
        skillsError.textContent = "Please select at least one skill";
        isValid = false;
    }

    // 8. About Student Validation
    const aboutVal = aboutTextarea.value;
    if (aboutVal.trim() === "") {
        showError(aboutTextarea, aboutError, "About Student is required (cannot be empty or spaces only)");
        isValid = false;
    } else if (aboutVal.trim().length < 20) {
        showError(aboutTextarea, aboutError, "About Student must have at least 20 characters");
        isValid = false;
    } else if (aboutVal.length > 200) {
        showError(aboutTextarea, aboutError, "About Student must not exceed 200 characters");
        isValid = false;
    }

    // 9. Profile Photo Validation
    if (!currentPhotoData) {
        showError(photoInput, photoError, "Profile photo is required");
        isValid = false;
    }

    return isValid;
}

// ===================================================
// 5. Form Submission (Task 4, 5, 9)
// ===================================================
studentForm.addEventListener("submit", function (event) {
    // 1. Prevent default form submission
    event.preventDefault();

    // 2 & 3. Validate form
    if (!validateForm()) {
        return;
    }

    // Read form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const course = courseSelect.value;

    const skills = [];
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
    skillCheckboxes.forEach(cb => skills.push(cb.value));

    const about = aboutTextarea.value.trim();
    const photo = currentPhotoData;

    // Check if we are updating an existing student (Task 9)
    if (editingStudentId !== null) {
        const studentIndex = students.findIndex(s => s.id === editingStudentId);
        if (studentIndex !== -1) {
            // Update existing object in array
            students[studentIndex].name = name;
            students[studentIndex].email = email;
            students[studentIndex].phone = phone;
            students[studentIndex].dob = dob;
            students[studentIndex].gender = gender;
            students[studentIndex].course = course;
            students[studentIndex].skills = skills;
            students[studentIndex].about = about;
            students[studentIndex].photo = photo;
        }
        editingStudentId = null;
        submitBtn.textContent = "Register Student";
    } else {
        // Create new student object (Task 5)
        const newStudent = {
            id: Date.now(), // Unique ID
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            course: course,
            skills: skills,
            about: about,
            photo: photo
        };
        students.push(newStudent);
    }

    // Save, update stats, re-render, and reset form
    saveStudentsToStorage();
    renderStudents();
    updateStatistics();
    resetForm();
});

// ===================================================
// 6. Dynamic Student Cards Generation (Task 6)
// Using document.createElement, appendChild, classList, textContent
// ===================================================
function renderStudents() {
    // Clear container
    studentContainer.innerHTML = "";

    // Apply Search & Filter (Task 10 & 11)
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    const filteredStudents = students.filter(student => {
        const matchesName = student.name.toLowerCase().includes(searchTerm);
        const matchesCourse = (selectedCourse === "All Courses" || student.course === selectedCourse);
        return matchesName && matchesCourse;
    });

    // If no matching students, show "No students found"
    if (filteredStudents.length === 0) {
        noStudentsMsg.style.display = "block";
        return;
    } else {
        noStudentsMsg.style.display = "none";
    }

    // Generate cards using pure DOM methods
    filteredStudents.forEach(student => {
        // 1. Card Container
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        // 2. Card Header (Photo + Name + Course badge)
        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        const photoImg = document.createElement("img");
        photoImg.classList.add("card-photo");
        photoImg.setAttribute("src", student.photo || "https://via.placeholder.com/80");
        photoImg.setAttribute("alt", student.name);

        const titleGroup = document.createElement("div");
        titleGroup.classList.add("card-title-group");

        const nameHeading = document.createElement("h3");
        nameHeading.textContent = student.name;

        const courseBadge = document.createElement("span");
        courseBadge.classList.add("card-course-badge");
        courseBadge.textContent = student.course;

        titleGroup.appendChild(nameHeading);
        titleGroup.appendChild(courseBadge);

        cardHeader.appendChild(photoImg);
        cardHeader.appendChild(titleGroup);

        // 3. Card Details
        const cardDetails = document.createElement("div");
        cardDetails.classList.add("card-details");

        const emailPara = document.createElement("p");
        const emailBold = document.createElement("strong");
        emailBold.textContent = "Email: ";
        emailPara.appendChild(emailBold);
        emailPara.append(student.email);

        const phonePara = document.createElement("p");
        const phoneBold = document.createElement("strong");
        phoneBold.textContent = "Phone: ";
        phonePara.appendChild(phoneBold);
        phonePara.append(student.phone);

        const dobPara = document.createElement("p");
        const dobBold = document.createElement("strong");
        dobBold.textContent = "DOB: ";
        dobPara.appendChild(dobBold);
        dobPara.append(student.dob);

        const genderPara = document.createElement("p");
        const genderBold = document.createElement("strong");
        genderBold.textContent = "Gender: ";
        genderPara.appendChild(genderBold);
        genderPara.append(student.gender);

        const skillsLabelPara = document.createElement("p");
        const skillsBold = document.createElement("strong");
        skillsBold.textContent = "Skills: ";
        skillsLabelPara.appendChild(skillsBold);

        const skillsList = document.createElement("div");
        skillsList.classList.add("skills-list");
        student.skills.forEach(skill => {
            const skillTag = document.createElement("span");
            skillTag.classList.add("skill-tag");
            skillTag.textContent = skill;
            skillsList.appendChild(skillTag);
        });

        const aboutLabelPara = document.createElement("p");
        const aboutBold = document.createElement("strong");
        aboutBold.textContent = "About: ";
        aboutLabelPara.appendChild(aboutBold);

        const aboutTextDiv = document.createElement("div");
        aboutTextDiv.classList.add("card-about");
        aboutTextDiv.textContent = student.about;

        // Append all detail fields
        cardDetails.appendChild(emailPara);
        cardDetails.appendChild(phonePara);
        cardDetails.appendChild(dobPara);
        cardDetails.appendChild(genderPara);
        cardDetails.appendChild(skillsLabelPara);
        cardDetails.appendChild(skillsList);
        cardDetails.appendChild(aboutLabelPara);
        cardDetails.appendChild(aboutTextDiv);

        // 4. Card Actions (Edit & Delete buttons)
        const cardActions = document.createElement("div");
        cardActions.classList.add("card-actions");

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";

        cardActions.appendChild(editBtn);
        cardActions.appendChild(deleteBtn);

        // 5. Assemble Card
        card.appendChild(cardHeader);
        card.appendChild(cardDetails);
        card.appendChild(cardActions);

        // 6. Append Card to Container
        studentContainer.appendChild(card);
    });
}

// ===================================================
// 7. Student Statistics (Task 7)
// Automatically updates Total and Course-wise counts
// ===================================================
function updateStatistics() {
    statTotal.textContent = students.length;

    let webDevCount = 0;
    let uiuxCount = 0;
    let pythonCount = 0;
    let dataAnalyticsCount = 0;
    let mernCount = 0;
    let cloudCount = 0;

    students.forEach(student => {
        switch (student.course) {
            case "Web Development":
                webDevCount++;
                break;
            case "UI/UX":
                uiuxCount++;
                break;
            case "Python":
                pythonCount++;
                break;
            case "Data Analytics":
                dataAnalyticsCount++;
                break;
            case "MERN Stack":
                mernCount++;
                break;
            case "Cloud Computing":
                cloudCount++;
                break;
        }
    });

    statWebDev.textContent = webDevCount;
    statUIUX.textContent = uiuxCount;
    statPython.textContent = pythonCount;
    statDataAnalytics.textContent = dataAnalyticsCount;
    statMern.textContent = mernCount;
    statCloud.textContent = cloudCount;
}

// ===================================================
// 8. Event Delegation for Delete & Edit (Task 8 & 9)
// Single click listener on studentContainer
// ===================================================
studentContainer.addEventListener("click", function (event) {
    // Check if clicked element is Delete button (Task 8)
    if (event.target.classList.contains("delete-btn")) {
        // Use closest to locate related student card
        const card = event.target.closest(".student-card");
        if (!card) return;

        // Read student data-id
        const studentId = Number(card.getAttribute("data-id"));

        // Confirm before deleting
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            // Remove student from array
            students = students.filter(s => s.id !== studentId);

            // Save to storage
            saveStudentsToStorage();

            // Re-render and update statistics
            renderStudents();
            updateStatistics();

            // If we were editing this student, cancel editing
            if (editingStudentId === studentId) {
                resetForm();
            }
        }
    }

    // Check if clicked element is Edit button (Task 9)
    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.closest(".student-card");
        if (!card) return;

        const studentId = Number(card.getAttribute("data-id"));
        const studentToEdit = students.find(s => s.id === studentId);

        if (studentToEdit) {
            populateFormForEdit(studentToEdit);
        }
    }
});

// Populate Form for Editing (Task 9)
function populateFormForEdit(student) {
    editingStudentId = student.id;

    // Fill form fields
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseSelect.value = student.course;
    aboutTextarea.value = student.about;
    charCounter.textContent = `${student.about.length} / 200`;

    // Fill gender radio
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    genderRadios.forEach(radio => {
        radio.checked = (radio.value === student.gender);
    });

    // Fill skills checkboxes
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
    skillCheckboxes.forEach(cb => {
        cb.checked = student.skills.includes(cb.value);
    });

    // Retain and show current photo
    currentPhotoData = student.photo;
    if (currentPhotoData) {
        photoPreview.src = currentPhotoData;
        photoPreviewContainer.style.display = "block";
    }

    // Change button text to "Update Student"
    submitBtn.textContent = "Update Student";

    // Clear any previous errors
    clearAllErrors();

    // Scroll to form smoothly
    studentForm.scrollIntoView({ behavior: "smooth" });
}

// ===================================================
// 9. Search & Filter (Task 10 & 11)
// Work together seamlessly
// ===================================================
searchInput.addEventListener("input", function () {
    renderStudents();
});

courseFilter.addEventListener("change", function () {
    renderStudents();
});

// ===================================================
// 10. Form Reset (Task 12)
// Clears all inputs, errors, counter, and cancels edit mode
// ===================================================
function resetForm() {
    studentForm.reset();
    currentPhotoData = "";
    photoPreviewContainer.style.display = "none";
    photoPreview.src = "";
    charCounter.textContent = "0 / 200";
    clearAllErrors();

    // Reset edit state
    editingStudentId = null;
    submitBtn.textContent = "Register Student";
}

// Reset button click event
resetBtn.addEventListener("click", function () {
    resetForm();
});

// ===================================================
// 11. Bonus Task: Dark Mode Toggle
// ===================================================
themeToggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "Light Mode";
        localStorage.setItem("theme_mode", "dark");
    } else {
        themeToggleBtn.textContent = "Dark Mode";
        localStorage.setItem("theme_mode", "light");
    }
});
