const studentForm = document.querySelector("#studentForm");
const studentNameInput = document.querySelector("#studentName");
const studentEmailInput = document.querySelector("#studentEmail");
const studentPhoneInput = document.querySelector("#studentPhone");
const studentDobInput = document.querySelector("#studentDob");
const studentCourseSelect = document.querySelector("#studentCourse");
const aboutStudentTextarea = document.querySelector("#aboutStudent");
const aboutCharCounter = document.querySelector("#aboutCharCounter");
const profilePhotoInput = document.querySelector("#profilePhoto");
const registerBtn = document.querySelector("#registerBtn");

const totalStudentsCount = document.querySelector("#totalStudentsCount");
const statWebDevelopment = document.querySelector("#statWebDevelopment");
const statUIUX = document.querySelector("#statUIUX");
const statPython = document.querySelector("#statPython");
const statDataAnalytics = document.querySelector("#statDataAnalytics");
const statMernStack = document.querySelector("#statMernStack");
const statCloudComputing = document.querySelector("#statCloudComputing");

const searchInput = document.querySelector("#searchInput");
const courseFilterSelect = document.querySelector("#courseFilter");

const studentCardsContainer = document.querySelector("#studentCardsContainer");
const emptyStateMessage = document.querySelector("#emptyStateMessage");

const themeToggleBtn = document.querySelector("#themeToggleBtn");

const nameRegex = /^[A-Za-z\s]{3,40}$/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const courseStatMap = {
    "Web Development": statWebDevelopment,
    "UI/UX": statUIUX,
    "Python": statPython,
    "Data Analytics": statDataAnalytics,
    "MERN Stack": statMernStack,
    "Cloud Computing": statCloudComputing
};

let students = loadStudentsFromStorage();
let editingStudentId = null;
let selectedPhotoDataUrl = "";

function loadStudentsFromStorage() {
    const savedData = localStorage.getItem("studentRecords");
    if (!savedData) {
        return [];
    }
    try {
        return JSON.parse(savedData);
    } catch (error) {
        return [];
    }
}

function saveStudentsToStorage() {
    localStorage.setItem("studentRecords", JSON.stringify(students));
}

function showFieldError(fieldId, message) {
    const errorSpan = document.querySelector("#" + fieldId + "Error");
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearFieldError(fieldId) {
    showFieldError(fieldId, "");
}

function clearAllFieldErrors() {
    document.querySelectorAll(".fieldError").forEach(function (span) {
        span.textContent = "";
    });
}

function validateStudentName() {
    const value = studentNameInput.value.trim();
    if (value === "") {
        showFieldError("studentName", "Student name is required");
        return false;
    }
    if (!nameRegex.test(value)) {
        showFieldError("studentName", "Enter 3 to 40 letters only, no numbers or symbols");
        return false;
    }
    clearFieldError("studentName");
    return true;
}

function validateStudentEmail() {
    const value = studentEmailInput.value.trim();
    if (value === "") {
        showFieldError("studentEmail", "Email is required");
        return false;
    }
    if (!emailRegex.test(value)) {
        showFieldError("studentEmail", "Enter a valid email address");
        return false;
    }
    clearFieldError("studentEmail");
    return true;
}

function validateStudentPhone() {
    const value = studentPhoneInput.value.trim();
    if (value === "") {
        showFieldError("studentPhone", "Phone number is required");
        return false;
    }
    if (!phoneRegex.test(value)) {
        showFieldError("studentPhone", "Enter exactly 10 digits");
        return false;
    }
    clearFieldError("studentPhone");
    return true;
}

function calculateAgeFromDob(dobValue) {
    const dobDate = new Date(dobValue);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
        age = age - 1;
    }
    return age;
}

function validateStudentDob() {
    const value = studentDobInput.value;
    if (value === "") {
        showFieldError("studentDob", "Date of birth is required");
        return false;
    }
    const dobDate = new Date(value);
    const today = new Date();
    if (dobDate > today) {
        showFieldError("studentDob", "Future dates are not allowed");
        return false;
    }
    if (calculateAgeFromDob(value) < 15) {
        showFieldError("studentDob", "Student must be at least 15 years old");
        return false;
    }
    clearFieldError("studentDob");
    return true;
}

function getSelectedGender() {
    const checkedRadio = studentForm.querySelector('input[name="gender"]:checked');
    return checkedRadio ? checkedRadio.value : "";
}

function validateGender() {
    if (getSelectedGender() === "") {
        showFieldError("gender", "Please select a gender");
        return false;
    }
    clearFieldError("gender");
    return true;
}

function validateStudentCourse() {
    if (studentCourseSelect.value === "") {
        showFieldError("studentCourse", "Please select a course");
        return false;
    }
    clearFieldError("studentCourse");
    return true;
}

function getSelectedSkills() {
    const checkedBoxes = studentForm.querySelectorAll('input[name="skills"]:checked');
    return Array.from(checkedBoxes).map(function (box) {
        return box.value;
    });
}

function validateSkills() {
    if (getSelectedSkills().length === 0) {
        showFieldError("skills", "Select at least one skill");
        return false;
    }
    clearFieldError("skills");
    return true;
}

function validateAboutStudent() {
    const value = aboutStudentTextarea.value.trim();
    if (value === "") {
        showFieldError("aboutStudent", "This field is required");
        return false;
    }
    if (value.length < 20) {
        showFieldError("aboutStudent", "Write at least 20 characters");
        return false;
    }
    if (value.length > 200) {
        showFieldError("aboutStudent", "Maximum 200 characters allowed");
        return false;
    }
    clearFieldError("aboutStudent");
    return true;
}

function validateProfilePhoto() {
    const hasNewFile = profilePhotoInput.files.length > 0;
    if (hasNewFile) {
        const chosenFile = profilePhotoInput.files[0];
        if (!chosenFile.type.startsWith("image/")) {
            showFieldError("profilePhoto", "Only image files are accepted");
            return false;
        }
        clearFieldError("profilePhoto");
        return true;
    }
    if (editingStudentId !== null && selectedPhotoDataUrl !== "") {
        clearFieldError("profilePhoto");
        return true;
    }
    showFieldError("profilePhoto", "Profile photo is required");
    return false;
}

function runAllValidations() {
    const nameOk = validateStudentName();
    const emailOk = validateStudentEmail();
    const phoneOk = validateStudentPhone();
    const dobOk = validateStudentDob();
    const genderOk = validateGender();
    const courseOk = validateStudentCourse();
    const skillsOk = validateSkills();
    const aboutOk = validateAboutStudent();
    const photoOk = validateProfilePhoto();
    return nameOk && emailOk && phoneOk && dobOk && genderOk && courseOk && skillsOk && aboutOk && photoOk;
}

function updateCharacterCounter() {
    const currentLength = aboutStudentTextarea.value.length;
    aboutCharCounter.textContent = currentLength + " / 200";
}

function updateStatistics() {
    totalStudentsCount.textContent = students.length;
    Object.keys(courseStatMap).forEach(function (courseName) {
        const matchingCount = students.filter(function (student) {
            return student.course === courseName;
        }).length;
        courseStatMap[courseName].textContent = matchingCount;
    });
}

function createStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("studentCard");
    card.setAttribute("data-id", student.id);

    const photo = document.createElement("img");
    photo.classList.add("cardPhoto");
    photo.src = student.photo;
    photo.alt = student.name + " profile photo";

    const name = document.createElement("h3");
    name.classList.add("cardName");
    name.textContent = student.name;

    const emailLine = document.createElement("p");
    emailLine.classList.add("cardDetailLine");
    emailLine.innerHTML = "<strong>Email:</strong> " + student.email;

    const phoneLine = document.createElement("p");
    phoneLine.classList.add("cardDetailLine");
    phoneLine.innerHTML = "<strong>Phone:</strong> " + student.phone;

    const dobLine = document.createElement("p");
    dobLine.classList.add("cardDetailLine");
    dobLine.innerHTML = "<strong>DOB:</strong> " + student.dob;

    const genderLine = document.createElement("p");
    genderLine.classList.add("cardDetailLine");
    genderLine.innerHTML = "<strong>Gender:</strong> " + student.gender;

    const courseLine = document.createElement("p");
    courseLine.classList.add("cardDetailLine");
    courseLine.innerHTML = "<strong>Course:</strong> " + student.course;

    const skillsWrap = document.createElement("div");
    skillsWrap.classList.add("cardSkillsWrap");
    student.skills.forEach(function (skill) {
        const pill = document.createElement("span");
        pill.classList.add("skillPill");
        pill.textContent = skill;
        skillsWrap.appendChild(pill);
    });

    const aboutLine = document.createElement("p");
    aboutLine.classList.add("cardAbout");
    aboutLine.textContent = student.about;

    const actionsWrap = document.createElement("div");
    actionsWrap.classList.add("cardActions");

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.classList.add("editBtn");
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "Delete";

    actionsWrap.appendChild(editButton);
    actionsWrap.appendChild(deleteButton);

    card.appendChild(photo);
    card.appendChild(name);
    card.appendChild(emailLine);
    card.appendChild(phoneLine);
    card.appendChild(dobLine);
    card.appendChild(genderLine);
    card.appendChild(courseLine);
    card.appendChild(skillsWrap);
    card.appendChild(aboutLine);
    card.appendChild(actionsWrap);

    return card;
}

function getFilteredStudents() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const chosenCourse = courseFilterSelect.value;
    return students.filter(function (student) {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm);
        const matchesCourse = chosenCourse === "" || student.course === chosenCourse;
        return matchesSearch && matchesCourse;
    });
}

function renderStudentCards(list) {
    studentCardsContainer.innerHTML = "";
    if (list.length === 0) {
        emptyStateMessage.style.display = "block";
        return;
    }
    emptyStateMessage.style.display = "none";
    list.forEach(function (student) {
        studentCardsContainer.appendChild(createStudentCard(student));
    });
}

function refreshDirectory() {
    renderStudentCards(getFilteredStudents());
    updateStatistics();
}

function deleteStudentById(studentId) {
    const wantsToDelete = confirm("Are you sure you want to delete this student?");
    if (!wantsToDelete) {
        return;
    }
    students = students.filter(function (student) {
        return student.id !== studentId;
    });
    saveStudentsToStorage();
    refreshDirectory();
}

function fillFormWithStudent(student) {
    studentNameInput.value = student.name;
    studentEmailInput.value = student.email;
    studentPhoneInput.value = student.phone;
    studentDobInput.value = student.dob;

    const genderRadio = studentForm.querySelector('input[name="gender"][value="' + student.gender + '"]');
    if (genderRadio) {
        genderRadio.checked = true;
    }

    studentCourseSelect.value = student.course;

    studentForm.querySelectorAll('input[name="skills"]').forEach(function (box) {
        box.checked = student.skills.includes(box.value);
    });

    aboutStudentTextarea.value = student.about;
    updateCharacterCounter();

    selectedPhotoDataUrl = student.photo;
}

function startEditingStudent(studentId) {
    const matchingStudent = students.find(function (student) {
        return student.id === studentId;
    });
    if (!matchingStudent) {
        return;
    }
    editingStudentId = studentId;
    fillFormWithStudent(matchingStudent);
    registerBtn.textContent = "Update Student";
    clearAllFieldErrors();
    studentForm.scrollIntoView({ behavior: "smooth" });
}

function resetFormToDefault() {
    studentForm.reset();
    clearAllFieldErrors();
    updateCharacterCounter();
    selectedPhotoDataUrl = "";
    editingStudentId = null;
    registerBtn.textContent = "Register Student";
}

function buildStudentFromForm() {
    return {
        name: studentNameInput.value.trim(),
        email: studentEmailInput.value.trim(),
        phone: studentPhoneInput.value.trim(),
        dob: studentDobInput.value,
        gender: getSelectedGender(),
        course: studentCourseSelect.value,
        skills: getSelectedSkills(),
        about: aboutStudentTextarea.value.trim(),
        photo: selectedPhotoDataUrl
    };
}

function generateNextStudentId() {
    if (students.length === 0) {
        return 1;
    }
    const highestId = students.reduce(function (max, student) {
        return student.id > max ? student.id : max;
    }, 0);
    return highestId + 1;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const isFormValid = runAllValidations();
    if (!isFormValid) {
        return;
    }

    const formData = buildStudentFromForm();

    if (editingStudentId !== null) {
        const studentIndex = students.findIndex(function (student) {
            return student.id === editingStudentId;
        });
        if (studentIndex !== -1) {
            students[studentIndex] = Object.assign({ id: editingStudentId }, formData);
        }
    } else {
        formData.id = generateNextStudentId();
        students.push(formData);
    }

    saveStudentsToStorage();
    resetFormToDefault();
    refreshDirectory();
}

function handleContainerClick(event) {
    const deleteButton = event.target.closest(".deleteBtn");
    if (deleteButton) {
        const parentCard = deleteButton.closest(".studentCard");
        const studentId = Number(parentCard.getAttribute("data-id"));
        deleteStudentById(studentId);
        return;
    }

    const editButton = event.target.closest(".editBtn");
    if (editButton) {
        const parentCard = editButton.closest(".studentCard");
        const studentId = Number(parentCard.getAttribute("data-id"));
        startEditingStudent(studentId);
    }
}

function handlePhotoChange() {
    if (profilePhotoInput.files.length === 0) {
        return;
    }
    const chosenFile = profilePhotoInput.files[0];
    if (!chosenFile.type.startsWith("image/")) {
        showFieldError("profilePhoto", "Only image files are accepted");
        return;
    }
    clearFieldError("profilePhoto");
    const reader = new FileReader();
    reader.onload = function () {
        selectedPhotoDataUrl = reader.result;
    };
    reader.readAsDataURL(chosenFile);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkModeOn = document.body.classList.contains("dark-mode");
    themeToggleBtn.textContent = isDarkModeOn ? "Light Mode" : "Dark Mode";
}

studentForm.addEventListener("submit", handleFormSubmit);
studentForm.addEventListener("reset", function () {
    setTimeout(resetFormToDefault, 0);
});

studentNameInput.addEventListener("input", validateStudentName);
studentEmailInput.addEventListener("input", validateStudentEmail);
studentPhoneInput.addEventListener("input", validateStudentPhone);
studentDobInput.addEventListener("change", validateStudentDob);
studentCourseSelect.addEventListener("change", validateStudentCourse);
studentForm.querySelectorAll('input[name="gender"]').forEach(function (radio) {
    radio.addEventListener("change", validateGender);
});
studentForm.querySelectorAll('input[name="skills"]').forEach(function (box) {
    box.addEventListener("change", validateSkills);
});
aboutStudentTextarea.addEventListener("input", function () {
    updateCharacterCounter();
    validateAboutStudent();
});
profilePhotoInput.addEventListener("change", handlePhotoChange);

studentCardsContainer.addEventListener("click", handleContainerClick);

searchInput.addEventListener("input", function () {
    renderStudentCards(getFilteredStudents());
});
courseFilterSelect.addEventListener("change", function () {
    renderStudentCards(getFilteredStudents());
});

themeToggleBtn.addEventListener("click", toggleDarkMode);

updateCharacterCounter();
refreshDirectory();
