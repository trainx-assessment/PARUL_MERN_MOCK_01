const form = document.querySelector(".form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector('input[type="email"]');
const phoneInput = document.querySelector('input[type="text"]');
const dobInput = document.querySelector('input[type="date"]');
const courseInput = document.querySelector("#course");
const aboutInput = document.querySelector("#about");
const photoInput = document.querySelector("#profilePhoto");
const studentsCard = document.querySelector(".students-card");
const count = document.querySelector("#characterCount");

let students = [];
let editIndex = -1;


// Character count
aboutInput.addEventListener("input", function () {
    count.textContent = aboutInput.value.length;
});


// Form submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const gender = document.querySelector('input[name="gender"]:checked');

    if (!nameInput.value.trim()) {
        alert("Please enter student name");
        return;
    }

    if (!emailInput.value.trim()) {
        alert("Please enter email");
        return;
    }

    if (!phoneInput.value.match(/^[0-9]{10}$/)) {
        alert("Enter a valid 10 digit phone number");
        return;
    }

    if (!dobInput.value) {
        alert("Please select date of birth");
        return;
    }

    if (!gender) {
        alert("Please select gender");
        return;
    }

    if (!courseInput.value) {
        alert("Please select course");
        return;
    }

    const skills = [];

    document.querySelectorAll('input[name="skills"]:checked').forEach(function (skill) {
        skills.push(skill.value);
    });

    if (skills.length === 0) {
        alert("Please select at least one skill");
        return;
    }

    if (aboutInput.value.trim().length < 20) {
        alert("About student must be at least 20 characters");
        return;
    }

    if (!photoInput.files[0]) {
        alert("Please select a profile photo");
        return;
    }


    const student = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        dob: dobInput.value,
        gender: gender.value,
        course: courseInput.value,
        skills: skills,
        about: aboutInput.value,
        photo: URL.createObjectURL(photoInput.files[0])
    };


    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
        document.querySelector(".reg").textContent = "Register Students";
    }

    displayStudents();
    form.reset();
    count.textContent = "0";
});


// Display students
function displayStudents() {
    studentsCard.innerHTML = "";

    students.forEach(function (student, index) {

        const card = document.createElement("div");
        card.classList.add("student-card");

        card.innerHTML = `
            <img src="${student.photo}" width="100">
            <h2>${student.name}</h2>
            <p>Email: ${student.email}</p>
            <p>Phone: ${student.phone}</p>
            <p>Date of Birth: ${student.dob}</p>
            <p>Gender: ${student.gender}</p>
            <p>Course: ${student.course}</p>
            <p>Skills: ${student.skills.join(", ")}</p>
            <p>About: ${student.about}</p>

            <button onclick="editStudent(${index})">Edit</button>
            <button onclick="deleteStudent(${index})">Delete</button>
        `;

        studentsCard.appendChild(card);
    });
}


// Delete student
function deleteStudent(index) {
    students.splice(index, 1);
    displayStudents();
}


// Edit student
function editStudent(index) {

    const student = students[index];

    nameInput.value = student.name;
    emailInput.value = student.email;
    phoneInput.value = student.phone;
    dobInput.value = student.dob;
    courseInput.value = student.course;
    aboutInput.value = student.about;

    document.querySelector(
        `input[name="gender"][value="${student.gender}"]`
    ).checked = true;

    document.querySelectorAll('input[name="skills"]').forEach(function (skill) {
        skill.checked = student.skills.includes(skill.value);
    });

    editIndex = index;

    document.querySelector(".reg").textContent = "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Reset
form.addEventListener("reset", function () {
    editIndex = -1;
    document.querySelector(".reg").textContent = "Register Students";
    count.textContent = "0";
});