let students = [];

const form = document.getElementById("studentForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    let selectedSkills = [];

    skills.forEach(function (skill) {
        selectedSkills.push(skill.value);
    });

    const student = {
        name: document.getElementById("studentName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        gender: gender ? gender.value : "",
        course: document.getElementById("course").value,
        skills: selectedSkills,
        about: document.getElementById("about").value
    };

    students.push(student);
    console.log(students);
    alert("Student registered successfully!");

    form.reset();
});