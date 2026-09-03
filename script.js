const studentForm = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const resetBtn = document.getElementById("resetBtn");
const submitBtn = document.getElementById("submitBtn");
const themeToggle = document.getElementById("themeToggle");
const charCounter = document.getElementById("charCounter");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");

const courseLabels = [
  "Web Development",
  "UI/UX",
  "Python",
  "Data Analytics",
  "MERN Stack",
  "Cloud Computing"
];

const students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;
let nextId = students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1;

function showError(fieldId, message) {
  const errorElement = document.querySelector(`[data-error-for="${fieldId}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(fieldId) {
  showError(fieldId, "");
}

function clearAllErrors() {
  document.querySelectorAll(".error-message").forEach((node) => {
    node.textContent = "";
  });
}

function getSelectedSkills() {
  return Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(
    (checkbox) => checkbox.value
  );
}

function getFormData() {
  const formData = new FormData(studentForm);

  return {
    name: formData.get("studentName")?.toString().trim() || "",
    email: formData.get("email")?.toString().trim() || "",
    phone: formData.get("phone")?.toString().trim() || "",
    dob: formData.get("dob")?.toString().trim() || "",
    gender: formData.get("gender")?.toString() || "",
    course: formData.get("course")?.toString() || "",
    skills: getSelectedSkills(),
    about: formData.get("about")?.toString().trim() || "",
    photo: photoInput.files[0] || null
  };
}

function validateName(name) {
  const regex = /^[A-Za-z\s]{3,40}$/;
  if (!name) return "Student name is required.";
  if (name.length < 3) return "Student name must be at least 3 characters.";
  if (name.length > 40) return "Student name cannot exceed 40 characters.";
  if (!regex.test(name)) return "Student name can only contain letters and spaces.";
  return "";
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required.";
  if (!regex.test(email)) return "Please enter a valid email address.";
  return "";
}

function validatePhone(phone) {
  const regex = /^\d{10}$/;
  if (!phone) return "Phone number is required.";
  if (!regex.test(phone)) return "Phone number must be exactly 10 digits.";
  return "";
}

function validateDob(dob) {
  if (!dob) return "Date of birth is required.";

  const dobDate = new Date(dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dobDate > today) return "Future dates are not allowed.";

  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();
  const actualAge =
    monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

  if (actualAge < 15) return "Student age must be at least 15 years.";
  return "";
}

function validateGender(gender) {
  if (!gender) return "Please select a gender.";
  return "";
}

function validateCourse(course) {
  if (!course) return "Please select a course.";
  return "";
}

function validateSkills(skills) {
  if (skills.length === 0) return "Please select at least one skill.";
  return "";
}

function validateAbout(about) {
  if (!about) return "About student is required.";
  if (about.trim() === "") return "Spaces-only input is not allowed.";
  if (about.length < 20) return "About student must contain at least 20 characters.";
  if (about.length > 200) return "About student cannot exceed 200 characters.";
  return "";
}

function validatePhoto(file) {
  if (!file) return "Profile photo is required.";

  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) return "Only JPG and PNG image files are allowed.";
  return "";
}

function validateForm() {
  const { name, email, phone, dob, gender, course, skills, about, photo } = getFormData();

  const validations = {
    studentName: validateName(name),
    email: validateEmail(email),
    phone: validatePhone(phone),
    dob: validateDob(dob),
    gender: validateGender(gender),
    course: validateCourse(course),
    skills: validateSkills(skills),
    about: validateAbout(about),
    photo: validatePhoto(photo)
  };

  Object.entries(validations).forEach(([field, message]) => {
    showError(field, message);
  });

  return Object.values(validations).every((message) => message === "");
}

function updateCharacterCounter() {
  const count = aboutInput.value.trimStart().length;
  charCounter.textContent = `${count} / 200`;
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function calculateStats() {
  const stats = {};
  courseLabels.forEach((course) => {
    stats[course] = students.filter((student) => student.course === course).length;
  });

  document.getElementById("totalStudents").textContent = students.length;

  const statMap = {
    "Web Development": "WebDevelopment",
    "UI/UX": "UIUX",
    "Python": "Python",
    "Data Analytics": "DataAnalytics",
    "MERN Stack": "MERNStack",
    "Cloud Computing": "CloudComputing"
  };

  courseLabels.forEach((course) => {
    const element = document.getElementById(statMap[course]);
    if (element) {
      element.textContent = stats[course];
    }
  });
}

function createPhotoUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Image reading failed"));
    reader.readAsDataURL(file);
  });
}

async function handleFormSubmit(event) {
  event.preventDefault();

  clearAllErrors();

  if (!validateForm()) {
    return;
  }

  const { name, email, phone, dob, gender, course, skills, about, photo } = getFormData();
  const photoUrl = photo ? await createPhotoUrl(photo) : "";

  if (editingId !== null) {
    const studentIndex = students.findIndex((student) => student.id === editingId);
    if (studentIndex !== -1) {
      students[studentIndex] = {
        ...students[studentIndex],
        name,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        photo: photoUrl || students[studentIndex].photo
      };
    }
  } else {
    students.push({
      id: nextId,
      name,
      email,
      phone,
      dob,
      gender,
      course,
      skills,
      about,
      photo: photoUrl
    });
    nextId += 1;
  }

  saveStudents();
  renderStudents();
  calculateStats();
  resetFormState();
}

function renderStudents() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchText);
    const matchesCourse =
      selectedCourse === "All Courses" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  studentContainer.innerHTML = "";

  if (filteredStudents.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "no-students";
    emptyState.textContent = "No students found";
    studentContainer.appendChild(emptyState);
    return;
  }

  filteredStudents.forEach((student) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.setAttribute("data-id", student.id);

    const photo = document.createElement("img");
    photo.src = student.photo || "https://via.placeholder.com/110";
    photo.alt = `${student.name} profile`;
    photo.className = "student-photo";

    const name = document.createElement("h3");
    name.textContent = student.name;

    const meta = document.createElement("div");
    meta.className = "student-meta";
    meta.innerHTML = `
      <div><strong>Email:</strong> ${student.email}</div>
      <div><strong>Phone:</strong> ${student.phone}</div>
      <div><strong>DOB:</strong> ${formatDate(student.dob)}</div>
      <div><strong>Gender:</strong> ${student.gender}</div>
      <div><strong>Course:</strong> ${student.course}</div>
    `;

    const skillsWrap = document.createElement("div");
    skillsWrap.className = "student-skills";
    student.skills.forEach((skill) => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.textContent = skill;
      skillsWrap.appendChild(tag);
    });

    const about = document.createElement("p");
    about.className = "student-about";
    about.textContent = `About: ${student.about}`;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action-btn edit-btn";
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action-btn delete-btn";
    deleteButton.textContent = "Delete";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    card.appendChild(photo);
    card.appendChild(name);
    card.appendChild(meta);
    card.appendChild(skillsWrap);
    card.appendChild(about);
    card.appendChild(actions);

    studentContainer.appendChild(card);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function populateForm(student) {
  document.getElementById("studentName").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("phone").value = student.phone;
  document.getElementById("dob").value = student.dob;

  const genderInput = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
  if (genderInput) {
    genderInput.checked = true;
  }

  document.getElementById("course").value = student.course;

  document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
    checkbox.checked = student.skills.includes(checkbox.value);
  });

  document.getElementById("about").value = student.about;
  updateCharacterCounter();

  submitBtn.textContent = "Update Student";
  editingId = student.id;
}

function resetFormState() {
  studentForm.reset();
  clearAllErrors();
  updateCharacterCounter();
  editingId = null;
  submitBtn.textContent = "Register Student";
}

studentForm.addEventListener("submit", handleFormSubmit);

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

aboutInput.addEventListener("input", () => {
  clearError("about");
  updateCharacterCounter();
});

["studentName", "email", "phone", "dob", "course"].forEach((fieldId) => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener("input", () => clearError(fieldId));
    field.addEventListener("change", () => clearError(fieldId));
  }
});

document.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", () => clearError("gender"));
});

document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => clearError("skills"));
});

photoInput.addEventListener("change", () => clearError("photo"));

resetBtn.addEventListener("click", resetFormState);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "Light Mode"
    : "Dark Mode";
});

studentContainer.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");
  if (deleteButton) {
    const card = deleteButton.closest(".student-card");
    const studentId = Number(card?.dataset.id);
    const student = students.find((item) => item.id === studentId);

    if (!student) return;

    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    const index = students.findIndex((item) => item.id === studentId);
    if (index !== -1) {
      students.splice(index, 1);
      saveStudents();
      renderStudents();
      calculateStats();
    }
    return;
  }

  const editButton = event.target.closest(".edit-btn");
  if (editButton) {
    const card = editButton.closest(".student-card");
    const studentId = Number(card?.dataset.id);
    const student = students.find((item) => item.id === studentId);

    if (student) {
      populateForm(student);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});

function init() {
  calculateStats();
  renderStudents();
  updateCharacterCounter();
}

init();