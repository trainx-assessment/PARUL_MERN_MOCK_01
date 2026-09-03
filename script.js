const form = document.getElementById("studentForm");
const box = document.getElementById("studentContainer");

const name = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const photo = document.getElementById("profilePhoto");

const search = document.getElementById("searchInput");
const filter = document.getElementById("filterCourse");
const count = document.getElementById("charCount");

let students = [];
let editId = -1;



about.oninput = function () {
    count.innerText = about.value.length + " / 200";
};



form.onsubmit = function (e) {
    e.preventDefault();

    if (name.value == "" || email.value == "" ||
        phone.value == "" || dob.value == "" ||
        course.value == "" || about.value == "") {
        alert("Please fill all fields");
        return;
    }

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {
        alert("Please select gender");
        return;
    }

    let skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (skills.length == 0) {
        alert("Please select skill");
        return;
    }

    let skillList = [];

    for (let i = 0; i < skills.length; i++) {
        skillList.push(skills[i].value);
    }

    let student = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        dob: dob.value,
        gender: gender.value,
        course: course.value,
        skills: skillList,
        about: about.value,
        photo: ""
    };

    if (editId == -1) {
        students.push(student);
        alert("Student Registered");
    } else {
        students[editId] = student;
        editId = -1;
        alert("Student Updated");
    }

    display();
    form.reset();
    count.innerText = "0 / 200";
};



function display() {

    box.innerHTML = "";

    for (let i = 0; i < students.length; i++) {

        if (
            students[i].name.toLowerCase()
            .includes(search.value.toLowerCase()) &&
            (filter.value == "" ||
             students[i].course == filter.value)
        ) {

            box.innerHTML += `
                <div class="student-card">

                    <h3>${students[i].name}</h3>

                    <p>Email: ${students[i].email}</p>

                    <p>Phone: ${students[i].phone}</p>

                    <p>DOB: ${students[i].dob}</p>

                    <p>Gender: ${students[i].gender}</p>

                    <p>Course: ${students[i].course}</p>

                    <p>Skills: ${students[i].skills.join(", ")}</p>

                    <p>About: ${students[i].about}</p>

                    <button onclick="editStudent(${i})">
                        Edit
                    </button>

                    <button onclick="deleteStudent(${i})">
                        Delete
                    </button>

                </div>
            `;
        }
    }
}



function editStudent(i) {

    let s = students[i];

    name.value = s.name;
    email.value = s.email;
    phone.value = s.phone;
    dob.value = s.dob;
    course.value = s.course;
    about.value = s.about;

    document.querySelector(
        'input[name="gender"][value="' + s.gender + '"]'
    ).checked = true;

    let skills = document.querySelectorAll(
        'input[name="skills"]'
    );

    for (let j = 0; j < skills.length; j++) {
        skills[j].checked =
            s.skills.includes(skills[j].value);
    }

    editId = i;
}


// Delete
function deleteStudent(i) {

    if (confirm("Delete this student?")) {
        students.splice(i, 1);
        display();
    }
}



search.oninput = display;


filter.onchange = display;



document.getElementById("darkModeBtn").onclick = function () {
    document.body.classList.toggle("dark-mode");
};



document.getElementById("resetBtn").onclick = function () {
    form.reset();
    editId = -1;
    count.innerText = "0 / 200";
};