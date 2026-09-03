let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;
let currentPhotoBase64 = "";

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseSelect = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");
const charCounter = document.getElementById("charCounter");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const cardsContainer = document.getElementById("studentCardsContainer");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const themeToggleBtn = document.getElementById("themeToggleBtn");

const totalStudentsEl = document.getElementById("totalStudents");
const statWebDevEl = document.getElementById("statWebDev");
const statUiUxEl = document.getElementById("statUiUx");
const statPythonEl = document.getElementById("statPython");
const statDataAnalyticsEl = document.getElementById("statDataAnalytics");
const statMernEl = document.getElementById("statMern");
const statCloudEl = document.getElementById("statCloud");

// Validation patterns
const nameRegex = /^[A-Za-z\s]{3,40}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

document.addEventListener("DOMContentLoaded", function () {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleBtn.textContent = "Light Mode";
    }

    renderStudents(students);
    updateStatistics();
});

// Real-time character count
aboutInput.addEventListener("input", function () {
    charCounter.textContent = `${aboutInput.value.length} / 200`;
});

// Real-time photo preview data
photoInput.addEventListener("change", function () {
    const file = photoInput.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            showError("photoError", "Only image files (.jpg, .jpeg, .png) are accepted");
            photoInput.value = "";
            currentPhotoBase64 = "";
            return;
        }
        clearError("photoError");
        const reader = new FileReader();
        reader.onload = function (e) {
            currentPhotoBase64 = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Clear validation messages on input
nameInput.addEventListener("input", () => clearError("nameError"));
emailInput.addEventListener("input", () => clearError("emailError"));
phoneInput.addEventListener("input", () => clearError("phoneError"));
dobInput.addEventListener("input", () => clearError("dobError"));
courseSelect.addEventListener("change", () => clearError("courseError"));
aboutInput.addEventListener("input", () => clearError("aboutError"));

document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener("change", () => clearError("genderError"));
});

document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => clearError("skillsError"));
});

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = "";
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll(".error-msg");
    errorElements.forEach((el) => {
        el.textContent = "";
    });
}

function validateForm() {
    let isValid = true;
    clearAllErrors();

    // Student Name
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
        showError("nameError", "Student name is required");
        isValid = false;
    } else if (!nameRegex.test(nameVal)) {
        showError("nameError", "Name must be 3-40 characters and contain only letters");
        isValid = false;
    }

    // Email
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
        showError("emailError", "Email address is required");
        isValid = false;
    } else if (!emailRegex.test(emailVal)) {
        showError("emailError", "Please enter a valid email address");
        isValid = false;
    }

    // Phone
    const phoneVal = phoneInput.value.trim();
    if (!phoneVal) {
        showError("phoneError", "Phone number is required");
        isValid = false;
    } else if (!phoneRegex.test(phoneVal)) {
        showError("phoneError", "Phone number must be exactly 10 digits");
        isValid = false;
    }

    // Date of Birth
    const dobVal = dobInput.value;
    if (!dobVal) {
        showError("dobError", "Date of birth is required");
        isValid = false;
    } else {
        const dobDate = new Date(dobVal);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dobDate > today) {
            showError("dobError", "Future dates are not allowed");
            isValid = false;
        } else {
            let age = today.getFullYear() - dobDate.getFullYear();
            const monthDiff = today.getMonth() - dobDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                age--;
            }
            if (age < 15) {
                showError("dobError", "Student must be at least 15 years old");
                isValid = false;
            }
        }
    }

    // Gender
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    if (!selectedGender) {
        showError("genderError", "Please select a gender");
        isValid = false;
    }

    // Course
    const courseVal = courseSelect.value;
    if (!courseVal) {
        showError("courseError", "Please select a course");
        isValid = false;
    }

    // Skills
    const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);
    if (selectedSkills.length === 0) {
        showError("skillsError", "Please select at least one skill");
        isValid = false;
    }

    // About Student
    const aboutVal = aboutInput.value.trim();
    if (!aboutVal) {
        showError("aboutError", "About student description is required");
        isValid = false;
    } else if (aboutVal.length < 20 || aboutVal.length > 200) {
        showError("aboutError", "About section must be between 20 and 200 characters");
        isValid = false;
    }

    // Profile Photo
    if (!editingId && !currentPhotoBase64) {
        showError("photoError", "Profile photo is required");
        isValid = false;
    }

    return isValid;
}

// Form Submit Handler
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value);

    if (editingId) {
        const studentIndex = students.findIndex((s) => s.id === editingId);
        if (studentIndex !== -1) {
            students[studentIndex] = {
                id: editingId,
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                dob: dobInput.value,
                gender: selectedGender,
                course: courseSelect.value,
                skills: selectedSkills,
                about: aboutInput.value.trim(),
                photo: currentPhotoBase64 || students[studentIndex].photo
            };
        }
        editingId = null;
        submitBtn.textContent = "Register Student";
    } else {
        const newStudent = {
            id: Date.now(),
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: selectedGender,
            course: courseSelect.value,
            skills: selectedSkills,
            about: aboutInput.value.trim(),
            photo: currentPhotoBase64
        };
        students.push(newStudent);
    }

    localStorage.setItem("students", JSON.stringify(students));
    resetForm();
    applyFilterAndSearch();
    updateStatistics();
});

// Reset Form Function
function resetForm() {
    form.reset();
    editingId = null;
    currentPhotoBase64 = "";
    charCounter.textContent = "0 / 200";
    submitBtn.textContent = "Register Student";
    clearAllErrors();
}

resetBtn.addEventListener("click", resetForm);

// Dynamic Card Rendering
function renderStudents(list) {
    cardsContainer.innerHTML = "";

    if (list.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.classList.add("no-records");
        emptyMsg.textContent = "No students found";
        cardsContainer.appendChild(emptyMsg);
        return;
    }

    list.forEach((student) => {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        // Header (Photo, Name, Course Badge)
        const header = document.createElement("div");
        header.classList.add("card-header");

        const img = document.createElement("img");
        img.classList.add("card-photo");
        img.src = student.photo || "https://via.placeholder.com/60?text=User";
        img.alt = student.name;

        const info = document.createElement("div");
        info.classList.add("card-name-role");

        const nameHeading = document.createElement("h3");
        nameHeading.textContent = student.name;

        const courseBadge = document.createElement("span");
        courseBadge.classList.add("card-course-badge");
        courseBadge.textContent = student.course;

        info.appendChild(nameHeading);
        info.appendChild(courseBadge);
        header.appendChild(img);
        header.appendChild(info);

        // Details
        const details = document.createElement("div");
        details.classList.add("card-details");

        const emailP = document.createElement("p");
        emailP.innerHTML = `<strong>Email:</strong> ${student.email}`;

        const phoneP = document.createElement("p");
        phoneP.innerHTML = `<strong>Phone:</strong> ${student.phone}`;

        const dobP = document.createElement("p");
        dobP.innerHTML = `<strong>DOB:</strong> ${student.dob}`;

        const genderP = document.createElement("p");
        genderP.innerHTML = `<strong>Gender:</strong> ${student.gender}`;

        const courseP = document.createElement("p");
        courseP.innerHTML = `<strong>Course:</strong> ${student.course}`;

        const skillsWrap = document.createElement("div");
        skillsWrap.innerHTML = "<strong>Skills:</strong>";
        const skillsList = document.createElement("div");
        skillsList.classList.add("skills-list");

        student.skills.forEach((skill) => {
            const skillTag = document.createElement("span");
            skillTag.classList.add("skill-tag");
            skillTag.textContent = skill;
            skillsList.appendChild(skillTag);
        });
        skillsWrap.appendChild(skillsList);

        details.appendChild(emailP);
        details.appendChild(phoneP);
        details.appendChild(dobP);
        details.appendChild(genderP);
        details.appendChild(courseP);
        details.appendChild(skillsWrap);

        // About section
        const aboutBox = document.createElement("div");
        aboutBox.classList.add("card-about");
        aboutBox.innerHTML = `<strong>About:</strong> ${student.about}`;

        // Action Buttons
        const actions = document.createElement("div");
        actions.classList.add("card-actions");

        const editBtn = document.createElement("button");
        editBtn.classList.add("btn", "btn-edit", "btn-sm", "edit-btn");
        editBtn.textContent = "Edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger", "btn-sm", "delete-btn");
        deleteBtn.textContent = "Delete";

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(header);
        card.appendChild(details);
        card.appendChild(aboutBox);
        card.appendChild(actions);

        cardsContainer.appendChild(card);
    });
}

// Event Delegation for Edit & Delete
cardsContainer.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".delete-btn");
    const editBtn = e.target.closest(".edit-btn");

    if (deleteBtn) {
        const card = deleteBtn.closest(".student-card");
        const studentId = Number(card.getAttribute("data-id"));

        if (confirm("Are you sure you want to delete this student?")) {
            students = students.filter((s) => s.id !== studentId);
            localStorage.setItem("students", JSON.stringify(students));
            
            if (editingId === studentId) {
                resetForm();
            }

            applyFilterAndSearch();
            updateStatistics();
        }
    }

    if (editBtn) {
        const card = editBtn.closest(".student-card");
        const studentId = Number(card.getAttribute("data-id"));
        startEditStudent(studentId);
    }
});

// Edit Student
function startEditStudent(id) {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    editingId = id;
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseSelect.value = student.course;
    aboutInput.value = student.about;
    charCounter.textContent = `${student.about.length} / 200`;
    currentPhotoBase64 = student.photo || "";

    const genderRadio = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
    if (genderRadio) genderRadio.checked = true;

    document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
        checkbox.checked = student.skills.includes(checkbox.value);
    });

    submitBtn.textContent = "Update Student";
    clearAllErrors();
    window.scrollTo({ top: form.offsetTop - 30, behavior: "smooth" });
}

// Update Statistics
function updateStatistics() {
    totalStudentsEl.textContent = students.length;

    let webDev = 0;
    let uiUx = 0;
    let python = 0;
    let dataAnalytics = 0;
    let mern = 0;
    let cloud = 0;

    students.forEach((s) => {
        if (s.course === "Web Development") webDev++;
        else if (s.course === "UI/UX") uiUx++;
        else if (s.course === "Python") python++;
        else if (s.course === "Data Analytics") dataAnalytics++;
        else if (s.course === "MERN Stack") mern++;
        else if (s.course === "Cloud Computing") cloud++;
    });

    statWebDevEl.textContent = webDev;
    statUiUxEl.textContent = uiUx;
    statPythonEl.textContent = python;
    statDataAnalyticsEl.textContent = dataAnalytics;
    statMernEl.textContent = mern;
    statCloudEl.textContent = cloud;
}

// Search and Filter logic
function applyFilterAndSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const course = courseFilter.value;

    const filtered = students.filter((s) => {
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesCourse = course === "All" || s.course === course;
        return matchesName && matchesCourse;
    });

    renderStudents(filtered);
}

searchInput.addEventListener("input", applyFilterAndSearch);
courseFilter.addEventListener("change", applyFilterAndSearch);

// Dark Mode Toggle
themeToggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
