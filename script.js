const studentForm = document.querySelector("#studentForm");
const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const photo = document.querySelector("#photo");
const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");
const studentContainer = document.querySelector("#studentContainer");
const searchInput = document.querySelector("#searchInput");
const courseFilter = document.querySelector("#courseFilter");
const charCounter = document.querySelector("#charCounter");
const themeBtn = document.querySelector("#themeBtn");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;

const courses = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function getError(id) {
    return document.querySelector(`#${id}`);
}

function showError(id, message) {
    getError(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(error => {
        error.textContent = "";
    });
}

function getGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    return selected ? selected.value : "";
}

function getSkills() {
    return [...document.querySelectorAll('input[name="skills"]:checked')]
        .map(skill => skill.value);
}

function calculateAge(date) {
    const birthDate = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

function validateForm(requirePhoto = true) {
    clearErrors();

    let valid = true;
    const nameValue = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const aboutValue = about.value.trim();
    const genderValue = getGender();
    const skillsValue = getSkills();

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameValue) {
        showError("studentNameError", "Student name is required");
        valid = false;
    } else if (nameValue.length < 3) {
        showError("studentNameError", "Minimum 3 characters required");
        valid = false;
    } else if (nameValue.length > 40) {
        showError("studentNameError", "Maximum 40 characters allowed");
        valid = false;
    } else if (!nameRegex.test(nameValue)) {
        showError("studentNameError", "Only letters and spaces are allowed");
        valid = false;
    }

    if (!emailValue) {
        showError("emailError", "Email is required");
        valid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError("emailError", "Enter a valid email address");
        valid = false;
    }

    if (!phoneValue) {
        showError("phoneError", "Phone number is required");
        valid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        showError("phoneError", "Phone number must contain exactly 10 digits");
        valid = false;
    }

    if (!dob.value) {
        showError("dobError", "Date of birth is required");
        valid = false;
    } else {
        const selectedDate = new Date(dob.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError("dobError", "Future dates are not allowed");
            valid = false;
        } else if (calculateAge(dob.value) < 15) {
            showError("dobError", "Student must be at least 15 years old");
            valid = false;
        }
    }

    if (!genderValue) {
        showError("genderError", "Please select a gender");
        valid = false;
    }

    if (!course.value) {
        showError("courseError", "Please select a course");
        valid = false;
    }

    if (skillsValue.length === 0) {
        showError("skillsError", "Select at least one skill");
        valid = false;
    }

    if (!aboutValue) {
        showError("aboutError", "About student is required");
        valid = false;
    } else if (aboutValue.length < 20) {
        showError("aboutError", "Minimum 20 characters required");
        valid = false;
    } else if (aboutValue.length > 200) {
        showError("aboutError", "Maximum 200 characters allowed");
        valid = false;
    }

    if (requirePhoto && !photo.files[0]) {
        showError("photoError", "Profile photo is required");
        valid = false;
    }

    if (photo.files[0] && !photo.files[0].type.startsWith("image/")) {
        showError("photoError", "Only image files are allowed");
        valid = false;
    }

    return valid;
}

function resetForm() {
    studentForm.reset();
    clearErrors();
    charCounter.textContent = "0 / 200";
    editingId = null;
    submitBtn.textContent = "Register Student";
}

function createStudent(photoData) {
    return {
        id: Date.now(),
        name: studentName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        dob: dob.value,
        gender: getGender(),
        course: course.value,
        skills: getSkills(),
        about: about.value.trim(),
        photo: photoData
    };
}

function renderStudents() {
    const searchValue = searchInput.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchValue);
        const matchesCourse =
            selectedCourse === "All Courses" ||
            student.course === selectedCourse;

        return matchesSearch && matchesCourse;
    });

    studentContainer.innerHTML = "";

    if (filteredStudents.length === 0) {
        studentContainer.innerHTML = `
            <div class="no-students">No students found</div>
        `;
        return;
    }

    filteredStudents.forEach(student => {
        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const image = document.createElement("img");
        image.classList.add("student-photo");
        image.src = student.photo;
        image.alt = student.name;

        const content = document.createElement("div");
        content.classList.add("student-content");

        const heading = document.createElement("h3");
        heading.textContent = student.name;

        const emailInfo = document.createElement("p");
        emailInfo.classList.add("student-info");
        emailInfo.innerHTML = `<strong>Email:</strong> ${student.email}`;

        const phoneInfo = document.createElement("p");
        phoneInfo.classList.add("student-info");
        phoneInfo.innerHTML = `<strong>Phone:</strong> ${student.phone}`;

        const dobInfo = document.createElement("p");
        dobInfo.classList.add("student-info");
        dobInfo.innerHTML = `<strong>DOB:</strong> ${formatDate(student.dob)}`;

        const genderInfo = document.createElement("p");
        genderInfo.classList.add("student-info");
        genderInfo.innerHTML = `<strong>Gender:</strong> ${student.gender}`;

        const courseInfo = document.createElement("p");
        courseInfo.classList.add("student-info");
        courseInfo.innerHTML = `<strong>Course:</strong> ${student.course}`;

        const skillsContainer = document.createElement("div");
        skillsContainer.classList.add("skills");

        student.skills.forEach(skill => {
            const skillElement = document.createElement("span");
            skillElement.classList.add("skill");
            skillElement.textContent = skill;
            skillsContainer.appendChild(skillElement);
        });

        const aboutInfo = document.createElement("p");
        aboutInfo.classList.add("about");
        aboutInfo.innerHTML = `<strong>About:</strong> ${student.about}`;

        const buttons = document.createElement("div");
        buttons.classList.add("card-buttons");

        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.dataset.action = "edit";
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";

        buttons.append(editButton, deleteButton);

        content.append(
            heading,
            emailInfo,
            phoneInfo,
            dobInfo,
            genderInfo,
            courseInfo,
            skillsContainer,
            aboutInfo,
            buttons
        );

        card.append(image, content);
        studentContainer.appendChild(card);
    });
}

function formatDate(date) {
    const parts = date.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function updateStatistics() {
    document.querySelector("#totalStudents").textContent = students.length;

    document.querySelector("#webDevelopmentCount").textContent =
        students.filter(student => student.course === "Web Development").length;

    document.querySelector("#uiuxCount").textContent =
        students.filter(student => student.course === "UI/UX").length;

    document.querySelector("#pythonCount").textContent =
        students.filter(student => student.course === "Python").length;

    document.querySelector("#dataAnalyticsCount").textContent =
        students.filter(student => student.course === "Data Analytics").length;

    document.querySelector("#mernCount").textContent =
        students.filter(student => student.course === "MERN Stack").length;

    document.querySelector("#cloudCount").textContent =
        students.filter(student => student.course === "Cloud Computing").length;
}

function fillForm(student) {
    studentName.value = student.name;
    email.value = student.email;
    phone.value = student.phone;
    dob.value = student.dob;
    course.value = student.course;
    about.value = student.about;

    document.querySelectorAll('input[name="gender"]').forEach(input => {
        input.checked = input.value === student.gender;
    });

    document.querySelectorAll('input[name="skills"]').forEach(input => {
        input.checked = student.skills.includes(input.value);
    });

    charCounter.textContent = `${about.value.length} / 200`;

    editingId = student.id;
    submitBtn.textContent = "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

studentForm.addEventListener("submit", event => {
    event.preventDefault();

    const valid = validateForm(editingId === null);

    if (!valid) {
        return;
    }

    if (editingId !== null) {
        const student = students.find(item => item.id === editingId);

        if (!student) {
            return;
        }

        student.name = studentName.value.trim();
        student.email = email.value.trim();
        student.phone = phone.value.trim();
        student.dob = dob.value;
        student.gender = getGender();
        student.course = course.value;
        student.skills = getSkills();
        student.about = about.value.trim();

        if (photo.files[0]) {
            const reader = new FileReader();

            reader.onload = () => {
                student.photo = reader.result;
                saveStudents();
                renderStudents();
                updateStatistics();
                resetForm();
            };

            reader.readAsDataURL(photo.files[0]);
            return;
        }

        saveStudents();
        renderStudents();
        updateStatistics();
        resetForm();
        return;
    }

    const file = photo.files[0];

    const reader = new FileReader();

    reader.onload = () => {
        const newStudent = createStudent(reader.result);

        students.push(newStudent);

        saveStudents();
        renderStudents();
        updateStatistics();
        resetForm();
    };

    reader.readAsDataURL(file);
});

resetBtn.addEventListener("click", resetForm);

about.addEventListener("input", () => {
    charCounter.textContent = `${about.value.length} / 200`;
});

studentContainer.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const card = button.closest(".student-card");

    if (!card) {
        return;
    }

    const id = Number(card.dataset.id);

    if (button.dataset.action === "delete") {
        const confirmed = confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        students = students.filter(student => student.id !== id);

        saveStudents();
        renderStudents();
        updateStatistics();

        if (editingId === id) {
            resetForm();
        }
    }

    if (button.dataset.action === "edit") {
        const student = students.find(item => item.id === id);

        if (student) {
            fillForm(student);
        }
    }
});

searchInput.addEventListener("input", renderStudents);

courseFilter.addEventListener("change", renderStudents);

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeBtn.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "Light Mode";
}

const today = new Date().toISOString().split("T")[0];
dob.setAttribute("max", today);

renderStudents();
updateStatistics();