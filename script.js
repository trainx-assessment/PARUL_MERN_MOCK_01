var courses = [
  "Web Development",
  "UI/UX",
  "Python",
  "Data Analytics",
  "MERN Stack",
  "Cloud Computing"
];

var storageKey = "studentFlowApplications";

var form = document.getElementById("studentForm");

var fields = {
  name: document.getElementById("studentName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  dob: document.getElementById("dob"),
  course: document.getElementById("course"),
  about: document.getElementById("about"),
  photo: document.getElementById("photo")
};

var container = document.getElementById("studentContainer");
var submitButton = document.getElementById("submitButton");
var characterCount = document.getElementById("characterCount");
var statistics = document.getElementById("statistics");
var searchInput = document.getElementById("searchInput");
var courseFilter = document.getElementById("courseFilter");
var resultCount = document.getElementById("resultCount");
var themeToggle = document.getElementById("themeToggle");

var students = [];
var storedStudents = localStorage.getItem(storageKey);
if (storedStudents) {
  students = JSON.parse(storedStudents);
}

var editingId = null;

/* ---------- storage ---------- */

function save() {
  localStorage.setItem(storageKey, JSON.stringify(students));
}

/* ---------- form reading helpers ---------- */

function getCheckedGender() {
  var radios = document.getElementsByName("gender");
  var i;
  for (i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "";
}

function getCheckedSkills() {
  var boxes = document.getElementsByName("skills");
  var result = [];
  var i;
  for (i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      result.push(boxes[i].value);
    }
  }
  return result;
}

/* ---------- validation ---------- */

function setError(name, message) {
  var el = document.getElementById(name + "Error");
  if (el) {
    el.textContent = message;
  }
}

function validate() {
  var ok = true;

  var nameValue = fields.name.value.trim();
  var nameRegex = /^[A-Za-z ]{3,40}$/;
  if (!nameRegex.test(nameValue)) {
    setError("studentName", "Enter a valid name (letters only, 3-40 characters)");
    ok = false;
  } else {
    setError("studentName", "");
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email.value.trim())) {
    setError("email", "Enter a valid email address");
    ok = false;
  } else {
    setError("email", "");
  }

  var phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(fields.phone.value.trim())) {
    setError("phone", "Enter a valid 10-digit phone number");
    ok = false;
  } else {
    setError("phone", "");
  }

  if (!fields.dob.value) {
    setError("dob", "Select a date of birth");
    ok = false;
  } else {
    setError("dob", "");
  }

  if (getCheckedGender() === "") {
    setError("gender", "Select a gender");
    ok = false;
  } else {
    setError("gender", "");
  }

  if (fields.course.value === "") {
    setError("course", "Select a course");
    ok = false;
  } else {
    setError("course", "");
  }

  if (getCheckedSkills().length === 0) {
    setError("skills", "Select at least one skill");
    ok = false;
  } else {
    setError("skills", "");
  }

  var aboutLength = fields.about.value.trim().length;
  if (aboutLength < 20 || aboutLength > 200) {
    setError("about", "Write between 20 and 200 characters");
    ok = false;
  } else {
    setError("about", "");
  }

  var file = fields.photo.files[0];
  var validTypes = ["image/jpeg", "image/png"];

  if (!editingId) {
    if (!file || validTypes.indexOf(file.type) === -1) {
      setError("photo", "Upload a JPG or PNG image");
      ok = false;
    } else {
      setError("photo", "");
    }
  } else {
    if (file && validTypes.indexOf(file.type) === -1) {
      setError("photo", "Upload a JPG or PNG image");
      ok = false;
    } else {
      setError("photo", "");
    }
  }

  return ok;
}

/* ---------- data helpers ---------- */

function readImage(file, callback) {
  var reader = new FileReader();
  reader.onload = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

function findStudentById(id) {
  var i;
  for (i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return students[i];
    }
  }
  return null;
}

function buildStudentFromForm(photoData) {
  var old = editingId ? findStudentById(editingId) : null;

  return {
    id: editingId ? editingId : Date.now(),
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    dob: fields.dob.value,
    gender: getCheckedGender(),
    course: fields.course.value,
    skills: getCheckedSkills(),
    about: fields.about.value.trim(),
    photo: photoData ? photoData : (old ? old.photo : null)
  };
}

function saveStudent(student) {
  var index = -1;
  var i;
  for (i = 0; i < students.length; i++) {
    if (students[i].id === student.id) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    students[index] = student;
  } else {
    students.push(student);
  }

  save();
  render();
  resetForm();
}

function resetForm() {
  form.reset();
  editingId = null;
  submitButton.textContent = "Register Student";
  characterCount.textContent = "0 / 200";
}

/* ---------- rendering ---------- */

function getInitials(name) {
  var parts = name.split(" ");
  var initials = "";
  var i;
  for (i = 0; i < parts.length && initials.length < 2; i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0];
    }
  }
  return initials.toUpperCase();
}

function createDetail(labelText, valueText) {
  var p = document.createElement("p");
  p.className = "detail";

  var strong = document.createElement("strong");
  strong.textContent = labelText;
  p.appendChild(strong);
  p.appendChild(document.createTextNode(" " + valueText));

  return p;
}

function createCard(student) {
  var article = document.createElement("article");
  article.className = "student-card";
  article.setAttribute("data-id", String(student.id));

  var top = document.createElement("div");
  top.className = "card-top";

  var photoEl;
  if (student.photo) {
    photoEl = document.createElement("img");
    photoEl.className = "student-photo";
    photoEl.src = student.photo;
    photoEl.alt = student.name;
  } else {
    photoEl = document.createElement("div");
    photoEl.className = "student-photo student-initials";
    photoEl.textContent = getInitials(student.name);
  }
  top.appendChild(photoEl);

  var nameWrap = document.createElement("div");

  var heading = document.createElement("h3");
  heading.textContent = student.name;
  nameWrap.appendChild(heading);

  var courseTag = document.createElement("span");
  courseTag.className = "course-tag";
  courseTag.textContent = student.course;
  nameWrap.appendChild(courseTag);

  top.appendChild(nameWrap);
  article.appendChild(top);

  var body = document.createElement("div");
  body.className = "card-body";

  body.appendChild(createDetail("Email:", student.email));
  body.appendChild(createDetail("Phone:", student.phone));
  body.appendChild(createDetail("DOB:", student.dob + " \u00B7 " + student.gender));

  var skillsWrap = document.createElement("div");
  skillsWrap.className = "skills-tags";
  var i;
  for (i = 0; i < student.skills.length; i++) {
    var tag = document.createElement("span");
    tag.className = "skill-tag";
    tag.textContent = student.skills[i];
    skillsWrap.appendChild(tag);
  }
  body.appendChild(skillsWrap);

  var aboutP = document.createElement("p");
  aboutP.className = "about-copy";
  aboutP.textContent = student.about;
  body.appendChild(aboutP);

  article.appendChild(body);

  var actions = document.createElement("div");
  actions.className = "card-actions";

  var editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "card-button edit-btn";
  editBtn.textContent = "Edit";
  actions.appendChild(editBtn);

  var deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "card-button delete-btn";
  deleteBtn.textContent = "Delete";
  actions.appendChild(deleteBtn);

  article.appendChild(actions);

  return article;
}

function createEmptyState(hasStudents) {
  var div = document.createElement("div");
  div.className = "empty-state";

  var h3 = document.createElement("h3");
  h3.textContent = hasStudents ? "No students found" : "No applications yet";
  div.appendChild(h3);

  var p = document.createElement("p");
  p.textContent = hasStudents ? "Try a different search or filter." : "Register your first student above.";
  div.appendChild(p);

  return div;
}

function filterStudents() {
  var search = searchInput.value.toLowerCase();
  var filter = courseFilter.value;
  var list = [];
  var i;

  for (i = 0; i < students.length; i++) {
    var s = students[i];
    var matchesSearch = s.name.toLowerCase().indexOf(search) !== -1;
    var matchesFilter = !filter || s.course === filter;
    if (matchesSearch && matchesFilter) {
      list.push(s);
    }
  }

  return list;
}

function createStatCard(number, label, isTotal) {
  var card = document.createElement("div");
  card.className = isTotal ? "stat-card total" : "stat-card";

  var numberEl = document.createElement("span");
  numberEl.className = "stat-number";
  numberEl.textContent = String(number);
  card.appendChild(numberEl);

  var labelEl = document.createElement("span");
  labelEl.className = "stat-label";
  labelEl.textContent = label;
  card.appendChild(labelEl);

  return card;
}

function renderStatistics() {
  statistics.innerHTML = "";
  statistics.appendChild(createStatCard(students.length, "Total Students", true));

  var i;
  var j;
  for (i = 0; i < courses.length; i++) {
    var count = 0;
    for (j = 0; j < students.length; j++) {
      if (students[j].course === courses[i]) {
        count++;
      }
    }
    statistics.appendChild(createStatCard(count, courses[i], false));
  }
}

function render() {
  var list = filterStudents();
  var i;

  container.innerHTML = "";

  if (list.length === 0) {
    container.appendChild(createEmptyState(students.length > 0));
  } else {
    for (i = 0; i < list.length; i++) {
      container.appendChild(createCard(list[i]));
    }
  }

  resultCount.textContent = list.length + " application" + (list.length === 1 ? "" : "s");

  renderStatistics();
}

/* ---------- events ---------- */

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  var file = fields.photo.files[0];

  if (file) {
    readImage(file, function (photoData) {
      var student = buildStudentFromForm(photoData);
      saveStudent(student);
    });
  } else {
    var student = buildStudentFromForm(null);
    saveStudent(student);
  }
});

container.addEventListener("click", function (e) {
  var card = e.target.closest(".student-card");
  if (!card) {
    return;
  }

  var id = Number(card.getAttribute("data-id"));

  if (e.target.classList.contains("delete-btn")) {
    var confirmed = confirm("Delete this student?");
    if (confirmed) {
      var newList = [];
      var i;
      for (i = 0; i < students.length; i++) {
        if (students[i].id !== id) {
          newList.push(students[i]);
        }
      }
      students = newList;
      save();
      render();
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    var student = findStudentById(id);
    if (!student) {
      return;
    }

    editingId = id;

    fields.name.value = student.name;
    fields.email.value = student.email;
    fields.phone.value = student.phone;
    fields.dob.value = student.dob;
    fields.course.value = student.course;
    fields.about.value = student.about;

    var radios = document.getElementsByName("gender");
    var r;
    for (r = 0; r < radios.length; r++) {
      radios[r].checked = radios[r].value === student.gender;
    }

    var boxes = document.getElementsByName("skills");
    var b;
    for (b = 0; b < boxes.length; b++) {
      boxes[b].checked = student.skills.indexOf(boxes[b].value) !== -1;
    }

    submitButton.textContent = "Update Student";
    characterCount.textContent = fields.about.value.length + " / 200";

    window.scrollTo({
      top: form.offsetTop - 20,
      behavior: "smooth"
    });
  }
});

searchInput.addEventListener("input", render);
courseFilter.addEventListener("change", render);

fields.about.addEventListener("input", function () {
  characterCount.textContent = fields.about.value.length + " / 200";
});

fields.phone.addEventListener("input", function () {
  fields.phone.value = fields.phone.value.replace(/\D/g, "").slice(0, 10);
});

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    var isDark = document.body.classList.contains("dark-mode");
    themeToggle.innerHTML = isDark ? "&#9728; Light Mode" : "&#9790; Dark Mode";
  });
}

var yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

render();
