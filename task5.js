const students = [];

const form = document.getElementById("studentForm");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const course = document.getElementById("course").value;

    const skills = Array.from(
        document.querySelectorAll('input[name="skills"]:checked')
    ).map(skill => skill.value);

    const about = document.getElementById("about").value.trim();
    const photoInput = document.getElementById("photo");

    if (!name || !email || !phone || !dob || !gender || !course) {
        alert("Please fill all required fields.");
        return;
    }

    const student = {
        id: students.length + 1,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about,
        photo: photoInput.files.length > 0
            ? photoInput.files[0].name
            : ""
    };

    students.push(student);

    console.log("Student Added:", student);
    console.log("All Students:", students);

    alert("Student registered successfully!");

    form.reset();
});