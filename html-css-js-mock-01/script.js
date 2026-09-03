const form = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const charCount = document.querySelector("#charCount");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");
const formTitle = document.querySelector("#formTitle");

const studentContainer = document.querySelector("#studentContainer");
const totalStudentsEl = document.querySelector("#totalStudents");
const courseStatsList = document.querySelector("#courseStats");

const searchInput = document.querySelector("#searchInput");
const filterCourseSelect = document.querySelector("#filterCourse");

const darkModeBtn = document.querySelector("#darkModeBtn");

let students = [];
let editingId = null;
let currentPhotoData = "";

function loadStudents() {
  const stored = localStorage.getItem("students");
  if (stored) {
    students = JSON.parse(stored);
  }
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function setError(fieldId, message) {
  const errEl = document.querySelector("#err-" + fieldId);
  if (errEl) {
    errEl.textContent = message;
  }
}

function clearError(fieldId) {
  setError(fieldId, "");
}

function validateName() {
  const value = studentNameInput.value.trim();
  const nameRegex = /^[A-Za-z ]{3,40}$/;
  if (!nameRegex.test(value)) {
    setError("studentName", "Enter a valid name (letters and spaces only, 3-40 characters)");
    return false;
  }
  clearError("studentName");
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    setError("email", "Enter a valid email address");
    return false;
  }
  clearError("email");
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(value)) {
    setError("phone", "Enter a valid 10 digit phone number");
    return false;
  }
  clearError("phone");
  return true;
}

function validateDob() {
  const value = dobInput.value;
  if (!value) {
    setError("dob", "Date of birth is required");
    return false;
  }
  const dobDate = new Date(value);
  const today = new Date();
  if (dobDate > today) {
    setError("dob", "Date of birth cannot be in the future");
    return false;
  }
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  if (age < 15) {
    setError("dob", "Student must be at least 15 years old");
    return false;
  }
  clearError("dob");
  return true;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) {
    setError("gender", "Please select a gender");
    return false;
  }
  clearError("gender");
  return true;
}

function validateCourse() {
  if (!courseInput.value) {
    setError("course", "Please select a course");
    return false;
  }
  clearError("course");
  return true;
}

function validateSkills() {
  const checked = document.querySelectorAll('input[name="skills"]:checked');
  if (checked.length === 0) {
    setError("skills", "Please select at least one skill");
    return false;
  }
  clearError("skills");
  return true;
}

function validateAbout() {
  const value = aboutInput.value.trim();
  if (value.length < 20 || value.length > 200) {
    setError("about", "About must be between 20 and 200 characters");
    return false;
  }
  clearError("about");
  return true;
}

function validatePhoto() {
  if (editingId !== null && currentPhotoData) {
    clearError("photo");
    return true;
  }
  const file = photoInput.files[0];
  if (!file) {
    setError("photo", "Profile photo is required");
    return false;
  }
  if (!file.type.startsWith("image/")) {
    setError("photo", "Only image files are accepted");
    return false;
  }
  clearError("photo");
  return true;
}

aboutInput.addEventListener("input", function () {
  charCount.textContent = aboutInput.value.length + " / 200";
  validateAbout();
});

studentNameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
dobInput.addEventListener("change", validateDob);
courseInput.addEventListener("change", validateCourse);
document.querySelectorAll('input[name="gender"]').forEach(function (el) {
  el.addEventListener("change", validateGender);
});
document.querySelectorAll('input[name="skills"]').forEach(function (el) {
  el.addEventListener("change", validateSkills);
});
photoInput.addEventListener("change", validatePhoto);

function getNextId() {
  if (students.length === 0) {
    return 1;
  }
  const maxId = Math.max.apply(null, students.map(function (s) { return s.id; }));
  return maxId + 1;
}

function updateStats(filteredList) {
  const list = filteredList || students;
  totalStudentsEl.textContent = "Total Students: " + students.length;
  const items = courseStatsList.querySelectorAll("li");
  items.forEach(function (item) {
    const course = item.getAttribute("data-course");
    const count = students.filter(function (s) { return s.course === course; }).length;
    item.textContent = course + ": " + count;
  });
}

function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  if (student.photo) {
    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = student.name;
    card.appendChild(img);
  }

  const heading = document.createElement("h3");
  heading.textContent = student.name;
  card.appendChild(heading);

  const email = document.createElement("p");
  email.textContent = "Email: " + student.email;
  card.appendChild(email);

  const phone = document.createElement("p");
  phone.textContent = "Phone: " + student.phone;
  card.appendChild(phone);

  const dob = document.createElement("p");
  dob.textContent = "DOB: " + student.dob;
  card.appendChild(dob);

  const gender = document.createElement("p");
  gender.textContent = "Gender: " + student.gender;
  card.appendChild(gender);

  const course = document.createElement("p");
  course.textContent = "Course: " + student.course;
  card.appendChild(course);

  const skills = document.createElement("p");
  skills.textContent = "Skills: " + student.skills.join(", ");
  card.appendChild(skills);

  const about = document.createElement("p");
  about.textContent = "About: " + student.about;
  card.appendChild(about);

  const buttonRow = document.createElement("div");
  buttonRow.classList.add("card-buttons");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-btn");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-btn");

  buttonRow.appendChild(editButton);
  buttonRow.appendChild(deleteButton);
  card.appendChild(buttonRow);

  return card;
}

function renderStudents() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const filterValue = filterCourseSelect.value;

  const filtered = students.filter(function (student) {
    const matchesSearch = student.name.toLowerCase().includes(searchValue);
    const matchesCourse = filterValue === "" || student.course === filterValue;
    return matchesSearch && matchesCourse;
  });

  studentContainer.innerHTML = "";

  if (filtered.length === 0) {
    const noResults = document.createElement("p");
    noResults.classList.add("no-results");
    noResults.textContent = "No students found";
    studentContainer.appendChild(noResults);
  } else {
    filtered.forEach(function (student) {
      const card = createStudentCard(student);
      studentContainer.appendChild(card);
    });
  }

  updateStats();
}

function resetForm() {
  form.reset();
  charCount.textContent = "0 / 200";
  document.querySelectorAll(".error-msg").forEach(function (el) {
    el.textContent = "";
  });
  editingId = null;
  currentPhotoData = "";
  submitBtn.textContent = "Register Student";
  formTitle.textContent = "Register Student";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isDobValid = validateDob();
  const isGenderValid = validateGender();
  const isCourseValid = validateCourse();
  const isSkillsValid = validateSkills();
  const isAboutValid = validateAbout();
  const isPhotoValid = validatePhoto();

  const allValid = isNameValid && isEmailValid && isPhoneValid && isDobValid &&
    isGenderValid && isCourseValid && isSkillsValid && isAboutValid && isPhotoValid;

  if (!allValid) {
    return;
  }

  const gender = document.querySelector('input[name="gender"]:checked').value;
  const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(function (el) {
    return el.value;
  });

  const file = photoInput.files[0];

  function saveStudent(photoData) {
    if (editingId !== null) {
      const student = students.find(function (s) { return s.id === editingId; });
      student.name = studentNameInput.value.trim();
      student.email = emailInput.value.trim();
      student.phone = phoneInput.value.trim();
      student.dob = dobInput.value;
      student.gender = gender;
      student.course = courseInput.value;
      student.skills = skills;
      student.about = aboutInput.value.trim();
      if (photoData) {
        student.photo = photoData;
      }
    } else {
      const newStudent = {
        id: getNextId(),
        name: studentNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: gender,
        course: courseInput.value,
        skills: skills,
        about: aboutInput.value.trim(),
        photo: photoData
      };
      students.push(newStudent);
    }

    saveStudents();
    renderStudents();
    resetForm();
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      saveStudent(reader.result);
    };
    reader.readAsDataURL(file);
  } else {
    saveStudent(currentPhotoData);
  }
});

resetBtn.addEventListener("click", function () {
  resetForm();
});

studentContainer.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-btn");
  if (deleteButton) {
    const card = event.target.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));
    const confirmed = confirm("Are you sure you want to delete this student?");
    if (confirmed) {
      students = students.filter(function (s) { return s.id !== id; });
      saveStudents();
      renderStudents();
    }
    return;
  }

  const editButton = event.target.closest(".edit-btn");
  if (editButton) {
    const card = event.target.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));
    const student = students.find(function (s) { return s.id === id; });

    studentNameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    document.querySelector('input[name="gender"][value="' + student.gender + '"]').checked = true;
    courseInput.value = student.course;

    document.querySelectorAll('input[name="skills"]').forEach(function (el) {
      el.checked = student.skills.includes(el.value);
    });

    aboutInput.value = student.about;
    charCount.textContent = student.about.length + " / 200";

    currentPhotoData = student.photo;
    editingId = student.id;
    submitBtn.textContent = "Update Student";
    formTitle.textContent = "Update Student";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

searchInput.addEventListener("input", renderStudents);
filterCourseSelect.addEventListener("change", renderStudents);

darkModeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.textContent = "Light Mode";
  } else {
    darkModeBtn.textContent = "Dark Mode";
  }
});

loadStudents();
renderStudents();