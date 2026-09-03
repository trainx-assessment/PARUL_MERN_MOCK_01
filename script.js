let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;
let photoData = "";

const form = document.querySelector("#studentForm");
const nameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const registerBtn = document.querySelector("#registerBtn");
const resetBtn = document.querySelector("#resetBtn");
const cardsContainer = document.querySelector("#studentCardsContainer");
const searchInput = document.querySelector("#searchInput");
const filterCourse = document.querySelector("#filterCourse");
const totalStudentsSpan = document.querySelector("#totalStudents");

const nameRegex = /^[A-Za-z ]{3,40}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

let counterEl = document.createElement("small");
counterEl.id = "aboutCounter";
counterEl.textContent = "0 / 200";
aboutInput.parentElement.appendChild(counterEl);

aboutInput.addEventListener("input", function () {
  counterEl.textContent = aboutInput.value.length + " / 200";
});

photoInput.addEventListener("change", function () {
  let file = photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    photoData = "";
    return;
  }
  let reader = new FileReader();
  reader.onload = function () {
    photoData = reader.result;
  };
  reader.readAsDataURL(file);
});

function showError(input, msg) {
  clearError(input);
  let err = document.createElement("span");
  err.classList.add("error-msg");
  err.textContent = msg;
  err.style.color = "red";
  err.style.fontSize = "12px";
  input.parentElement.appendChild(err);
}

function clearError(input) {
  let existing = input.parentElement.querySelector(".error-msg");
  if (existing) existing.remove();
}

function validateName() {
  let val = nameInput.value.trim();
  if (val === "") {
    showError(nameInput, "Name is required");
    return false;
  }
  if (!nameRegex.test(val)) {
    showError(nameInput, "Enter valid name (letters only, 3-40 chars)");
    return false;
  }
  clearError(nameInput);
  return true;
}

function validateEmail() {
  let val = emailInput.value.trim();
  if (val === "" || !emailRegex.test(val)) {
    showError(emailInput, "Enter valid email");
    return false;
  }
  clearError(emailInput);
  return true;
}

function validatePhone() {
  let val = phoneInput.value.trim();
  if (!phoneRegex.test(val)) {
    showError(phoneInput, "Phone must be 10 digits");
    return false;
  }
  clearError(phoneInput);
  return true;
}

function validateDob() {
  let val = dobInput.value;
  if (val === "") {
    showError(dobInput, "DOB is required");
    return false;
  }
  let dobDate = new Date(val);
  let today = new Date();
  if (dobDate > today) {
    showError(dobInput, "Future date not allowed");
    return false;
  }
  let age = today.getFullYear() - dobDate.getFullYear();
  let m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  if (age < 15) {
    showError(dobInput, "Student must be at least 15 years old");
    return false;
  }
  clearError(dobInput);
  return true;
}

function validateGender() {
  let checked = document.querySelector('input[name="gender"]:checked');
  let firstRadio = document.querySelector('input[name="gender"]');
  if (!checked) {
    showError(firstRadio, "Select gender");
    return false;
  }
  clearError(firstRadio);
  return true;
}

function validateCourse() {
  if (courseInput.value === "") {
    showError(courseInput, "Select a course");
    return false;
  }
  clearError(courseInput);
  return true;
}

function validateSkills() {
  let checked = document.querySelectorAll('input[name="skills"]:checked');
  let firstSkill = document.querySelector('input[name="skills"]');
  if (checked.length === 0) {
    showError(firstSkill, "Select at least one skill");
    return false;
  }
  clearError(firstSkill);
  return true;
}

function validateAbout() {
  let val = aboutInput.value.trim();
  if (val === "") {
    showError(aboutInput, "About is required");
    return false;
  }
  if (val.length < 20 || val.length > 200) {
    showError(aboutInput, "About must be 20-200 characters");
    return false;
  }
  clearError(aboutInput);
  return true;
}

function validatePhoto() {
  if (editId !== null && photoData !== "") {
    clearError(photoInput);
    return true;
  }
  if (photoInput.files.length === 0) {
    showError(photoInput, "Photo is required");
    return false;
  }
  let file = photoInput.files[0];
  if (!file.type.startsWith("image/")) {
    showError(photoInput, "Only image files allowed");
    return false;
  }
  clearError(photoInput);
  return true;
}

function calcStats() {
  let stats = {
    "Web Development": 0,
    "UI/UX": 0,
    Python: 0,
    "Data Analytics": 0,
    "MERN Stack": 0,
    "Cloud Computing": 0,
  };
  for (let i = 0; i < students.length; i++) {
    stats[students[i].course]++;
  }
  return stats;
}

function updateStats() {
  totalStudentsSpan.textContent = students.length;
  let stats = calcStats();
  let statsContainer = document.querySelector("#statsContainer");
  let courseStatsEl = document.querySelector("#courseStats");
  if (!courseStatsEl) {
    courseStatsEl = document.createElement("div");
    courseStatsEl.id = "courseStats";
    statsContainer.appendChild(courseStatsEl);
  }
  courseStatsEl.innerHTML = "";
  for (let course in stats) {
    let p = document.createElement("p");
    p.textContent = course + ": " + stats[course];
    courseStatsEl.appendChild(p);
  }
}

function createCard(student) {
  let card = document.createElement("div");
  card.classList.add("studentCard");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  let img = document.createElement("img");
  img.src = student.photo || "";
  card.appendChild(img);

  let h3 = document.createElement("h3");
  h3.textContent = student.name;
  card.appendChild(h3);

  let email = document.createElement("p");
  email.textContent = "Email: " + student.email;
  card.appendChild(email);

  let phone = document.createElement("p");
  phone.textContent = "Phone: " + student.phone;
  card.appendChild(phone);

  let dob = document.createElement("p");
  dob.textContent = "DOB: " + student.dob;
  card.appendChild(dob);

  let gender = document.createElement("p");
  gender.textContent = "Gender: " + student.gender;
  card.appendChild(gender);

  let course = document.createElement("p");
  course.textContent = "Course: " + student.course;
  card.appendChild(course);

  let skills = document.createElement("p");
  skills.textContent = "Skills: " + student.skills.join(", ");
  card.appendChild(skills);

  let about = document.createElement("p");
  about.textContent = "About: " + student.about;
  card.appendChild(about);

  let btnDiv = document.createElement("div");
  btnDiv.classList.add("cardButtons");

  let editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("editBtn");

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("deleteBtn");

  btnDiv.appendChild(editBtn);
  btnDiv.appendChild(deleteBtn);
  card.appendChild(btnDiv);

  return card;
}

function renderCards(list) {
  cardsContainer.innerHTML = "";
  if (list.length === 0) {
    let msg = document.createElement("p");
    msg.textContent = "No students found";
    cardsContainer.appendChild(msg);
    return;
  }
  for (let i = 0; i < list.length; i++) {
    let card = createCard(list[i]);
    cardsContainer.appendChild(card);
  }
}

function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function applyFilters() {
  let searchVal = searchInput.value.toLowerCase().trim();
  let courseVal = filterCourse.value;

  let filtered = students.filter(function (s) {
    let matchName = s.name.toLowerCase().includes(searchVal);
    let matchCourse = courseVal === "all" || s.course === courseVal;
    return matchName && matchCourse;
  });

  renderCards(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterCourse.addEventListener("change", applyFilters);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let v1 = validateName();
  let v2 = validateEmail();
  let v3 = validatePhone();
  let v4 = validateDob();
  let v5 = validateGender();
  let v6 = validateCourse();
  let v7 = validateSkills();
  let v8 = validateAbout();
  let v9 = validatePhoto();

  if (!(v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8 && v9)) {
    return;
  }

  let genderVal = document.querySelector('input[name="gender"]:checked').value;
  let skillsChecked = document.querySelectorAll('input[name="skills"]:checked');
  let skillsArr = [];
  for (let i = 0; i < skillsChecked.length; i++) {
    skillsArr.push(skillsChecked[i].value);
  }

  if (editId !== null) {
    let student = students.find(function (s) {
      return s.id === editId;
    });
    student.name = nameInput.value.trim();
    student.email = emailInput.value.trim();
    student.phone = phoneInput.value.trim();
    student.dob = dobInput.value;
    student.gender = genderVal;
    student.course = courseInput.value;
    student.skills = skillsArr;
    student.about = aboutInput.value.trim();
    if (photoData !== "") {
      student.photo = photoData;
    }
    editId = null;
    registerBtn.textContent = "Register Student";
  } else {
    let newStudent = {
      id: Date.now(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: genderVal,
      course: courseInput.value,
      skills: skillsArr,
      about: aboutInput.value.trim(),
      photo: photoData,
    };
    students.push(newStudent);
  }

  saveToStorage();
  applyFilters();
  updateStats();
  resetForm();
});

function resetForm() {
  form.reset();
  photoData = "";
  editId = null;
  registerBtn.textContent = "Register Student";
  counterEl.textContent = "0 / 200";
  document.querySelectorAll(".error-msg").forEach(function (el) {
    el.remove();
  });
}

resetBtn.addEventListener("click", function () {
  resetForm();
});

cardsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("deleteBtn")) {
    let card = event.target.closest(".studentCard");
    let id = Number(card.getAttribute("data-id"));

    let sure = confirm("Are you sure you want to delete this student?");
    if (!sure) return;

    students = students.filter(function (s) {
      return s.id !== id;
    });

    saveToStorage();
    applyFilters();
    updateStats();
  }

  if (event.target.classList.contains("editBtn")) {
    let card = event.target.closest(".studentCard");
    let id = Number(card.getAttribute("data-id"));
    let student = students.find(function (s) {
      return s.id === id;
    });

    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseInput.value = student.course;
    aboutInput.value = student.about;
    counterEl.textContent = student.about.length + " / 200";

    document.querySelectorAll('input[name="gender"]').forEach(function (r) {
      r.checked = r.value === student.gender;
    });

    document.querySelectorAll('input[name="skills"]').forEach(function (c) {
      c.checked = student.skills.includes(c.value);
    });

    photoData = student.photo;
    editId = student.id;
    registerBtn.textContent = "Update Student";
    window.scrollTo(0, 0);
  }
});

applyFilters();
updateStats();
