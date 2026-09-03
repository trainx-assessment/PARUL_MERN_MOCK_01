const STORAGE_KEY = "studentApplications";
const THEME_KEY = "studentApplicationTheme";

const courses = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];

const students = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

let editingStudentId = null;

const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");
const submitButton = document.querySelector("#submitButton");
const resetButton = document.querySelector("#resetButton");
const aboutStudent = document.querySelector("#aboutStudent");
const characterCounter = document.querySelector("#characterCounter");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const themeToggle = document.querySelector("#themeToggle");
const formStatus = document.querySelector("#formStatus");

function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function showError(fieldName, message) {
    document.querySelector("#" + fieldName + "Error").textContent = message;
}

function clearErrors() {
    var errorElements = document.querySelectorAll(".error-message");
    for (var i = 0; i < errorElements.length; i++) {
        errorElements[i].textContent = "";
    }
    formStatus.textContent = "";
}

function clearFieldError(fieldName) {
    var errorElement = document.querySelector("#" + fieldName + "Error");
    if (errorElement) {
        errorElement.textContent = "";
    }
}

function selectedGender() {
    var checkedGender = document.querySelector("input[name=gender]:checked");
    if (checkedGender) {
        return checkedGender.value;
    } else {
        return "";
    }
}

function selectedSkills() {
    var skillsList = [];
    var checkedSkills = document.querySelectorAll("input[name=skills]:checked");
    for (var i = 0; i < checkedSkills.length; i++) {
        skillsList.push(checkedSkills[i].value);
    }
    return skillsList;
}

function validateForm() {
    clearErrors();
    var isValid = true;

    var name = document.querySelector("#studentName").value.trim();
    var email = document.querySelector("#studentEmail").value.trim();
    var phone = document.querySelector("#studentPhone").value.trim();
    var dob = document.querySelector("#studentDob").value;
    var gender = selectedGender();
    var course = document.querySelector("#course").value;
    var skills = selectedSkills();
    var about = aboutStudent.value.trim();
    var photo = document.querySelector("#profilePhoto").files[0];

    var nameRegex = /^[A-Za-z ]{3,40}$/;
    if (!name) {
        showError("studentName", "Student name is required.");
        isValid = false;
    } else if (!nameRegex.test(name)) {
        showError("studentName", "Use 3-40 letters and spaces only.");
        isValid = false;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("studentEmail", "Enter a valid email address.");
        isValid = false;
    }

    var phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showError("studentPhone", "Phone number must contain exactly 10 digits.");
        isValid = false;
    }

    if (!dob) {
        showError("studentDob", "Date of birth is required.");
        isValid = false;
    } else {
        var birthDate = new Date(dob + "T00:00:00");
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var birthdayThisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (today < birthdayThisYear) {
            age = age - 1;
        }

        if (birthDate > today) {
            showError("studentDob", "Future dates are not accepted.");
            isValid = false;
        } else if (age < 15) {
            showError("studentDob", "Student must be at least 15 years old.");
            isValid = false;
        }
    }

    if (!gender) {
        showError("gender", "Select a gender.");
        isValid = false;
    }

    if (!course) {
        showError("course", "Select a course.");
        isValid = false;
    }

    if (skills.length === 0) {
        showError("skills", "Select at least one skill.");
        isValid = false;
    }

    if (!about) {
        showError("aboutStudent", "About student is required.");
        isValid = false;
    } else if (about.length < 20 || about.length > 200) {
        showError("aboutStudent", "Enter between 20 and 200 characters.");
        isValid = false;
    }

    if (!editingStudentId && !photo) {
        showError("profilePhoto", "Profile photo is required.");
        isValid = false;
    }
    if (photo && photo.type.indexOf("image/") !== 0) {
        showError("profilePhoto", "Only image files are accepted.");
        isValid = false;
    }

    return isValid;
}

function readPhoto(file) {
    return new Promise(function (resolve) {
        if (!file) {
            resolve("");
            return;
        }
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        });
        reader.readAsDataURL(file);
    });
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-GB");
}

function updateStatistics() {
    var statisticsGrid = document.querySelector("#statisticsGrid");
    statisticsGrid.innerHTML = "";

    var entries = [];
    entries.push({ label: "Total Students", value: students.length });

    for (var i = 0; i < courses.length; i++) {
        var courseName = courses[i];
        var count = 0;
        for (var j = 0; j < students.length; j++) {
            if (students[j].course === courseName) {
                count = count + 1;
            }
        }
        entries.push({ label: courseName, value: count });
    }

    for (var k = 0; k < entries.length; k++) {
        var statistic = document.createElement("div");
        statistic.className = "statistic";
        statistic.innerHTML = "<strong>" + entries[k].value + "</strong><span>" + entries[k].label + "</span>";
        statisticsGrid.appendChild(statistic);
    }
}

function renderStudents() {
    var searchTerm = searchInput.value.trim().toLowerCase();
    var selectedCourse = courseFilter.value;

    var visibleStudents = [];
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var nameMatches = student.name.toLowerCase().indexOf(searchTerm) !== -1;
        var courseMatches = selectedCourse === "" || student.course === selectedCourse;
        if (nameMatches && courseMatches) {
            visibleStudents.push(student);
        }
    }

    studentContainer.innerHTML = "";

    if (visibleStudents.length === 0) {
        var emptyState = document.createElement("p");
        emptyState.className = "empty-state";
        emptyState.textContent = "No students found";
        studentContainer.appendChild(emptyState);
        return;
    }

    for (var j = 0; j < visibleStudents.length; j++) {
        var currentStudent = visibleStudents[j];

        var card = document.createElement("article");
        card.className = "student-card";
        card.dataset.id = currentStudent.id;

        var photoHtml = "";
        if (currentStudent.photo) {
            photoHtml = "<img class=\"student-photo\" src=\"" + currentStudent.photo + "\" alt=\"" + currentStudent.name + "'s profile photo\">";
        } else {
            photoHtml = "<div class=\"student-photo avatar-placeholder\" aria-hidden=\"true\">" + currentStudent.name.charAt(0) + "</div>";
        }

        card.innerHTML =
            photoHtml +
            "<div class=\"student-profile\"><div><h3>" + currentStudent.name + "</h3><p class=\"student-email\">" + currentStudent.email + "</p></div></div>" +
            "<dl class=\"student-details\">" +
            "<div><dt>Phone</dt><dd>" + currentStudent.phone + "</dd></div>" +
            "<div><dt>Date of Birth</dt><dd>" + formatDate(currentStudent.dob) + "</dd></div>" +
            "<div><dt>Gender</dt><dd>" + currentStudent.gender + "</dd></div>" +
            "<div><dt>Course</dt><dd>" + currentStudent.course + "</dd></div>" +
            "<div><dt>Skills</dt><dd>" + currentStudent.skills.join(", ") + "</dd></div>" +
            "</dl>" +
            "<p class=\"student-about\"><strong>About:</strong> " + currentStudent.about + "</p>" +
            "<div class=\"student-actions\">" +
            "<button class=\"edit-button\" type=\"button\" data-action=\"edit\">Edit</button>" +
            "<button class=\"delete-button\" type=\"button\" data-action=\"delete\">Delete</button>" +
            "</div>";

        studentContainer.appendChild(card);
    }
}

function resetForm() {
    form.reset();
    editingStudentId = null;
    submitButton.textContent = "Register Student";
    clearErrors();
    characterCounter.textContent = "0 / 200";
}

function populateForm(student) {
    document.querySelector("#studentName").value = student.name;
    document.querySelector("#studentEmail").value = student.email;
    document.querySelector("#studentPhone").value = student.phone;
    document.querySelector("#studentDob").value = student.dob;

    var genderRadio = document.querySelector("input[name=gender][value=\"" + student.gender + "\"]");
    if (genderRadio) {
        genderRadio.checked = true;
    }

    document.querySelector("#course").value = student.course;

    var skillCheckboxes = document.querySelectorAll("input[name=skills]");
    for (var i = 0; i < skillCheckboxes.length; i++) {
        var checkbox = skillCheckboxes[i];
        checkbox.checked = student.skills.indexOf(checkbox.value) !== -1;
    }

    aboutStudent.value = student.about;
    characterCounter.textContent = student.about.length + " / 200";
    editingStudentId = student.id;
    submitButton.textContent = "Update Student";
    clearErrors();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    var photoFile = document.querySelector("#profilePhoto").files[0];
    var photo = await readPhoto(photoFile);

    var existingStudent = null;
    for (var i = 0; i < students.length; i++) {
        if (students[i].id === editingStudentId) {
            existingStudent = students[i];
            break;
        }
    }

    var oldPhoto = "";
    if (existingStudent) {
        oldPhoto = existingStudent.photo;
    }

    var studentData = {
        name: document.querySelector("#studentName").value.trim(),
        email: document.querySelector("#studentEmail").value.trim(),
        phone: document.querySelector("#studentPhone").value.trim(),
        dob: document.querySelector("#studentDob").value,
        gender: selectedGender(),
        course: document.querySelector("#course").value,
        skills: selectedSkills(),
        about: aboutStudent.value.trim(),
        photo: photo || oldPhoto
    };

    if (existingStudent) {
        existingStudent.name = studentData.name;
        existingStudent.email = studentData.email;
        existingStudent.phone = studentData.phone;
        existingStudent.dob = studentData.dob;
        existingStudent.gender = studentData.gender;
        existingStudent.course = studentData.course;
        existingStudent.skills = studentData.skills;
        existingStudent.about = studentData.about;
        existingStudent.photo = studentData.photo;
    } else {
        studentData.id = Date.now();
        students.push(studentData);
    }

    saveStudents();
    updateStatistics();
    renderStudents();

    if (existingStudent) {
        formStatus.textContent = "Student application updated.";
    } else {
        formStatus.textContent = "Student application registered.";
    }

    resetForm();
});

studentContainer.addEventListener("click", function (event) {
    var actionButton = event.target.closest("button[data-action]");
    if (!actionButton) {
        return;
    }

    var card = actionButton.closest(".student-card");
    var studentId = Number(card.dataset.id);

    var student = null;
    var studentIndex = -1;
    for (var i = 0; i < students.length; i++) {
        if (students[i].id === studentId) {
            student = students[i];
            studentIndex = i;
            break;
        }
    }

    if (actionButton.dataset.action === "delete") {
        var confirmDelete = confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) {
            return;
        }
        students.splice(studentIndex, 1);
        saveStudents();
        updateStatistics();
        renderStudents();
    } else if (actionButton.dataset.action === "edit") {
        populateForm(student);
    }
});

aboutStudent.addEventListener("input", function () {
    characterCounter.textContent = aboutStudent.value.length + " / 200";
    clearFieldError("aboutStudent");
});

document.querySelector("#studentName").addEventListener("input", function () {
    clearFieldError("studentName");
});
document.querySelector("#studentEmail").addEventListener("input", function () {
    clearFieldError("studentEmail");
});
document.querySelector("#studentPhone").addEventListener("input", function () {
    clearFieldError("studentPhone");
});
document.querySelector("#studentDob").addEventListener("input", function () {
    clearFieldError("studentDob");
});

var genderRadios = document.querySelectorAll("input[name=gender]");
for (var g = 0; g < genderRadios.length; g++) {
    genderRadios[g].addEventListener("change", function () {
        clearFieldError("gender");
    });
}

document.querySelector("#course").addEventListener("change", function () {
    clearFieldError("course");
});

var skillInputs = document.querySelectorAll("input[name=skills]");
for (var s = 0; s < skillInputs.length; s++) {
    skillInputs[s].addEventListener("change", function () {
        clearFieldError("skills");
    });
}

document.querySelector("#profilePhoto").addEventListener("change", function () {
    clearFieldError("profilePhoto");
});

resetButton.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    var isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

if (localStorage.getItem(THEME_KEY) === "dark") {
    themeToggle.click();
}

updateStatistics();
renderStudents();