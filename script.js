
const students = [];

const form = document.getElementById("studentForm");
const studentBox = document.getElementById("studentCardsContainer");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");
const aboutText = document.getElementById("about");
const counter = document.getElementById("aboutCounter");
const photoInput = document.getElementById("photo");

function showError(id, message) {
  document.getElementById(id + "Error").textContent = message;
}

function clearAllErrors() {
  document.querySelectorAll(".field-error").forEach((item) => {
    item.textContent = "";
  });
}

function getCheckedSkills() {
  return Array.from(document.querySelectorAll('input[name="skills"]:checked')).map((item) => item.value);
}

function updateCounter() {
  counter.textContent = aboutText.value.length + " / 200";
}

function validateForm() {
  clearAllErrors();
  let valid = true;
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const dob = document.getElementById("dob").value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const course = document.getElementById("course").value;
  const aboutValue = aboutText.value.trim();
  const photo = photoInput.files[0];

  if (name.length < 3 || !/^[A-Za-z ]+$/.test(name)) {
    showError("studentName", "Enter a valid name."); valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("email", "Enter a valid email."); valid = false;
  }
  if (!/^\d{10}$/.test(phone)) {
    showError("phone", "Enter a 10 digit phone number."); valid = false;
  }
  if (!dob || new Date(dob) > new Date()) {
    showError("dob", "Enter a valid date of birth."); valid = false;
  }
  if (!gender) {
    showError("gender", "Select a gender."); valid = false;
  }
  if (course === "Select Course") {
    showError("course", "Select a course."); valid = false;
  }
  if (getCheckedSkills().length === 0) {
    showError("skills", "Select at least one skill."); valid = false;
  }
  if (aboutValue.length < 20) {
    showError("about", "Write at least 20 characters."); valid = false;
  }
  if (!photo || !["image/jpeg", "image/png"].includes(photo.type)) {
    showError("photo", "Choose a JPG or PNG photo."); valid = false;
  }

  return valid;
}

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read photo"));
    reader.readAsDataURL(file);
  });
}

function getStudentData() {
  return {
    id: Date.now() + Math.random(),
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    dob: document.getElementById("dob").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    course: document.getElementById("course").value,
    skills: getCheckedSkills(),
    about: document.getElementById("about").value.trim(),
    photo: "",
  };
}

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function renderCards() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filtered = students.filter((student) => {
    const nameMatch = student.name.toLowerCase().includes(searchText);
    const courseMatch = selectedCourse === "All Courses" || student.course === selectedCourse;
    return nameMatch && courseMatch;
  });

  studentBox.innerHTML = "";

  if (filtered.length === 0) {
    studentBox.innerHTML = '<p class="empty-state">No students found</p>';
    return;
  }

  filtered.forEach((student) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.dataset.id = student.id;

    const img = document.createElement("img");
    img.className = "student-photo";
    img.src = student.photo || "https://via.placeholder.com/100x100?text=Student";
    img.alt = student.name;

    const name = document.createElement("h3");
    name.textContent = student.name;

    const info = document.createElement("div");
    info.className = "student-meta";
    info.innerHTML = "<div><strong>Email:</strong> " + student.email + "</div>" +
      "<div><strong>Phone:</strong> " + student.phone + "</div>" +
      "<div><strong>DOB:</strong> " + formatDate(student.dob) + "</div>" +
      "<div><strong>Gender:</strong> " + student.gender + "</div>" +
      "<div><strong>Course:</strong> " + student.course + "</div>";

    const skillWrap = document.createElement("div");
    skillWrap.innerHTML = "<strong>Skills:</strong>";

    const skillList = document.createElement("ul");
    skillList.className = "skills-list";

    student.skills.forEach((skill) => {
      const item = document.createElement("li");
      item.textContent = skill;
      skillList.appendChild(item);
    });

    skillWrap.appendChild(skillList);

    const aboutTextCard = document.createElement("div");
    aboutTextCard.className = "about-text";
    aboutTextCard.innerHTML = "<strong>About:</strong> " + student.about;

    const actionBox = document.createElement("div");
    actionBox.className = "card-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    actionBox.appendChild(deleteBtn);

    const top = document.createElement("div");
    top.className = "student-card-header";
    top.appendChild(img);
    top.appendChild(name);

    card.appendChild(top);
    card.appendChild(info);
    card.appendChild(skillWrap);
    card.appendChild(aboutTextCard);
    card.appendChild(actionBox);

    studentBox.appendChild(card);
  });
}

function resetForm() {
  form.reset();
  clearAllErrors();
  counter.textContent = "0 / 200";
  submitBtn.textContent = "Register Student";
  photoInput.value = "";
}

async function submitForm(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const student = getStudentData();

  if (photoInput.files[0]) {
    try {
      student.photo = await readPhoto(photoInput.files[0]);
    } catch (error) {
      showError("photo", "Unable to read the profile photo.");
      return;
    }
  }

  students.push(student);

  renderCards();
  resetForm();
}

function deleteStudent(event) {
  const deleteBtn = event.target.closest(".delete-btn");

  if (!deleteBtn) {
    return;
  }

  const card = event.target.closest(".student-card");
  const studentId = Number(card.dataset.id);

  const selectedStudent = students.find((student) => student.id === studentId);

  if (!selectedStudent) {
    return;
  }

  const confirmDelete = confirm("Are you sure you want to delete this student?");

  if (!confirmDelete) {
    return;
  }

  const index = students.findIndex((student) => student.id === studentId);

  if (index !== -1) {
    students.splice(index, 1);
  }

  renderCards();
}

form.addEventListener("submit", submitForm);
resetBtn.addEventListener("click", resetForm);
studentBox.addEventListener("click", (event) => {
  deleteStudent(event);
});
searchInput.addEventListener("input", renderCards);
courseFilter.addEventListener("change", renderCards);
aboutText.addEventListener("input", updateCounter);

resetForm();
renderCards();
