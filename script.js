let students = JSON.parse(localStorage.getItem("students")) || [];
let nextId = students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1;
let editId = null;
let currentPhotoData = null;

const COURSES = [
  "Web Development",
  "UI/UX",
  "Python",
  "Data Analytics",
  "MERN Stack",
  "Cloud Computing",
];

const form = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const charCounter = document.querySelector("#charCounter");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");
const studentContainer = document.querySelector("#studentContainer");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const darkModeToggle = document.querySelector("#darkModeToggle");
const totalCountEl = document.querySelector("#totalCount");

const NAME_REGEX = /^[A-Za-z\s]{3,40}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

function showError(fieldId, message) {
  const errEl = document.querySelector(`#err-${fieldId}`);
  if (errEl) errEl.textContent = message;
}

function clearError(fieldId) {
  showError(fieldId, "");
}

function clearAllErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
}

[
  studentNameInput,
  emailInput,
  phoneInput,
  dobInput,
  courseInput,
  aboutInput,
].forEach((input) => {
  input.addEventListener("input", () => clearError(input.id));
});
courseInput.addEventListener("change", () => clearError("course"));
document
  .querySelectorAll('input[name="gender"]')
  .forEach((r) => r.addEventListener("change", () => clearError("gender")));
document
  .querySelectorAll('input[name="skills"]')
  .forEach((c) => c.addEventListener("change", () => clearError("skills")));
photoInput.addEventListener("change", () => clearError("photo"));

aboutInput.addEventListener("input", () => {
  charCounter.textContent = `${aboutInput.value.length} / 200`;
});

function validateName() {
  const value = studentNameInput.value.trim();
  if (!value) {
    showError("studentName", "Student name is required.");
    return false;
  }
  if (!NAME_REGEX.test(value)) {
    showError("studentName", "Name must be 3-40 letters and spaces only.");
    return false;
  }
  clearError("studentName");
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) {
    showError("email", "Email is required.");
    return false;
  }
  if (!EMAIL_REGEX.test(value)) {
    showError("email", "Enter a valid email address.");
    return false;
  }
  clearError("email");
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  if (!value) {
    showError("phone", "Phone number is required.");
    return false;
  }
  if (!PHONE_REGEX.test(value)) {
    showError("phone", "Phone number must be exactly 10 digits.");
    return false;
  }
  clearError("phone");
  return true;
}

function validateDob() {
  const value = dobInput.value;
  if (!value) {
    showError("dob", "Date of birth is required.");
    return false;
  }
  const dob = new Date(value);
  const today = new Date();
  if (dob > today) {
    showError("dob", "Future dates are not allowed.");
    return false;
  }
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  if (age < 15) {
    showError("dob", "Student must be at least 15 years old.");
    return false;
  }
  clearError("dob");
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
  if (!courseInput.value) {
    showError("course", "Please select a course.");
    return false;
  }
  clearError("course");
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
  const value = aboutInput.value;
  const trimmed = value.trim();
  if (!trimmed) {
    showError("about", "About section is required.");
    return false;
  }
  if (trimmed.length < 20) {
    showError("about", "Minimum 20 characters required.");
    return false;
  }
  if (value.length > 200) {
    showError("about", "Maximum 200 characters allowed.");
    return false;
  }
  clearError("about");
  return true;
}

function validatePhoto() {
  const file = photoInput.files[0];
  if (!file) {
    if (editId !== null && currentPhotoData) {
      clearError("photo");
      return true;
    }
    showError("photo", "Profile photo is required.");
    return false;
  }
  if (!file.type.startsWith("image/")) {
    showError("photo", "Only image files are allowed.");
    return false;
  }
  clearError("photo");
  return true;
}

function validateForm() {
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

function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  const img = document.createElement("img");
  img.classList.add("student-photo");
  img.src = student.photo || "";
  img.alt = student.name;
  card.appendChild(img);

  const heading = document.createElement("h3");
  heading.textContent = student.name;
  card.appendChild(heading);

  const fields = [
    ["Email", student.email],
    ["Phone", student.phone],
    ["DOB", student.dob],
    ["Gender", student.gender],
    ["Course", student.course],
  ];

  fields.forEach(([label, value]) => {
    const p = document.createElement("p");
    p.textContent = `${label}: ${value}`;
    card.appendChild(p);
  });

  const skillsP = document.createElement("p");
  skillsP.textContent = `Skills: ${student.skills.join(", ")}`;
  card.appendChild(skillsP);

  const aboutP = document.createElement("p");
  aboutP.textContent = `About: ${student.about}`;
  card.appendChild(aboutP);

  const actions = document.createElement("div");
  actions.classList.add("card-actions");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  card.appendChild(actions);

  return card;
}

function renderStudents() {
  studentContainer.innerHTML = "";

  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filtered = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm);
    const matchesCourse =
      selectedCourse === "all" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  if (filtered.length === 0) {
    const msg = document.createElement("p");
    msg.classList.add("no-results");
    msg.textContent = "No students found";
    studentContainer.appendChild(msg);
  } else {
    filtered.forEach((student) => {
      studentContainer.appendChild(createStudentCard(student));
    });
  }

  updateStatistics();
}

function updateStatistics() {
  totalCountEl.textContent = students.length;
  COURSES.forEach((course) => {
    const count = students.filter((s) => s.course === course).length;
    const el = document.querySelector(`#count-${CSS.escape(course)}`);
    if (el) el.textContent = count;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) return;

  const file = photoInput.files[0];

  function saveStudent(photoData) {
    const skills = Array.from(
      document.querySelectorAll('input[name="skills"]:checked'),
    ).map((cb) => cb.value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    if (editId !== null) {
      const student = students.find((s) => s.id === editId);
      student.name = studentNameInput.value.trim();
      student.email = emailInput.value.trim();
      student.phone = phoneInput.value.trim();
      student.dob = dobInput.value;
      student.gender = gender;
      student.course = courseInput.value;
      student.skills = skills;
      student.about = aboutInput.value.trim();
      if (photoData) student.photo = photoData;
      editId = null;
      submitBtn.textContent = "Register Student";
    } else {
      const newStudent = {
        id: nextId++,
        name: studentNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: gender,
        course: courseInput.value,
        skills: skills,
        about: aboutInput.value.trim(),
        photo: photoData,
      };
      students.push(newStudent);
    }

    saveToStorage();
    renderStudents();
    resetForm();
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = () => saveStudent(reader.result);
    reader.readAsDataURL(file);
  } else {
    saveStudent(null);
  }
});

function resetForm() {
  form.reset();
  charCounter.textContent = "0 / 200";
  clearAllErrors();
  editId = null;
  currentPhotoData = null;
  submitBtn.textContent = "Register Student";
}

resetBtn.addEventListener("click", resetForm);

studentContainer.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".delete-btn");
  const editBtn = event.target.closest(".edit-btn");

  if (deleteBtn) {
    const card = event.target.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));

    const confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    students = students.filter((s) => s.id !== id);
    saveToStorage();
    renderStudents();
    return;
  }

  if (editBtn) {
    const card = event.target.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));
    const student = students.find((s) => s.id === id);
    if (!student) return;

    studentNameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseInput.value = student.course;
    aboutInput.value = student.about;
    charCounter.textContent = `${student.about.length} / 200`;

    document.querySelectorAll('input[name="gender"]').forEach((r) => {
      r.checked = r.value === student.gender;
    });

    document.querySelectorAll('input[name="skills"]').forEach((cb) => {
      cb.checked = student.skills.includes(cb.value);
    });

    currentPhotoData = student.photo;
    editId = id;
    submitBtn.textContent = "Update Student";
    clearAllErrors();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

darkModeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
});

renderStudents();
