const form = document.getElementById("student-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about-student");
const photoInput = document.getElementById("profile-photo");
const genderInputs = document.querySelectorAll('input[name="gender"]');
const skillInputs = document.querySelectorAll('input[name="skills"]');
const cardsContainer = document.getElementById("student-cards");
const submitButton = document.getElementById("submit-button");

const students = [];
let editingStudentId = null;
let nextStudentId = 1;
const courseNames = [
  "Web Development",
  "UI/UX",
  "Python",
  "Data Analytics",
  "MERN Stack",
  "Cloud Computing",
];

function setError(id, message, input) {
  document.getElementById(id).textContent = message;
  if (input) input.classList.toggle("input-error", message !== "");
}

function getGender() {
  for (let i = 0; i < genderInputs.length; i++) {
    if (genderInputs[i].checked) return genderInputs[i].value;
  }
  return "";
}

function getSkills() {
  const skills = [];
  for (let i = 0; i < skillInputs.length; i++) {
    if (skillInputs[i].checked) skills.push(skillInputs[i].value);
  }
  return skills;
}

function validDate() {
  if (dobInput.value === "") return false;
  const selectedDate = new Date(dobInput.value + "T00:00:00");
  const today = new Date();
  const fifteenYearsAgo = new Date(
    today.getFullYear() - 15,
    today.getMonth(),
    today.getDate(),
  );
  return selectedDate <= today && selectedDate <= fifteenYearsAgo;
}

function validateForm() {
  let valid = true;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const about = aboutInput.value.trim();

  if (name === "") {
    setError("name-error", "Name is required.", nameInput);
    valid = false;
  } else if (
    name.length < 3 ||
    name.length > 40 ||
    !/^[a-zA-Z ]+$/.test(name)
  ) {
    setError("name-error", "Use 3-40 letters and spaces only.", nameInput);
    valid = false;
  } else setError("name-error", "", nameInput);

  if (email === "") {
    setError("email-error", "Email is required.", emailInput);
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email-error", "Enter a valid email address.", emailInput);
    valid = false;
  } else setError("email-error", "", emailInput);

  if (!/^\d{10}$/.test(phone)) {
    setError("phone-error", "Enter exactly 10 digits.", phoneInput);
    valid = false;
  } else setError("phone-error", "", phoneInput);

  if (!validDate()) {
    setError("dob-error", "Use a date at least 15 years ago.", dobInput);
    valid = false;
  } else setError("dob-error", "", dobInput);

  if (getGender() === "") {
    setError("gender-error", "Please select a gender.");
    valid = false;
  } else setError("gender-error", "");

  if (courseInput.value === "") {
    setError("course-error", "Please select a course.", courseInput);
    valid = false;
  } else setError("course-error", "", courseInput);

  if (getSkills().length === 0) {
    setError("skills-error", "Select at least one skill.");
    valid = false;
  } else setError("skills-error", "");

  if (about.length < 20 || about.length > 200) {
    setError(
      "about-student-error",
      "Write between 20 and 200 characters.",
      aboutInput,
    );
    valid = false;
  } else setError("about-student-error", "", aboutInput);

  const hasPhoto = photoInput.files.length > 0;
  if (editingStudentId === null && !hasPhoto) {
    setError(
      "profile-photo-error",
      "Please upload a profile photo.",
      photoInput,
    );
    valid = false;
  } else if (hasPhoto && !photoInput.files[0].type.startsWith("image/")) {
    setError("profile-photo-error", "Please choose an image file.", photoInput);
    valid = false;
  } else setError("profile-photo-error", "", photoInput);
  return valid;
}

function addText(parent, label, value) {
  const paragraph = document.createElement("p");
  paragraph.textContent = label + value;
  parent.appendChild(paragraph);
}

function displayStudents() {
  cardsContainer.innerHTML = "";
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const card = document.createElement("article");
    card.className = "student-card";
    card.dataset.id = student.id;

    const image = document.createElement("img");
    image.className = "student-photo";
    image.src = student.photo;
    image.alt = student.name + " photo";
    card.appendChild(image);

    const heading = document.createElement("h3");
    heading.textContent = student.name;
    card.appendChild(heading);
    addText(card, "Email: ", student.email);
    addText(card, "Phone: ", student.phone);
    addText(card, "DOB: ", student.dob);
    addText(card, "Gender: ", student.gender);
    addText(card, "Course: ", student.course);
    addText(card, "Skills: ", student.skills.join(", "));
    addText(card, "About: ", student.about);

    const buttons = document.createElement("div");
    buttons.className = "card-buttons";
    buttons.innerHTML =
      '<button class="edit-button" type="button">Edit</button><button class="delete-button" type="button">Delete</button>';
    card.appendChild(buttons);
    cardsContainer.appendChild(card);
  }
}

function updateStatistics() {
  document.getElementById("total-students").textContent = students.length;
  const statistics = document.getElementById("course-statistics");
  statistics.innerHTML = "";
  for (let i = 0; i < courseNames.length; i++) {
    let total = 0;
    for (let j = 0; j < students.length; j++) {
      if (students[j].course === courseNames[i]) total++;
    }
    const item = document.createElement("p");
    item.textContent = courseNames[i] + ": " + total;
    statistics.appendChild(item);
  }
}

function clearFormState() {
  editingStudentId = null;
  submitButton.textContent = "Register Student";
  document.getElementById("about-counter").textContent = "0 / 200";
  document.querySelectorAll(".error-message").forEach(function (error) {
    error.textContent = "";
  });
  document.querySelectorAll(".input-error").forEach(function (input) {
    input.classList.remove("input-error");
  });
}

function resetForm() {
  form.reset();
  clearFormState();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateForm()) return;

  const newPhoto =
    photoInput.files.length > 0 ? URL.createObjectURL(photoInput.files[0]) : "";
  if (editingStudentId !== null) {
    const student = students.find(function (item) {
      return item.id === editingStudentId;
    });
    student.name = nameInput.value.trim();
    student.email = emailInput.value.trim();
    student.phone = phoneInput.value.trim();
    student.dob = dobInput.value;
    student.gender = getGender();
    student.course = courseInput.value;
    student.skills = getSkills();
    student.about = aboutInput.value.trim();
    if (newPhoto !== "") student.photo = newPhoto;
  } else {
    students.push({
      id: nextStudentId++,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: getGender(),
      course: courseInput.value,
      skills: getSkills(),
      about: aboutInput.value.trim(),
      photo: newPhoto,
    });
  }
  displayStudents();
  updateStatistics();
  resetForm();
});

form.addEventListener("reset", function () {
  setTimeout(clearFormState, 0);
});

aboutInput.addEventListener("input", function () {
  document.getElementById("about-counter").textContent =
    aboutInput.value.length + " / 200";
  if (aboutInput.classList.contains("input-error")) validateForm();
});

nameInput.addEventListener("input", function () {
  if (nameInput.classList.contains("input-error")) validateForm();
});
emailInput.addEventListener("input", function () {
  if (emailInput.classList.contains("input-error")) validateForm();
});
phoneInput.addEventListener("input", function () {
  if (phoneInput.classList.contains("input-error")) validateForm();
});
dobInput.addEventListener("change", function () {
  if (dobInput.classList.contains("input-error")) validateForm();
});
courseInput.addEventListener("change", function () {
  if (courseInput.classList.contains("input-error")) validateForm();
});
photoInput.addEventListener("change", function () {
  if (photoInput.classList.contains("input-error")) validateForm();
});
genderInputs.forEach(function (input) {
  input.addEventListener("change", function () {
    if (document.getElementById("gender-error").textContent !== "")
      validateForm();
  });
});
skillInputs.forEach(function (input) {
  input.addEventListener("change", function () {
    if (document.getElementById("skills-error").textContent !== "")
      validateForm();
  });
});


cardsContainer.addEventListener("click", function (event) {
  const card = event.target.closest(".student-card");
  if (!card) return;
  const studentId = Number(card.dataset.id);

  if (event.target.classList.contains("delete-button")) {
    if (confirm("Are you sure you want to delete this student?")) {
      const studentIndex = students.findIndex(function (student) {
        return student.id === studentId;
      });
      students.splice(studentIndex, 1);
      displayStudents();
      updateStatistics();
      if (editingStudentId === studentId) resetForm();
    }
  }

  if (event.target.classList.contains("edit-button")) {
    const student = students.find(function (item) {
      return item.id === studentId;
    });
    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseInput.value = student.course;
    aboutInput.value = student.about;
    document.getElementById("about-counter").textContent =
      student.about.length + " / 200";
    genderInputs.forEach(function (input) {
      input.checked = input.value === student.gender;
    });
    skillInputs.forEach(function (input) {
      input.checked = student.skills.includes(input.value);
    });
    editingStudentId = student.id;
    submitButton.textContent = "Update Student";
    form.scrollIntoView({ behavior: "smooth" });
  }
});

updateStatistics();


function serachByName(){
    
}