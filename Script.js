const studentForm = document.querySelector("#studentForm");
const studentName = document.querySelector("#studentName");
const studentEmail = document.querySelector("#studentEmail");
const studentPhone = document.querySelector("#studentPhone");
const studentDob = document.querySelector("#studentDob");
const studentCourse = document.querySelector("#studentCourse");
const studentAbout = document.querySelector("#studentAbout");
const studentPhoto = document.querySelector("#studentPhoto");
const studentContainer = document.querySelector("#studentContainer");
const emptyState = document.querySelector("#emptyState");
const searchStudent = document.querySelector("#searchStudent");
const courseFilter = document.querySelector("#courseFilter");
const characterCounter = document.querySelector("#characterCounter");
const submitButton = document.querySelector("#submitButton");
const resetButton = document.querySelector("#resetButton");
const formMessage = document.querySelector("#formMessage");
const themeToggle = document.querySelector("#themeToggle");
const editingStudentId = document.querySelector("#editingStudentId");

let students = JSON.parse(localStorage.getItem("students")) || [];

const courseCountIds = {
    "Web Development": "webDevelopmentCount",
    "UI/UX": "uiUxCount",
    "Python": "pythonCount",
    "Data Analytics": "dataAnalyticsCount",
    "MERN Stack": "mernStackCount",
    "Cloud Computing": "cloudComputingCount"
};

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function showError(errorId, message) {
    document.querySelector(`#${errorId}`).textContent = message;
}

function clearErrors() {
    const errorMessages = document.querySelectorAll("form span");

    errorMessages.forEach((errorMessage) => {
        errorMessage.textContent = "";
    });

    formMessage.textContent = "";
}

function getSelectedGender() {
    const selectedGender = document.querySelector(
        'input[name="gender"]:checked'
    );

    return selectedGender ? selectedGender.value : "";
}

function getSelectedSkills() {
    return Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map((skill) => skill.value);
}

function validateForm() {
    clearErrors();

    const name = studentName.value.trim();
    const email = studentEmail.value.trim();
    const phone = studentPhone.value.trim();
    const dob = studentDob.value;
    const gender = getSelectedGender();
    const course = studentCourse.value;
    const skills = getSelectedSkills();
    const about = studentAbout.value.trim();
    const editingId = Number(editingStudentId.value);
    const editingStudent = students.find((student) => student.id === editingId);
    const hasNewPhoto = studentPhoto.files.length > 0;

    let isValid = true;

    const namePattern = /^[A-Za-z ]+$/;
    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
        showError("studentNameError", "Student name is required.");
        isValid = false;
    } else if (name.length < 3 || name.length > 40) {
        showError(
            "studentNameError",
            "Name must contain 3 to 40 characters."
        );
        isValid = false;
    } else if (!namePattern.test(name)) {
        showError(
            "studentNameError",
            "Name can contain only letters and spaces."
        );
        isValid = false;
    }

    if (!email) {
        showError("studentEmailError", "Email is required.");
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError("studentEmailError", "Enter a valid email address.");
        isValid = false;
    }

    if (!phone) {
        showError("studentPhoneError", "Phone number is required.");
        isValid = false;
    } else if (!phonePattern.test(phone)) {
        showError(
            "studentPhoneError",
            "Phone number must contain exactly 10 digits."
        );
        isValid = false;
    }

    if (!dob) {
        showError("studentDobError", "Date of birth is required.");
        isValid = false;
    } else {
        const birthDate = new Date(`${dob}T00:00:00`);
        const today = new Date();

        if (birthDate > today) {
            showError(
                "studentDobError",
                "Future dates are not allowed."
            );
            isValid = false;
        } else {
            const minimumAgeDate = new Date(
                today.getFullYear() - 15,
                today.getMonth(),
                today.getDate()
            );

            if (birthDate > minimumAgeDate) {
                showError(
                    "studentDobError",
                    "Student must be at least 15 years old."
                );
                isValid = false;
            }
        }
    }

    if (!gender) {
        showError("genderError", "Please select a gender.");
        isValid = false;
    }

    if (!course) {
        showError("studentCourseError", "Please select a course.");
        isValid = false;
    }

    if (skills.length === 0) {
        showError("skillsError", "Select at least one skill.");
        isValid = false;
    }

    if (!about) {
        showError("studentAboutError", "About section is required.");
        isValid = false;
    } else if (about.length < 20 || about.length > 200) {
        showError(
            "studentAboutError",
            "About section must contain 20 to 200 characters."
        );
        isValid = false;
    }

    if (!editingStudent && !hasNewPhoto) {
        showError("studentPhotoError", "Profile photo is required.");
        isValid = false;
    }

    if (hasNewPhoto && !studentPhoto.files[0].type.startsWith("image/")) {
        showError("studentPhotoError", "Only image files are accepted.");
        isValid = false;
    }

    return isValid;
}

function readPhoto(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve("");
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = () => reject(new Error("Photo could not be read."));

        fileReader.readAsDataURL(file);
    });
}

function createElement(tagName, text, className) {
    const element = document.createElement(tagName);

    element.textContent = text;

    if (className) {
        element.classList.add(className);
    }

    return element;
}

function createStudentCard(student) {
    const card = document.createElement("article");
    card.classList.add("student-card");
    card.dataset.id = student.id;

    const image = document.createElement("img");
    image.src = student.photo;
    image.alt = `${student.name}'s profile photo`;

    const name = createElement("h3", student.name);
    const email = createElement("p", `Email: ${student.email}`);
    const phone = createElement("p", `Phone: ${student.phone}`);
    const dob = createElement("p", `Date of Birth: ${student.dob}`);
    const gender = createElement("p", `Gender: ${student.gender}`);
    const course = createElement("p", `Course: ${student.course}`);
    const skills = createElement(
        "p",
        `Skills: ${student.skills.join(", ")}`
    );
    const about = createElement("p", `About: ${student.about}`);

    const editButton = createElement("button", "Edit");
    editButton.type = "button";
    editButton.classList.add("edit-btn");

    const deleteButton = createElement("button", "Delete");
    deleteButton.type = "button";
    deleteButton.classList.add("delete-btn");

    card.append(
        image,
        name,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        editButton,
        deleteButton
    );

    return card;
}

function renderStudents() {
    const searchText = searchStudent.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    studentContainer
        .querySelectorAll(".student-card")
        .forEach((card) => card.remove());

    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name
            .toLowerCase()
            .includes(searchText);

        const matchesCourse =
            selectedCourse === "All Courses" ||
            student.course === selectedCourse;

        return matchesSearch && matchesCourse;
    });

    emptyState.hidden = filteredStudents.length !== 0;

    filteredStudents.forEach((student) => {
        studentContainer.appendChild(createStudentCard(student));
    });
}

function updateStatistics() {
    document.querySelector("#totalStudents").textContent = students.length;

    Object.entries(courseCountIds).forEach(([course, elementId]) => {
        const courseTotal = students.filter(
            (student) => student.course === course
        ).length;

        document.querySelector(`#${elementId}`).textContent = courseTotal;
    });
}

function resetFormState() {
    studentForm.reset();
    editingStudentId.value = "";
    submitButton.textContent = "Register Student";
    clearErrors();
    characterCounter.textContent = "0 / 200";
}

function fillFormForEditing(student) {
    studentName.value = student.name;
    studentEmail.value = student.email;
    studentPhone.value = student.phone;
    studentDob.value = student.dob;
    studentCourse.value = student.course;
    studentAbout.value = student.about;
    editingStudentId.value = student.id;
    submitButton.textContent = "Update Student";

    document
        .querySelectorAll('input[name="gender"]')
        .forEach((radioButton) => {
            radioButton.checked = radioButton.value === student.gender;
        });

    document
        .querySelectorAll('input[name="skills"]')
        .forEach((checkbox) => {
            checkbox.checked = student.skills.includes(checkbox.value);
        });

    characterCounter.textContent = `${studentAbout.value.length} / 200`;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const selectedPhoto = studentPhoto.files[0];
    const currentId = Number(editingStudentId.value);
    const existingStudent = students.find(
        (student) => student.id === currentId
    );

    const photo = selectedPhoto
        ? await readPhoto(selectedPhoto)
        : existingStudent.photo;

    const studentData = {
        id: existingStudent ? existingStudent.id : Date.now(),
        name: studentName.value.trim(),
        email: studentEmail.value.trim(),
        phone: studentPhone.value.trim(),
        dob: studentDob.value,
        gender: getSelectedGender(),
        course: studentCourse.value,
        skills: getSelectedSkills(),
        about: studentAbout.value.trim(),
        photo
    };

    if (existingStudent) {
        const studentIndex = students.findIndex(
            (student) => student.id === currentId
        );

        students[studentIndex] = studentData;
        formMessage.textContent = "Student updated successfully.";
    } else {
        students.push(studentData);
        formMessage.textContent = "Student registered successfully.";
    }

    saveStudents();
    renderStudents();
    updateStatistics();
    resetFormState();
});

studentContainer.addEventListener("click", (event) => {
    const clickedButton = event.target;

    if (
        !clickedButton.classList.contains("delete-btn") &&
        !clickedButton.classList.contains("edit-btn")
    ) {
        return;
    }

    const studentCard = clickedButton.closest(".student-card");
    const studentId = Number(studentCard.dataset.id);
    const student = students.find((item) => item.id === studentId);

    if (clickedButton.classList.contains("delete-btn")) {
        const confirmed = confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        students = students.filter((item) => item.id !== studentId);

        saveStudents();
        renderStudents();
        updateStatistics();
        return;
    }

    if (clickedButton.classList.contains("edit-btn")) {
        fillFormForEditing(student);
    }
});

studentAbout.addEventListener("input", () => {
    characterCounter.textContent = `${studentAbout.value.length} / 200`;
});

searchStudent.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

resetButton.addEventListener("click", () => {
    setTimeout(resetFormState, 0);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const darkModeEnabled = document.body.classList.contains("dark-mode");

    themeToggle.textContent = darkModeEnabled
        ? "Light Mode"
        : "Dark Mode";

    localStorage.setItem("darkMode", darkModeEnabled);
});

if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
}

renderStudents();
updateStatistics();