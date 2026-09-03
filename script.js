const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const dobInput = document.querySelector("#dob");
const aboutInput = document.querySelector("#about");
const counter = document.querySelector("#counter");

const submitButton = document.querySelector("#submitButton");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const darkModeButton = document.querySelector("#darkModeButton");

const totalStudents = document.querySelector("#totalStudents");

const students = [];

let editingId = null;

aboutInput.addEventListener("input", function () {
  counter.textContent = aboutInput.value.length + " / 200";
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  document.querySelectorAll(".error").forEach(function (error) {
    error.textContent = "";
  });

  let valid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const dob = dobInput.value;
  const gender = document.querySelector('input[name="gender"]:checked');
  const course = document.querySelector("#course").value;
  const skills = document.querySelectorAll('input[name="skills"]:checked');
  const about = aboutInput.value.trim();
  const photo = document.querySelector("#photo").files[0];

  if (!/^[A-Za-z ]+$/.test(name) || name.length < 3 || name.length > 40) {
    document.querySelector("#nameError").textContent = "Enter a valid name";
    valid = false;
  }

  if (email === "" || !emailInput.checkValidity()) {
    document.querySelector("#emailError").textContent = "Enter a valid email";
    valid = false;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    document.querySelector("#phoneError").textContent =
      "Phone must contain exactly 10 digits";
    valid = false;
  }

  if (dob === "") {
    document.querySelector("#dobError").textContent = "Select date of birth";
    valid = false;
  } else {
    const selectedDate = new Date(dob);
    const today = new Date();

    if (selectedDate > today) {
      document.querySelector("#dobError").textContent =
        "Date cannot be in the future";
      valid = false;
    }

    let age = today.getFullYear() - selectedDate.getFullYear();
    const month = today.getMonth() - selectedDate.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < selectedDate.getDate())
    ) {
      age--;
    }

    if (age < 15) {
      document.querySelector("#dobError").textContent =
        "Age must be at least 15";
      valid = false;
    }
  }

  if (!gender) {
    document.querySelector("#genderError").textContent = "Select gender";
    valid = false;
  }

  if (course === "") {
    document.querySelector("#courseError").textContent = "Select a course";
    valid = false;
  }

  if (skills.length === 0) {
    document.querySelector("#skillsError").textContent =
      "Select at least one skill";
    valid = false;
  }

  if (about.length < 20 || about.length > 200) {
    document.querySelector("#aboutError").textContent =
      "About must be between 20 and 200 characters";
    valid = false;
  }

  if (!editingId && !photo) {
    document.querySelector("#photoError").textContent =
      "Select a profile photo";
    valid = false;
  }

  if (photo && !["image/jpeg", "image/png"].includes(photo.type)) {
    document.querySelector("#photoError").textContent =
      "Only JPG and PNG images are allowed";
    valid = false;
  }

  if (!valid) {
    return;
  }

  const skillArray = [];

  skills.forEach(function (skill) {
    skillArray.push(skill.value);
  });

  if (editingId) {
    const student = students.find(function (student) {
      return student.id === editingId;
    });

    student.name = name;
    student.email = email;
    student.phone = phone;
    student.dob = dob;
    student.gender = gender.value;
    student.course = course;
    student.skills = skillArray;
    student.about = about;

    if (photo) {
      const reader = new FileReader();

      reader.onload = function () {
        student.photo = reader.result;

        displayStudents();
        updateStatistics();

        form.reset();
        editingId = null;
        submitButton.textContent = "Register Student";
        counter.textContent = "0 / 200";
      };

      reader.readAsDataURL(photo);
      return;
    }

    displayStudents();
    updateStatistics();

    form.reset();
    editingId = null;
    submitButton.textContent = "Register Student";
    counter.textContent = "0 / 200";

    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const student = {
      id: Date.now(),
      name: name,
      email: email,
      phone: phone,
      dob: dob,
      gender: gender.value,
      course: course,
      skills: skillArray,
      about: about,
      photo: reader.result,
    };

    students.push(student);

    displayStudents();
    updateStatistics();

    form.reset();
    editingId = null;
    submitButton.textContent = "Register Student";
    counter.textContent = "0 / 200";
  };

  reader.readAsDataURL(photo);
});

form.addEventListener("reset", function () {
  editingId = null;
  submitButton.textContent = "Register Student";
  counter.textContent = "0 / 200";
});

function displayStudents() {
  studentContainer.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();
  const selectedCourse = courseFilter.value;

  const filteredStudents = students.filter(function (student) {
    const matchesName = student.name.toLowerCase().includes(searchText);

    const matchesCourse =
      selectedCourse === "" || student.course === selectedCourse;

    return matchesName && matchesCourse;
  });

  if (filteredStudents.length === 0) {
    studentContainer.innerHTML = "<p class='no-students'>No students found</p>";
    return;
  }

  filteredStudents.forEach(function (student) {
    const card = document.createElement("div");

    card.className = "student-card";
    card.dataset.id = student.id;

    card.innerHTML = `
            <img src="${student.photo}" class="student-photo">

            <h3>${student.name}</h3>

            <p><b>Email:</b> ${student.email}</p>
            <p><b>Phone:</b> ${student.phone}</p>
            <p><b>DOB:</b> ${student.dob}</p>
            <p><b>Gender:</b> ${student.gender}</p>
            <p><b>Course:</b> ${student.course}</p>
            <p><b>Skills:</b> ${student.skills.join(", ")}</p>
            <p><b>About:</b> ${student.about}</p>

            <button class="edit-button">Edit</button>
            <button class="delete-button">Delete</button>
        `;

    studentContainer.appendChild(card);
  });
}

function updateStatistics() {
  if (totalStudents) {
    totalStudents.textContent = students.length;
  }

  const courseCounts = {};

  students.forEach(function (student) {
    if (courseCounts[student.course]) {
      courseCounts[student.course]++;
    } else {
      courseCounts[student.course] = 1;
    }
  });

  document.querySelectorAll("[data-course-count]").forEach(function (element) {
    const course = element.dataset.courseCount;

    if (courseCounts[course]) {
      element.textContent = courseCounts[course];
    } else {
      element.textContent = 0;
    }
  });
}

studentContainer.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".delete-button");
  const editButton = event.target.closest(".edit-button");

  if (deleteButton) {
    const card = deleteButton.closest(".student-card");
    const id = Number(card.dataset.id);

    const confirmDelete = confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmDelete) {
      return;
    }

    const index = students.findIndex(function (student) {
      return student.id === id;
    });

    if (index !== -1) {
      students.splice(index, 1);
    }

    displayStudents();
    updateStatistics();
  }

  if (editButton) {
    const card = editButton.closest(".student-card");
    const id = Number(card.dataset.id);

    const student = students.find(function (student) {
      return student.id === id;
    });

    if (!student) {
      return;
    }

    editingId = id;

    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;

    const genderInput = document.querySelector(
      `input[name="gender"][value="${student.gender}"]`,
    );

    if (genderInput) {
      genderInput.checked = true;
    }

    document.querySelector("#course").value = student.course;

    document.querySelectorAll('input[name="skills"]').forEach(function (skill) {
      skill.checked = student.skills.includes(skill.value);
    });

    aboutInput.value = student.about;
    counter.textContent = aboutInput.value.length + " / 200";

    submitButton.textContent = "Update Student";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});

searchInput.addEventListener("input", function () {
  displayStudents();
});

courseFilter.addEventListener("change", function () {
  displayStudents();
});

darkModeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkModeButton.textContent = "Light Mode";
  } else {
    darkModeButton.textContent = "Dark Mode";
  }
});

displayStudents();
updateStatistics();
