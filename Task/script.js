const studentForm = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const totalStudents = document.getElementById("totalStudents");
const totalApplications = document.getElementById("totalApplications");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

let students = [];

studentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;

    const skillInputs = document.querySelectorAll('input[name="skills"]:checked');
    const skills = [];

    skillInputs.forEach(function (skill) {
        skills.push(skill.value);
    });

    const photoInput = document.getElementById("profilePhoto");

    let photo = "";

    if (photoInput.files.length > 0) {
        photo = URL.createObjectURL(photoInput.files[0]);
    }

    const student = {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about,
        photo: photo
    };

    students.push(student);

    displayStudents(students);
    updateStatistics();

    studentForm.reset();

    console.log("Student registered successfully");
});

function displayStudents(studentList) {
    studentContainer.innerHTML = "";

    studentList.forEach(function (student, index) {

        const card = document.createElement("div");
        card.className = "student-card";

        card.innerHTML = `
            ${student.photo ? `<img src="${student.photo}" alt="Profile Photo">` : ""}
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>Date of Birth:</strong> ${student.dob}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
            <p><strong>About:</strong> ${student.about}</p>
            <button onclick="deleteStudent(${index})">Delete</button>
        `;

        studentContainer.appendChild(card);
    });
}

function updateStatistics() {
    totalStudents.textContent = students.length;
    totalApplications.textContent = students.length;
}

function deleteStudent(index) {
    students.splice(index, 1);

    displayStudents(students);
    updateStatistics();
}

search.addEventListener("input", function () {
    filterStudents();
});

filter.addEventListener("change", function () {
    filterStudents();
});

function filterStudents() {
    const searchValue = search.value.toLowerCase();
    const filterValue = filter.value;

    const filteredStudents = students.filter(function (student) {

        if (filterValue === "name") {
            return student.name.toLowerCase().includes(searchValue);
        }

        if (filterValue === "course") {
            return student.course.toLowerCase().includes(searchValue);
        }

        return (
            student.name.toLowerCase().includes(searchValue) ||
            student.course.toLowerCase().includes(searchValue)
        );
    });

    displayStudents(filteredStudents);
}