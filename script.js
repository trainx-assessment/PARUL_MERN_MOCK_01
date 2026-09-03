const form = document.querySelector("#studentForm");

const nameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#photo");

const studentContainer = document.querySelector("#studentContainer");
const studentCountText = document.querySelector("#studentCount");
const emptyMessage = document.querySelector("#emptyMessage");
const charCount = document.querySelector("#charCount");
const resetBtn = document.querySelector("#resetBtn");

const students = [];
let nextId = 1;

function validateName() {
  const value = nameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]{3,}$/;

  if (value === "") {
    return "Name is required.";
  }
  if (!nameRegex.test(value)) {
    return "Name must be at least 3 letters, no numbers or symbols.";
  }
  return "";
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    return "Email is required.";
  }
  if (!emailRegex.test(value)) {
    return "Please enter a valid email address.";
  }
  return "";
}

function validatePhone() {
  const value = phoneInput.value.trim();
  const phoneRegex = /^[0-9]{10}$/;

  if (value === "") {
    return "Phone number is required.";
  }
  if (!phoneRegex.test(value)) {
    return "Phone number must be exactly 10 digits.";
  }
  return "";
}

function validateDob() {
  const value = dobInput.value;

  if (value === "") {
    return "Date of birth is required.";
  }

  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return "Date of birth cannot be in the future.";
  }
  return "";
}

function validateGender() {
  const genderChecked = document.querySelector('input[name="gender"]:checked');
  if (!genderChecked) {
    return "Please select a gender.";
  }
  return "";
}

function validateCourse() {
  if (courseInput.value === "") {
    return "Please select a course.";
  }
  return "";
}

function validateSkills() {
  const checkedSkills = document.querySelectorAll('input[name="skills"]:checked');
  if (checkedSkills.length === 0) {
    return "Please select at least one skill.";
  }
  return "";
}

function validateAbout() {
  const value = aboutInput.value.trim();
  if (value === "") {
    return "Please write something about the student.";
  }
  return "";
}

function validatePhoto() {
  if (photoInput.files.length === 0) {
    return "Please select a profile photo.";
  }
  return "";
}

function showError(errorId, message) {
  const errorSpan = document.querySelector("#" + errorId);
  errorSpan.textContent = message;
}

function clearAllErrors() {
  const allErrorSpans = document.querySelectorAll(".error-message");
  allErrorSpans.forEach(function (span) {
    span.textContent = "";
  });
}

function validateForm() {
  clearAllErrors();

  const nameError = validateName();
  const emailError = validateEmail();
  const phoneError = validatePhone();
  const dobError = validateDob();
  const genderError = validateGender();
  const courseError = validateCourse();
  const skillsError = validateSkills();
  const aboutError = validateAbout();
  const photoError = validatePhoto();

  showError("nameError", nameError);
  showError("emailError", emailError);
  showError("phoneError", phoneError);
  showError("dobError", dobError);
  showError("genderError", genderError);
  showError("courseError", courseError);
  showError("skillsError", skillsError);
  showError("aboutError", aboutError);
  showError("photoError", photoError);

  const allErrors = [
    nameError, emailError, phoneError, dobError,
    genderError, courseError, skillsError, aboutError, photoError
  ];

  const isValid = allErrors.every(function (msg) {
    return msg === "";
  });

  return isValid;
}

function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  const photoWrap = document.createElement("div");
  photoWrap.classList.add("photo-wrap");

  const photoImg = document.createElement("img");
  photoImg.src = student.photo;
  photoImg.alt = student.name + "'s photo";
  photoWrap.appendChild(photoImg);

  const nameHeading = document.createElement("h3");
  nameHeading.textContent = student.name;

  const emailPara = document.createElement("p");
  emailPara.innerHTML = "<strong>Email:</strong> ";
  emailPara.append(student.email);

  const phonePara = document.createElement("p");
  phonePara.innerHTML = "<strong>Phone:</strong> ";
  phonePara.append(student.phone);

  const dobPara = document.createElement("p");
  dobPara.innerHTML = "<strong>DOB:</strong> ";
  dobPara.append(student.dob);

  const genderPara = document.createElement("p");
  genderPara.innerHTML = "<strong>Gender:</strong> ";
  genderPara.append(student.gender);

  const coursePara = document.createElement("p");
  coursePara.innerHTML = "<strong>Course:</strong> ";
  coursePara.append(student.course);

  const skillsLabel = document.createElement("p");
  skillsLabel.innerHTML = "<strong>Skills:</strong>";

  const skillsWrap = document.createElement("div");
  skillsWrap.classList.add("skills-tags");

  student.skills.forEach(function (skill) {
    const tag = document.createElement("span");
    tag.classList.add("skill-tag");
    tag.textContent = skill;
    skillsWrap.appendChild(tag);
  });

  const aboutPara = document.createElement("p");
  aboutPara.innerHTML = "<strong>About:</strong> ";
  aboutPara.append(student.about);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-btn");
  deleteButton.textContent = "Delete";

  card.appendChild(photoWrap);
  card.appendChild(nameHeading);
  card.appendChild(emailPara);
  card.appendChild(phonePara);
  card.appendChild(dobPara);
  card.appendChild(genderPara);
  card.appendChild(coursePara);
  card.appendChild(skillsLabel);
  card.appendChild(skillsWrap);
  card.appendChild(aboutPara);
  card.appendChild(deleteButton);

  return card;
}

function updateStudentCount() {
  studentCountText.textContent = "Total Students: " + students.length;

  if (students.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

function resetForm() {
  form.reset();
  clearAllErrors();
  charCount.textContent = "0 / 200";
}

aboutInput.addEventListener("input", function () {
  charCount.textContent = aboutInput.value.length + " / 200";
});

resetBtn.addEventListener("click", function () {
  clearAllErrors();
  charCount.textContent = "0 / 200";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formIsValid = validateForm();

  if (!formIsValid) {
    return;
  }

  const genderChecked = document.querySelector('input[name="gender"]:checked');
  const checkedSkillBoxes = document.querySelectorAll('input[name="skills"]:checked');

  const selectedSkills = [];
  checkedSkillBoxes.forEach(function (box) {
    selectedSkills.push(box.value);
  });

  const photoFile = photoInput.files[0];
  const fileReader = new FileReader();

  fileReader.onload = function () {
    const newStudent = {
      id: nextId,
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      dob: dobInput.value,
      gender: genderChecked.value,
      course: courseInput.value,
      skills: selectedSkills,
      about: aboutInput.value.trim(),
      photo: fileReader.result
    };

    nextId = nextId + 1;

    students.push(newStudent);

    const newCard = createStudentCard(newStudent);
    studentContainer.appendChild(newCard);

    updateStudentCount();
    resetForm();
  };

  fileReader.readAsDataURL(photoFile);
});

studentContainer.addEventListener("click", function (event) {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const card = event.target.closest(".student-card");
  const studentId = Number(card.getAttribute("data-id"));

  const indexToRemove = students.findIndex(function (student) {
    return student.id === studentId;
  });

  if (indexToRemove !== -1) {
    students.splice(indexToRemove, 1);
  }

  card.remove();
  updateStudentCount();
});

updateStudentCount();