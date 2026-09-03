// Application Constants
const STORAGE_KEY = "studentApplications";
const THEME_KEY = "studentApplicationTheme";

// State Variables
let students = [];
let editingStudentId = null;
let selectedPhotoDataUrl = "";

// DOM Element References
let studentForm, studentName, studentEmail, studentPhone, studentDob;
let genderRadios, studentCourse, skillsCheckboxes, studentAbout, studentPhoto;
let photoPreview, photoPreviewContainer, photoFileName, aboutCounter;
let submitBtn, submitBtnText, resetBtn, editIndicator, studentCardsContainer, emptyState;
let searchInput, courseFilter, darkModeToggle, themeIconContainer, toastNotification;

// Statistics DOM Elements
let statTotal, statWebDev, statUiUx, statPython, statDataAnalytics, statMern, statCloud;

// Initialize Application
document.addEventListener("DOMContentLoaded", function () {
    initDomReferences();
    initTheme();
    loadStudents();
    initEventListeners();
    updateStatistics();
    applyFilters();
});

function initDomReferences() {
    studentForm = document.querySelector("#studentForm");
    studentName = document.querySelector("#studentName");
    studentEmail = document.querySelector("#studentEmail");
    studentPhone = document.querySelector("#studentPhone");
    studentDob = document.querySelector("#studentDob");
    genderRadios = document.querySelectorAll('input[name="gender"]');
    studentCourse = document.querySelector("#studentCourse");
    skillsCheckboxes = document.querySelectorAll('input[name="skills"]');
    studentAbout = document.querySelector("#studentAbout");
    studentPhoto = document.querySelector("#studentPhoto");
    photoPreview = document.querySelector("#photoPreview");
    photoPreviewContainer = document.querySelector("#photoPreviewContainer");
    photoFileName = document.querySelector("#photoFileName");
    aboutCounter = document.querySelector("#aboutCounter");
    submitBtn = document.querySelector("#submitBtn");
    submitBtnText = document.querySelector("#submitBtnText");
    resetBtn = document.querySelector("#resetBtn");
    editIndicator = document.querySelector("#editIndicator");
    studentCardsContainer = document.querySelector("#studentCardsContainer");
    emptyState = document.querySelector("#emptyState");
    searchInput = document.querySelector("#searchInput");
    courseFilter = document.querySelector("#courseFilter");
    darkModeToggle = document.querySelector("#darkModeToggle");
    themeIconContainer = document.querySelector("#themeIconContainer");
    toastNotification = document.querySelector("#toastNotification");

    statTotal = document.querySelector("#statTotal");
    statWebDev = document.querySelector("#statWebDev");
    statUiUx = document.querySelector("#statUiUx");
    statPython = document.querySelector("#statPython");
    statDataAnalytics = document.querySelector("#statDataAnalytics");
    statMern = document.querySelector("#statMern");
    statCloud = document.querySelector("#statCloud");
}

function initEventListeners() {
    studentForm.addEventListener("submit", handleFormSubmit);
    resetBtn.addEventListener("click", resetForm);

    // About character counter
    studentAbout.addEventListener("input", function () {
        const length = studentAbout.value.length;
        aboutCounter.textContent = length;
        if (length > 200) {
            aboutCounter.style.color = "var(--danger)";
        } else {
            aboutCounter.style.color = "var(--muted)";
        }
        if (studentAbout.value.trim().length >= 20 && length <= 200) {
            clearError("aboutError", "studentAbout");
        }
    });

    // Real-time validation clearance
    studentName.addEventListener("input", () => validateName());
    studentEmail.addEventListener("input", () => validateEmail());
    studentPhone.addEventListener("input", () => validatePhone());
    studentDob.addEventListener("change", () => validateDob());
    studentCourse.addEventListener("change", () => validateCourse());
    
    genderRadios.forEach(radio => radio.addEventListener("change", () => validateGender()));
    skillsCheckboxes.forEach(checkbox => checkbox.addEventListener("change", () => validateSkills()));

    studentPhoto.addEventListener("change", handlePhotoChange);
    studentCardsContainer.addEventListener("click", handleContainerClick);

    // Search and filter handlers
    searchInput.addEventListener("input", applyFilters);
    courseFilter.addEventListener("change", applyFilters);

    darkModeToggle.addEventListener("click", toggleDarkMode);
}

// Storage & Persistence
function loadStudents() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            students = JSON.parse(stored);
            if (!Array.isArray(students) || students.length === 0) {
                students = getDemoStudents();
                saveStudents();
            } else {
                // Normalize legacy course names so all students map to statistics categories
                const courseMap = {
                    "Data Science": "Data Analytics",
                    "Cyber Security": "Python"
                };
                let updated = false;
                students.forEach(s => {
                    if (courseMap[s.course]) {
                        s.course = courseMap[s.course];
                        updated = true;
                    }
                });
                if (updated) {
                    saveStudents();
                }
            }
        } else {
            students = getDemoStudents();
            saveStudents();
        }
    } catch (e) {
        console.error("Failed to load students from localStorage", e);
        students = getDemoStudents();
    }
}

function saveStudents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
        console.error("Failed to save students to localStorage", e);
        showToast("Storage error: Image file may be too large.");
    }
}

// Initial Demo Students
function getDemoStudents() {
    return [
        {
            id: 1725345600001,
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "9876543210",
            dob: "2002-05-15",
            gender: "Male",
            course: "Web Development",
            skills: ["HTML", "CSS", "JavaScript", "Git"],
            about: "Passionate about full-stack web development and responsive CSS architectures.",
            photo: createDefaultAvatarSvg("Rahul Sharma", "#2563EB")
        },
        {
            id: 1725345600002,
            name: "Priya Singh",
            email: "priya.singh@example.com",
            phone: "9812345678",
            dob: "2003-08-22",
            gender: "Female",
            course: "UI/UX",
            skills: ["HTML", "CSS", "Git", "React"],
            about: "UI/UX enthusiast focused on accessible user interfaces and modern design systems.",
            photo: createDefaultAvatarSvg("Priya Singh", "#7C3AED")
        },
        {
            id: 1725345600003,
            name: "Amit Kumar",
            email: "amit.kumar@example.com",
            phone: "9988776655",
            dob: "2001-11-10",
            gender: "Male",
            course: "Python",
            skills: ["Git", "Node.js"],
            about: "Python programmer enthusiastic about data structures, algorithms, and backend scripting.",
            photo: createDefaultAvatarSvg("Amit Kumar", "#16A34A")
        },
        {
            id: 1725345600004,
            name: "Neha Patel",
            email: "neha.patel@example.com",
            phone: "9876123456",
            dob: "2002-03-30",
            gender: "Female",
            course: "MERN Stack",
            skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            about: "Full stack MERN developer eager to build scalable modern web applications and APIs.",
            photo: createDefaultAvatarSvg("Neha Patel", "#D97706")
        },
        {
            id: 1725345600005,
            name: "Vikram Reddy",
            email: "vikram.reddy@example.com",
            phone: "9765432109",
            dob: "2000-09-18",
            gender: "Male",
            course: "Data Analytics",
            skills: ["Git", "JavaScript"],
            about: "Data analyst with strong background in visualization, statistical modeling, and insights.",
            photo: createDefaultAvatarSvg("Vikram Reddy", "#DC2626")
        },
        {
            id: 1725345600006,
            name: "Ananya Gupta",
            email: "ananya.gupta@example.com",
            phone: "9654321098",
            dob: "2003-01-14",
            gender: "Female",
            course: "Cloud Computing",
            skills: ["Git", "Node.js", "React"],
            about: "Cloud enthusiast passionate about cloud architecture, microservices, and DevOps pipelines.",
            photo: createDefaultAvatarSvg("Ananya Gupta", "#0891B2")
        }
    ];
}

// Avatar Fallback SVG Generator
function createDefaultAvatarSvg(name, bgHex) {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${bgHex}"/>
        <text x="50%" y="55%" font-size="38" font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Error Message Utilities
function showError(errorId, message, inputId = null) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = message;
    }
    if (inputId) {
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            inputEl.classList.add("input-error");
        }
    }
}

function clearError(errorId, inputId = null) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
        errorEl.textContent = "";
    }
    if (inputId) {
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            inputEl.classList.remove("input-error");
        }
    }
}

function clearAllErrors() {
    const errorEls = document.querySelectorAll(".error-message");
    errorEls.forEach(el => el.textContent = "");
    const inputEls = document.querySelectorAll(".input-error");
    inputEls.forEach(el => el.classList.remove("input-error"));
}

// Field Validators
function validateName() {
    const value = studentName.value.trim();
    if (value === "") {
        showError("nameError", "Student name is required.", "studentName");
        return false;
    }
    if (value.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.", "studentName");
        return false;
    }
    if (value.length > 40) {
        showError("nameError", "Name cannot exceed 40 characters.", "studentName");
        return false;
    }
    // Regex: letters and spaces only
    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(value)) {
        showError("nameError", "Name can contain only letters and spaces.", "studentName");
        return false;
    }
    clearError("nameError", "studentName");
    return true;
}

function validateEmail() {
    const value = studentEmail.value.trim();
    if (value === "") {
        showError("emailError", "Email address is required.", "studentEmail");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError("emailError", "Please enter a valid email address.", "studentEmail");
        return false;
    }
    clearError("emailError", "studentEmail");
    return true;
}

function validatePhone() {
    const value = studentPhone.value.trim();
    if (value === "") {
        showError("phoneError", "Phone number is required.", "studentPhone");
        return false;
    }
    // Regex: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) {
        showError("phoneError", "Phone number must be exactly 10 digits.", "studentPhone");
        return false;
    }
    clearError("phoneError", "studentPhone");
    return true;
}

function validateDob() {
    const value = studentDob.value;
    if (!value) {
        showError("dobError", "Date of Birth is required.", "studentDob");
        return false;
    }
    const dobDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dobDate > today) {
        showError("dobError", "Future dates are not accepted.", "studentDob");
        return false;
    }

    // Age check (at least 15 years old)
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }

    if (age < 15) {
        showError("dobError", "Student must be at least 15 years old.", "studentDob");
        return false;
    }

    clearError("dobError", "studentDob");
    return true;
}

function validateGender() {
    const selected = Array.from(genderRadios).find(radio => radio.checked);
    if (!selected) {
        showError("genderError", "Please select a gender.");
        return false;
    }
    clearError("genderError");
    return true;
}

function validateCourse() {
    const value = studentCourse.value;
    if (!value || value === "" || value === "Select Course") {
        showError("courseError", "Please select a valid course.", "studentCourse");
        return false;
    }
    clearError("courseError", "studentCourse");
    return true;
}

function validateSkills() {
    const selected = Array.from(skillsCheckboxes).filter(cb => cb.checked);
    if (selected.length === 0) {
        showError("skillsError", "Please select at least one skill.");
        return false;
    }
    clearError("skillsError");
    return true;
}

function validateAbout() {
    const value = studentAbout.value.trim();
    if (value === "") {
        showError("aboutError", "About student description is required.", "studentAbout");
        return false;
    }
    if (value.length < 20) {
        showError("aboutError", "About description must be at least 20 characters.", "studentAbout");
        return false;
    }
    if (value.length > 200) {
        showError("aboutError", "About description cannot exceed 200 characters.", "studentAbout");
        return false;
    }
    clearError("aboutError", "studentAbout");
    return true;
}

function validatePhoto() {
    if (editingStudentId !== null && !studentPhoto.files[0] && selectedPhotoDataUrl) {
        clearError("photoError");
        return true;
    }

    if (!studentPhoto.files || studentPhoto.files.length === 0) {
        showError("photoError", "Profile photo is required.");
        return false;
    }

    const file = studentPhoto.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
        showError("photoError", "Only image files (.jpg, .jpeg, .png) are accepted.");
        return false;
    }

    clearError("photoError");
    return true;
}

function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isDobValid = validateDob();
    const isGenderValid = validateGender();
    const isCourseValid = validateCourse();
    const isSkillsValid = validateSkills();
    const isAboutValid = validateAbout();
    const isPhotoValid = validatePhoto();

    return isNameValid && isEmailValid && isPhoneValid && isDobValid &&
        isGenderValid && isCourseValid && isSkillsValid && isAboutValid && isPhotoValid;
}

// Photo Upload Handler
function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type.toLowerCase())) {
            showError("photoError", "Only image files (.jpg, .jpeg, .png) are accepted.");
            return;
        }

        readPhotoAsDataUrl(file).then(dataUrl => {
            selectedPhotoDataUrl = dataUrl;
            photoPreview.src = dataUrl;
            photoFileName.textContent = file.name;
            photoPreviewContainer.classList.remove("hidden");
            clearError("photoError");
        }).catch(err => {
            console.error("Error reading file:", err);
            showError("photoError", "Failed to read image file.");
        });
    }
}

function readPhotoAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Form Submission Handler
function handleFormSubmit(event) {
    event.preventDefault(); // Prevents page reload

    if (!validateForm()) {
        return;
    }

    const nameValue = studentName.value.trim();
    const emailValue = studentEmail.value.trim();
    const phoneValue = studentPhone.value.trim();
    const dobValue = studentDob.value;
    const genderValue = Array.from(genderRadios).find(r => r.checked).value;
    const courseValue = studentCourse.value;
    const skillsValue = Array.from(skillsCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const aboutValue = studentAbout.value.trim();
    const photoValue = selectedPhotoDataUrl || createDefaultAvatarSvg(nameValue, "#2563EB");

    if (editingStudentId !== null) {
        // Update existing student
        const index = students.findIndex(s => String(s.id) === String(editingStudentId));
        if (index !== -1) {
            students[index] = {
                id: editingStudentId,
                name: nameValue,
                email: emailValue,
                phone: phoneValue,
                dob: dobValue,
                gender: genderValue,
                course: courseValue,
                skills: skillsValue,
                about: aboutValue,
                photo: photoValue
            };
            showToast("Student updated successfully.");
        }
    } else {
        // Create new student
        const newStudent = {
            id: Date.now(), // Unique ID
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            dob: dobValue,
            gender: genderValue,
            course: courseValue,
            skills: skillsValue,
            about: aboutValue,
            photo: photoValue
        };
        students.push(newStudent);
        showToast("Student registered successfully.");
    }

    saveStudents();
    updateStatistics();
    applyFilters();
    resetForm();
}

// Reset Form Handler
function resetForm() {
    studentForm.reset();
    clearAllErrors();
    
    editingStudentId = null;
    selectedPhotoDataUrl = "";

    submitBtnText.textContent = "Register Student";
    editIndicator.classList.add("hidden");
    photoPreviewContainer.classList.add("hidden");
    photoPreview.src = "";
    photoFileName.textContent = "";
    aboutCounter.textContent = "0";
    aboutCounter.style.color = "var(--muted)";
}

// Dynamic Student Card Generator
function createStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", String(student.id));

    // Card Header
    const headerGroup = document.createElement("div");
    headerGroup.classList.add("card-header-group");

    const avatar = document.createElement("img");
    avatar.src = student.photo || createDefaultAvatarSvg(student.name, "#2563EB");
    avatar.alt = `${student.name}'s photo`;
    avatar.classList.add("card-avatar");

    const headerInfo = document.createElement("div");
    headerInfo.classList.add("card-header-info");

    const nameHeading = document.createElement("h3");
    nameHeading.classList.add("student-name");
    nameHeading.textContent = student.name;

    const courseBadge = document.createElement("span");
    courseBadge.classList.add("course-badge");
    courseBadge.textContent = student.course;

    headerInfo.appendChild(nameHeading);
    headerInfo.appendChild(courseBadge);
    headerGroup.appendChild(avatar);
    headerGroup.appendChild(headerInfo);

    // Card Body
    const bodyDetails = document.createElement("div");
    bodyDetails.classList.add("card-body-details");

    bodyDetails.appendChild(createDetailRow("Email", student.email));
    bodyDetails.appendChild(createDetailRow("Phone", student.phone));
    bodyDetails.appendChild(createDetailRow("DOB", formatDate(student.dob)));
    bodyDetails.appendChild(createDetailRow("Gender", student.gender));

    // Skills
    const skillsContainer = document.createElement("div");
    skillsContainer.classList.add("card-skills-container");

    const skillsLabel = document.createElement("span");
    skillsLabel.classList.add("detail-label");
    skillsLabel.textContent = "Skills:";

    const skillsList = document.createElement("div");
    skillsList.classList.add("skills-list");
    student.skills.forEach(skill => {
        const tag = document.createElement("span");
        tag.classList.add("skill-tag");
        tag.textContent = skill;
        skillsList.appendChild(tag);
    });

    skillsContainer.appendChild(skillsLabel);
    skillsContainer.appendChild(skillsList);

    // About
    const aboutContainer = document.createElement("div");
    aboutContainer.classList.add("card-about-container");
    aboutContainer.textContent = student.about;

    // Action Buttons
    const actionsGroup = document.createElement("div");
    actionsGroup.classList.add("card-actions");

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.classList.add("btn", "btn-edit");
    editBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Delete`;

    actionsGroup.appendChild(editBtn);
    actionsGroup.appendChild(deleteBtn);

    card.appendChild(headerGroup);
    card.appendChild(bodyDetails);
    card.appendChild(skillsContainer);
    card.appendChild(aboutContainer);
    card.appendChild(actionsGroup);

    return card;
}

function createDetailRow(label, value) {
    const row = document.createElement("div");
    row.classList.add("detail-row");
    
    const labelSpan = document.createElement("span");
    labelSpan.classList.add("detail-label");
    labelSpan.textContent = label + ":";

    const valueSpan = document.createElement("span");
    valueSpan.classList.add("detail-value");
    valueSpan.textContent = value;

    row.appendChild(labelSpan);
    row.appendChild(valueSpan);
    return row;
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

// Render Cards to Container
function renderStudents(studentsToRender) {
    studentCardsContainer.innerHTML = "";

    if (students.length === 0) {
        emptyState.textContent = "No student applications yet. Register a student using the form above.";
        emptyState.classList.remove("hidden");
        return;
    }

    if (studentsToRender.length === 0) {
        emptyState.textContent = "No students found";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    studentsToRender.forEach(student => {
        const cardElement = createStudentCard(student);
        studentCardsContainer.appendChild(cardElement);
    });
}

// Statistics Recalculator
function updateStatistics() {
    statTotal.textContent = students.length;

    const counts = {
        "Web Development": 0,
        "UI/UX": 0,
        "Python": 0,
        "Data Analytics": 0,
        "MERN Stack": 0,
        "Cloud Computing": 0
    };

    students.forEach(student => {
        if (counts.hasOwnProperty(student.course)) {
            counts[student.course]++;
        }
    });

    statWebDev.textContent = counts["Web Development"];
    statUiUx.textContent = counts["UI/UX"];
    statPython.textContent = counts["Python"];
    statDataAnalytics.textContent = counts["Data Analytics"];
    statMern.textContent = counts["MERN Stack"];
    statCloud.textContent = counts["Cloud Computing"];
}

// Combined Search & Course Filter
function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    const filtered = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm);
        const matchesCourse = (selectedCourse === "All Courses" || student.course === selectedCourse);
        return matchesSearch && matchesCourse;
    });

    renderStudents(filtered);
}

// Event Delegation Handler
function handleContainerClick(event) {
    const card = event.target.closest(".student-card");
    if (!card) return;

    const studentId = card.dataset.id;
    if (!studentId) return;

    if (event.target.classList.contains("delete-btn") || event.target.closest(".delete-btn")) {
        deleteStudent(studentId);
    } else if (event.target.classList.contains("btn-edit") || event.target.closest(".btn-edit")) {
        startEditStudent(studentId);
    }
}

// Delete Student
function deleteStudent(studentId) {
    const confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    students = students.filter(s => String(s.id) !== String(studentId));
    saveStudents();
    updateStatistics();
    applyFilters();

    if (editingStudentId && String(editingStudentId) === String(studentId)) {
        resetForm();
    }

    showToast("Student deleted successfully.");
}

// Edit Student
function startEditStudent(studentId) {
    const student = students.find(s => String(s.id) === String(studentId));
    if (!student) return;

    editingStudentId = student.id;

    studentName.value = student.name;
    studentEmail.value = student.email;
    studentPhone.value = student.phone;
    studentDob.value = student.dob;

    genderRadios.forEach(radio => {
        radio.checked = (radio.value === student.gender);
    });

    studentCourse.value = student.course;

    skillsCheckboxes.forEach(cb => {
        cb.checked = student.skills.includes(cb.value);
    });

    studentAbout.value = student.about;
    aboutCounter.textContent = student.about.length;

    selectedPhotoDataUrl = student.photo || "";
    if (selectedPhotoDataUrl) {
        photoPreview.src = selectedPhotoDataUrl;
        photoFileName.textContent = "Existing Photo";
        photoPreviewContainer.classList.remove("hidden");
    } else {
        photoPreviewContainer.classList.add("hidden");
    }

    submitBtnText.textContent = "Update Student";
    editIndicator.textContent = `Editing: ${student.name}`;
    editIndicator.classList.remove("hidden");

    clearAllErrors();
    studentForm.scrollIntoView({ behavior: "smooth" });
}

// Dark Mode Theme Handler
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateDarkModeButtonIcon(true);
    }
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    updateDarkModeButtonIcon(isDark);
}

function updateDarkModeButtonIcon(isDark) {
    const text = darkModeToggle.querySelector(".theme-text");
    if (isDark) {
        themeIconContainer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        if (text) text.textContent = "Light Mode";
    } else {
        themeIconContainer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        if (text) text.textContent = "Dark Mode";
    }
}

// Lightweight Toast Notification
function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.remove("hidden");
    setTimeout(() => {
        toastNotification.classList.add("hidden");
    }, 3000);
}
