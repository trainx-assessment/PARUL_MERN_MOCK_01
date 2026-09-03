const students = [];

const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("studentContainer");
const noStudentsMessage = document.getElementById("noStudentsMessage");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const course = document.getElementById("course").value;

    const skillInputs = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    const about = document.getElementById("about").value;

    const profile = document.getElementById("profile");

    // Basic validation
    if (
        name === "" ||
        email === "" ||
        phone === "" ||
        dob === "" ||
        gender === null ||
        course === ""
    ) {
        alert("Please fill all required fields");
        return;
    }

    // Get skills
    const skills = [];

    skillInputs.forEach(function (skill) {
        skills.push(skill.value);
    });

    // Get photo
    let photo = "";

    if (profile.files.length > 0) {
        photo = URL.createObjectURL(profile.files[0]);
    }

    // Create student object
    const student = {
        id: students.length + 1,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skills,
        about: about,
        photo: photo
    };

    // Add student to array
    students.push(student);

    // Display student
    displayStudent(student);

    // Clear form
    form.reset();

    alert("Student registered successfully!");
});


function displayStudent(student) {

    // Remove "No students found"
    noStudentsMessage.style.display = "none";

    // Create card
    const card = document.createElement("div");

    card.classList.add("student-card");

    // Store ID
    card.setAttribute("data-id", student.id);

    // Photo
    const image = document.createElement("img");

    if (student.photo !== "") {
        image.setAttribute("src", student.photo);
    } else {
        image.setAttribute(
            "src",
            "https://via.placeholder.com/100"
        );
    }

    image.setAttribute("alt", "Student Photo");

    // Name
    const studentName = document.createElement("h3");
    studentName.textContent = student.name;

    // Email
    const email = document.createElement("p");
    email.textContent = "Email: " + student.email;

    // Phone
    const phone = document.createElement("p");
    phone.textContent = "Phone: " + student.phone;

    // DOB
    const dob = document.createElement("p");
    dob.textContent = "DOB: " + student.dob;

    // Gender
    const gender = document.createElement("p");
    gender.textContent = "Gender: " + student.gender;

    // Course
    const course = document.createElement("p");
    course.textContent = "Course: " + student.course;

    // Skills
    const skills = document.createElement("p");

    if (student.skills.length > 0) {
        skills.textContent = "Skills: " + student.skills.join(", ");
    } else {
        skills.textContent = "Skills: None";
    }

    // About
    const about = document.createElement("p");
    about.textContent = "About: " + student.about;

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    // Add everything to card
    card.append(
        image,
        studentName,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        editButton,
        deleteButton
    );

    // Add card to container
    studentContainer.appendChild(card);
}