let students = JSON.parse(localStorage.getItem("students")) || [];
let editId = null;

const form = document.getElementById("studentForm");
const container = document.getElementById("studentContainer");
const about = document.getElementById("about");
const counter = document.getElementById("counter");

about.addEventListener("input", () => {
    counter.textContent = about.value.length + " / 200";
});

function error(id, text) {
    document.getElementById(id).textContent = text;
}

function clearErrors() {
    document.querySelectorAll("span").forEach(x => x.textContent = "");
}

function validate() {
    clearErrors();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let gender = document.querySelector('input[name="gender"]:checked');
    let course = document.getElementById("course").value;
    let skills = [...document.querySelectorAll('input[name="skill"]:checked')];
    let text = about.value.trim();
    let photo = document.getElementById("photo");

    let ok = true;

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        error("nameError", "Enter a valid name");
        ok = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error("emailError", "Enter a valid email");
        ok = false;
    }

    if (!/^\d{10}$/.test(phone)) {
        error("phoneError", "Enter 10 digit phone");
        ok = false;
    }

    if (!dob || new Date(dob) > new Date()) {
        error("dobError", "Enter a valid date");
        ok = false;
    }

    if (!gender) {
        error("genderError", "Select gender");
        ok = false;
    }

    if (!course) {
        error("courseError", "Select course");
        ok = false;
    }

    if (skills.length === 0) {
        error("skillsError", "Select at least one skill");
        ok = false;
    }

    if (text.length < 20) {
        error("aboutError", "Minimum 20 characters required");
        ok = false;
    }

    if (editId === null && !photo.files[0]) {
        error("photoError", "Photo is required");
        ok = false;
    }

    if (photo.files[0] && !photo.files[0].type.startsWith("image/")) {
        error("photoError", "Only image allowed");
        ok = false;
    }

    return ok;
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!validate()) return;

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let gender = document.querySelector('input[name="gender"]:checked').value;
    let course = document.getElementById("course").value;
    let skills = [...document.querySelectorAll('input[name="skill"]:checked')].map(x => x.value);
    let text = about.value.trim();
    let file = document.getElementById("photo").files[0];

    if (editId !== null) {
        let student = students.find(x => x.id === editId);

        student.name = name;
        student.email = email;
        student.phone = phone;
        student.dob = dob;
        student.gender = gender;
        student.course = course;
        student.skills = skills;
        student.about = text;

        if (file) {
            let reader = new FileReader();
            reader.onload = function() {
                student.photo = reader.result;
                save();
                resetForm();
            };
            reader.readAsDataURL(file);
            return;
        }

        save();
    } else {
        let reader = new FileReader();

        reader.onload = function() {
            students.push({
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender,
                course: course,
                skills: skills,
                about: text,
                photo: reader.result
            });

            save();
            resetForm();
        };

        reader.readAsDataURL(file);
        return;
    }

    resetForm();
});

function save() {
    localStorage.setItem("students", JSON.stringify(students));
    showStudents();
    showStats();
}

function showStudents() {
    let search = document.getElementById("search").value.toLowerCase();
    let filter = document.getElementById("filter").value;

    container.innerHTML = "";

    let list = students.filter(x =>
        x.name.toLowerCase().includes(search) &&
        (!filter || x.course === filter)
    );

    if (list.length === 0) {
        container.innerHTML = "<p>No students found</p>";
        return;
    }

    list.forEach(student => {
        let card = document.createElement("div");
        card.className = "student-card";
        card.dataset.id = student.id;

        card.innerHTML = `
            <img src="${student.photo}">
            <h3>${student.name}</h3>
            <p><b>Email:</b> ${student.email}</p>
            <p><b>Phone:</b> ${student.phone}</p>
            <p><b>DOB:</b> ${student.dob}</p>
            <p><b>Gender:</b> ${student.gender}</p>
            <p><b>Course:</b> ${student.course}</p>
            <p><b>Skills:</b> ${student.skills.join(", ")}</p>
            <p><b>About:</b> ${student.about}</p>
            <div class="card-buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        container.appendChild(card);
    });
}

container.addEventListener("click", function(e) {
    let card = e.target.closest(".student-card");

    if (!card) return;

    let id = Number(card.dataset.id);

    if (e.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this student?")) {
            students = students.filter(x => x.id !== id);
            save();
        }
    }

    if (e.target.classList.contains("edit-btn")) {
        let student = students.find(x => x.id === id);

        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;
        document.getElementById("dob").value = student.dob;
        document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
        document.getElementById("course").value = student.course;
        document.querySelectorAll('input[name="skill"]').forEach(x => {
            x.checked = student.skills.includes(x.value);
        });
        about.value = student.about;
        counter.textContent = student.about.length + " / 200";

        editId = id;
        document.getElementById("submitBtn").textContent = "Update Student";
        window.scrollTo(0, 0);
    }
});

function showStats() {
    let courses = [
        "Web Development",
        "UI/UX",
        "Python",
        "Data Analytics",
        "MERN Stack",
        "Cloud Computing"
    ];

    let box = document.getElementById("stats");
    box.innerHTML = `<div>Total Students: ${students.length}</div>`;

    courses.forEach(course => {
        let count = students.filter(x => x.course === course).length;
        box.innerHTML += `<div>${course}: ${count}</div>`;
    });
}

function resetForm() {
    form.reset();
    editId = null;
    document.getElementById("submitBtn").textContent = "Register Student";
    counter.textContent = "0 / 200";
    clearErrors();
}

document.getElementById("resetBtn").addEventListener("click", resetForm);

document.getElementById("search").addEventListener("input", showStudents);
document.getElementById("filter").addEventListener("change", showStudents);

document.getElementById("themeBtn").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    this.textContent = document.body.classList.contains("dark-mode")
        ? "Light Mode"
        : "Dark Mode";
});

showStudents();
showStats();