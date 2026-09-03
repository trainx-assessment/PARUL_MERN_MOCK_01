const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("profile-pic");

const studentContainer = document.getElementById("studentContainer");
const studentCount = document.getElementById("studentCount");

const students = [];
let studentId = 1;

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dateInput.value;
    const course = courseInput.value;
    const about = aboutInput.value.trim();

    const gender = document.querySelector('input[name="gender"]:checked');

    const skills = [];

    document.querySelectorAll('input[name="skills"]:checked').forEach(function (skill) {
        skills.push(skill.value);
    });

    // Validation

    const nameRegex = /^[A-Za-z ]{3,}$/;

    if (!nameRegex.test(name)) {
        alert("Name must contain only letters and minimum 3 characters.");
        return;
    }

    if (email === "") {
        alert("Enter Email.");
        return;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
        alert("Phone number must contain exactly 10 digits.");
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (dob === "" || dob > today) {
        alert("Future date is not allowed.");
        return;
    }

    if (!gender) {
        alert("Select Gender.");
        return;
    }

    if (course === "") {
        alert("Select Course.");
        return;
    }

    if (skills.length === 0) {
        alert("Select at least one Skill.");
        return;
    }

    if (about === "") {
        alert("About Student is required.");
        return;
    }

    if (photoInput.files.length === 0) {
        alert("Upload Profile Photo.");
        return;
    }

    const student = {
        id: studentId,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skills,
        about: about,
        photo: URL.createObjectURL(photoInput.files[0])
    };

    students.push(student);
    studentId++;

    // Create Card

    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);

    const image = document.createElement("img");
    image.src = student.photo;

    const heading = document.createElement("h3");
    heading.textContent = student.name;

    const emailText = document.createElement("p");
    emailText.textContent = "Email: " + student.email;

    const phoneText = document.createElement("p");
    phoneText.textContent = "Phone: " + student.phone;

    const dobText = document.createElement("p");
    dobText.textContent = "DOB: " + student.dob;

    const genderText = document.createElement("p");
    genderText.textContent = "Gender: " + student.gender;

    const courseText = document.createElement("p");
    courseText.textContent = "Course: " + student.course;

    const skillText = document.createElement("p");
    skillText.textContent = "Skills: " + student.skills.join(", ");

    const aboutText = document.createElement("p");
    aboutText.textContent = "About: " + student.about;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    card.appendChild(image);
    card.appendChild(heading);
    card.appendChild(emailText);
    card.appendChild(phoneText);
    card.appendChild(dobText);
    card.appendChild(genderText);
    card.appendChild(courseText);
    card.appendChild(skillText);
    card.appendChild(aboutText);
    card.appendChild(deleteButton);

    studentContainer.appendChild(card);

    studentCount.textContent = "Total Students: " + students.length;

    form.reset();

});

// Delete using Event Delegation

studentContainer.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-btn")) {

        const card = event.target.closest(".student-card");

        const id = Number(card.dataset.id);

        const index = students.findIndex(function (student) {
            return student.id === id;
        });

        if (index !== -1) {
            students.splice(index, 1);
        }

        card.remove();

        studentCount.textContent = "Total Students: " + students.length;
    }

});