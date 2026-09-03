const students = [];

var form = document.getElementById("studentForm");
var cardsContainer = document.getElementById("cardsContainer");
var aboutTextarea = document.getElementById("about");
var charCountDisplay = document.getElementById("charCount");

aboutTextarea.oninput = function () {
  var len = aboutTextarea.value.length;
  charCountDisplay.innerText = len + " / 200";
  if (aboutTextarea.value.trim().length >= 20) {
    document.getElementById("aboutError").innerText = "";
  }
};

document.getElementById("name").oninput = function () {
  document.getElementById("nameError").innerText = "";
};

document.getElementById("email").oninput = function () {
  document.getElementById("emailError").innerText = "";
};

document.getElementById("phone").oninput = function () {
  document.getElementById("phoneError").innerText = "";
};

document.getElementById("dob").onchange = function () {
  document.getElementById("dobError").innerText = "";
};

document.getElementById("course").onchange = function () {
  document.getElementById("courseError").innerText = "";
};

document.getElementById("photo").onchange = function () {
  document.getElementById("photoError").innerText = "";
};

var genderRadios = document.querySelectorAll('input[name="gender"]');
for (var g = 0; g < genderRadios.length; g++) {
  genderRadios[g].onchange = function () {
    document.getElementById("genderError").innerText = "";
  };
}

var skillInputs = document.querySelectorAll('input[name="skill"]');
for (var s = 0; s < skillInputs.length; s++) {
  skillInputs[s].onchange = function () {
    document.getElementById("skillError").innerText = "";
  };
}

document.getElementById("resetBtn").onclick = function () {
  var errors = document.querySelectorAll(".error-msg");
  for (var i = 0; i < errors.length; i++) {
    errors[i].innerText = "";
  }
  charCountDisplay.innerText = "0 / 200";
};

form.onsubmit = function (e) {
  e.preventDefault();

  var isValid = true;

  var name = document.getElementById("name").value.trim();
  var nameRegex = /^[A-Za-z ]{3,40}$/;
  if (name === "") {
    document.getElementById("nameError").innerText = "Name is required";
    isValid = false;
  } else if (!nameRegex.test(name)) {
    document.getElementById("nameError").innerText = "Only letters & spaces (3-40 chars)";
    isValid = false;
  } else {
    document.getElementById("nameError").innerText = "";
  }

  var email = document.getElementById("email").value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    document.getElementById("emailError").innerText = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    document.getElementById("emailError").innerText = "Enter a valid email address";
    isValid = false;
  } else {
    document.getElementById("emailError").innerText = "";
  }

  var phone = document.getElementById("phone").value.trim();
  var phoneRegex = /^[0-9]{10}$/;
  if (phone === "") {
    document.getElementById("phoneError").innerText = "Phone number is required";
    isValid = false;
  } else if (!phoneRegex.test(phone)) {
    document.getElementById("phoneError").innerText = "Must be exactly 10 digits";
    isValid = false;
  } else {
    document.getElementById("phoneError").innerText = "";
  }

  var dobValue = document.getElementById("dob").value;
  if (dobValue === "") {
    document.getElementById("dobError").innerText = "Date of Birth is required";
    isValid = false;
  } else {
    var dobDate = new Date(dobValue);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dobDate > today) {
      document.getElementById("dobError").innerText = "Future dates not allowed";
      isValid = false;
    } else {
      var age = today.getFullYear() - dobDate.getFullYear();
      var monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      if (age < 15) {
        document.getElementById("dobError").innerText = "Age must be at least 15 years";
        isValid = false;
      } else {
        document.getElementById("dobError").innerText = "";
      }
    }
  }

  var genderElem = document.querySelector('input[name="gender"]:checked');
  if (!genderElem) {
    document.getElementById("genderError").innerText = "Please select gender";
    isValid = false;
  } else {
    document.getElementById("genderError").innerText = "";
  }

  var course = document.getElementById("course").value;
  if (course === "") {
    document.getElementById("courseError").innerText = "Please select a course";
    isValid = false;
  } else {
    document.getElementById("courseError").innerText = "";
  }

  var checkedSkills = document.querySelectorAll('input[name="skill"]:checked');
  if (checkedSkills.length === 0) {
    document.getElementById("skillError").innerText = "Select at least 1 skill";
    isValid = false;
  } else {
    document.getElementById("skillError").innerText = "";
  }

  var aboutVal = document.getElementById("about").value;
  if (aboutVal.trim() === "") {
    document.getElementById("aboutError").innerText = "About student is required";
    isValid = false;
  } else if (aboutVal.trim().length < 20) {
    document.getElementById("aboutError").innerText = "Minimum 20 characters required";
    isValid = false;
  } else {
    document.getElementById("aboutError").innerText = "";
  }

  var photoInput = document.getElementById("photo");
  if (!photoInput.files || photoInput.files.length === 0) {
    document.getElementById("photoError").innerText = "Profile photo is required";
    isValid = false;
  } else {
    var fileName = photoInput.files[0].name.toLowerCase();
    if (!fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg") && !fileName.endsWith(".png")) {
      document.getElementById("photoError").innerText = "Only .jpg, .jpeg, or .png allowed";
      isValid = false;
    } else {
      document.getElementById("photoError").innerText = "";
    }
  }

  if (!isValid) {
    return;
  }

  var skills = [];
  for (var i = 0; i < checkedSkills.length; i++) {
    skills.push(checkedSkills[i].value);
  }

  var photoUrl = URL.createObjectURL(photoInput.files[0]);

  var student = {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone,
    dob: dobValue,
    gender: genderElem.value,
    course: course,
    skills: skills,
    about: aboutVal.trim(),
    photo: photoUrl
  };

  students.push(student);
  renderStudents(students);
  updateStats();
  form.reset();
  charCountDisplay.innerText = "0 / 200";
};

function renderStudents(list) {
  cardsContainer.innerHTML = "";

  for (var i = 0; i < list.length; i++) {
    var s = list[i];

    var card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", s.id);

    if (s.photo) {
      var img = document.createElement("img");
      img.setAttribute("src", s.photo);
      img.setAttribute("alt", "Student Photo");
      card.appendChild(img);
    }

    var nameEl = document.createElement("h3");
    nameEl.textContent = s.name;
    card.appendChild(nameEl);

    var emailEl = document.createElement("p");
    emailEl.textContent = "Email: " + s.email;
    card.appendChild(emailEl);

    var phoneEl = document.createElement("p");
    phoneEl.textContent = "Phone: " + s.phone;
    card.appendChild(phoneEl);

    var dobEl = document.createElement("p");
    dobEl.textContent = "DOB: " + s.dob;
    card.appendChild(dobEl);

    var genderEl = document.createElement("p");
    genderEl.textContent = "Gender: " + s.gender;
    card.appendChild(genderEl);

    var courseEl = document.createElement("p");
    courseEl.textContent = "Course: " + s.course;
    card.appendChild(courseEl);

    var skillsEl = document.createElement("p");
    skillsEl.textContent = "Skills: " + s.skills.join(", ");
    card.appendChild(skillsEl);

    var aboutEl = document.createElement("p");
    aboutEl.textContent = "About: " + s.about;
    card.appendChild(aboutEl);

    var btnDiv = document.createElement("div");
    btnDiv.classList.add("card-actions");

    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);
    card.appendChild(btnDiv);

    cardsContainer.appendChild(card);
  }
}

cardsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    var confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) {
      return;
    }

    var card = event.target.closest(".student-card");
    var studentId = Number(card.getAttribute("data-id"));

    for (var i = 0; i < students.length; i++) {
      if (students[i].id === studentId) {
        students.splice(i, 1);
        break;
      }
    }

    card.remove();
    updateStats();
  }

  if (event.target.classList.contains("edit-btn")) {
    var editCard = event.target.closest(".student-card");
    var editId = Number(editCard.getAttribute("data-id"));
    editStudent(editId);
  }
});

function editStudent(id) {
  var s = null;
  for (var i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      s = students[i];
      break;
    }
  }

  if (!s) return;

  document.getElementById("name").value = s.name;
  document.getElementById("email").value = s.email;
  document.getElementById("phone").value = s.phone;
  document.getElementById("dob").value = s.dob;
  document.getElementById("course").value = s.course;
  document.getElementById("about").value = s.about;
  charCountDisplay.innerText = s.about.length + " / 200";

  var radios = document.querySelectorAll('input[name="gender"]');
  for (var r = 0; r < radios.length; r++) {
    radios[r].checked = (radios[r].value === s.gender);
  }

  var checkboxes = document.querySelectorAll('input[name="skill"]');
  for (var c = 0; c < checkboxes.length; c++) {
    checkboxes[c].checked = s.skills.includes(checkboxes[c].value);
  }

  for (var j = 0; j < students.length; j++) {
    if (students[j].id === id) {
      students.splice(j, 1);
      break;
    }
  }

  updateStats();
  filterStudents();
}

function filterStudents() {
  var text = document.getElementById("search").value.toLowerCase();
  var filtered = [];

  for (var i = 0; i < students.length; i++) {
    if (students[i].name.toLowerCase().indexOf(text) !== -1) {
      filtered.push(students[i]);
    }
  }

  renderStudents(filtered);
}

function updateStats() {
  var total = students.length;
  var web = 0;
  var uiux = 0;
  var python = 0;
  var data = 0;
  var mern = 0;
  var cloud = 0;

  for (var i = 0; i < students.length; i++) {
    if (students[i].course === "Web Development") web++;
    if (students[i].course === "UI/UX") uiux++;
    if (students[i].course === "Python") python++;
    if (students[i].course === "Data Analytics") data++;
    if (students[i].course === "MERN Stack") mern++;
    if (students[i].course === "Cloud Computing") cloud++;
  }

  document.getElementById("totalCount").innerText = total;
  document.getElementById("countWeb").innerText = web;
  document.getElementById("countUIUX").innerText = uiux;
  document.getElementById("countPython").innerText = python;
  document.getElementById("countData").innerText = data;
  document.getElementById("countMern").innerText = mern;
  document.getElementById("countCloud").innerText = cloud;
}