const form = document.getElementById("studentForm");
const themeButton = document.getElementById("themeButton");

const studentName = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profilePhoto");

const registerButton = document.getElementById("registerButton");
const characterCount = document.getElementById("characterCount");
const studentContainer = document.getElementById("studentContainer");

const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

const totalStudents = document.getElementById("totalStudents");
const webDevelopmentCount = document.getElementById("webDevelopmentCount");
const uiuxCount = document.getElementById("uiuxCount");
const pythonCount = document.getElementById("pythonCount");
const dataAnalyticsCount = document.getElementById("dataAnalyticsCount");
const mernCount = document.getElementById("mernCount");
const cloudComputingCount = document.getElementById("cloudComputingCount");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;

about.addEventListener("input", function () {
    characterCount.textContent = `${about.value.length} / 200`;
});

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error-message").forEach(function (error) {
        error.textContent = "";
    });
}

function getGender() {
    const gender = document.querySelector('input[name="gender"]:checked');

    return gender ? gender.value : "";
}

function getSkills() {
    const skills = document.querySelectorAll('input[name="skills"]:checked');

    return Array.from(skills).map(function (skill) {
        return skill.value;
    });
}

function validateForm() {
    clearErrors();

    let valid = true;

    const name = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value;
    const gender = getGender();
    const courseValue = course.value;
    const skills = getSkills();
    const aboutValue = about.value.trim();

    const nameRegex = /^[A-Za-z ]{3,40}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (name === "") {
        showError("studentNameError", "Name is required");
        valid = false;
    } else if (!nameRegex.test(name)) {
        showError("studentNameError", "Name must contain only letters and spaces");
        valid = false;
    }

    if (emailValue === "") {
        showError("emailError", "Email is required");
        valid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError("emailError", "Enter a valid email");
        valid = false;
    }

    if (phoneValue === "") {
        showError("phoneError", "Phone number is required");
        valid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError("phoneError", "Phone must contain exactly 10 digits");
        valid = false;
    }

    if (dobValue === "") {
        showError("dobError", "Date of birth is required");
        valid = false;
    } else {
        const birthDate = new Date(dobValue);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (birthDate > today) {
            showError("dobError", "Future date is not allowed");
            valid = false;
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (
            month < 0 ||
            (month === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        if (age < 15) {
            showError("dobError", "Student must be at least 15 years old");
            valid = false;
        }
    }

    if (gender === "") {
        showError("genderError", "Please select gender");
        valid = false;
    }

    if (courseValue === "") {
        showError("courseError", "Please select a course");
        valid = false;
    }

    if (skills.length === 0) {
        showError("skillsError", "Select at least one skill");
        valid = false;
    }

    if (aboutValue === "") {
        showError("aboutError", "About student is required");
        valid = false;
    } else if (aboutValue.length < 20) {
        showError("aboutError", "Minimum 20 characters required");
        valid = false;
    } else if (aboutValue.length > 200) {
        showError("aboutError", "Maximum 200 characters allowed");
        valid = false;
    }

    if (editingId === null && profilePhoto.files.length === 0) {
        showError("photoError", "Profile photo is required");
        valid = false;
    }

    if (profilePhoto.files.length > 0) {
        const file = profilePhoto.files[0];

        if (!file.type.startsWith("image/")) {
            showError("photoError", "Only image files are allowed");
            valid = false;
        }
    }

    return valid;
}

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const name = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value;
    const gender = getGender();
    const courseValue = course.value;
    const skills = getSkills();
    const aboutValue = about.value.trim();

    let photo = "";

    if (profilePhoto.files.length > 0) {
        photo = URL.createObjectURL(profilePhoto.files[0]);
    }

    if (editingId !== null) {
        const student = students.find(function (student) {
            return student.id === editingId;
        });

        student.name = name;
        student.email = emailValue;
        student.phone = phoneValue;
        student.dob = dobValue;
        student.gender = gender;
        student.course = courseValue;
        student.skills = skills;
        student.about = aboutValue;

        if (photo !== "") {
            student.photo = photo;
        }
    } else {
        const newStudent = {
            id: students.length > 0
                ? Math.max(...students.map(student => student.id)) + 1
                : 1,
            name: name,
            email: emailValue,
            phone: phoneValue,
            dob: dobValue,
            gender: gender,
            course: courseValue,
            skills: skills,
            about: aboutValue,
            photo: photo
        };

        students.push(newStudent);
    }

    saveStudents();
    renderStudents(students);
    updateStatistics();
    resetForm();
});

function renderStudents(list) {
    studentContainer.innerHTML = "";

    if (list.length === 0) {
        const message = document.createElement("p");

        message.classList.add("no-students");
        message.textContent = "No students found";

        studentContainer.appendChild(message);

        return;
    }

    list.forEach(function (student) {
        const card = document.createElement("div");

        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const image = document.createElement("img");

        image.classList.add("student-photo");
        image.setAttribute("alt", student.name);

        if (student.photo) {
            image.setAttribute("src", student.photo);
        } else {
            image.setAttribute(
                "src",
                "https://via.placeholder.com/300x180?text=No+Photo"
            );
        }

        const name = document.createElement("h3");
        name.textContent = student.name;

        const emailText = document.createElement("p");
        emailText.textContent = `Email: ${student.email}`;

        const phoneText = document.createElement("p");
        phoneText.textContent = `Phone: ${student.phone}`;

        const dobText = document.createElement("p");
        dobText.textContent = `DOB: ${student.dob}`;

        const genderText = document.createElement("p");
        genderText.textContent = `Gender: ${student.gender}`;

        const courseText = document.createElement("p");
        courseText.textContent = `Course: ${student.course}`;

        const skillsBox = document.createElement("div");

        skillsBox.classList.add("student-skills");

        const skillsTitle = document.createElement("strong");
        skillsTitle.textContent = "Skills: ";

        skillsBox.appendChild(skillsTitle);

        student.skills.forEach(function (skill) {
            const skillElement = document.createElement("span");

            skillElement.classList.add("skill");
            skillElement.textContent = skill;

            skillsBox.appendChild(skillElement);
        });

        const aboutText = document.createElement("p");
        aboutText.textContent = `About: ${student.about}`;

        const buttons = document.createElement("div");

        buttons.classList.add("card-buttons");

        const editButton = document.createElement("button");

        editButton.classList.add("edit-btn");
        editButton.setAttribute("type", "button");
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-btn");
        deleteButton.setAttribute("type", "button");
        deleteButton.textContent = "Delete";

        buttons.append(editButton, deleteButton);

        card.append(
            image,
            name,
            emailText,
            phoneText,
            dobText,
            genderText,
            courseText,
            skillsBox,
            aboutText,
            buttons
        );

        studentContainer.appendChild(card);
    });
}

function updateStatistics() {
    totalStudents.textContent = students.length;

    webDevelopmentCount.textContent = students.filter(function (student) {
        return student.course === "Web Development";
    }).length;

    uiuxCount.textContent = students.filter(function (student) {
        return student.course === "UI/UX";
    }).length;

    pythonCount.textContent = students.filter(function (student) {
        return student.course === "Python";
    }).length;

    dataAnalyticsCount.textContent = students.filter(function (student) {
        return student.course === "Data Analytics";
    }).length;

    mernCount.textContent = students.filter(function (student) {
        return student.course === "MERN Stack";
    }).length;

    cloudComputingCount.textContent = students.filter(function (student) {
        return student.course === "Cloud Computing";
    }).length;
}

studentContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".student-card");
        const id = Number(card.dataset.id);

        if (!confirm("Are you sure you want to delete this student?")) {
            return;
        }

        const index = students.findIndex(function (student) {
            return student.id === id;
        });

        if (index !== -1) {
            students.splice(index, 1);
            saveStudents();
            card.remove();
            updateStatistics();
            applyFilters();
        }
    }

    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.closest(".student-card");
        const id = Number(card.dataset.id);

        const student = students.find(function (student) {
            return student.id === id;
        });

        if (!student) {
            return;
        }

        editingId = student.id;

        studentName.value = student.name;
        email.value = student.email;
        phone.value = student.phone;
        dob.value = student.dob;
        course.value = student.course;
        about.value = student.about;

        document
            .querySelectorAll('input[name="gender"]')
            .forEach(function (radio) {
                radio.checked = radio.value === student.gender;
            });

        document
            .querySelectorAll('input[name="skills"]')
            .forEach(function (checkbox) {
                checkbox.checked = student.skills.includes(checkbox.value);
            });

        characterCount.textContent = `${about.value.length} / 200`;
        registerButton.textContent = "Update Student";

        form.scrollIntoView({
            behavior: "smooth"
        });
    }
});

function applyFilters() {
    const search = searchInput.value.toLowerCase().trim();
    const selectedCourse = courseFilter.value;

    const result = students.filter(function (student) {
        const nameMatch = student.name
            .toLowerCase()
            .includes(search);

        const courseMatch =
            selectedCourse === "all" ||
            student.course === selectedCourse;

        return nameMatch && courseMatch;
    });

    renderStudents(result);
}

searchInput.addEventListener("input", applyFilters);

courseFilter.addEventListener("change", applyFilters);

function resetForm() {
    form.reset();

    editingId = null;

    registerButton.textContent = "Register Student";
    characterCount.textContent = "0 / 200";

    clearErrors();
}

form.addEventListener("reset", function () {
    setTimeout(function () {
        editingId = null;
        registerButton.textContent = "Register Student";
        characterCount.textContent = "0 / 200";
        clearErrors();
    }, 0);
});

themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeButton.textContent = "Light Mode";
    } else {
        themeButton.textContent = "Dark Mode";
    }
});

renderStudents(students);
updateStatistics();