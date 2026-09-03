const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const course = document.getElementById("course");
const about = document.getElementById("about");
const characterCount = document.getElementById("characterCount");

const studentContainer = document.getElementById("studentContainer");
const statsContainer = document.getElementById("statsContainer");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const darkModeBtn = document.getElementById("darkModeBtn");

const courses = [
  "Web Development", "UI/UX", "Python",
  "Data Analytics", "MERN Stack", "Cloud Computing"
];

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function validateForm() {
  let isValid = true;

  const fields = [
    { input: studentName, errorId: "studentNameError" },
    { input: email, errorId: "emailError" },
    { input: phone, errorId: "phoneError" },
    { input: course, errorId: "courseError" }
  ];

  fields.forEach(({ input, errorId }) => {
    document.getElementById(errorId).textContent = "";
    input.classList.remove("input-error");
  });

  const setError = (input, errorId, message) => {
    document.getElementById(errorId).textContent = message;
    input.classList.add("input-error");
    isValid = false;
  };

  if (studentName.value.trim().length < 3) {
    setError(studentName, "studentNameError", "Name must be at least 3 characters.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    setError(email, "emailError", "Enter a valid email address.");
  }

  if (!/^\d{10}$/.test(phone.value.trim())) {
    setError(phone, "phoneError", "Phone number must be 10 digits.");
  }

  if (!course.value) {
    setError(course, "courseError", "Please select a course.");
  }

  return isValid;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const studentData = {
    name: studentName.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    course: course.value,
    about: about.value.trim()
  };

  if (editingId) {
    const index = students.findIndex((s) => s.id === editingId);
    students[index] = { ...students[index], ...studentData };
    editingId = null;
    submitBtn.textContent = "Register Student";
  } else {
    students.push({ id: Date.now(), ...studentData });
  }

  saveStudents();
  renderStudents();
  renderStats();
  resetForm();
});

resetBtn.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  editingId = null;
  submitBtn.textContent = "Register Student";
  characterCount.textContent = "0";
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
}

about.addEventListener("input", () => {
  characterCount.textContent = about.value.length;
});

function renderStudents() {
  studentContainer.innerHTML = "";

  const search = searchInput.value.trim().toLowerCase();
  const filterCourse = courseFilter.value;

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search);
    const matchesCourse = filterCourse === "All Courses" || s.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  if (filtered.length === 0) {
    studentContainer.innerHTML = `<p class="no-students">No students found</p>`;
    return;
  }

  filtered.forEach((student) => {
    const card = document.createElement("article");
    card.className = "student-card";
    card.innerHTML = `
      <h3>${student.name}</h3>
      <p>Email: ${student.email}</p>
      <p>Phone: ${student.phone}</p>
      <p>Course: ${student.course}</p>
      <p>About: ${student.about}</p>
      <div class="card-buttons">
        <button class="edit-btn" data-id="${student.id}">Edit</button>
        <button class="delete-btn" data-id="${student.id}">Delete</button>
      </div>
    `;
    studentContainer.appendChild(card);
  });
}

studentContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);

  if (button.classList.contains("delete-btn")) {
    if (confirm("Delete this student?")) {
      students = students.filter((s) => s.id !== id);
      saveStudents();
      renderStudents();
      renderStats();
    }
  }

  if (button.classList.contains("edit-btn")) {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    studentName.value = student.name;
    email.value = student.email;
    phone.value = student.phone;
    course.value = student.course;
    about.value = student.about;
    characterCount.textContent = student.about.length;

    editingId = id;
    submitBtn.textContent = "Update Student";
    form.scrollIntoView({ behavior: "smooth" });
  }
});

function renderStats() {
  statsContainer.innerHTML = "";

  const totalCard = `
    <div class="stat-card">
      <h3>Total Students</h3>
      <p>${students.length}</p>
    </div>`;

  const courseCards = courses.map((c) => {
    const count = students.filter((s) => s.course === c).length;
    return `
      <div class="stat-card">
        <h3>${c}</h3>
        <p>${count}</p>
      </div>`;
  }).join("");

  statsContainer.innerHTML = totalCard + courseCards;
}

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

renderStudents();
renderStats();