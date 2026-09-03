const students = [];
let nextId = 1;
let editingId = null;

const studentForm = document.querySelector("#studentForm");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
const aboutCount = document.querySelector("#aboutCount");
const submitBtn = document.querySelector("#submitBtn");

const nameMsg = document.querySelector("#nameMsg");
const emailMsg = document.querySelector("#emailMsg");
const phoneMsg = document.querySelector("#phoneMsg");
const dobMsg = document.querySelector("#dobMsg");
const genderMsg = document.querySelector("#genderMsg");
const courseMsg = document.querySelector("#courseMsg");
const skillsMsg = document.querySelector("#skillsMsg");
const aboutMsg = document.querySelector("#aboutMsg");
const photoMsg = document.querySelector("#photoMsg");

const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const phoneRegex = /^[0-9]{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName() {
  const value = nameInput.value.trim();
  if (value === "") {
    nameMsg.textContent = "Student name is required.";
    return false;
  }
  if (value.length < 3 || value.length > 40) {
    nameMsg.textContent = "Name must be between 3 and 40 characters.";
    return false;
  }
  if (!nameRegex.test(value)) {
    nameMsg.textContent = "Only letters and spaces are allowed.";
    return false;
  }
  nameMsg.textContent = "";
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (value === "") {
    emailMsg.textContent = "Email is required.";
    return false;
  }
  if (!emailRegex.test(value)) {
    emailMsg.textContent = "Enter a valid email address.";
    return false;
  }
  emailMsg.textContent = "";
  return true;
}

function validatePhone() {
  const value = phoneInput.value.trim();
  if (value === "") {
    phoneMsg.textContent = "Phone number is required.";
    return false;
  }
  if (!phoneRegex.test(value)) {
    phoneMsg.textContent = "Phone number must be exactly 10 digits.";
    return false;
  }
  phoneMsg.textContent = "";
  return true;
}

function validateDob() {
  const value = dobInput.value;
  if (value === "") {
    dobMsg.textContent = "Date of birth is required.";
    return false;
  }
  const dobDate = new Date(value);
  const today = new Date();
  if (dobDate > today) {
    dobMsg.textContent = "Future dates are not allowed.";
    return false;
  }
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  if (age < 15) {
    dobMsg.textContent = "Student must be at least 15 years old.";
    return false;
  }
  dobMsg.textContent = "";
  return true;
}

function validateGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  if (!selected) {
    genderMsg.textContent = "Please select a gender.";
    return false;
  }
  genderMsg.textContent = "";
  return true;
}

function validateCourse() {
  if (courseInput.value === "") {
    courseMsg.textContent = "Please select a course.";
    return false;
  }
  courseMsg.textContent = "";
  return true;
}

function validateSkills() {
  const checked = document.querySelectorAll('input[name="skills"]:checked');
  if (checked.length === 0) {
    skillsMsg.textContent = "Select at least one skill.";
    return false;
  }
  skillsMsg.textContent = "";
  return true;
}

function validateAbout() {
  const value = aboutInput.value.trim();
  if (value === "") {
    aboutMsg.textContent = "About Student is required.";
    return false;
  }
  if (value.length < 20 || value.length > 200) {
    aboutMsg.textContent = "About Student must be between 20 and 200 characters.";
    return false;
  }
  aboutMsg.textContent = "";
  return true;
}

function validatePhoto() {
  const files = photoInput.files;
  if (files.length === 0) {
    if (editingId !== null) {
      photoMsg.textContent = "";
      return true;
    }
    photoMsg.textContent = "Profile photo is required.";
    return false;
  }
  if (!files[0].type.startsWith("image/")) {
    photoMsg.textContent = "Only image files are allowed.";
    return false;
  }
  photoMsg.textContent = "";
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
    validatePhoto()
  ];
  return results.every(Boolean);
}

const studentContainer = document.querySelector("#studentContainer");

function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  const photo = document.createElement("img");
  photo.src = student.photo ? URL.createObjectURL(student.photo) : "";
  photo.alt = student.name;
  card.appendChild(photo);

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

  const actions = document.createElement("div");
  actions.classList.add("cardActions");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("editBtn");
  actions.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("deleteBtn");
  actions.appendChild(deleteBtn);

  card.appendChild(actions);

  return card;
}

function renderStudents(list) {
  studentContainer.textContent = "";
  list.forEach(function (student) {
    studentContainer.appendChild(createStudentCard(student));
  });
  if (list.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No students found";
    studentContainer.appendChild(noResults);
  }
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCourse = courseFilter.value;

  const filtered = students.filter(function (student) {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm);
    const matchesCourse = selectedCourse === "" || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  renderStudents(filtered);
}

const totalStudents = document.querySelector("#totalStudents");
const courseStats = document.querySelectorAll("#courseStats li");

function updateStats() {
  totalStudents.textContent = "Total Students: " + students.length;

  courseStats.forEach(function (item) {
    const course = item.getAttribute("data-course");
    const count = students.filter(function (student) {
      return student.course === course;
    }).length;
    item.textContent = course + ": " + count;
  });
}

function getSelectedSkills() {
  const checked = document.querySelectorAll('input[name="skills"]:checked');
  return Array.from(checked).map(function (box) {
    return box.value;
  });
}

function getSelectedGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  return selected ? selected.value : "";
}

function fillFormForEdit(student) {
  nameInput.value = student.name;
  emailInput.value = student.email;
  phoneInput.value = student.phone;
  dobInput.value = student.dob;

  document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
    radio.checked = radio.value === student.gender;
  });

  courseInput.value = student.course;

  document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
    checkbox.checked = student.skills.includes(checkbox.value);
  });

  aboutInput.value = student.about;
  aboutCount.textContent = student.about.length;
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  if (editingId !== null) {
    const student = students.find(function (item) {
      return item.id === editingId;
    });
    student.name = nameInput.value.trim();
    student.email = emailInput.value.trim();
    student.phone = phoneInput.value.trim();
    student.dob = dobInput.value;
    student.gender = getSelectedGender();
    student.course = courseInput.value;
    student.skills = getSelectedSkills();
    student.about = aboutInput.value.trim();
    if (photoInput.files.length > 0) {
      student.photo = photoInput.files[0];
    }
  } else {
    const student = {
      id: nextId,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: getSelectedGender(),
      course: courseInput.value,
      skills: getSelectedSkills(),
      about: aboutInput.value.trim(),
      photo: photoInput.files[0]
    };
    students.push(student);
    nextId++;
  }

  applyFilters();
  updateStats();
  studentForm.reset();
});

studentForm.addEventListener("reset", function () {
  aboutCount.textContent = "0";
  nameMsg.textContent = "";
  emailMsg.textContent = "";
  phoneMsg.textContent = "";
  dobMsg.textContent = "";
  genderMsg.textContent = "";
  courseMsg.textContent = "";
  skillsMsg.textContent = "";
  aboutMsg.textContent = "";
  photoMsg.textContent = "";
  editingId = null;
  submitBtn.textContent = "Register Student";
});

studentContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("deleteBtn")) {
    const card = event.target.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));

    const confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) {
      return;
    }

    const index = students.findIndex(function (student) {
      return student.id === id;
    });
    if (index !== -1) {
      students.splice(index, 1);
    }

    applyFilters();
    updateStats();
    return;
  }

  if (event.target.classList.contains("editBtn")) {
    const card = event.target.closest(".student-card");
    const id = Number(card.getAttribute("data-id"));
    const student = students.find(function (item) {
      return item.id === id;
    });
    if (!student) {
      return;
    }

    fillFormForEdit(student);
    editingId = id;
    submitBtn.textContent = "Update Student";
  }
});

const themeToggleBtn = document.querySelector("#themeToggleBtn");

themeToggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("darkMode");
  const isDark = document.body.classList.contains("darkMode");
  themeToggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

searchInput.addEventListener("input", applyFilters);
courseFilter.addEventListener("change", applyFilters);

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
dobInput.addEventListener("input", validateDob);
courseInput.addEventListener("change", validateCourse);
photoInput.addEventListener("change", validatePhoto);

document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
  radio.addEventListener("change", validateGender);
});

document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
  checkbox.addEventListener("change", validateSkills);
});

aboutInput.addEventListener("input", function () {
  aboutCount.textContent = aboutInput.value.length;
  validateAbout();
});