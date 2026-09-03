const form = document.querySelector("#studentForm");
const studentsBox = document.querySelector("#students");

let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function clearErrors() {
    document.querySelectorAll("span").forEach(function(span) {
        span.textContent = "";
    });
}

function validate() {
    clearErrors();

    let valid = true;

    let name = document.querySelector("#name").value.trim();
    let email = document.querySelector("#email").value.trim();
    let phone = document.querySelector("#phone").value.trim();
    let dob = document.querySelector("#dob").value;
    let gender = document.querySelector("input[name='gender']:checked");
    let course = document.querySelector("#course").value;
    let about = document.querySelector("#about").value.trim();
    let skills = document.querySelectorAll("input[name='skills']:checked");
    let photo = document.querySelector("#photo").files[0];

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        document.querySelector("#nameError").textContent = "Enter a valid name.";
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.querySelector("#emailError").textContent = "Enter a valid email.";
        valid = false;
    }

    if (!/^\d{10}$/.test(phone)) {
        document.querySelector("#phoneError").textContent = "Enter exactly 10 digits.";
        valid = false;
    }

    if (!dob || new Date(dob) > new Date()) {
        document.querySelector("#dobError").textContent = "Enter a valid date.";
        valid = false;
    }

    if (!gender) {
        document.querySelector("#genderError").textContent = "Select a gender.";
        valid = false;
    }

    if (!course) {
        document.querySelector("#courseError").textContent = "Select a course.";
        valid = false;
    }

    if (skills.length == 0) {
        document.querySelector("#skillsError").textContent = "Select at least one skill.";
        valid = false;
    }

    if (about.length < 20 || about.length > 200) {
        document.querySelector("#aboutError").textContent =
            "About must be between 20 and 200 characters.";
        valid = false;
    }

    if (!photo) {
        document.querySelector("#photoError").textContent =
            "Select a profile photo.";
        valid = false;
    }

    return valid;
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!validate()) {
        return;
    }

    let name = document.querySelector("#name").value.trim();
    let email = document.querySelector("#email").value.trim();
    let phone = document.querySelector("#phone").value.trim();
    let dob = document.querySelector("#dob").value;
    let gender = document.querySelector("input[name='gender']:checked").value;
    let course = document.querySelector("#course").value;
    let about = document.querySelector("#about").value.trim();

    let skillBoxes = document.querySelectorAll(
        "input[name='skills']:checked"
    );

    let skills = [];

    skillBoxes.forEach(function(box) {
        skills.push(box.value);
    });

    let photoFile = document.querySelector("#photo").files[0];

    let reader = new FileReader();

    reader.onload = function() {

        let student = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: gender,
            course: course,
            skills: skills,
            about: about,
            photo: reader.result
        };

        students.push(student);

        saveStudents();

        form.reset();

        showStudents();
    };

    reader.readAsDataURL(photoFile);
});

function showStudents() {
    studentsBox.innerHTML = "";

    if (students.length == 0) {
        document.querySelector("#noStudents").style.display = "block";
        return;
    }

    document.querySelector("#noStudents").style.display = "none";

    students.forEach(function(student) {

        let card = document.createElement("div");
        card.className = "student-card";
        card.dataset.id = student.id;

        let image = document.createElement("img");
        image.src = student.photo;

        let info = document.createElement("div");
        info.className = "student-info";

        let name = document.createElement("h3");
        name.textContent = student.name;

        let details = document.createElement("p");

        details.textContent =
            "Email: " + student.email +
            "\nPhone: " + student.phone +
            "\nDOB: " + student.dob +
            "\nGender: " + student.gender +
            "\nCourse: " + student.course;

        details.style.whiteSpace = "pre-line";

        let skills = document.createElement("div");
        skills.className = "skills";

        student.skills.forEach(function(skill) {

            let span = document.createElement("span");

            span.className = "skill";
            span.textContent = skill;

            skills.appendChild(span);
        });

        let about = document.createElement("p");
        about.textContent = student.about;

        let deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.textContent = "Delete";

        info.appendChild(name);
        info.appendChild(details);
        info.appendChild(skills);
        info.appendChild(about);
        info.appendChild(deleteButton);

        card.appendChild(image);
        card.appendChild(info);

        studentsBox.appendChild(card);
    });
}

studentsBox.addEventListener("click", function(e) {

    if (!e.target.classList.contains("delete")) {
        return;
    }

    let card = e.target.closest(".student-card");
    let id = Number(card.dataset.id);

    if (confirm("Are you sure you want to delete this student?")) {

        for (let i = 0; i < students.length; i++) {

            if (students[i].id == id) {
                students.splice(i, 1);
                break;
            }
        }

        saveStudents();

        showStudents();
    }
});

document.querySelector("#resetBtn").addEventListener("click", function() {
    form.reset();
    clearErrors();
});

showStudents();