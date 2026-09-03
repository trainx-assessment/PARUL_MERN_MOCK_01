const students = [];
let currentEditId = null;
let nextId = 1;

function generateId() {
    return nextId++;
}

function getSelectedGender() {
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    for (const input of genderInputs) {
        if (input.checked) return input.value;
    }
    return null;
}

function getSelectedSkills() {
    const skillInputs = document.querySelectorAll('input[name="skills"]:checked');
    return Array.from(skillInputs).map((input) => input.value);
}

function photoToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function createStudentObject() {
    return {
        id: generateId(),
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        phone: document.getElementById("studentPhone").value.trim(),
        dob: document.getElementById("studentDob").value,
        gender: getSelectedGender(),
        course: document.getElementById("studentCourse").value,
        skills: getSelectedSkills(),
        about: document.getElementById("studentAbout").value.trim(),
        photo: document.getElementById("studentPhoto").dataset.preview || ""
    };
}

function renderStudentCards() {
    const container = document.getElementById("studentCardsContainer");
    container.innerHTML = "";

    if (students.length === 0) {
        container.innerHTML = '<p class="no-students">No students found</p>';
        return;
    }

    students.forEach((student) => {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        card.innerHTML = `
            <div class="student-card-content">
                <img src="${student.photo}" alt="${student.name}" class="student-photo">
                <div class="student-card-details">
                    <p><span class="label">Name:</span> ${student.name}</p>
                    <p><span class="label">Email:</span> ${student.email}</p>
                    <p><span class="label">Phone:</span> ${student.phone}</p>
                    <p><span class="label">DOB:</span> ${student.dob}</p>
                    <p><span class="label">Gender:</span> ${student.gender}</p>
                    <p><span class="label">Course:</span> ${student.course}</p>
                    <div class="student-skills">
                        ${student.skills.map((skill) => `<span class="student-skill-tag">${skill}</span>`).join("")}
                    </div>
                    <p><span class="label">About:</span> ${student.about}</p>
                    <div class="student-card-actions">
                        <button class="card-edit-btn">Edit</button>
                        <button class="card-delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

const form = document.getElementById("studentForm");
const aboutTextarea = document.getElementById("studentAbout");
const counterDisplay = document.getElementById("counter");

aboutTextarea.addEventListener("input", function () {
    const currentLength = aboutTextarea.value.length;
    counterDisplay.textContent = currentLength + " / 200";
    counterDisplay.style.color = currentLength > 180 ? "red" : "#666";
});

function showError(input, message) {
    const formGroup = input.closest(".form-group");
    let errorElement = formGroup.querySelector(".error-message");
    if (!errorElement) {
        errorElement = document.createElement("span");
        errorElement.className = "error-message";
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
    input.classList.add("input-error");
}

function clearError(input) {
    const formGroup = input.closest(".form-group");
    if (!formGroup) return;
    const errorElement = formGroup.querySelector(".error-message");
    if (errorElement) {
        errorElement.remove();
    }
    input.classList.remove("input-error");
}

function showSkillsError(message) {
    const checkboxGroup = document.querySelector(".checkbox-group");
    let errorElement = checkboxGroup.querySelector(".error-message");
    if (!errorElement) {
        errorElement = document.createElement("span");
        errorElement.className = "error-message";
        checkboxGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearSkillsError() {
    const checkboxGroup = document.querySelector(".checkbox-group");
    const errorElement = checkboxGroup.querySelector(".error-message");
    if (errorElement) {
        errorElement.remove();
    }
}

function validateName() {
    const input = document.getElementById("studentName");
    const value = input.value.trim();

    if (value === "") {
        showError(input, "Student name is required");
        return false;
    }
    if (value.length < 3) {
        showError(input, "Name must be at least 3 characters");
        return false;
    }
    if (value.length > 40) {
        showError(input, "Name must not exceed 40 characters");
        return false;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(value)) {
        showError(input, "Only letters and spaces are allowed");
        return false;
    }
    clearError(input);
    return true;
}

function validateEmail() {
    const input = document.getElementById("studentEmail");
    const value = input.value.trim();

    if (value === "") {
        showError(input, "Email is required");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(input, "Please enter a valid email address");
        return false;
    }
    clearError(input);
    return true;
}

function validatePhone() {
    const input = document.getElementById("studentPhone");
    const value = input.value.trim();

    if (value === "") {
        showError(input, "Phone number is required");
        return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
        showError(input, "Phone number must be exactly 10 digits (numbers only)");
        return false;
    }
    clearError(input);
    return true;
}

function validateDob() {
    const input = document.getElementById("studentDob");
    const value = input.value;

    if (value === "") {
        showError(input, "Date of birth is required");
        return false;
    }
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
        showError(input, "WoW!! The Student is not even born - Future dates are not allowed");
        return false;
    }

    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 15);
    if (selectedDate > minAgeDate) {
        showError(input, "Student must be at least 15 years old");
        return false;
    }
    clearError(input);
    return true;
}

function validateGender() {
    const input = document.getElementById("genderMale");
    const isChecked =
        document.getElementById("genderMale").checked ||
        document.getElementById("genderFemale").checked ||
        document.getElementById("genderOther").checked;

    if (!isChecked) {
        showError(input, "Please select a gender");
        return false;
    }
    clearError(input);
    return true;
}

function validateCourse() {
    const input = document.getElementById("studentCourse");
    const value = input.value;

    if (value === "" || value === "Select Course") {
        showError(input, "Please select a course");
        return false;
    }
    clearError(input);
    return true;
}

function validateSkills() {
    const checkedCount = document.querySelectorAll('input[name="skills"]:checked').length;

    if (checkedCount === 0) {
        showSkillsError("Please select at least one skill");
        return false;
    }
    clearSkillsError();
    return true;
}

function validateAbout() {
    const input = document.getElementById("studentAbout");
    const value = input.value.trim();

    if (value === "") {
        showError(input, "About student is required");
        return false;
    }
    if (value.length < 20) {
        showError(input, "About must be at least 20 characters");
        return false;
    }
    if (value.length > 200) {
        showError(input, "About must not exceed 200 characters");
        return false;
    }
    clearError(input);
    return true;
}

function validatePhoto() {
    const input = document.getElementById("studentPhoto");
    const file = input.files[0];

    if (!file) {
        showError(input, "Profile photo is required");
        return false;
    }
    const fileName = file.name.toLowerCase();
    const allowedExtensions = /\.(jpg|jpeg|png)$/;
    if (!allowedExtensions.test(fileName)) {
        showError(input, "Only image files (.jpg, .jpeg, .png) are allowed");
        return false;
    }
    clearError(input);
    return true;
}

function updateStatistics() {
    const totalEl = document.getElementById("totalStudents");
    totalEl.textContent = `Total Students: ${students.length}`;

    const courseCounts = {};
    students.forEach((student) => {
        courseCounts[student.course] = (courseCounts[student.course] || 0) + 1;
    });

    const courseIds = {
        "Web Development": "statWebDev",
        "UI/UX": "statUiUx",
        "Python": "statPython",
        "Data Analytics": "statDataAnalytics",
        "MERN Stack": "statMern",
        "Cloud Computing": "statCloud"
    };

    Object.keys(courseIds).forEach((course) => {
        const el = document.getElementById(courseIds[course]);
        el.textContent = courseCounts[course] || 0;
    });
}

function resetForm() {
    form.reset();
    currentEditId = null;
    document.getElementById("registerBtn").textContent = "Register Student";
    document.getElementById("counter").textContent = "0 / 200";
    document.getElementById("counter").style.color = "#666";
    document.getElementById("studentPhoto").dataset.preview = "";

    const errorElements = form.querySelectorAll(".error-message");
    errorElements.forEach((el) => el.remove());

    const errorInputs = form.querySelectorAll("input.error, .input-error");
    errorInputs.forEach((el) => el.classList.remove("input-error"));
}

document.getElementById("studentPhoto").addEventListener("change", function () {
    const file = this.files[0];
    const input = this;
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const allowedExtensions = /\.(jpg|jpeg|png)$/;
    if (!allowedExtensions.test(fileName)) {
        showError(input, "Only image files (.jpg, .jpeg, .png) are allowed");
        return;
    }

    clearError(input);

    photoToDataURL(file).then((dataUrl) => {
        input.dataset.preview = dataUrl;
    }).catch(() => {});
});

function attachInputListeners() {
    const textInputs = form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='date'], select, textarea"
    );
    textInputs.forEach((input) => {
        input.addEventListener("input", function () {
            clearError(input);
        });
    });

    const genderInputs = form.querySelectorAll('input[name="gender"]');
    genderInputs.forEach((input) => {
        input.addEventListener("change", function () {
            clearError(input);
        });
    });

    const skillInputs = form.querySelectorAll('input[name="skills"]');
    skillInputs.forEach((input) => {
        input.addEventListener("change", function () {
            clearSkillsError();
        });
    });

    const photoInput = document.getElementById("studentPhoto");
    photoInput.addEventListener("change", function () {
        clearError(photoInput);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    if (!validateName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (!validateDob()) isValid = false;
    if (!validateGender()) isValid = false;
    if (!validateCourse()) isValid = false;
    if (!validateSkills()) isValid = false;
    if (!validateAbout()) isValid = false;
    if (!validatePhoto()) isValid = false;

    if (!isValid) return;

    const student = createStudentObject();
    students.push(student);
    renderStudentCards();
    updateStatistics();
    resetForm();
});

attachInputListeners();
updateStatistics();
renderStudentCards();