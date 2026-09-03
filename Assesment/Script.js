let students = JSON.parse(localStorage.getItem("students")) || [];

const form = document.querySelector("#studentForm");
const studentContainer = document.querySelector("#studentContainer");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.querySelector("#studentName").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const dob = document.querySelector("#dob").value;
    const course = document.querySelector("#course").value;
    const about = document.querySelector("#about").value.trim();

    const genderInput = document.querySelector(
        'input[name="gender"]:checked'
    );

    const gender = genderInput ? genderInput.value : "";

    const skillInputs = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    let skills = [];

    skillInputs.forEach(function(skill) {
        skills.push(skill.value);
    });

    const student = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about
    };

    students.push(student);

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    displayStudents();

    form.reset();
});


function displayStudents() {

    studentContainer.innerHTML = "";

    students.forEach(function(student) {

        const card = document.createElement("div");

        card.classList.add("student-card");

        card.setAttribute("data-id", student.id);

        card.innerHTML = `
            <h3>${student.name}</h3>

            <p>Email: ${student.email}</p>

            <p>Phone: ${student.phone}</p>

            <p>DOB: ${student.dob}</p>

            <p>Gender: ${student.gender}</p>

            <p>Course: ${student.course}</p>

            <p>Skills: ${student.skills.join(", ")}</p>

            <p>About: ${student.about}</p>

            <button class="delete-btn">
                Delete
            </button>
        `;

        studentContainer.appendChild(card);
    });
}

studentContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const card = event.target.closest(".student-card");
        const id = Number(card.getAttribute("data-id"));
        students = students.filter(function(student) {
            return student.id !== id;
        });
        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );
        displayStudents();
    }
});
displayStudents();