const STORAGE_KEY = "studentApplications";
const THEME_KEY = "studentApplicationsTheme";
const courses = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];
const students = loadStudents();
let editingStudentId = null;

const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const emptyState = document.querySelector("#emptyState");
const submitButton = document.querySelector("#submitButton");
const formStatus = document.querySelector("#formStatus");
const aboutInput = document.querySelector("#about");
const characterCounter = document.querySelector("#characterCounter");
const photoInput = document.querySelector("#photo");
const photoHint = document.querySelector("#photoHint");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const themeToggle = document.querySelector("#themeToggle");

const fields = {
    studentName: document.querySelector("#studentName"),
    email: document.querySelector("#email"),
    phone: document.querySelector("#phone"),
    dob: document.querySelector("#dob"),
    course: document.querySelector("#course"),
    about: aboutInput,
    photo: photoInput
};

function loadStudents() {
    try {
        const savedStudents = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(savedStudents) ? savedStudents : [];
    } catch (error) {
        return [];
    }
}

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function getNextId() {
    return students.reduce((highestId, student) => Math.max(highestId, Number(student.id) || 0), 0) + 1;
}

function getSelectedGender() {
    return document.querySelector("input[name=gender]:checked")?.value || "";
}

function getSelectedSkills() {
    return [...document.querySelectorAll("input[name=skills]:checked")].map((checkbox) => checkbox.value);
}

function setError(fieldName, message) {
    const field = fields[fieldName];
    const errorElement = document.querySelector(`#${fieldName}Error`);
    if (field) field.classList.toggle("invalid", Boolean(message));
    if (errorElement) errorElement.textContent = message;
}

function clearErrors() {
    Object.keys(fields).forEach((fieldName) => setError(fieldName, ""));
    ["gender", "skills"].forEach((fieldName) => {
        document.querySelector(`#${fieldName}Error`).textContent = "";
    });
}

function calculateAge(dateOfBirth) {
    const birthDate = new Date(`${dateOfBirth}T00:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayHasPassed = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!birthdayHasPassed) age -= 1;
    return age;
}

function validateForm() {
    clearErrors();
    let isValid = true;
    const name = fields.studentName.value.trim();
    const email = fields.email.value.trim();
    const phone = fields.phone.value.trim();
    const dateOfBirth = fields.dob.value;
    const gender = getSelectedGender();
    const course = fields.course.value;
    const skills = getSelectedSkills();
    const about = fields.about.value.trim();
    const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) { setError("studentName", "Student name is required."); isValid = false; }
    else if (name.length < 3 || name.length > 40) { setError("studentName", "Name must be 3 to 40 characters."); isValid = false; }
    else if (!namePattern.test(name)) { setError("studentName", "Use letters and spaces only."); isValid = false; }
    if (!email) { setError("email", "Email is required."); isValid = false; }
    else if (!emailPattern.test(email)) { setError("email", "Enter a valid email address."); isValid = false; }
    if (!phone) { setError("phone", "Phone number is required."); isValid = false; }
    else if (!phonePattern.test(phone)) { setError("phone", "Enter exactly 10 digits."); isValid = false; }
    if (!dateOfBirth) { setError("dob", "Date of birth is required."); isValid = false; }
    else if (new Date(`${dateOfBirth}T00:00:00`) > new Date()) { setError("dob", "Date of birth cannot be in the future."); isValid = false; }
    else if (calculateAge(dateOfBirth) < 15) { setError("dob", "Student must be at least 15 years old."); isValid = false; }
    if (!gender) { document.querySelector("#genderError").textContent = "Select a gender."; isValid = false; }
    if (!course) { setError("course", "Select a course."); isValid = false; }
    if (!skills.length) { document.querySelector("#skillsError").textContent = "Select at least one skill."; isValid = false; }
    if (!about) { setError("about", "About section is required."); isValid = false; }
    else if (about.length < 20) { setError("about", "Write at least 20 characters."); isValid = false; }
    const selectedFile = photoInput.files[0];
    if (editingStudentId === null && !selectedFile) { setError("photo", "Profile photo is required."); isValid = false; }
    else if (selectedFile && !selectedFile.type.startsWith("image/")) { setError("photo", "Choose an image file."); isValid = false; }
    return isValid;
}

function readPhoto(file) {
    return new Promise((resolve) => {
        if (!file) { resolve(""); return; }
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", () => resolve(""));
        reader.readAsDataURL(file);
    });
}

function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB");
}

function createDetail(label, value) {
    const detail = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    detail.append(term, description);
    return detail;
}

function createStudentCard(student) {
    const card = document.createElement("article");
    card.className = "student-card";
    card.dataset.id = student.id;
    const image = document.createElement("img");
    image.className = "student-photo";
    image.src = student.photo;
    image.alt = `Profile photo of ${student.name}`;
    const body = document.createElement("div");
    body.className = "student-card-body";
    const name = document.createElement("h3");
    name.textContent = student.name;
    const course = document.createElement("p");
    course.className = "student-course";
    course.textContent = student.course;
    const details = document.createElement("dl");
    details.className = "student-details";
    details.append(createDetail("Email", student.email), createDetail("Phone", student.phone), createDetail("DOB", formatDate(student.dob)), createDetail("Gender", student.gender), createDetail("Skills", student.skills.join(", ")));
    const about = document.createElement("p");
    about.className = "student-about";
    const aboutLabel = document.createElement("strong");
    aboutLabel.textContent = "About";
    about.append(aboutLabel, document.createTextNode(student.about));
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    actions.append(editButton, deleteButton);
    body.append(name, course, details, about, actions);
    card.append(image, body);
    return card;
}

function renderStudents() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;
    const visibleStudents = students.filter((student) => student.name.toLowerCase().includes(query) && (!selectedCourse || student.course === selectedCourse));
    studentContainer.replaceChildren(...visibleStudents.map(createStudentCard));
    emptyState.classList.toggle("visible", visibleStudents.length === 0);
    emptyState.textContent = students.length && (query || selectedCourse) ? "No students found" : "No student applications yet. Your next great applicant starts here.";
}

function renderStats() {
    document.querySelector("#totalStudents").textContent = `Total Students: ${students.length}`;
    const statsContainer = document.querySelector("#courseStats");
    statsContainer.replaceChildren(...courses.map((course) => {
        const item = document.createElement("div");
        item.className = "stat-item";
        const count = document.createElement("strong");
        count.textContent = students.filter((student) => student.course === course).length;
        const label = document.createElement("span");
        label.textContent = course;
        item.append(count, label);
        return item;
    }));
}

function render() {
    renderStudents();
    renderStats();
}

function resetForm() {
    form.reset();
    editingStudentId = null;
    submitButton.textContent = "Register Student";
    photoHint.textContent = "JPG, PNG, or WEBP image files.";
    formStatus.textContent = "";
    clearErrors();
    updateCharacterCounter();
}

function populateForm(student) {
    fields.studentName.value = student.name;
    fields.email.value = student.email;
    fields.phone.value = student.phone;
    fields.dob.value = student.dob;
    fields.course.value = student.course;
    fields.about.value = student.about;
    document.querySelectorAll("input[name=gender]").forEach((radio) => { radio.checked = radio.value === student.gender; });
    document.querySelectorAll("input[name=skills]").forEach((checkbox) => { checkbox.checked = student.skills.includes(checkbox.value); });
    editingStudentId = student.id;
    submitButton.textContent = "Update Student";
    photoHint.textContent = "Current photo kept unless you choose a new image.";
    updateCharacterCounter();
    clearErrors();
    document.querySelector("#form-title").scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleSubmit(event) {
    event.preventDefault();
    formStatus.textContent = "";
    if (!validateForm()) return;
    const selectedFile = photoInput.files[0];
    const existingStudent = students.find((student) => student.id === editingStudentId);
    readPhoto(selectedFile).then((photo) => {
        const studentData = {
            id: editingStudentId ?? getNextId(),
            name: fields.studentName.value.trim(),
            email: fields.email.value.trim(),
            phone: fields.phone.value.trim(),
            dob: fields.dob.value,
            gender: getSelectedGender(),
            course: fields.course.value,
            skills: getSelectedSkills(),
            about: fields.about.value.trim(),
            photo: photo || existingStudent?.photo || ""
        };
        if (existingStudent) Object.assign(existingStudent, studentData);
        else students.push(studentData);
        saveStudents();
        render();
        const successMessage = existingStudent ? "Student application updated." : "Student application registered.";
        resetForm();
        formStatus.textContent = successMessage;
    });
}

function updateCharacterCounter() {
    characterCounter.textContent = `${aboutInput.value.length} / 200`;
}

studentContainer.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button");
    const card = event.target.closest(".student-card");
    if (!actionButton || !card) return;
    const studentId = Number(card.dataset.id);
    const student = students.find((item) => item.id === studentId);
    if (!student) return;
    if (actionButton.classList.contains("delete-button")) {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        students.splice(students.indexOf(student), 1);
        saveStudents();
        if (editingStudentId === studentId) resetForm();
        render();
    }
    if (actionButton.classList.contains("edit-button")) populateForm(student);
});

form.addEventListener("submit", handleSubmit);
document.querySelector("#resetButton").addEventListener("click", resetForm);
aboutInput.addEventListener("input", updateCharacterCounter);
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
Object.entries(fields).forEach(([fieldName, field]) => {
    field.addEventListener("input", () => setError(fieldName, ""));
});
document.querySelectorAll("input[name=gender], input[name=skills]").forEach((input) => {
    input.addEventListener("change", () => {
        const errorName = input.name === "gender" ? "gender" : "skills";
        document.querySelector(`#${errorName}Error`).textContent = "";
    });
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
});

if (localStorage.getItem(THEME_KEY) === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
}

updateCharacterCounter();
render();
