/* ==========================================================
   CONSTANTS & STATE
   ========================================================== */
const COURSES = [
  "Web Development",
  "UI/UX",
  "Python",
  "Data Analytics",
  "MERN Stack",
  "Cloud Computing"
];

const NAME_REGEX = /^[A-Za-z\s]{3,40}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const STORAGE_KEY = "studentApplicationData";

/** @type {Array<Object>} Primary in-memory data store for the whole app */
let students = [];

/** Tracks the id of the student currently being edited, or null when adding a new student */
let editingId = null;

/** Holds a temporary base64 photo while the user has selected a new file but not yet submitted */
let pendingPhotoData = null;

/* ==========================================================
   DOM REFERENCES
   ========================================================== */
const form = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseSelect = document.querySelector("#course");
const aboutTextarea = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const charCounter = document.querySelector("#charCounter");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");

const statsGrid = document.querySelector("#statsGrid");
const studentCardsContainer = document.querySelector("#studentCardsContainer");
const noResultsMessage = document.querySelector("#noResultsMessage");

const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const darkModeToggle = document.querySelector("#darkModeToggle");

/* ==========================================================
   PERSISTENCE (Array is the source of truth; localStorage
   is only used so data survives a page refresh)
   ========================================================== */
function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.warn("Could not save student data:", err);
  }
}

function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    students = raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not load student data:", err);
    students = [];
  }
}

function getNextId() {
  return students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
}

/* ==========================================================
   VALIDATION HELPERS
   ========================================================== */
function showError(fieldId, message, inputEl) {
  const errorEl = document.querySelector(`#error-${fieldId}`);
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.toggle("field-invalid", Boolean(message));
}

function clearError(fieldId, inputEl) {
  showError(fieldId, "", inputEl);
}

function validateName() {
  const value = studentNameInput.value.trim();
  if (!value) {
    showError("studentName", "Student name is required.", studentNameInput);
    return false;
  }
  if (!NAME_REGEX.test(value)) {
    showError(
      "studentName",
      "Name must be 3-40 characters, letters and spaces only.",
      studentNameInput
    );
    return false;
  }
  clearError("studentName", studentNameInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) {
    showError("email", "Email is required.", emailInput);
    return false;
  }
  if (!EMAIL_REGEX.test(value)) {
    showError("email", "Enter a valid email address.", emailInput);
    return false;
  }
  clearError("email", emailInput);
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  if (!value) {
    showError("phone", "Phone number is required.", phoneInput);
    return false;
  }
  if (!PHONE_REGEX.test(value)) {
    showError("phone", "Phone number must be exactly 10 digits.", phoneInput);
    return false;
  }
  clearError("phone", phoneInput);
  return true;
}

function validateDob() {
  const value = dobInput.value;
  if (!value) {
    showError("dob", "Date of birth is required.", dobInput);
    return false;
  }
  const dobDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dobDate > today) {
    showError("dob", "Date of birth cannot be in the future.", dobInput);
    return false;
  }

  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  if (age < 15) {
    showError("dob", "Student must be at least 15 years old.", dobInput);
    return false;
  }

  clearError("dob", dobInput);
  return true;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) {
    showError("gender", "Please select a gender.");
    return false;
  }
  clearError("gender");
  return true;
}

function validateCourse() {
  if (!courseSelect.value) {
    showError("course", "Please select a course.", courseSelect);
    return false;
  }
  clearError("course", courseSelect);
  return true;
}

function validateSkills() {
  const checked = document.querySelectorAll('input[name="skills"]:checked');
  if (checked.length === 0) {
    showError("skills", "Select at least one skill.");
    return false;
  }
  clearError("skills");
  return true;
}

function validateAbout() {
  const value = aboutTextarea.value;
  const trimmed = value.trim();

  if (!trimmed) {
    showError("about", "This field is required.", aboutTextarea);
    return false;
  }
  if (trimmed.length < 20) {
    showError("about", "Please write at least 20 characters.", aboutTextarea);
    return false;
  }
  if (value.length > 200) {
    showError("about", "Maximum 200 characters allowed.", aboutTextarea);
    return false;
  }
  clearError("about", aboutTextarea);
  return true;
}

function validatePhoto() {
  const file = photoInput.files[0];

  // In edit mode, an existing photo already on the record is acceptable.
  if (!file) {
    if (editingId !== null && pendingPhotoData) {
      clearError("photo", photoInput);
      return true;
    }
    showError("photo", "Profile photo is required.", photoInput);
    return false;
  }

  if (!file.type.startsWith("image/")) {
    showError("photo", "Only image files (.jpg, .jpeg, .png) are allowed.", photoInput);
    return false;
  }

  clearError("photo", photoInput);
  return true;
}

function validateForm() {
  // Using no short-circuit (|) so every field is checked and every message shows.
  const results = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validateGender(),
    validateCourse(),
    validateSkills(),
    validateAbout(),
    validatePhoto()
  ];
  return results.every(Boolean);
}

/* ==========================================================
   LIVE VALIDATION (clears/updates messages as the user types)
   ========================================================== */
studentNameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
dobInput.addEventListener("change", validateDob);
courseSelect.addEventListener("change", validateCourse);
document.querySelectorAll('input[name="gender"]').forEach((el) =>
  el.addEventListener("change", validateGender)
);
document.querySelectorAll('input[name="skills"]').forEach((el) =>
  el.addEventListener("change", validateSkills)
);
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingPhotoData = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  validatePhoto();
});

aboutTextarea.addEventListener("input", () => {
  const length = aboutTextarea.value.length;
  charCounter.textContent = `${length} / 200`;
  validateAbout();
});

/* ==========================================================
   FORM SUBMIT (create or update)
   ========================================================== */
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) return;

  const selectedSkills = Array.from(
    document.querySelectorAll('input[name="skills"]:checked')
  ).map((el) => el.value);

  const studentData = {
    name: studentNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    dob: dobInput.value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    course: courseSelect.value,
    skills: selectedSkills,
    about: aboutTextarea.value.trim(),
    photo: pendingPhotoData
  };

  if (editingId !== null) {
    const student = students.find((s) => s.id === editingId);
    if (student) Object.assign(student, studentData);
    exitEditMode();
  } else {
    students.push({ id: getNextId(), ...studentData });
  }

  saveStudents();
  resetFormCompletely();
  refreshStatistics();
  applySearchAndFilter();
});

/* ==========================================================
   FORM RESET
   ========================================================== */
function resetFormCompletely() {
  form.reset();
  charCounter.textContent = "0 / 200";
  pendingPhotoData = null;

  [
    "studentName",
    "email",
    "phone",
    "dob",
    "gender",
    "course",
    "skills",
    "about",
    "photo"
  ].forEach((id) => clearError(id));

  document
    .querySelectorAll(".field-invalid")
    .forEach((el) => el.classList.remove("field-invalid"));
}

function exitEditMode() {
  editingId = null;
  submitBtn.textContent = "Register Student";
}

resetBtn.addEventListener("click", () => {
  resetFormCompletely();
  exitEditMode();
});

/* ==========================================================
   STATISTICS
   ========================================================== */
function refreshStatistics() {
  statsGrid.innerHTML = "";

  const totalTile = document.createElement("div");
  totalTile.classList.add("stat-tile", "stat-total");
  const totalValue = document.createElement("div");
  totalValue.classList.add("stat-value");
  totalValue.textContent = students.length;
  const totalLabel = document.createElement("div");
  totalLabel.classList.add("stat-label");
  totalLabel.textContent = "Total Students";
  totalTile.append(totalValue, totalLabel);
  statsGrid.appendChild(totalTile);

  COURSES.forEach((course) => {
    const count = students.filter((s) => s.course === course).length;

    const tile = document.createElement("div");
    tile.classList.add("stat-tile");

    const value = document.createElement("div");
    value.classList.add("stat-value");
    value.textContent = count;

    const label = document.createElement("div");
    label.classList.add("stat-label");
    label.textContent = course;

    tile.append(value, label);
    statsGrid.appendChild(tile);
  });
}

/* ==========================================================
   DYNAMIC STUDENT CARDS
   ========================================================== */
function formatDate(isoDate) {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", String(student.id));

  // Photo row
  const photoRow = document.createElement("div");
  photoRow.classList.add("card-photo-row");

  if (student.photo) {
    const img = document.createElement("img");
    img.classList.add("card-photo");
    img.setAttribute("src", student.photo);
    img.setAttribute("alt", `${student.name}'s profile photo`);
    photoRow.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.classList.add("card-photo-placeholder");
    placeholder.textContent = student.name.charAt(0).toUpperCase();
    photoRow.appendChild(placeholder);
  }

  const nameWrap = document.createElement("div");
  const name = document.createElement("div");
  name.classList.add("card-name");
  name.textContent = student.name;

  const course = document.createElement("span");
  course.classList.add("card-course");
  course.textContent = student.course;

  nameWrap.append(name, course);
  photoRow.appendChild(nameWrap);
  card.appendChild(photoRow);

  // Meta details
  const meta = document.createElement("div");
  meta.classList.add("card-meta");

  const metaFields = [
    ["Email", student.email],
    ["Phone", student.phone],
    ["DOB", formatDate(student.dob)],
    ["Gender", student.gender]
  ];

  metaFields.forEach(([label, value]) => {
    const line = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    line.appendChild(strong);
    line.append(value);
    meta.appendChild(line);
  });
  card.appendChild(meta);

  // Skills
  const skills = document.createElement("div");
  skills.classList.add("card-skills");
  const skillsStrong = document.createElement("strong");
  skillsStrong.textContent = "Skills: ";
  skills.appendChild(skillsStrong);
  skills.append(student.skills.join(", "));
  card.appendChild(skills);

  // About
  const about = document.createElement("div");
  about.classList.add("card-about");
  about.textContent = student.about;
  card.appendChild(about);

  // Actions
  const actions = document.createElement("div");
  actions.classList.add("card-actions");

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.classList.add("btn", "btn-small", "btn-edit");
  editButton.textContent = "Edit";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("btn", "btn-small", "btn-delete");
  deleteButton.textContent = "Delete";

  actions.append(editButton, deleteButton);
  card.appendChild(actions);

  return card;
}

function renderStudents(list) {
  studentCardsContainer.innerHTML = "";

  if (list.length === 0) {
    noResultsMessage.hidden = false;
    return;
  }

  noResultsMessage.hidden = true;
  const fragment = document.createDocumentFragment();
  list.forEach((student) => fragment.appendChild(createStudentCard(student)));
  studentCardsContainer.appendChild(fragment);
}

/* ==========================================================
   SEARCH + FILTER (combined)
   ========================================================== */
function applySearchAndFilter() {
  const query = searchInput.value.trim().toLowerCase();
  const course = courseFilter.value;

  const filtered = students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(query);
    const matchesCourse = course === "All Courses" || student.course === course;
    return matchesName && matchesCourse;
  });

  renderStudents(filtered);
}

searchInput.addEventListener("input", applySearchAndFilter);
courseFilter.addEventListener("change", applySearchAndFilter);

/* ==========================================================
   EVENT DELEGATION: edit + delete
   ========================================================== */
studentCardsContainer.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".btn-delete");
  const editButton = event.target.closest(".btn-edit");

  if (deleteButton) {
    const card = deleteButton.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));

    const confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    students = students.filter((s) => s.id !== id);
    card.remove();

    saveStudents();
    refreshStatistics();
    applySearchAndFilter();

    if (editingId === id) {
      resetFormCompletely();
      exitEditMode();
    }
    return;
  }

  if (editButton) {
    const card = editButton.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));
    const student = students.find((s) => s.id === id);
    if (!student) return;

    populateFormForEdit(student);
  }
});

function populateFormForEdit(student) {
  editingId = student.id;
  pendingPhotoData = student.photo || null;

  studentNameInput.value = student.name;
  emailInput.value = student.email;
  phoneInput.value = student.phone;
  dobInput.value = student.dob;

  document
    .querySelectorAll('input[name="gender"]')
    .forEach((el) => (el.checked = el.value === student.gender));

  courseSelect.value = student.course;

  document
    .querySelectorAll('input[name="skills"]')
    .forEach((el) => (el.checked = student.skills.includes(el.value)));

  aboutTextarea.value = student.about;
  charCounter.textContent = `${student.about.length} / 200`;

  submitBtn.textContent = "Update Student";

  [
    "studentName",
    "email",
    "phone",
    "dob",
    "gender",
    "course",
    "skills",
    "about",
    "photo"
  ].forEach((id) => clearError(id));

  document
    .querySelectorAll(".field-invalid")
    .forEach((el) => el.classList.remove("field-invalid"));

  document.querySelector("#registration-section").scrollIntoView({ behavior: "smooth" });
}

/* ==========================================================
   DARK MODE (BONUS)
   ========================================================== */
darkModeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");
  darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch (err) {
    console.warn("Could not save theme preference:", err);
  }
});

function restoreTheme() {
  try {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      darkModeToggle.textContent = "Light Mode";
    }
  } catch (err) {
    console.warn("Could not restore theme preference:", err);
  }
}

/* ==========================================================
   INITIALISATION
   ========================================================== */
function init() {
  loadStudents();
  restoreTheme();
  refreshStatistics();
  applySearchAndFilter();
}

init();