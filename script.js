
const form = document.getElementById("studentForm");
const studentCards = document.getElementById("studentCards");
const studentCount = document.getElementById("studentCount");

let students = [];

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Please enter a valid student name.");
        nameInput.focus();
        return;
    }

    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;

    const genderElement = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!genderElement) {
        alert("Please select gender.");
        return;
    }

    const gender = genderElement.value;

    const skillElements = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    let skills = [];

    skillElements.forEach(function (skill) {
        skills.push(skill.value);
    });

    const photoInput = document.getElementById("photo");

    let photoURL = "";

    if (photoInput.files.length > 0) {
        photoURL = URL.createObjectURL(photoInput.files[0]);
    }

    const student = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about,
        photo: photoURL
    };

   
    students.push(student);

    
    createStudentCard(student);

    
    studentCount.textContent = students.length;

   
    form.reset();
});



function createStudentCard(student) {

    const card = document.createElement("section");

    card.classList.add("student-card");

    card.innerHTML = `
        ${
            student.photo
            ? `<img src="${student.photo}" alt="Profile Photo">`
            : ""
        }

        <h3>${student.name}</h3>

        <p>
            <strong>Email:</strong>
            ${student.email}
        </p>

        <p>
            <strong>Phone:</strong>
            ${student.phone}
        </p>

        <p>
            <strong>Date of Birth:</strong>
            ${student.dob}
        </p>

        <p>
            <strong>Gender:</strong>
            ${student.gender}
        </p>

        <p>
            <strong>Course:</strong>
            ${student.course}
        </p>

        <p>
            <strong>Skills:</strong>
            ${
                student.skills.length > 0
                ? student.skills.join(", ")
                : "None"
            }
        </p>

        <p>
            <strong>About:</strong>
            ${student.about}
        </p>

        <button class="delete-btn">Delete</button>
    `;

    studentCards.appendChild(card);
}


studentCards.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-btn")) {

        const card = event.target.closest(".student-card");

        card.remove();

        const cards = studentCards.querySelectorAll(".student-card");

        studentCount.textContent = cards.length;
    }
});

