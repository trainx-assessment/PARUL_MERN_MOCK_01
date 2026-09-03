const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

const COURSES = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];
const form = $("#studentForm");
const studentContainer = $("#studentContainer");
const searchInput = $("#searchInput");
const courseFilter = $("#courseFilter");
const aboutInput = $("#about");
const photoInput = $("#profilePhoto");
const submitButton = $("#submitButton");
const themeButton = $("#themeButton");
const today = new Date().toISOString().split("T")[0];

let students = JSON.parse(localStorage.getItem("students") || "[]");
let editingId = null;

$("#dob").max = today;

const getValue = (id) => $(id).value.trim();
const getGender = () => $('input[name="gender"]:checked')?.value || "";
const getSkills = () => $$('input[name="skills"]:checked').map((c) => c.value);
const saveStudents = () => localStorage.setItem("students", JSON.stringify(students));

function clearErrors() {
  ["studentName", "email", "phone", "dob", "gender", "course", "skills", "about", "photo"].forEach((k) => {
    $(`#${k}Error`).textContent = "";
  });
}

function setError(key, message) {
  $(`#${key}Error`).textContent = message;
}

function ageFromDob(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function validateForm() {
  clearErrors();
  const data = {
    name: getValue("#studentName"),
    email: getValue("#email"),
    phone: getValue("#phone"),
    dob: $("#dob").value,
    gender: getGender(),
    course: $("#course").value,
    skills: getSkills(),
    about: getValue("#about")
  };

  if (!/^[A-Za-z ]{3,40}$/.test(data.name)) setError("studentName", "Name must contain only letters and spaces (3-40)."), data.invalid = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) setError("email", "Enter a valid email."), data.invalid = true;
  if (!/^\d{10}$/.test(data.phone)) setError("phone", "Phone must be exactly 10 digits."), data.invalid = true;

  if (!data.dob) setError("dob", "Date of birth is required."), data.invalid = true;
  else if (new Date(data.dob) > new Date()) setError("dob", "Future dates are not allowed."), data.invalid = true;
  else if (ageFromDob(data.dob) < 15) setError("dob", "Student must be at least 15 years old."), data.invalid = true;

  if (!data.gender) setError("gender", "Please select a gender."), data.invalid = true;
  if (!data.course) setError("course", "Please select a course."), data.invalid = true;
  if (!data.skills.length) setError("skills", "Select at least one skill."), data.invalid = true;
  if (data.about.length < 20 || data.about.length > 200) setError("about", "About must be 20-200 characters."), data.invalid = true;

  if (!editingId && !photoInput.files.length) setError("photo", "Profile photo is required."), data.invalid = true;
  if (photoInput.files[0] && !photoInput.files[0].type.startsWith("image/")) setError("photo", "Only image files are allowed."), data.invalid = true;

  return data.invalid ? null : data;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function updateStatistics() {
  const stats = $("#stats");
  const counts = COURSES.map((c) => ({ label: c, value: students.filter((s) => s.course === c).length }));
  counts.unshift({ label: "Total Students", value: students.length });
  stats.innerHTML = counts.map((s) => `<div class="stat">${s.label}<strong>${s.value}</strong></div>`).join("");
}

function cardTemplate(student) {
  return `
    <article class="student" data-id="${student.id}">
      <img src="${student.photo}" alt="${student.name} profile photo" />
      <div class="content">
        <h3>${student.name}</h3>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Phone:</strong> ${student.phone}</p>
        <p><strong>DOB:</strong> ${formatDate(student.dob)}</p>
        <p><strong>Gender:</strong> ${student.gender}</p>
        <p><strong>Course:</strong> ${student.course}</p>
        <div class="skills">${student.skills.map((s) => `<span>${s}</span>`).join("")}</div>
        <p>${student.about}</p>
        <div class="btns">
          <button class="edit" type="button">Edit</button>
          <button class="delete" type="button">Delete</button>
        </div>
      </div>
    </article>`;
}

function renderStudents() {
  const q = searchInput.value.trim().toLowerCase();
  const course = courseFilter.value;
  const filtered = students.filter((s) => s.name.toLowerCase().includes(q) && (course === "All Courses" || s.course === course));

  $("#noStudents").style.display = filtered.length ? "none" : "block";
  studentContainer.innerHTML = filtered.map(cardTemplate).join("");
}

function resetForm() {
  form.reset();
  editingId = null;
  submitButton.textContent = "Register Student";
  $("#characterCounter").textContent = "0 / 200";
  $("#dob").max = today;
  clearErrors();
}

function fillForm(student) {
  $("#studentName").value = student.name;
  $("#email").value = student.email;
  $("#phone").value = student.phone;
  $("#dob").value = student.dob;
  $("#course").value = student.course;
  $("#about").value = student.about;
  $("#characterCounter").textContent = `${student.about.length} / 200`;
  $$('input[name="gender"]').forEach((r) => (r.checked = r.value === student.gender));
  $$('input[name="skills"]').forEach((c) => (c.checked = student.skills.includes(c.value)));
  editingId = student.id;
  submitButton.textContent = "Update Student";
  clearErrors();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = validateForm();
  if (!data) return;

  const photo = photoInput.files[0] ? await toBase64(photoInput.files[0]) : "";
  if (editingId) {
    const student = students.find((s) => s.id === editingId);
    Object.assign(student, data);
    if (photo) student.photo = photo;
    alert("Student updated successfully.");
  } else {
    students.push({ id: Date.now(), ...data, photo });
    alert("Student registered successfully.");
  }

  saveStudents();
  renderStudents();
  updateStatistics();
  resetForm();
});

$("#resetButton").addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
aboutInput.addEventListener("input", () => ($("#characterCounter").textContent = `${aboutInput.value.length} / 200`));

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeButton.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

studentContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".student");
  if (!card) return;
  const id = Number(card.dataset.id);

  if (e.target.classList.contains("edit")) {
    const student = students.find((s) => s.id === id);
    if (student) fillForm(student);
  }

  if (e.target.classList.contains("delete") && confirm("Are you sure you want to delete this student?")) {
    students = students.filter((s) => s.id !== id);
    saveStudents();
    renderStudents();
    updateStatistics();
    alert("Student deleted successfully.");
  }
});

renderStudents();
updateStatistics();
