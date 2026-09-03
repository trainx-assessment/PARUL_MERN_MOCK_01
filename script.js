// ===================== Element References =====================
const form = document.querySelector("#studentForm");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const aboutCounter = document.querySelector("#aboutCounter");
const photoInput = document.querySelector("#profilePhoto");
const regButton = document.querySelector("#regButton");
const resetButton = document.querySelector("#resetButton");

const studentContainer = document.querySelector("#studentContainer");
const noStudentsMsg = document.querySelector("#noStudentsMsg");

const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");

const darkModeBtn = document.querySelector("#darkModeBtn");

// ===================== State =====================
const STORAGE_KEY = "studentApplicationData";

/** @type {Array<Object>} */
let students = loadStudents();

let nextId = getNextId();
let editingId = null; // tracks which student is currently being edited
let currentPhotoData = ""; // holds base64 photo while filling the form

// ===================== Storage Helpers =====================
function loadStudents() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (err) {
        console.error("Could not load saved students:", err);
        return [];
    }
}

function saveStudents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (err) {
        console.error("Could not save students:", err);
    }
}

function getNextId() {
    if (students.length === 0) return 1;
    return Math.max(...students.map((s) => s.id)) + 1;
}

// ===================== Validation Helpers =====================
const NAME_REGEX = /^[A-Za-z\s]{3,40}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

function setError(id, message) {
    const el = document.querySelector(`#${id}`);
    if (el) el.textContent = message;
}

function clearError(id) {
    setError(id, "");
}

function clearAllErrors() {
    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
}

function validateName() {
    const value = nameInput.value.trim();
    if (value === "") {
        setError("nameError", "Student name is required.");
        return false;
    }
    if (!NAME_REGEX.test(value)) {
        setError("nameError", "Name must be 3-40 letters and spaces only.");
        return false;
    }
    clearError("nameError");
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    if (value === "") {
        setError("emailError", "Email is required.");
        return false;
    }
    if (!EMAIL_REGEX.test(value)) {
        setError("emailError", "Enter a valid email address.");
        return false;
    }
    clearError("emailError");
    return true;
}

function validatePhone() {
    const value = phoneInput.value.trim();
    if (value === "") {
        setError("phoneError", "Phone number is required.");
        return false;
    }
    if (!PHONE_REGEX.test(value)) {
        setError("phoneError", "Phone number must be exactly 10 digits.");
        return false;
    }
    clearError("phoneError");
    return true;
}

function validateDob() {
    const value = dobInput.value;
    if (value === "") {
        setError("dobError", "Date of birth is required.");
        return false;
    }
    const dob = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dob > today) {
        setError("dobError", "Date of birth cannot be in the future.");
        return false;
    }
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    if (age < 15) {
        setError("dobError", "Student must be at least 15 years old.");
        return false;
    }
    clearError("dobError");
    return true;
}

function getSelectedGender() {
    const checked = document.querySelector('input[name="gender"]:checked');
    return checked ? checked.value : null;
}

function validateGender() {
    if (!getSelectedGender()) {
        setError("genderError", "Please select a gender.");
        return false;
    }
    clearError("genderError");
    return true;
}

function validateCourse() {
    if (courseInput.value === "") {
        setError("courseError", "Please select a course.");
        return false;
    }
    clearError("courseError");
    return true;
}

function getSelectedSkills() {
    return Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(
        (el) => el.value
    );
}

function validateSkills() {
    if (getSelectedSkills().length === 0) {
        setError("skillsError", "Select at least one skill.");
        return false;
    }
    clearError("skillsError");
    return true;
}

function validateAbout() {
    const value = aboutInput.value;
    const trimmed = value.trim();
    if (trimmed === "") {
        setError("aboutError", "About Student is required.");
        return false;
    }
    if (trimmed.length < 20) {
        setError("aboutError", "About Student must be at least 20 characters.");
        return false;
    }
    if (value.length > 200) {
        setError("aboutError", "About Student cannot exceed 200 characters.");
        return false;
    }
    clearError("aboutError");
    return true;
}

function validatePhoto() {
    const file = photoInput.files[0];
    // While editing, an existing photo may already be stored, so a re-upload isn't mandatory.
    if (!file) {
        if (editingId !== null && currentPhotoData) {
            clearError("photoError");
            return true;
        }
        setError("photoError", "Profile photo is required.");
        return false;
    }
    if (!file.type.startsWith("image/")) {
        setError("photoError", "Only image files (jpg, jpeg, png) are accepted.");
        return false;
    }
    clearError("photoError");
    return true;
}

function validateForm() {
    // Run every validator (avoid short-circuit) so all messages show at once.
    const results = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validateDob(),
        validateGender(),
        validateCourse(),
        validateSkills(),
        validateAbout(),
        validatePhoto(),
    ];
    return results.every(Boolean);
}

// ===================== Live Validation & Counter =====================
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
dobInput.addEventListener("input", validateDob);
courseInput.addEventListener("change", validateCourse);
document
    .querySelectorAll('input[name="gender"]')
    .forEach((el) => el.addEventListener("change", validateGender));
document
    .querySelectorAll('input[name="skills"]')
    .forEach((el) => el.addEventListener("change", validateSkills));
photoInput.addEventListener("change", validatePhoto);

aboutInput.addEventListener("input", function () {
    const length = aboutInput.value.length;
    aboutCounter.textContent = `${length} / 200`;
    validateAbout();
});

// ===================== Statistics =====================
const courseStatIdMap = {
    "Web Development": "statWebDevelopment",
    "UI/UX": "statUIUX",
    "Python": "statPython",
    "Data Analytics": "statDataAnalytics",
    "MERN Stack": "statMERNStack",
    "Cloud Computing": "statCloudComputing",
};

function updateStatistics() {
    document.querySelector("#totalStudents").textContent = students.length;
    const counts = {
        "Web Development": 0,
        "UI/UX": 0,
        "Python": 0,
        "Data Analytics": 0,
        "MERN Stack": 0,
        "Cloud Computing": 0,
    };
    students.forEach((student) => {
        if (counts.hasOwnProperty(student.course)) {
            counts[student.course]++;
        }
    });
    Object.keys(counts).forEach((course) => {
        const el = document.querySelector(`#${courseStatIdMap[course]}`);
        if (el) el.textContent = counts[course];
    });
}

// ===================== Rendering =====================
function formatDate(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

function createStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    if (student.photo) {
        const img = document.createElement("img");
        img.src = student.photo;
        img.alt = `${student.name}'s photo`;
        card.appendChild(img);
    }

    const heading = document.createElement("h3");
    heading.textContent = student.name;
    card.appendChild(heading);

    const email = document.createElement("p");
    email.textContent = `Email: ${student.email}`;
    card.appendChild(email);

    const phone = document.createElement("p");
    phone.textContent = `Phone: ${student.phone}`;
    card.appendChild(phone);

    const dob = document.createElement("p");
    dob.textContent = `DOB: ${formatDate(student.dob)}`;
    card.appendChild(dob);

    const gender = document.createElement("p");
    gender.textContent = `Gender: ${student.gender}`;
    card.appendChild(gender);

    const course = document.createElement("p");
    course.textContent = `Course: ${student.course}`;
    card.appendChild(course);

    const skills = document.createElement("p");
    skills.classList.add("skills-line");
    skills.textContent = `Skills: ${student.skills.join(", ")}`;
    card.appendChild(skills);

    const about = document.createElement("p");
    about.classList.add("about-line");
    about.textContent = `About: ${student.about}`;
    card.appendChild(about);

    const buttonRow = document.createElement("div");
    buttonRow.classList.add("card-buttons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.type = "button";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.type = "button";

    buttonRow.appendChild(editBtn);
    buttonRow.appendChild(deleteBtn);
    card.appendChild(buttonRow);

    return card;
}

function renderStudents() {
    // Clear container.
    studentContainer.innerHTML = "";

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    const filtered = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm);
        const matchesCourse = selectedCourse === "" || student.course === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    if (filtered.length === 0) {
        const msg = document.createElement("p");
        msg.classList.add("no-students");
        msg.textContent = "No students found";
        studentContainer.appendChild(msg);
        return;
    }

    filtered.forEach((student) => {
        studentContainer.appendChild(createStudentCard(student));
    });
}

function refreshUI() {
    renderStudents();
    updateStatistics();
    saveStudents();
}

// ===================== Form Submit (Register / Update) =====================
form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const finalizeSubmit = (photoData) => {
        const studentData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: getSelectedGender(),
            course: courseInput.value,
            skills: getSelectedSkills(),
            about: aboutInput.value.trim(),
            photo: photoData,
        };

        if (editingId !== null) {
            const index = students.findIndex((s) => s.id === editingId);
            if (index !== -1) {
                students[index] = { ...students[index], ...studentData };
            }
            exitEditMode();
        } else {
            studentData.id = nextId++;
            students.push(studentData);
        }

        refreshUI();
        resetFormFields();
    };

    const file = photoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            finalizeSubmit(reader.result);
        };
        reader.readAsDataURL(file);
    } else {
        finalizeSubmit(currentPhotoData);
    }
});

// ===================== Delete & Edit (Event Delegation) =====================
studentContainer.addEventListener("click", function (event) {
    const deleteBtn = event.target.closest(".delete-btn");
    const editBtn = event.target.closest(".edit-btn");

    if (deleteBtn) {
        const card = event.target.closest(".student-card");
        if (!card) return;
        const id = Number(card.getAttribute("data-id"));

        const confirmed = confirm("Are you sure you want to delete this student?");
        if (!confirmed) return;

        students = students.filter((s) => s.id !== id);

        if (editingId === id) {
            exitEditMode();
            resetFormFields();
        }

        refreshUI();
        return;
    }

    if (editBtn) {
        const card = event.target.closest(".student-card");
        if (!card) return;
        const id = Number(card.getAttribute("data-id"));
        loadStudentIntoForm(id);
    }
});

function loadStudentIntoForm(id) {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    editingId = id;
    currentPhotoData = student.photo || "";

    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;

    document.querySelectorAll('input[name="gender"]').forEach((el) => {
        el.checked = el.value === student.gender;
    });

    courseInput.value = student.course;

    document.querySelectorAll('input[name="skills"]').forEach((el) => {
        el.checked = student.skills.includes(el.value);
    });

    aboutInput.value = student.about;
    aboutCounter.textContent = `${student.about.length} / 200`;

    photoInput.value = "";

    clearAllErrors();
    regButton.textContent = "Update Student";

    form.scrollIntoView({ behavior: "smooth" });
}

function exitEditMode() {
    editingId = null;
    currentPhotoData = "";
    regButton.textContent = "Register Student";
}

// ===================== Reset =====================
function resetFormFields() {
    form.reset();
    aboutCounter.textContent = "0 / 200";
    clearAllErrors();
    currentPhotoData = "";
}

resetButton.addEventListener("click", function () {
    resetFormFields();
    exitEditMode();
});

// ===================== Search & Filter =====================
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

// ===================== Dark Mode =====================
darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// ===================== Init =====================
refreshUI();