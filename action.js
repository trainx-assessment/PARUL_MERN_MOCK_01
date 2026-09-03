
const form = document.getElementById("studentForm");
const container = document.getElementById("studentContainer");

let students = [];

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("studentName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let course = document.getElementById("course").value;
    let about = document.getElementById("about").value.trim();

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    let skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (name.length < 3 || !/^[A-Za-z ]+$/.test(name)) {
        alert("Enter a valid name");
        return;
    }

    if (!email) {
        alert("Enter email");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be 10 digits");
        return;
    }

    if (!dob) {
        alert("Select date of birth");
        return;
    }

    if (!gender) {
        alert("Select gender");
        return;
    }

    if (course == "Select Course") {
        alert("Select a course");
        return;
    }

    if (skills.length == 0) {
        alert("Select at least one skill");
        return;
    }

    if (about.length < 20) {
        alert("About should have at least 20 characters");
        return;
    }

    let skillList = [];

    skills.forEach(function(skill) {
        skillList.push(skill.value);
    });

    let student = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skillList,
        about: about
    };

    students.push(student);

    showStudents();
    updateStats();

    form.reset();

    document.getElementById("characterCounter").textContent = "0 / 200";

    alert("Student added");
});


function showStudents() {

    container.innerHTML = "";

    let search = document.getElementById("searchInput")
        .value.toLowerCase();

    let filter = document.getElementById("courseFilter").value;

    students.forEach(function(student) {

        if (
            student.name.toLowerCase().includes(search) &&
            (filter == "all" || student.course == filter)
        ) {

            let card = document.createElement("div");

            card.className = "student-card";
            card.dataset.id = student.id;

            card.innerHTML = `
                <h3>${student.name}</h3>
                <p>Email: ${student.email}</p>
                <p>Phone: ${student.phone}</p>
                <p>DOB: ${student.dob}</p>
                <p>Gender: ${student.gender}</p>
                <p>Course: ${student.course}</p>
                <p>Skills: ${student.skills.join(", ")}</p>
                <p>About: ${student.about}</p>

                <button class="delete-btn">Delete</button>
            `;

            container.appendChild(card);
        }
    });

    document.getElementById("noStudentsFound").style.display =
        container.innerHTML == "" ? "block" : "none";
}





// Course filter
document.getElementById("courseFilter").addEventListener(
    "change",
    showStudents
);


// Statistics
function updateStats() {

    document.getElementById("totalStudents").textContent =
        students.length;

    document.getElementById("webDevelopmentCount").textContent =
        students.filter(s => s.course == "Web Development").length;

  
}
