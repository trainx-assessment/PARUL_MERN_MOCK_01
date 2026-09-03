
const form = document.querySelector("#studentForm");
const container = document.querySelector("#studentContainer");
const count = document.querySelector("#studentCount");

const students = [];
let id = 1;

function error(name, message) {
    document.querySelector("#" + name).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(function (e) {
        e.textContent = "";
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.querySelector("#studentName").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const dob = document.querySelector("#dob").value;
    const course = document.querySelector("#course").value;
    const about = document.querySelector("#about").value.trim();
    const photo = document.querySelector("#photo").files[0];
    const gender = document.querySelector('input[name="gender"]:checked');
    const skills = document.querySelectorAll('input[name="skills"]:checked');

    let valid = true;

    if (!name) {
        error("nameError", "Name is required");
        valid = false;
    } else if (name.length < 3) {
        error("nameError", "Minimum 3 characters");
        valid = false;
    } else if (!/^[A-Za-z ]+$/.test(name)) {
        error("nameError", "Only letters and spaces allowed");
        valid = false;
    }

    if (!email) {
        error("emailError", "Email is required");
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error("emailError", "Enter a valid email");
        valid = false;
    }

    if (!phone) {
        error("phoneError", "Phone is required");
        valid = false;
    } else if (!/^\d{10}$/.test(phone)) {
        error("phoneError", "Enter exactly 10 digits");
        valid = false;
    }

    if (!dob) {
        error("dobError", "Date of birth is required");
        valid = false;
    } else if (new Date(dob) > new Date()) {
        error("dobError", "Future date is not allowed");
        valid = false;
    }

    if (!gender) {
        error("genderError", "Select gender");
        valid = false;
    }

    if (!course) {
        error("courseError", "Select a course");
        valid = false;
    }

    if (skills.length === 0) {
        error("skillsError", "Select at least one skill");
        valid = false;
    }

    if (!about) {
        error("aboutError", "About student is required");
        valid = false;
    }

    if (!photo) {
        error("photoError", "Select a profile photo");
        valid = false;
    }

    if (!valid) {
        return;
    }

    const skillList = [];

    skills.forEach(function (skill) {
        skillList.push(skill.value);
    });

    const student = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skillList,
        about: about,
        photo: URL.createObjectURL(photo)
    };

    students.push(student);
    id++;

    addCard(student);

    count.textContent = "Total Students: " + students.length;

    form.reset();
    clearErrors();
});

function addCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.id = student.id;

    card.innerHTML = `
        <img class="student-photo" src="${student.photo}" alt="${student.name}">
        <h3>${student.name}</h3>
        <p class="student-info"><strong>Email:</strong> ${student.email}</p>
        <p class="student-info"><strong>Phone:</strong> ${student.phone}</p>
        <p class="student-info"><strong>Date of Birth:</strong> ${student.dob}</p>
        <p class="student-info"><strong>Gender:</strong> ${student.gender}</p>
        <p class="student-info"><strong>Course:</strong> ${student.course}</p>
        <p class="student-info"><strong>Skills:</strong> ${student.skills.join(", ")}</p>
        <p class="about"><strong>About:</strong> ${student.about}</p>
        <button class="delete-btn" type="button">Delete</button>
    `;

    container.appendChild(card);
}

container.addEventListener("click", function (e) {
    if (!e.target.classList.contains("delete-btn")) {
        return;
    }

    const card = e.target.closest(".student-card");
    const studentId = Number(card.dataset.id);

    const index = students.findIndex(function (student) {
        return student.id === studentId;
    });

    students.splice(index, 1);
    card.remove();

    count.textContent = "Total Students: " + students.length;
});

