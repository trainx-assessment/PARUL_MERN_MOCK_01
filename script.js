const students = JSON.parse(localStorage.getItem("students")) || [];
let editingStudentId = null;

const form = document.querySelector("#studentForm");
const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const profilePhoto = document.querySelector("#profilePhoto");
const submitButton = document.querySelector("#submitButton");
const studentContainer = document.querySelector("#studentContainer");
const statistics = document.querySelector("#statistics");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const characterCounter = document.querySelector("#characterCounter");
const themeToggle = document.querySelector("#themeToggle");

const courses = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function getSelectedGender() {
    return document.querySelector("input[name='gender']:checked")?.value || "";
}

function getSelectedSkills() {
    return [...document.querySelectorAll("input[name='skills']:checked")].map((skill) => skill.value);
}

function setError(fieldId, message) {
    const field = document.querySelector(`#${fieldId}`);
    const error = document.querySelector(`#${fieldId}Error`);
    if (field) field.classList.toggle("input-error", Boolean(message));
    if (error) error.textContent = message;
}

function clearErrors() {
    ["studentName", "email", "phone", "dob", "gender", "course", "skills", "about", "profilePhoto"].forEach((fieldId) => setError(fieldId, ""));
}

function validateForm() {
    clearErrors();
    let isValid = true;
    const namePattern = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedName = studentName.value.trim();
    const trimmedAbout = about.value.trim();
    const selectedGender = getSelectedGender();
    const selectedSkills = getSelectedSkills();
    const birthDate = dob.value ? new Date(`${dob.value}T00:00:00`) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!trimmedName) { setError("studentName", "Student name is required."); isValid = false; }
    else if (trimmedName.length < 3 || trimmedName.length > 40 || !namePattern.test(trimmedName)) { setError("studentName", "Use 3-40 letters and spaces only."); isValid = false; }
    if (!email.value.trim()) { setError("email", "Email is required."); isValid = false; }
    else if (!emailPattern.test(email.value.trim())) { setError("email", "Enter a valid email address."); isValid = false; }
    if (!phone.value.trim()) { setError("phone", "Phone number is required."); isValid = false; }
    else if (!phonePattern.test(phone.value.trim())) { setError("phone", "Enter exactly 10 digits."); isValid = false; }
    if (!dob.value) { setError("dob", "Date of birth is required."); isValid = false; }
    else if (birthDate > today) { setError("dob", "Future dates are not accepted."); isValid = false; }
    else if (today.getFullYear() - birthDate.getFullYear() - ((today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) ? 1 : 0) < 15) { setError("dob", "Student must be at least 15 years old."); isValid = false; }
    if (!selectedGender) { setError("gender", "Select a gender."); isValid = false; }
    if (!course.value) { setError("course", "Select a course."); isValid = false; }
    if (!selectedSkills.length) { setError("skills", "Select at least one skill."); isValid = false; }
    if (!trimmedAbout) { setError("about", "About information is required."); isValid = false; }
    else if (trimmedAbout.length < 20 || trimmedAbout.length > 200) { setError("about", "Use between 20 and 200 characters."); isValid = false; }
    if (!editingStudentId && !profilePhoto.files.length) { setError("profilePhoto", "Profile photo is required."); isValid = false; }
    else if (profilePhoto.files.length && !profilePhoto.files[0].type.startsWith("image/")) { setError("profilePhoto", "Choose an image file."); isValid = false; }

    return isValid;
}

function readPhoto() {
    return new Promise((resolve) => {
        if (!profilePhoto.files.length) { resolve(""); return; }
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.readAsDataURL(profilePhoto.files[0]);
    });
}

function getStudentData(photo) {
    return { name: studentName.value.trim(), email: email.value.trim(), phone: phone.value.trim(), dob: dob.value, gender: getSelectedGender(), course: course.value, skills: getSelectedSkills(), about: about.value.trim(), photo };
}

function formatDate(dateValue) {
    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-GB");
}

function addDetail(card, label, value, className = "") {
    const detail = document.createElement("p");
    detail.className = `student-detail ${className}`;
    const labelElement = document.createElement("strong");
    labelElement.textContent = label;
    detail.append(labelElement, document.createTextNode(value));
    card.appendChild(detail);
}

function createStudentCard(student) {
    const card = document.createElement("article");
    card.className = "student-card";
    card.dataset.id = student.id;
    const photo = document.createElement("div");
    photo.className = "student-photo";
    if (student.photo) {
        const image = document.createElement("img");
        image.className = "student-photo";
        image.src = student.photo;
        image.alt = `Profile photo of ${student.name}`;
        card.appendChild(image);
    } else {
        photo.classList.add("photo-placeholder");
        photo.textContent = student.name.charAt(0).toUpperCase();
        card.appendChild(photo);
    }
    const heading = document.createElement("h3");
    heading.textContent = student.name;
    card.appendChild(heading);
    addDetail(card, "Email", student.email);
    addDetail(card, "Phone", student.phone);
    addDetail(card, "DOB", formatDate(student.dob));
    addDetail(card, "Gender", student.gender);
    addDetail(card, "Course", student.course);
    addDetail(card, "Skills", student.skills.join(", "));
    addDetail(card, "About", student.about, "about-detail");
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.textContent = "Edit";
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button delete-btn";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "Delete";
    actions.append(editButton, deleteButton);
    card.appendChild(actions);
    return card;
}

function renderStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;
    const visibleStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm) && (selectedCourse === "All Courses" || student.course === selectedCourse));
    studentContainer.replaceChildren();
    if (!visibleStudents.length) {
        const emptyState = document.createElement("p");
        emptyState.className = "empty-state";
        emptyState.textContent = students.length ? "No students found" : "No applications yet. Register the first student above.";
        studentContainer.appendChild(emptyState);
        return;
    }
    visibleStudents.forEach((student) => studentContainer.appendChild(createStudentCard(student)));
}

function renderStatistics() {
    statistics.replaceChildren();
    const total = document.createElement("div");
    total.className = "stat";
    total.innerHTML = `<strong>${students.length}</strong><span>Total Students</span>`;
    statistics.appendChild(total);
    courses.forEach((courseName) => {
        const stat = document.createElement("div");
        stat.className = "stat";
        const count = students.filter((student) => student.course === courseName).length;
        stat.innerHTML = `<strong>${count}</strong><span>${courseName}</span>`;
        statistics.appendChild(stat);
    });
}

function render() {
    renderStudents();
    renderStatistics();
}

function resetEditor() {
    editingStudentId = null;
    submitButton.textContent = "Register Student";
    form.reset();
    clearErrors();
    characterCounter.value = "0 / 200";
}

function startEditing(student) {
    editingStudentId = student.id;
    studentName.value = student.name;
    email.value = student.email;
    phone.value = student.phone;
    dob.value = student.dob;
    course.value = student.course;
    about.value = student.about;
    document.querySelector(`input[name='gender'][value='${student.gender}']`).checked = true;
    document.querySelectorAll("input[name='skills']").forEach((skill) => { skill.checked = student.skills.includes(skill.value); });
    submitButton.textContent = "Update Student";
    characterCounter.value = `${about.value.length} / 200`;
    clearErrors();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const currentStudent = students.find((student) => student.id === editingStudentId);
    const photo = await readPhoto();
    const data = getStudentData(photo || currentStudent?.photo || "");
    if (editingStudentId) Object.assign(currentStudent, data);
    else students.push({ id: students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1, ...data });
    saveStudents();
    render();
    resetEditor();
});

form.addEventListener("reset", () => { editingStudentId = null; submitButton.textContent = "Register Student"; clearErrors(); setTimeout(() => { characterCounter.value = "0 / 200"; }, 0); });
about.addEventListener("input", () => { characterCounter.value = `${about.value.length} / 200`; });
[studentName, email, phone, dob, course, about, profilePhoto].forEach((field) => field.addEventListener("input", () => { if (field.value || field === profilePhoto) validateForm(); }));
document.querySelectorAll("input[name='gender'], input[name='skills']").forEach((field) => field.addEventListener("change", validateForm));
studentContainer.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) return;
    const card = actionButton.closest(".student-card");
    const studentId = Number(card.dataset.id);
    const student = students.find((item) => item.id === studentId);
    if (!student) return;
    if (actionButton.dataset.action === "delete") {
        if (!confirm("Are you sure you want to delete this student?")) return;
        students.splice(students.indexOf(student), 1);
        saveStudents();
        render();
    } else startEditing(student);
});
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const darkModeEnabled = document.body.classList.contains("dark-mode");
    themeToggle.textContent = darkModeEnabled ? "Light Mode" : "Dark Mode";
    localStorage.setItem("darkMode", darkModeEnabled);
});
if (localStorage.getItem("darkMode") === "true") { document.body.classList.add("dark-mode"); themeToggle.textContent = "Light Mode"; }

dob.max = new Date().toISOString().split("T")[0];
render();
