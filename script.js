let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

const studentForm = document.getElementById("studentForm");
const formHeading = document.getElementById("formHeading");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const studentId = document.getElementById("studentId");
const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentPhone = document.getElementById("studentPhone");
const studentDob = document.getElementById("studentDob");
const studentCourse = document.getElementById("studentCourse");
const studentAbout = document.getElementById("studentAbout");
const charCount = document.getElementById("charCount");
const studentPhoto = document.getElementById("studentPhoto");
const imagePreview = document.getElementById("imagePreview");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const dobError = document.getElementById("dobError");
const genderError = document.getElementById("genderError");
const courseError = document.getElementById("courseError");
const skillsError = document.getElementById("skillsError");
const aboutError = document.getElementById("aboutError");
const photoError = document.getElementById("photoError");

const statTotal = document.getElementById("statTotal");
const statWebDev = document.getElementById("statWebDev");
const statUiUx = document.getElementById("statUiUx");
const statPython = document.getElementById("statPython");
const statDataAnalytics = document.getElementById("statDataAnalytics");
const statMern = document.getElementById("statMern");
const statCloud = document.getElementById("statCloud");

const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");
const studentContainer = document.getElementById("studentContainer");
const noStudentsMsg = document.getElementById("noStudentsMsg");
const themeToggleBtn = document.getElementById("themeToggleBtn");

let photoData = "";

studentAbout.addEventListener("input", function () {
  charCount.textContent = studentAbout.value.length + " / 200";
});

studentPhoto.addEventListener("change", function () {
  const file = studentPhoto.files[0];
  if (file) {
    if (!file.type.startsWith("image/")) {
      photoError.textContent = "Please select a valid image file.";
      imagePreview.src = "";
      imagePreview.classList.add("hidden");
      photoData = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      photoData = e.target.result;
      imagePreview.src = photoData;
      imagePreview.classList.remove("hidden");
      photoError.textContent = "";
    };
    reader.readAsDataURL(file);
  }
});

themeToggleBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    themeToggleBtn.textContent = "Light Mode";
  } else {
    themeToggleBtn.textContent = "Dark Mode";
  }
});

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
}

function validateForm() {
  clearErrors();
  let isValid = true;

  const nameVal = studentName.value.trim();
  const namePattern = /^[a-zA-Z\s]{3,40}$/;
  if (nameVal === "") {
    nameError.textContent = "Student name is required.";
    isValid = false;
  } else if (!namePattern.test(nameVal)) {
    nameError.textContent = "Name must be 3-40 characters (letters and spaces only).";
    isValid = false;
  }

  const emailVal = studentEmail.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailVal === "") {
    emailError.textContent = "Email is required.";
    isValid = false;
  } else if (!emailPattern.test(emailVal)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  const phoneVal = studentPhone.value.trim();
  const phonePattern = /^[0-9]{10}$/;
  if (phoneVal === "") {
    phoneError.textContent = "Phone number is required.";
    isValid = false;
  } else if (!phonePattern.test(phoneVal)) {
    phoneError.textContent = "Phone number must be exactly 10 digits.";
    isValid = false;
  }

  const dobVal = studentDob.value;
  if (dobVal === "") {
    dobError.textContent = "Date of birth is required.";
    isValid = false;
  } else {
    const enteredDate = new Date(dobVal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (enteredDate >= today) {
      dobError.textContent = "Date of birth cannot be today or a future date.";
      isValid = false;
    } else {
      let age = today.getFullYear() - enteredDate.getFullYear();
      const m = today.getMonth() - enteredDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < enteredDate.getDate())) {
        age--;
      }
      if (age < 15) {
        dobError.textContent = "Student must be at least 15 years old.";
        isValid = false;
      }
    }
  }

  const checkedGender = document.querySelector('input[name="gender"]:checked');
  if (!checkedGender) {
    genderError.textContent = "Please select a gender.";
    isValid = false;
  }

  const courseVal = studentCourse.value;
  if (courseVal === "") {
    courseError.textContent = "Please select a course.";
    isValid = false;
  }

  const checkedSkills = document.querySelectorAll('input[name="skills"]:checked');
  if (checkedSkills.length === 0) {
    skillsError.textContent = "Please select at least one skill.";
    isValid = false;
  }

  const aboutVal = studentAbout.value.trim();
  if (aboutVal === "") {
    aboutError.textContent = "About student is required.";
    isValid = false;
  } else if (aboutVal.length < 20 || aboutVal.length > 200) {
    aboutError.textContent = "About section must be between 20 and 200 characters.";
    isValid = false;
  }

  if (editId === null && photoData === "") {
    photoError.textContent = "Profile photo is required.";
    isValid = false;
  }

  return isValid;
}

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const name = studentName.value.trim();
  const email = studentEmail.value.trim();
  const phone = studentPhone.value.trim();
  const dob = studentDob.value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const course = studentCourse.value;

  const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
  const skills = [];
  skillCheckboxes.forEach(function (box) {
    skills.push(box.value);
  });

  const about = studentAbout.value.trim();

  if (editId !== null) {
    for (let i = 0; i < students.length; i++) {
      if (students[i].id == editId) {
        students[i].name = name;
        students[i].email = email;
        students[i].phone = phone;
        students[i].dob = dob;
        students[i].gender = gender;
        students[i].course = course;
        students[i].skills = skills;
        students[i].about = about;
        if (photoData !== "") {
          students[i].photo = photoData;
        }
        break;
      }
    }
  } else {
    const newStudent = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      dob: dob,
      gender: gender,
      course: course,
      skills: skills,
      about: about,
      photo: photoData
    };
    students.push(newStudent);
  }

  saveData();
  resetForm();
  renderCards();
  updateStats();
});

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

function updateStats() {
  statTotal.textContent = students.length;

  let webCount = 0;
  let uiCount = 0;
  let pyCount = 0;
  let dataCount = 0;
  let mernCount = 0;
  let cloudCount = 0;

  for (let i = 0; i < students.length; i++) {
    const c = students[i].course;
    if (c === "Web Development") webCount++;
    else if (c === "UI/UX") uiCount++;
    else if (c === "Python") pyCount++;
    else if (c === "Data Analytics") dataCount++;
    else if (c === "MERN Stack") mernCount++;
    else if (c === "Cloud Computing") cloudCount++;
  }

  statWebDev.textContent = webCount;
  statUiUx.textContent = uiCount;
  statPython.textContent = pyCount;
  statDataAnalytics.textContent = dataCount;
  statMern.textContent = mernCount;
  statCloud.textContent = cloudCount;
}

function renderCards() {
  studentContainer.innerHTML = "";

  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCourse = filterCourse.value;

  const filtered = [];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const matchName = s.name.toLowerCase().includes(searchText);
    const matchCourse = selectedCourse === "All Courses" || s.course === selectedCourse;
    if (matchName && matchCourse) {
      filtered.push(s);
    }
  }

  if (filtered.length === 0) {
    noStudentsMsg.classList.remove("hidden");
  } else {
    noStudentsMsg.classList.add("hidden");
  }

  for (let i = 0; i < filtered.length; i++) {
    const student = filtered[i];

    const card = document.createElement("div");
    card.className = "student-card";
    card.setAttribute("data-id", student.id);

    const skillsText = student.skills.join(", ");

    card.innerHTML = `
      <div class="card-header-box">
        <img src="${student.photo || 'https://via.placeholder.com/80'}" alt="${student.name}" class="card-avatar">
        <div class="card-name-title">
          <h3>${student.name}</h3>
          <span class="card-course-badge">${student.course}</span>
        </div>
      </div>
      <div class="card-body-info">
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Phone:</strong> ${student.phone}</p>
        <p><strong>DOB:</strong> ${student.dob}</p>
        <p><strong>Gender:</strong> ${student.gender}</p>
        <p><strong>Skills:</strong> ${skillsText}</p>
        <div class="card-about-box"><strong>About:</strong> ${student.about}</div>
      </div>
      <div class="card-buttons">
        <button type="button" class="edit-btn">Edit</button>
        <button type="button" class="delete-btn">Delete</button>
      </div>
    `;

    studentContainer.appendChild(card);
  }
}

studentContainer.addEventListener("click", function (e) {
  const card = e.target.closest(".student-card");
  if (!card) return;

  const id = card.getAttribute("data-id");

  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      const remaining = [];
      for (let i = 0; i < students.length; i++) {
        if (students[i].id != id) {
          remaining.push(students[i]);
        }
      }
      students = remaining;
      saveData();

      if (editId == id) {
        resetForm();
      }

      renderCards();
      updateStats();
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    let targetStudent = null;
    for (let i = 0; i < students.length; i++) {
      if (students[i].id == id) {
        targetStudent = students[i];
        break;
      }
    }

    if (targetStudent) {
      editId = targetStudent.id;
      studentId.value = targetStudent.id;
      studentName.value = targetStudent.name;
      studentEmail.value = targetStudent.email;
      studentPhone.value = targetStudent.phone;
      studentDob.value = targetStudent.dob;
      studentCourse.value = targetStudent.course;
      studentAbout.value = targetStudent.about;
      charCount.textContent = targetStudent.about.length + " / 200";

      const radios = document.querySelectorAll('input[name="gender"]');
      radios.forEach(function (r) {
        r.checked = r.value === targetStudent.gender;
      });

      const checkboxes = document.querySelectorAll('input[name="skills"]');
      checkboxes.forEach(function (c) {
        c.checked = targetStudent.skills.includes(c.value);
      });

      if (targetStudent.photo) {
        imagePreview.src = targetStudent.photo;
        imagePreview.classList.remove("hidden");
        photoData = targetStudent.photo;
      } else {
        imagePreview.src = "";
        imagePreview.classList.add("hidden");
        photoData = "";
      }

      studentPhoto.value = "";
      clearErrors();

      submitBtn.textContent = "Update Student";
      formHeading.textContent = "Edit Student";

      window.scrollTo({ top: studentForm.offsetTop - 50, behavior: "smooth" });
    }
  }
});

function resetForm() {
  studentForm.reset();
  studentId.value = "";
  editId = null;
  photoData = "";
  submitBtn.textContent = "Register Student";
  formHeading.textContent = "Register Student";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
  charCount.textContent = "0 / 200";
  clearErrors();
}

resetBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderCards);
filterCourse.addEventListener("change", renderCards);

renderCards();
updateStats();
