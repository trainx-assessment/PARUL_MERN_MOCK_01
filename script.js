let students = JSON.parse(localStorage.getItem("studentsData")) || [];
let editId = null;
let temp = "";

let form = document.getElementById("form");
let picInput = document.getElementById("pic");
let preview = document.getElementById("preview");
let list = document.getElementById("list");
let search = document.getElementById("search");
let filter = document.getElementById("filter");
let listCount = document.getElementById("listCount");
let charCount = document.getElementById("charCount");
let about = document.getElementById("about");
let modeBtn = document.getElementById("modeBtn");

modeBtn.onclick = function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    modeBtn.innerText = "Light Mode";
  } else {
    modeBtn.innerText = "Dark Mode";
  }
};

about.addEventListener("input", function () {
  charCount.innerText = about.value.length;
});

picInput.addEventListener("change", function (e) {
  let file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (ev) {
      temp = ev.target.result;
      preview.src = temp;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

function showErr(id, msg) {
  document.getElementById("err" + id).innerText = msg;
  let el = document.getElementById(id);
  if (el) el.classList.add("bad");
}

function clearErr() {
  let errs = document.querySelectorAll(".err");
  for (let i = 0; i < errs.length; i++) {
    errs[i].innerText = "";
  }
  let bads = document.querySelectorAll(".bad");
  for (let i = 0; i < bads.length; i++) {
    bads[i].classList.remove("bad");
  }
}

function checkForm() {
  clearErr();
  let ok = true;

  let name = document.getElementById("stdName").value.trim();
  let nameRegex = /^[A-Za-z\s]+$/;
  if (name.length < 3 || name.length > 40 || !nameRegex.test(name)) {
    showErr(
      "stdName",
      "Name must be 3-40 characters, letters and spaces only.",
    );
    ok = false;
  }

  let email = document.getElementById("email").value.trim();
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showErr("email", "Enter a valid email address.");
    ok = false;
  }

  let phone = document.getElementById("phone").value.trim();
  if (!/^\d{10}$/.test(phone)) {
    showErr("phone", "Phone must be exactly 10 digits.");
    ok = false;
  }

  let dob = document.getElementById("dob").value;
  if (!dob) {
    showErr("dob", "Date of birth is required.");
    ok = false;
  } else {
    let bd = new Date(dob);
    let now = new Date();
    let age = now.getFullYear() - bd.getFullYear();
    let m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) {
      age--;
    }
    if (bd > now) {
      showErr("dob", "Future dates are not allowed.");
      ok = false;
    } else if (age < 15) {
      showErr("dob", "Student must be at least 15 years old.");
      ok = false;
    }
  }

  let gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) {
    document.getElementById("errgender").innerText = "Please select a gender.";
    ok = false;
  }

  let course = document.getElementById("course").value;
  if (!course) {
    showErr("course", "Please select a course.");
    ok = false;
  }

  let skills = document.querySelectorAll('input[name="skills"]:checked');
  if (skills.length === 0) {
    document.getElementById("errskills").innerText =
      "Select at least one skill.";
    ok = false;
  }

  let aboutVal = document.getElementById("about").value;
  if (
    aboutVal.trim().length === 0 ||
    aboutVal.length < 20 ||
    aboutVal.length > 200
  ) {
    showErr("about", "About must be between 20 and 200 characters.");
    ok = false;
  }

  if (!temp && !editId) {
    document.getElementById("errpic").innerText = "Profile photo is required.";
    ok = false;
  }

  return ok;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!checkForm()) return;

  let skillsArr = [];
  document
    .querySelectorAll('input[name="skills"]:checked')
    .forEach(function (cb) {
      skillsArr.push(cb.value);
    });

  let data = {
    name: document.getElementById("stdName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    dob: document.getElementById("dob").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    course: document.getElementById("course").value,
    skills: skillsArr,
    about: document.getElementById("about").value.trim(),
    photo: temp,
  };

  if (editId !== null) {
    let idx = students.findIndex(function (s) {
      return s.id === editId;
    });
    if (!temp) {
      data.photo = students[idx].photo;
    }
    data.id = editId;
    students[idx] = data;
    document.getElementById("addBtn").innerText = "Register Student";
    editId = null;
  } else {
    data.id = Date.now();
    students.push(data);
  }

  localStorage.setItem("studentsData", JSON.stringify(students));
  resetForm();
  showList();
  showStats();
});

function resetForm() {
  form.reset();
  preview.style.display = "none";
  temp = "";
  editId = null;
  charCount.innerText = "0";
  document.getElementById("addBtn").innerText = "Register Student";
  clearErr();
}

document.getElementById("resetBtn").onclick = resetForm;

function showList() {
  let text = search.value.toLowerCase();
  let courseFilter = filter.value;

  let filtered = students.filter(function (s) {
    let matchName = s.name.toLowerCase().includes(text);
    let matchCourse =
      courseFilter === "All Courses" || s.course === courseFilter;
    return matchName && matchCourse;
  });

  if (filtered.length === 0) {
    listCount.innerText = "- No student registered";
    listCount.style.color = "#e74c3c";
    list.innerHTML = '<div class="empty">No students found</div>';
    return;
  }

  listCount.innerText = "(" + filtered.length + ")";
  listCount.style.color = "";

  let html = "";
  for (let i = 0; i < filtered.length; i++) {
    let s = filtered[i];
    html += '<div class="stdCard">';
    html += '<img src="' + s.photo + '">';
    html += "<h3>" + s.name + "</h3>";
    html += "<p><strong>Course:</strong> " + s.course + "</p>";
    html += "<p><strong>Email:</strong> " + s.email + "</p>";
    html += "<p><strong>Phone:</strong> " + s.phone + "</p>";
    html +=
      "<p><strong>DOB:</strong> " +
      s.dob +
      " | <strong>Gender:</strong> " +
      s.gender +
      "</p>";
    html += "<p><strong>Skills:</strong> " + s.skills.join(", ") + "</p>";
    html += "<p><strong>About:</strong> " + s.about + "</p>";
    html += '<div class="actions">';
    html +=
      '<button class="btn3" onclick="editStudent(' + s.id + ')">Edit</button>';
    html +=
      '<button class="btn4" onclick="delStudent(' + s.id + ')">Delete</button>';
    html += "</div></div>";
  }
  list.innerHTML = html;
}

function delStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter(function (s) {
      return s.id !== id;
    });
    localStorage.setItem("studentsData", JSON.stringify(students));
    showList();
    showStats();
  }
}

function editStudent(id) {
  let s = students.find(function (st) {
    return st.id === id;
  });
  if (!s) return;

  editId = s.id;
  clearErr();

  document.getElementById("stdName").value = s.name;
  document.getElementById("email").value = s.email;
  document.getElementById("phone").value = s.phone;
  document.getElementById("dob").value = s.dob;
  document.querySelector(
    'input[name="gender"][value="' + s.gender + '"]',
  ).checked = true;
  document.getElementById("course").value = s.course;
  document.getElementById("about").value = s.about;
  charCount.innerText = s.about.length;

  document.querySelectorAll('input[name="skills"]').forEach(function (cb) {
    cb.checked = s.skills.includes(cb.value);
  });

  temp = s.photo;
  preview.src = temp;
  preview.style.display = "block";

  document.getElementById("addBtn").innerText = "Update Student";
  window.scrollTo(0, 0);
}

function showStats() {
  document.getElementById("cTotal").innerText = students.length;

  let courses = {
    "Web Development": "cWeb",
    "UI/UX": "cUi",
    Python: "cPy",
    "Data Analytics": "cData",
    "MERN Stack": "cMern",
    "Cloud Computing": "cCloud",
  };

  for (let c in courses) {
    let count = students.filter(function (s) {
      return s.course === c;
    }).length;
    document.getElementById(courses[c]).innerText = count;
  }
}

search.addEventListener("input", showList);
filter.addEventListener("change", showList);

showList();
showStats();
