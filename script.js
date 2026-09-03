let students = [];
let id = 1;
let editId = null;

function loadData() {
  const saved = localStorage.getItem("students");
  if (saved) {
    students = JSON.parse(saved);
    const ids = students.map(s => s.id);
    id = ids.length ? Math.max(...ids) + 1 : 1;
  }
}

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");
const aboutCount = document.getElementById("aboutCount");
const submitBtn = document.getElementById("submitBtn");
const cardBox = document.getElementById("cardBox");
const searchBox = document.getElementById("searchBox");
const filterBox = document.getElementById("filterBox");
const darkBtn = document.getElementById("darkBtn");

const courseIds = {
  "Web Development": "c1",
  "UI/UX": "c2",
  "Python": "c3",
  "Data Analytics": "c4",
  "MERN Stack": "c5",
  "Cloud Computing": "c6"
};

aboutInput.addEventListener("input", () => {
  aboutCount.textContent = `${aboutInput.value.length} / 200`;
});

const showError = (id, msg) => {
  document.getElementById(id).textContent = msg;
};

function checkName() {
  const val = nameInput.value.trim();
  const re = /^[A-Za-z]+(\s[A-Za-z]+)*$/;
  if (!val) return showError("nameErr", "Name is required"), false;
  if (val.length < 3 || val.length > 40) return showError("nameErr", "Name must be 3 to 40 characters"), false;
  if (!re.test(val)) return showError("nameErr", "Only letters and spaces allowed"), false;
  showError("nameErr", "");
  return true;
}

function checkEmail() {
  const val = emailInput.value.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) return showError("emailErr", "Email is required"), false;
  if (!re.test(val)) return showError("emailErr", "Enter a valid email"), false;
  showError("emailErr", "");
  return true;
}

function checkPhone() {
  const val = phoneInput.value.trim();
  const re = /^[0-9]{10}$/;
  if (!val) return showError("phoneErr", "Phone number is required"), false;
  if (!re.test(val)) return showError("phoneErr", "Enter 10 digit number only"), false;
  showError("phoneErr", "");
  return true;
}

function checkDob() {
  const val = dobInput.value;
  if (!val) return showError("dobErr", "Date of birth is required"), false;

  const dob = new Date(val);
  const today = new Date();
  if (dob > today) return showError("dobErr", "Future date not allowed"), false;

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  if (age < 15) return showError("dobErr", "Student must be at least 15 years old"), false;
  showError("dobErr", "");
  return true;
}

function checkGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) return showError("genderErr", "Select a gender"), false;
  showError("genderErr", "");
  return true;
}

function checkCourse() {
  if (!courseInput.value) return showError("courseErr", "Select a course"), false;
  showError("courseErr", "");
  return true;
}

function checkSkills() {
  const checked = document.querySelectorAll('input[name="skills"]:checked');
  if (checked.length === 0) return showError("skillsErr", "Select at least one skill"), false;
  showError("skillsErr", "");
  return true;
}

function checkAbout() {
  const val = aboutInput.value;
  const trimmed = val.trim();
  if (!trimmed) return showError("aboutErr", "This field is required"), false;
  if (trimmed.length < 20) return showError("aboutErr", "Minimum 20 characters required"), false;
  if (val.length > 200) return showError("aboutErr", "Maximum 200 characters allowed"), false;
  showError("aboutErr", "");
  return true;
}

function checkPhoto() {
  if (photoInput.files.length === 0) {
    if (editId !== null) return showError("photoErr", ""), true;
    return showError("photoErr", "Photo is required"), false;
  }
  const file = photoInput.files[0];
  if (!file.type.startsWith("image/")) return showError("photoErr", "Only image files allowed"), false;
  showError("photoErr", "");
  return true;
}

function validateAll() {
  const checks = [checkName, checkEmail, checkPhone, checkDob, checkGender, checkCourse, checkSkills, checkAbout, checkPhoto];
  return checks.map(fn => fn()).every(Boolean);
}

function updateStats() {
  document.getElementById("totalCount").textContent = students.length;

  const counts = students.reduce((acc, s) => {
    acc[s.course] = (acc[s.course] || 0) + 1;
    return acc;
  }, {});

  Object.keys(courseIds).forEach(course => {
    document.getElementById(courseIds[course]).textContent = counts[course] || 0;
  });
}

function addEl(parent, tag, text) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  parent.appendChild(el);
  return el;
}

function makeCard(s) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", s.id);

  if (s.photo) {
    const img = document.createElement("img");
    img.src = s.photo;
    img.setAttribute("alt", s.name);
    card.appendChild(img);
  } else {
    addEl(card, "p", "No photo uploaded");
  }

  addEl(card, "h3", s.name);
  addEl(card, "p", `Email: ${s.email}`);
  addEl(card, "p", `Phone: ${s.phone}`);
  addEl(card, "p", `DOB: ${s.dob}`);
  addEl(card, "p", `Gender: ${s.gender}`);
  addEl(card, "p", `Course: ${s.course}`);
  addEl(card, "p", `Skills: ${s.skills.join(", ")}`);
  addEl(card, "p", `About: ${s.about}`);

  const btnDiv = document.createElement("div");
  btnDiv.classList.add("cardBtns");

  const editBtn = addEl(btnDiv, "button", "Edit");
  editBtn.classList.add("editBtn");

  const delBtn = addEl(btnDiv, "button", "Delete");
  delBtn.classList.add("deleteBtn");

  card.appendChild(btnDiv);
  return card;
}

function renderCards() {
  const search = searchBox.value.trim().toLowerCase();
  const course = filterBox.value;

  const filtered = students.filter(s => {
    const nameMatch = s.name.toLowerCase().includes(search);
    const courseMatch = !course || s.course === course;
    return nameMatch && courseMatch;
  });

  cardBox.innerHTML = "";

  if (filtered.length === 0) {
    cardBox.innerHTML = "<p>No students found</p>";
    return;
  }

  filtered.forEach(s => cardBox.appendChild(makeCard(s)));
}

function readPhoto(file) {
  return new Promise(resolve => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function resetForm() {
  form.reset();
  document.querySelectorAll(".err").forEach(el => el.textContent = "");
  aboutCount.textContent = "0 / 200";
  editId = null;
  submitBtn.textContent = "Register Student";
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateAll()) return;

  const gender = document.querySelector('input[name="gender"]:checked').value;
  const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb => cb.value);

  let photoData = null;
  if (photoInput.files.length > 0) {
    photoData = await readPhoto(photoInput.files[0]);
  } else if (editId !== null) {
    const old = students.find(s => s.id === editId);
    if (old) photoData = old.photo;
  }

  if (editId !== null) {
    const s = students.find(s => s.id === editId);
    Object.assign(s, {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender,
      course: courseInput.value,
      skills,
      about: aboutInput.value.trim(),
      photo: photoData
    });
  } else {
    students.push({
      id,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender,
      course: courseInput.value,
      skills,
      about: aboutInput.value.trim(),
      photo: photoData
    });
    id++;
  }

  saveData();
  resetForm();
  renderCards();
  updateStats();
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    document.querySelectorAll(".err").forEach(el => el.textContent = "");
    aboutCount.textContent = "0 / 200";
    editId = null;
    submitBtn.textContent = "Register Student";
  }, 0);
});

cardBox.addEventListener("click", e => {
  const card = e.target.closest(".student-card");
  if (!card) return;
  const cardId = Number(card.getAttribute("data-id"));

  if (e.target.classList.contains("deleteBtn")) {
    const sure = confirm("Are you sure you want to delete this student?");
    if (!sure) return;
    students = students.filter(s => s.id !== cardId);
    saveData();
    if (editId === cardId) resetForm();
    renderCards();
    updateStats();
  }

  if (e.target.classList.contains("editBtn")) {
    const s = students.find(s => s.id === cardId);
    if (!s) return;

    nameInput.value = s.name;
    emailInput.value = s.email;
    phoneInput.value = s.phone;
    dobInput.value = s.dob;
    courseInput.value = s.course;
    aboutInput.value = s.about;
    aboutCount.textContent = `${s.about.length} / 200`;

    document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = r.value === s.gender);
    document.querySelectorAll('input[name="skills"]').forEach(c => c.checked = s.skills.includes(c.value));

    photoInput.value = "";
    editId = s.id;
    submitBtn.textContent = "Update Student";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

searchBox.addEventListener("input", renderCards);
filterBox.addEventListener("change", renderCards);

darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkBtn.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

loadData();
updateStats();
renderCards();