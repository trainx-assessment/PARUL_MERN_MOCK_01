const students = [];

const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("photo");
const resetBtn = document.getElementById("resetBtn");
const studentCount = document.getElementById("studentCount");
const studentContainer = document.getElementById("studentContainer");
const emptyMessage = document.getElementById("emptyMessage");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dobError = document.getElementById("dobError");
const genderError = document.getElementById("genderError");
const courseError = document.getElementById("courseError");
const skillsError = document.getElementById("skillsError");
const aboutError = document.getElementById("aboutError");
const photoError = document.getElementById("photoError");

function clearErrors() {
  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
  dobError.textContent = "";
  genderError.textContent = "";
  courseError.textContent = "";
  skillsError.textContent = "";
  aboutError.textContent = "";
  photoError.textContent = "";

  studentName.classList.remove("input-error");
  email.classList.remove("input-error");
  phone.classList.remove("input-error");
  dob.classList.remove("input-error");
  course.classList.remove("input-error");
  about.classList.remove("input-error");
}

function updateCount() {
  studentCount.textContent = "Total Students: " + students.length;
  if (emptyMessage) {
    emptyMessage.style.display = students.length === 0 ? "block" : "none";
  }
}

function createStudentCard(student) {
  const card = document.createElement("div");
  card.classList.add("student-card");
  card.setAttribute("data-id", student.id);

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");

  const img = document.createElement("img");
  img.classList.add("card-photo");
  img.src = student.photo;
  img.alt = student.name;

  const title = document.createElement("h3");
  title.textContent = student.name;

  cardHeader.appendChild(img);
  cardHeader.appendChild(title);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  function makeItem(label, value) {
    const item = document.createElement("div");
    item.classList.add("card-item");

    const strong = document.createElement("strong");
    strong.textContent = label + ":";

    const span = document.createElement("span");
    span.textContent = value;

    item.appendChild(strong);
    item.appendChild(span);
    return item;
  }

  cardBody.appendChild(makeItem("Email", student.email));
  cardBody.appendChild(makeItem("Phone", student.phone));
  cardBody.appendChild(makeItem("DOB", student.dob));
  cardBody.appendChild(makeItem("Gender", student.gender));
  cardBody.appendChild(makeItem("Course", student.course));

  const skillsDiv = document.createElement("div");
  skillsDiv.classList.add("card-skills");

  const skillsTitle = document.createElement("strong");
  skillsTitle.textContent = "Skills:";
  skillsDiv.appendChild(skillsTitle);

  student.skills.forEach(function (skill) {
    const tag = document.createElement("span");
    tag.classList.add("skill-tag");
    tag.textContent = skill;
    skillsDiv.appendChild(tag);
  });

  cardBody.appendChild(skillsDiv);

  const aboutDiv = document.createElement("div");
  aboutDiv.classList.add("card-about");

  const aboutTitle = document.createElement("strong");
  aboutTitle.textContent = "About:";

  const aboutText = document.createElement("p");
  aboutText.textContent = student.about;

  aboutDiv.appendChild(aboutTitle);
  aboutDiv.appendChild(aboutText);
  cardBody.appendChild(aboutDiv);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";

  card.appendChild(cardHeader);
  card.appendChild(cardBody);
  card.appendChild(deleteBtn);

  studentContainer.appendChild(card);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  let isValid = true;

  const nameVal = studentName.value.trim();
  const namePattern = /^[A-Za-z ]{3,}$/;
  if (nameVal === "") {
    nameError.textContent = "Name is required";
    studentName.classList.add("input-error");
    isValid = false;
  } else if (!namePattern.test(nameVal)) {
    nameError.textContent = "Name must be at least 3 characters and contain only letters";
    studentName.classList.add("input-error");
    isValid = false;
  }

  const emailVal = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailVal === "") {
    emailError.textContent = "Email is required";
    email.classList.add("input-error");
    isValid = false;
  } else if (!emailPattern.test(emailVal)) {
    emailError.textContent = "Enter a valid email address";
    email.classList.add("input-error");
    isValid = false;
  }

  const phoneVal = phone.value.trim();
  const phonePattern = /^[0-9]{10}$/;
  if (phoneVal === "") {
    phoneError.textContent = "Phone number is required";
    phone.classList.add("input-error");
    isValid = false;
  } else if (!phonePattern.test(phoneVal)) {
    phoneError.textContent = "Phone must be exactly 10 digits";
    phone.classList.add("input-error");
    isValid = false;
  }

  const dobVal = dob.value;
  if (dobVal === "") {
    dobError.textContent = "Date of birth is required";
    dob.classList.add("input-error");
    isValid = false;
  } else {
    const enteredDate = new Date(dobVal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (enteredDate > today) {
      dobError.textContent = "Future dates are not allowed";
      dob.classList.add("input-error");
      isValid = false;
    }
  }

  const genderElem = document.querySelector('input[name="gender"]:checked');
  if (!genderElem) {
    genderError.textContent = "Please select a gender";
    isValid = false;
  }

  const courseVal = course.value;
  if (courseVal === "") {
    courseError.textContent = "Please select a course";
    course.classList.add("input-error");
    isValid = false;
  }

  const skillElems = document.querySelectorAll('input[name="skills"]:checked');
  if (skillElems.length === 0) {
    skillsError.textContent = "Please select at least one skill";
    isValid = false;
  }

  const aboutVal = about.value;
  if (aboutVal.trim() === "") {
    aboutError.textContent = "About student is required";
    about.classList.add("input-error");
    isValid = false;
  }

  if (!photo.files || photo.files.length === 0) {
    photoError.textContent = "Please select a profile photo";
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const skillsArr = [];
  skillElems.forEach(function (cb) {
    skillsArr.push(cb.value);
  });

  const file = photo.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const newStudent = {
      id: Date.now(),
      name: nameVal,
      email: emailVal,
      phone: phoneVal,
      dob: dobVal,
      gender: genderElem.value,
      course: courseVal,
      skills: skillsArr,
      about: aboutVal.trim(),
      photo: e.target.result
    };

    students.push(newStudent);
    createStudentCard(newStudent);
    updateCount();

    form.reset();
    clearErrors();
  };

  reader.readAsDataURL(file);
});

resetBtn.addEventListener("click", function () {
  setTimeout(clearErrors, 0);
});

studentContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const card = event.target.closest(".student-card");
    if (card) {
      const studentId = Number(card.getAttribute("data-id"));
      const index = students.findIndex(function (s) {
        return s.id === studentId;
      });

      if (index !== -1) {
        students.splice(index, 1);
      }

      card.remove();
      updateCount();
    }
  }
});

updateCount();
