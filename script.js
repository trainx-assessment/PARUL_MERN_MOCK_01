const form = document.querySelector("#studentForm");
const nameEl = document.querySelector("#studentName");
const emailEl = document.querySelector("#studentEmail");
const phoneEl = document.querySelector("#studentPhone");
const dobEl = document.querySelector("#studentDob");
const courseEl = document.querySelector("#studentCourse");
const aboutEl = document.querySelector("#studentAbout");
const photoEl = document.querySelector("#studentPhoto");
const counter = document.querySelector("#charCounter");
const addBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");
const cardsBox = document.querySelector("#studentContainer");
const totalEl = document.querySelector("#totalStudents");
const searchEl = document.querySelector("#searchInput");
const filterEl = document.querySelector("#courseFilter");
const darkBtn = document.querySelector("#darkModeBtn");

//Data
let students = [];
let nextId = 1;
let editId = null;
let photoData = "";

const show = (id, msg) => (document.querySelector(id).textContent = msg);

aboutEl.addEventListener("input", () => counter.textContent = aboutEl.value.length + " / 200");

photoEl.addEventListener("change", () => {
  const file = photoEl.files[0];
  if (!file) return (photoData = "");
  const reader = new FileReader();
  reader.onload = () => (photoData = reader.result);
  reader.readAsDataURL(file);
});

//Validation
function checkName() {
  const ok = /^[A-Za-z ]{3,40}$/.test(nameEl.value.trim());
  show("#nameError", ok ? "" : "3-40 letters and spaces only.");
  return ok;
}
function checkEmail() {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
  show("#emailError", ok ? "" : "Enter a valid email.");
  return ok;
}
function checkPhone() {
  const ok = /^[0-9]{10}$/.test(phoneEl.value.trim());
  show("#phoneError", ok ? "" : "Must be exactly 10 digits.");
  return ok;
}
function checkDob() {
  if (!dobEl.value) { show("#dobError", "Required."); return false; }
  const dob = new Date(dobEl.value), today = new Date();
  if (dob > today) { show("#dobError", "Cannot be a future date."); return false; }
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 15) { show("#dobError", "Must be at least 15 years old."); return false; }
  show("#dobError", "");
  return true;
}
function checkGender() {
  const ok = !!document.querySelector('input[name="gender"]:checked');
  show("#genderError", ok ? "" : "Select a gender.");
  return ok;
}
function checkCourse() {
  const ok = courseEl.value !== "";
  show("#courseError", ok ? "" : "Select a course.");
  return ok;
}
function checkSkills() {
  const ok = document.querySelectorAll('input[name="skills"]:checked').length > 0;
  show("#skillsError", ok ? "" : "Select at least one skill.");
  return ok;
}
function checkAbout() {
  const len = aboutEl.value.trim().length;
  const ok = len >= 20 && len <= 200;
  show("#aboutError", ok ? "" : "20-200 characters required.");
  return ok;
}
function checkPhoto() {
  if (editId !== null && photoData) { show("#photoError", ""); return true; }
  if (!photoEl.files[0]) { show("#photoError", "Photo is required."); return false; }
  const type = photoEl.files[0].type;
  if (type !== "image/jpeg" && type !== "image/png") { show("#photoError", "Only jpg or png allowed."); return false; }
  show("#photoError", "");
  return true;
}

const getSkills = () => [...document.querySelectorAll('input[name="skills"]:checked')].map(el => el.value);
const getGender = () => document.querySelector('input[name="gender"]:checked')?.value || "";

//Submit
form.addEventListener("submit", e => {
  e.preventDefault();
  const valid = [checkName(), checkEmail(), checkPhone(), checkDob(), checkGender(),
    checkCourse(), checkSkills(), checkAbout(), checkPhoto()].every(Boolean);
  if (!valid) return;

  const data = {
    name: nameEl.value.trim(), email: emailEl.value.trim(), phone: phoneEl.value.trim(),
    dob: dobEl.value, gender: getGender(), course: courseEl.value,
    skills: getSkills(), about: aboutEl.value.trim(), photo: photoData
  };

  if (editId === null) {
    data.id = nextId++;
    students.push(data);
  } else {
    data.id = editId;
    students = students.map(s => (s.id === editId ? data : s));
    editId = null;
    addBtn.textContent = "Register Student";
  }

  clearForm();
  render();
  updateStats();
});

resetBtn.addEventListener("click", () => {
  clearForm();
  editId = null;
  addBtn.textContent = "Register Student";
});

function clearForm() {
  form.reset();
  counter.textContent = "0 / 200";
  photoData = "";
  document.querySelectorAll(".error").forEach(el => (el.textContent = ""));
}

//Card
function makeCard(s) {
  const card = document.createElement("div");
  card.className = "student-card";
  card.dataset.id = s.id;
  card.innerHTML = `
    ${s.photo ? `<img src="${s.photo}">` : ""}
    <h3></h3>
    <p>Email: ${s.email}</p>
    <p>Phone: ${s.phone}</p>
    <p>DOB: ${s.dob}</p>
    <p>Gender: ${s.gender}</p>
    <p>Course: ${s.course}</p>
    <p>Skills: ${s.skills.join(", ")}</p>
    <p>About: ${s.about}</p>
    <div class="card-buttons">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>`;
  card.querySelector("h3").textContent = s.name;
  return card;
}

function render() {
  cardsBox.textContent = "";
  const q = searchEl.value.trim().toLowerCase();
  const course = filterEl.value;
  const list = students.filter(s =>
    s.name.toLowerCase().includes(q) && (course === "All Courses" || s.course === course));

  if (list.length === 0) { cardsBox.innerHTML = "<p>No students found</p>"; return; }
  list.forEach(s => cardsBox.appendChild(makeCard(s)));
}

//Edit/delete
cardsBox.addEventListener("click", e => {
  const card = e.target.closest(".student-card");
  if (!card) return;
  const id = Number(card.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    students = students.filter(s => s.id !== id);
    render();
    updateStats();
  }

  if (e.target.classList.contains("edit-btn")) {
    const s = students.find(st => st.id === id);
    if (!s) return;
    nameEl.value = s.name; emailEl.value = s.email; phoneEl.value = s.phone;
    dobEl.value = s.dob; courseEl.value = s.course; aboutEl.value = s.about;
    counter.textContent = s.about.length + " / 200";
    photoData = s.photo;
    document.querySelectorAll('input[name="gender"]').forEach(r => (r.checked = r.value === s.gender));
    document.querySelectorAll('input[name="skills"]').forEach(c => (c.checked = s.skills.includes(c.value)));
    editId = id;
    addBtn.textContent = "Update Student";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

//Stats
function updateStats() {
  totalEl.textContent = "Total Students: " + students.length;
  const counts = { "Web Development": 0, "UI/UX": 0, "Python": 0, "Data Analytics": 0, "MERN Stack": 0, "Cloud Computing": 0 };
  students.forEach(s => { if (counts[s.course] !== undefined) counts[s.course]++; });
  document.querySelector("#count-web").textContent = counts["Web Development"];
  document.querySelector("#count-uiux").textContent = counts["UI/UX"];
  document.querySelector("#count-python").textContent = counts["Python"];
  document.querySelector("#count-data").textContent = counts["Data Analytics"];
  document.querySelector("#count-mern").textContent = counts["MERN Stack"];
  document.querySelector("#count-cloud").textContent = counts["Cloud Computing"];
}
searchEl.addEventListener("input", render);
filterEl.addEventListener("change", render);
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkBtn.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});
render();
updateStats();
