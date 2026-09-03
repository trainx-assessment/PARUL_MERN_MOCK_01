let students = [];

let form = document.getElementById("studentForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let dob = document.getElementById("dob").value;
    let course = document.getElementById("course").value;
    let about = document.getElementById("about").value;

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    let skillInputs = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    let skills = [];

    skillInputs.forEach(function(skill) {
        skills.push(skill.value);
    });

    let photo = document.getElementById("photo").files[0];

    let photoURL = "";

    if (photo) {
        photoURL = URL.createObjectURL(photo);
    }

    let student = {

        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skills,
        about: about,
        photo: photoURL

    };

    students.push(student);

    displayStudents();

    document.getElementById("total").innerText = students.length;

    form.reset();

});

function displayStudents() {

    let container = document.getElementById("students");

    container.innerHTML = "";


    students.forEach(function(student) {

        let card = document.createElement("div");

        card.className = "student-card";


        card.innerHTML = `

            ${
                student.photo
                ? `<img src="${student.photo}">`
                : ""
            }

            <h3>${student.name}</h3>

            <p>Email: ${student.email}</p>

            <p>Phone: ${student.phone}</p>

            <p>DOB: ${student.dob}</p>

            <p>Gender: ${student.gender}</p>

            <p>Course: ${student.course}</p>

            <p>Skills: ${student.skills.join(", ")}</p>

            <p>About: ${student.about}</p>

        `;


        container.appendChild(card);

    });

}

document.getElementById("resetBtn").addEventListener(
    "click",
    function() {

        form.reset();

    }
);

document.getElementById("search").addEventListener(
    "input",
    function() {

        let value = this.value.toLowerCase();

        let cards = document.querySelectorAll(".student-card");

        cards.forEach(function(card) {

            let name = card.querySelector("h3").innerText.toLowerCase();

            if (name.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    }
);