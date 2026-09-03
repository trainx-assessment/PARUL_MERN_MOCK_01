const form = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");

const counter = document.getElementById("counter");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dobError = document.getElementById("dobError");
const genderError = document.getElementById("genderError");
const courseError = document.getElementById("courseError");
const skillsError = document.getElementById("skillsError");
const aboutError = document.getElementById("aboutError");
const photoError = document.getElementById("photoError");

const students = [];
let studentId = 1;

const studentContainer = document.getElementById("studentContainer");

about.addEventListener("input", function () {
  counter.textContent = about.value.length + " / 200";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
  dobError.textContent = "";
  genderError.textContent = "";
  courseError.textContent = "";
  skillsError.textContent = "";
  aboutError.textContent = "";
  photoError.textContent = "";

  let isValid = true;

  const namePattern = /^[A-Za-z ]{3,40}$/;

  if (studentName.value.trim() === "") {
    nameError.textContent = "Student name is required";
    isValid = false;
  } else if (!namePattern.test(studentName.value.trim())) {
    nameError.textContent =
      "Name must contain only letters and spaces (3-40 characters)";
    isValid = false;
  }

  if (email.value.trim() === "") {
    emailError.textContent = "Email is required";
    isValid = false;
  } else if (!email.value.includes("@")) {
    emailError.textContent = "Enter a valid email";
    isValid = false;
  }

  const phonePattern = /^[0-9]{10}$/;

  if (phone.value.trim() === "") {
    phoneError.textContent = "Phone number is required";
    isValid = false;
  } else if (!phonePattern.test(phone.value)) {
    phoneError.textContent = "Phone number must contain exactly 10 digits";
    isValid = false;
  }

  if (dob.value === "") {
    dobError.textContent = "Date of birth is required";
    isValid = false;
  } else {
    const selectedDate = new Date(dob.value);
    const today = new Date();

    if (selectedDate > today) {
      dobError.textContent = "Future date is not allowed";
      isValid = false;
    }
  }

  const gender = document.querySelector('input[name="gender"]:checked');

  if (!gender) {
    genderError.textContent = "Please select gender";
    isValid = false;
  }

  if (course.value === "") {
    courseError.textContent = "Please select a course";
    isValid = false;
  }

  const skills = document.querySelectorAll('input[name="skills"]:checked');

  if (skills.length === 0) {
    skillsError.textContent = "Select at least one skill";
    isValid = false;
  }

  if (about.value.trim() === "") {
    aboutError.textContent = "About Student is required";
    isValid = false;
  } else if (about.value.trim().length < 20) {
    aboutError.textContent = "Minimum 20 characters required";
    isValid = false;
  }

  if (photo.files.length === 0) {
    photoError.textContent = "Profile photo is required";
    isValid = false;
  } else if (!photo.files[0].type.startsWith("image/")) {
    photoError.textContent = "Only image files are allowed";
    isValid = false;
  }

  if (isValid) {
    const selectedSkills = [];

    skills.forEach(function (skill) {
      selectedSkills.push(skill.value);
    });

    const student = {
      id: studentId,
      name: studentName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      dob: dob.value,
      gender: gender.value,
      course: course.value,
      skills: selectedSkills,
      about: about.value.trim(),
      photo: URL.createObjectURL(photo.files[0]),
    };

    students.push(student);

    displayStudent(student);

    studentId++;

    console.log(students);

    alert("Student registered successfully");

    form.reset();

    counter.textContent = "0 / 200";
  }
});

function displayStudent(student) {
  const card = document.createElement("div");

  card.classList.add("student-card");

  card.setAttribute("data-id", student.id);

  const image = document.createElement("img");

  image.src = student.photo;
  image.alt = student.name;

  const name = document.createElement("h2");

  name.textContent = student.name;

  const emailText = document.createElement("p");

  emailText.textContent = "Email: " + student.email;

  const phoneText = document.createElement("p");

  phoneText.textContent = "Phone: " + student.phone;

  const dobText = document.createElement("p");

  dobText.textContent = "DOB: " + student.dob;

  const genderText = document.createElement("p");

  genderText.textContent = "Gender: " + student.gender;

  const courseText = document.createElement("p");

  courseText.textContent = "Course: " + student.course;

  const skillsText = document.createElement("p");

  skillsText.textContent = "Skills: " + student.skills.join(", ");

  const aboutText = document.createElement("p");

  aboutText.textContent = "About: " + student.about;

  const editButton = document.createElement("button");

  editButton.textContent = "Edit";

  editButton.classList.add("edit-btn");

  const deleteButton = document.createElement("button");

  deleteButton.textContent = "Delete";

  deleteButton.classList.add("delete-btn");

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(emailText);
  card.appendChild(phoneText);
  card.appendChild(dobText);
  card.appendChild(genderText);
  card.appendChild(courseText);
  card.appendChild(skillsText);
  card.appendChild(aboutText);
  card.appendChild(editButton);
  card.appendChild(deleteButton);

  studentContainer.appendChild(card);
}

console.log(students);
