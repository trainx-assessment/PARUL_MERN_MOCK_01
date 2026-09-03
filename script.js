let students = [];
let editId = null;

let form = document.querySelector("form");
let name = document.querySelector('input[placeholder="Enter name"]');
let email = document.querySelector('input[type="email"]');
let phone = document.querySelector('input[type="number"]');
let dob = document.querySelector('input[type="date"]');
let gender = document.querySelectorAll('input[name="GENDER"]');
let course = document.querySelector('select[name="course"]');
let skills = document.querySelectorAll('input[type="checkbox"]');
let about = document.querySelector("textarea");
let photo = document.querySelector('input[type="file"]');

let cards = document.querySelector("#student-cards");
let submit = document.querySelector("#sub-btn");
let reset = document.querySelector("#reset-btn");

function error(input, msg) {
    let e = input.parentElement.querySelector(".error");

    if (!e) {
        e = document.createElement("small");
        e.className = "error";
        e.style.color = "red";
        input.parentElement.append(e);
    }

    e.textContent = msg;
}

function validate() {
    let valid = true;

    if (name.value.trim() == "") {
        error(name, "Name is required");
        valid = false;
    } else if (name.value.trim().length < 3 ||
               name.value.trim().length > 40 ||
               !/^[A-Za-z ]+$/.test(name.value.trim())) {
        error(name, "Enter a valid name");
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        error(email, "Enter a valid email");
        valid = false;
    }

    if (!/^\d{10}$/.test(phone.value)) {
        error(phone, "Enter 10 digit phone number");
        valid = false;
    }

    if (dob.value == "" || new Date(dob.value) > new Date()) {
        error(dob, "Enter a valid date");
        valid = false;
    }

    if (!document.querySelector('input[name="GENDER"]:checked')) {
        error(gender[0], "Select gender");
        valid = false;
    }

    if (course.value == "" || course.value == "Select Course") {
        error(course, "Select course");
        valid = false;
    }

    if (document.querySelectorAll('input[type="checkbox"]:checked').length == 0) {
        error(skills[0], "Select at least one skill");
        valid = false;
    }

    if (about.value.trim().length < 20) {
        error(about, "Minimum 20 characters required");
        valid = false;
    }

    if (photo.files.length == 0 && editId == null) {
        error(photo, "Photo is required");
        valid = false;
    }

    return valid;
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!validate()) return;

    let selectedGender =
        document.querySelector('input[name="GENDER"]:checked');

    let selectedSkills = [];

    skills.forEach(function(s) {
        if (s.checked)
            selectedSkills.push(s.nextSibling.textContent.trim());
    });

    let student = {
        id: editId || Date.now(),
        name: name.value.trim(),
        email: email.value,
        phone: phone.value,
        dob: dob.value,
        gender: selectedGender.value,
        course: course.value,
        skills: selectedSkills,
        about: about.value.trim(),
        photo: photo.files.length
            ? URL.createObjectURL(photo.files[0])
            : ""
    };

    if (editId == null)
        students.push(student);
    else
        students[students.findIndex(s => s.id == editId)] = student;

    displayStudents();
    updateStats();
    resetForm();
});

function displayStudents() {
    cards.innerHTML = "";

    students.forEach(function(s) {
        let card = document.createElement("div");

        card.classList.add("student-card");
        card.dataset.id = s.id;

        card.innerHTML = `
            <img src="${s.photo}">
            <h3>${s.name}</h3>
            <p>Email: ${s.email}</p>
            <p>Phone: ${s.phone}</p>
            <p>DOB: ${s.dob}</p>
            <p>Gender: ${s.gender}</p>
            <p>Course: ${s.course}</p>
            <p>Skills: ${s.skills.join(", ")}</p>
            <p>About: ${s.about}</p>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        `;

        cards.append(card);
    });
}

cards.addEventListener("click", function(e) {
    let card = e.target.closest(".student-card");
    if (!card) return;

    let id = Number(card.dataset.id);

    if (e.target.classList.contains("delete")) {
        if (confirm("Are you sure you want to delete this student?")) {
            let i = students.findIndex(s => s.id == id);
            students.splice(i, 1);
            displayStudents();
            updateStats();
        }
    }

    if (e.target.classList.contains("edit")) {
        let s = students.find(s => s.id == id);

        name.value = s.name;
        email.value = s.email;
        phone.value = s.phone;
        dob.value = s.dob;
        course.value = s.course;
        about.value = s.about;

        gender.forEach(g => g.checked = g.value == s.gender);

        skills.forEach(skill => {
            skill.checked =
                s.skills.includes(skill.nextSibling.textContent.trim());
        });

        editId = id;
        submit.textContent = "Update Student";
        window.scrollTo(0, 0);
    }
});

function updateStats() {
    document.querySelector("#total-students").textContent = students.length;

    ["Web Development", "UI/UX", "Python",
     "Data Analytics", "MERN Stack", "Cloud Computing"]
    .forEach(function(c) {
        let id = c.toLowerCase().replaceAll(" ", "-").replace("/", "-");
        document.querySelector("#" + id).textContent =
            students.filter(s => s.course == c).length;
    });
}

function resetForm() {
    form.reset();
    editId = null;
    submit.textContent = "Register Student";

    document.querySelectorAll(".error").forEach(e => e.remove());
}

reset.addEventListener("click", resetForm);