const form = document.getElementById("studentForm");
const container = document.getElementById("studentContainer");
const search = document.getElementById("searchInput");
const filter = document.getElementById("courseFilter");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const gender = document.querySelector('input[name="gender"]:checked');
    const skillBox = document.querySelectorAll('input[name="skills"]:checked');

    if (name.value == "" || email.value == "" || phone.value == "" ||
        dob.value == "" || !gender || course.value == "" ||
        skillBox.length == 0 || about.value == "") {
        alert("Please fill all fields");
        return;
    }

    let skills = [];

    for (let i = 0; i < skillBox.length; i++) {
        skills.push(skillBox[i].value);
    }

    if (editId == null) {
        students.push({
            id: Date.now(),
            name: name.value,
            email: email.value,
            phone: phone.value,
            dob: dob.value,
            gender: gender.value,
            course: course.value,
            skills: skills,
            about: about.value,
            photo: photo.files.length > 0 ?
                URL.createObjectURL(photo.files[0]) : ""
        });
    } else {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id == editId) {
                students[i].name = name.value;
                students[i].email = email.value;
                students[i].phone = phone.value;
                students[i].dob = dob.value;
                students[i].gender = gender.value;
                students[i].course = course.value;
                students[i].skills = skills;
                students[i].about = about.value;
            }
        }
        editId = null;
    }

    save();
    showStudents();
    form.reset();
});

function save() {
    localStorage.setItem("students", JSON.stringify(students));
}

function showStudents() {
    container.innerHTML = "";

    const text = search.value.toLowerCase();
    const selected = filter.value;

    for (let i = 0; i < students.length; i++) {
        const s = students[i];

        if (s.name.toLowerCase().indexOf(text) == -1 ||
            (selected != "All Courses" && s.course != selected)) {
            continue;
        }

        const card = document.createElement("div");
        card.className = "student-card";

        card.innerHTML =
            "<h3>" + s.name + "</h3>" +
            "<p>Email: " + s.email + "</p>" +
            "<p>Phone: " + s.phone + "</p>" +
            "<p>DOB: " + s.dob + "</p>" +
            "<p>Gender: " + s.gender + "</p>" +
            "<p>Course: " + s.course + "</p>" +
            "<p>Skills: " + s.skills.join(", ") + "</p>" +
            "<p>About: " + s.about + "</p>" +
            "<button onclick='editStudent(" + s.id + ")'>Edit</button>" +
            "<button onclick='deleteStudent(" + s.id + ")'>Delete</button>";

        container.appendChild(card);
    }
}

function deleteStudent(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            students.splice(i, 1);
            break;
        }
    }

    save();
    showStudents();
}

function editStudent(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            const s = students[i];

            name.value = s.name;
            email.value = s.email;
            phone.value = s.phone;
            dob.value = s.dob;
            course.value = s.course;
            about.value = s.about;

            document.querySelector(
                'input[name="gender"][value="' + s.gender + '"]'
            ).checked = true;

            editId = id;
            break;
        }
    }
}

search.addEventListener("input", showStudents);
filter.addEventListener("change", showStudents);

showStudents();