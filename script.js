const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dobError = document.getElementById("dobError");
const genderError = document.getElementById("genderError");
const courseError = document.getElementById("courseError");
const skillsError = document.getElementById("skillsError");
const aboutError = document.getElementById("aboutError");
const photoError = document.getElementById("photoError");

const studentCount = document.getElementById("studentCount");
const studentsContainer = document.getElementById("studentsContainer");

let totalStudents = 0;

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.classList.remove("input-error");
  });
}

function showError(element, errorElement, message) {
  if (element) element.classList.add("input-error");
  errorElement.textContent = message;
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  let isValid = true;

  const nameRegex = /^[A-Za-z ]+$/;
  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameValue = studentName.value.trim();
  const emailValue = email.value.trim();
  const phoneValue = phone.value.trim();
  const dobValue = dob.value;
  const courseValue = course.value;
  const aboutValue = about.value.trim();

  if (nameValue === "") {
    showError(studentName, nameError, "Student name is required.");
    isValid = false;
  } else if (nameValue.length < 3) {
    showError(
      studentName,
      nameError,
      "Student name must contain at least 3 characters.",
    );
    isValid = false;
  } else if (!nameRegex.test(nameValue)) {
    showError(studentName, nameError, "Only letters and spaces are allowed.");
    isValid = false;
  }

  if (emailValue === "") {
    showError(email, emailError, "Email is required.");
    isValid = false;
  } else if (!emailRegex.test(emailValue)) {
    showError(email, emailError, "Enter a valid email address.");
    isValid = false;
  }

  if (phoneValue === "") {
    showError(phone, phoneError, "Phone number is required.");
    isValid = false;
  } else if (!phoneRegex.test(phoneValue)) {
    showError(
      phone,
      phoneError,
      "Phone number must contain exactly 10 digits.",
    );
    isValid = false;
  }

  if (dobValue === "") {
    showError(dob, dobError, "Date of birth is required.");
    isValid = false;
  } else {
    const selectedDate = new Date(dobValue);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      showError(dob, dobError, "Future dates are not allowed.");
      isValid = false;
    }
  }

  const selectedGender = document.querySelector('input[name="gender"]:checked');

  if (!selectedGender) {
    genderError.textContent = "Please select a gender.";
    isValid = false;
  }

  if (courseValue === "") {
    showError(course, courseError, "Please select a course.");
    isValid = false;
  }

  const selectedSkills = document.querySelectorAll(
    'input[name="skills"]:checked',
  );

  if (selectedSkills.length === 0) {
    skillsError.textContent = "Please select at least one skill.";
    isValid = false;
  }

  if (aboutValue === "") {
    showError(about, aboutError, "About Student is required.");
    isValid = false;
  }

  if (photo.files.length === 0) {
    showError(photo, photoError, "Please select a profile photo.");
    isValid = false;
  }

  // Stop immediately when validation fails
  if (!isValid) return;

  const skills = Array.from(selectedSkills).map((skill) => skill.value);

  const photoURL = URL.createObjectURL(photo.files[0]);

  const studentCard = document.createElement("div");
  studentCard.classList.add("student-card");

  studentCard.innerHTML = `
    <img src="${photoURL}" alt="${nameValue}">
    <h3>${nameValue}</h3>
    <p><strong>Email:</strong> ${emailValue}</p>
    <p><strong>Phone:</strong> ${phoneValue}</p>
    <p><strong>Date of Birth:</strong> ${dobValue}</p>
    <p><strong>Gender:</strong> ${selectedGender.value}</p>
    <p><strong>Course:</strong> ${courseValue}</p>
    <p><strong>Skills:</strong> ${skills.join(", ")}</p>
    <p><strong>About:</strong> ${aboutValue}</p>
  `;

  const emptyMessage = document.getElementById("emptyMessage");
  if (emptyMessage) emptyMessage.remove();

  studentsContainer.appendChild(studentCard);

  totalStudents++;
  studentCount.textContent = totalStudents;

  studentForm.reset();

  alert("Student registered successfully!");
});
