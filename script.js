const form = document.getElementById("studentForm");

const container = document.querySelector(".studentcard-container");


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value;

    const email = document.getElementById("email").value;

    const phone = document.getElementById("phone").value;

    const dob = document.getElementById("dob").value;

    const course = document.getElementById("course").value;

    const about = document.getElementById("about").value;

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    ).value;

    const checkedSkills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    let skills = [];

    checkedSkills.forEach(function (skill) {
        skills.push(skill.value);
    });


    const card = document.createElement("div");

    card.classList.add("student-card");


    const studentName = document.createElement("h2");

    studentName.textContent = name;


    const studentEmail = document.createElement("p");

    studentEmail.textContent = "Email: " + email;


    const studentPhone = document.createElement("p");

    studentPhone.textContent = "Phone: " + phone;

    const studentDob = document.createElement("p");

    studentDob.textContent = "DOB: " + dob;


    const studentGender = document.createElement("p");

    studentGender.textContent = "Gender: " + gender;

    const studentCourse = document.createElement("p");

    studentCourse.textContent = "Course: " + course;


    const studentSkills = document.createElement("p");

    studentSkills.textContent =
        "Skills: " + skills.join(", ");


    const studentAbout = document.createElement("p");

    studentAbout.textContent =
        "About: " + about;


    card.appendChild(studentName);

    card.appendChild(studentEmail);

    card.appendChild(studentPhone);

    card.appendChild(studentDob);

    card.appendChild(studentGender);

    card.appendChild(studentCourse);

    card.appendChild(studentSkills);

    card.appendChild(studentAbout);


    container.appendChild(card);


    form.reset();

});