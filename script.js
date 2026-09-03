const students = [];

try {
  const storedStudents = JSON.parse(localStorage.getItem("students") || "[]");
  if (Array.isArray(storedStudents)) {
    students.push(...storedStudents);
  }
} catch (error) {
  localStorage.removeItem("students");
}

const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentPhone = document.getElementById("studentPhone");
const studentDob = document.getElementById("studentDob");
const studentCourse = document.getElementById("studentCourse");
const studentAbout = document.getElementById("studentAbout");
const studentPhoto = document.getElementById("studentPhoto");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const studentContainer = document.getElementById("studentContainer");
const charCounter = document.querySelector(".char-counter");
const themeToggle = document.getElementById("themeToggle");

function setError(fieldName, message) {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearAllErrors() {
  document.querySelectorAll(".error-message").forEach((element) => {
    element.textContent = "";
  });
}

function getGenderValue() {
  const selectedGender = document.querySelector('input[name="gender"]:checked');
  return selectedGender ? selectedGender.value : "";
}

function getSelectedSkills() {
  return [...document.querySelectorAll('input[name="skills"]:checked')].map((checkbox) => checkbox.value);
}

function updateCharCounter() {
  const usedLength = studentAbout.value.trim().length;
  charCounter.textContent = `${usedLength} / 200`;
}

function validateName() {
  const value = studentName.value.trim();

  if (!value) {
    return "Student name is required.";
  }
  if (value.length < 3) {
    return "Name must be at least 3 characters.";
  }
  if (value.length > 40) {
    return "Name cannot exceed 40 characters.";
  }
  if (!/^[A-Za-z ]+$/.test(value)) {
    return "Only letters and spaces are allowed.";
  }

  return "";
}

function validateEmail() {
  const value = studentEmail.value.trim();

  if (!value) {
    return "Email is required.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
}

function validatePhone() {
  const value = studentPhone.value.trim();

  if (!value) {
    return "Phone number is required.";
  }
  if (!/^\d{10}$/.test(value)) {
    return "Phone number must be exactly 10 digits.";
  }

  return "";
}

function validateDob() {
  const value = studentDob.value;

  if (!value) {
    return "Date of birth is required.";
  }

  const selectedDate = new Date(value);
  const today = new Date();
  const minimumAgeDate = new Date();
  minimumAgeDate.setFullYear(today.getFullYear() - 15);

  if (selectedDate > today) {
    return "Future dates are not allowed.";
  }
  if (selectedDate > minimumAgeDate) {
    return "Student must be at least 15 years old.";
  }

  return "";
}

function validateGender() {
  if (!getGenderValue()) {
    return "Please select a gender.";
  }

  return "";
}

function validateCourse() {
  if (!studentCourse.value) {
    return "Please select a course.";
  }

  return "";
}

function validateSkills() {
  if (getSelectedSkills().length === 0) {
    return "Please select at least one skill.";
  }

  return "";
}

function validateAbout() {
  const value = studentAbout.value.trim();

  if (!value) {
    return "About student is required.";
  }
  if (value.length < 20) {
    return "About should have at least 20 characters.";
  }
  if (value.length > 200) {
    return "About cannot exceed 200 characters.";
  }

  return "";
}

function validatePhoto() {
  const file = studentPhoto.files[0];
  const editingId = form.dataset.editingId;
  const existingPhoto = form.dataset.currentPhoto || "";

  if (file) {
    const fileName = file.name.toLowerCase();
    const allowedExtensions = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png");
    const allowedTypes = file.type === "image/jpeg" || file.type === "image/png";

    if (!allowedExtensions || !allowedTypes) {
      return "Only .jpg, .jpeg, and .png image files are allowed.";
    }
    return "";
  }

  if (editingId && existingPhoto) {
    return "";
  }

  return "Profile photo is required.";
}

function validateField(fieldName) {
  const validators = {
    studentName: validateName,
    studentEmail: validateEmail,
    studentPhone: validatePhone,
    studentDob: validateDob,
    gender: validateGender,
    studentCourse: validateCourse,
    skills: validateSkills,
    studentAbout: validateAbout,
    studentPhoto: validatePhoto,
  };

  const message = validators[fieldName] ? validators[fieldName]() : "";
  setError(fieldName, message);
  return !message;
}

function validateForm() {
  const checks = [
    validateField("studentName"),
    validateField("studentEmail"),
    validateField("studentPhone"),
    validateField("studentDob"),
    validateField("gender"),
    validateField("studentCourse"),
    validateField("skills"),
    validateField("studentAbout"),
    validateField("studentPhoto"),
  ];

  return checks.every(Boolean);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function updateStatistics() {
  const totals = {
    "Web Development": 0,
    "UI/UX": 0,
    Python: 0,
    "Data Analytics": 0,
    "MERN Stack": 0,
    "Cloud Computing": 0,
  };

  students.forEach((student) => {
    if (totals[student.course] !== undefined) {
      totals[student.course] += 1;
    }
  });

  document.getElementById("totalStudents").textContent = students.length;

  Object.keys(totals).forEach((course) => {
    const target = document.getElementById(`course-${course}`);
    if (target) {
      target.textContent = totals[course];
    }
  });
}

function renderStudents() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchText);
    const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  if (filteredStudents.length === 0) {
    studentContainer.innerHTML = '<p class="no-students">No students found</p>';
    return;
  }

  studentContainer.innerHTML = filteredStudents
    .map(
      (student) => `
        <div class="student-card" data-id="${student.id}">
          <img src="${student.photo || "https://via.placeholder.com/300x220?text=No+Photo"}" alt="${student.name}" />
          <h3>${student.name}</h3>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Phone:</strong> ${student.phone}</p>
          <p><strong>DOB:</strong> ${student.dob}</p>
          <p><strong>Gender:</strong> ${student.gender}</p>
          <p><strong>Course:</strong> ${student.course}</p>
          <p class="skills"><strong>Skills:</strong> ${student.skills.join(", ")}</p>
          <p><strong>About:</strong> ${student.about}</p>
          <div class="card-actions">
            <button type="button" class="edit-btn">Edit</button>
            <button type="button" class="delete-btn">Delete</button>
          </div>
        </div>
      `
    )
    .join("");
}

function resetFormState() {
  form.reset();
  clearAllErrors();
  updateCharCounter();
  studentPhoto.value = "";
  submitBtn.textContent = "Register Student";
  delete form.dataset.editingId;
  delete form.dataset.currentPhoto;
}

function resetForm() {
  resetFormState();
  renderStudents();
}

function populateForm(student) {
  studentName.value = student.name;
  studentEmail.value = student.email;
  studentPhone.value = student.phone;
  studentDob.value = student.dob;
  studentCourse.value = student.course;
  studentAbout.value = student.about;
  updateCharCounter();

  document.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.checked = radio.value === student.gender;
  });

  document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
    checkbox.checked = student.skills.includes(checkbox.value);
  });

  form.dataset.editingId = String(student.id);
  form.dataset.currentPhoto = student.photo || "";
  studentPhoto.value = "";
  submitBtn.textContent = "Update Student";
  clearAllErrors();
}

async function submitStudent(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const file = studentPhoto.files[0];
  let photoValue = form.dataset.currentPhoto || "";

  if (file) {
    try {
      photoValue = await readFileAsDataURL(file);
    } catch (error) {
      setError("studentPhoto", "Unable to read the selected image. Please try again.");
      return;
    }
  }

  const studentData = {
    name: studentName.value.trim(),
    email: studentEmail.value.trim(),
    phone: studentPhone.value.trim(),
    dob: studentDob.value,
    gender: getGenderValue(),
    course: studentCourse.value,
    skills: getSelectedSkills(),
    about: studentAbout.value.trim(),
    photo: photoValue,
  };

  const editingId = form.dataset.editingId;

  if (editingId) {
    const studentIndex = students.findIndex((student) => student.id === Number(editingId));
    if (studentIndex !== -1) {
      students[studentIndex] = { ...students[studentIndex], ...studentData };
    }
  } else {
    const nextId = students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1;
    students.push({ id: nextId, ...studentData });
  }

  saveStudents();
  updateStatistics();
  renderStudents();
  resetFormState();
}

function handleCardClick(event) {
  const editButton = event.target.closest(".edit-btn");
  const deleteButton = event.target.closest(".delete-btn");

  if (editButton) {
    const card = editButton.closest(".student-card");
    const selectedId = Number(card.dataset.id);
    const student = students.find((item) => item.id === selectedId);

    if (student) {
      populateForm(student);
    }
    return;
  }

  if (deleteButton) {
    const card = deleteButton.closest(".student-card");
    const selectedId = Number(card.dataset.id);

    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) {
      return;
    }

    const studentIndex = students.findIndex((student) => student.id === selectedId);
    if (studentIndex !== -1) {
      students.splice(studentIndex, 1);
      saveStudents();
      updateStatistics();
      renderStudents();
    }
  }
}

function handleLiveValidation(event) {
  const target = event.target;

  if (target === studentName) {
    setError("studentName", validateName());
  }
  if (target === studentEmail) {
    setError("studentEmail", validateEmail());
  }
  if (target === studentPhone) {
    setError("studentPhone", validatePhone());
  }
  if (target === studentDob) {
    setError("studentDob", validateDob());
  }
  if (target.matches('input[name="gender"]')) {
    setError("gender", validateGender());
  }
  if (target === studentCourse) {
    setError("studentCourse", validateCourse());
  }
  if (target.matches('input[name="skills"]')) {
    setError("skills", validateSkills());
  }
  if (target === studentAbout) {
    setError("studentAbout", validateAbout());
    updateCharCounter();
  }
  if (target === studentPhoto) {
    setError("studentPhoto", validatePhoto());
  }
}

form.addEventListener("submit", submitStudent);
resetBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
studentContainer.addEventListener("click", handleCardClick);

[studentName, studentEmail, studentPhone, studentDob, studentCourse, studentAbout, studentPhoto].forEach((field) => {
  field.addEventListener("input", handleLiveValidation);
  field.addEventListener("change", handleLiveValidation);
});

document.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", handleLiveValidation);
});

document.querySelectorAll('input[name="skills"]').forEach((checkbox) => {
  checkbox.addEventListener("change", handleLiveValidation);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

updateCharCounter();
updateStatistics();
renderStudents();
