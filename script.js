const form = document.querySelector("#studentForm");
const nameInput = document.querySelector("#studentName");
const emailInput = document.querySelector("#studentEmail");
const phoneInput = document.querySelector("#studentPhone");
const dobInput = document.querySelector("#studentDOB");
const courseInput = document.querySelector("#studentCourses");
const aboutInput = document.querySelector("#studentAbout");
const photoInput = document.querySelector("#profilePhoto");
const studentContainer = document.querySelector("#studentContainer");

let students = [];

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (nameInput.value.trim() === "") {
        alert("Name is required");
        return;
}

    if (emailInput.value.trim() === "") {
        alert("Email is required");
        return;}

    if (phoneInput.value.trim() === "") {
        alert("Phone is required");
        return;
    }

    if (dobInput.value === "") {
        alert("Date of birth is required");
        return;
    }

    if (courseInput.value === "") {
        alert("Please select a course");
        return;
    }

    if (aboutInput.value.trim() === "") {
        alert("About student is required");
        return;
    }

    if (photoInput.files.length === 0) {
        alert("Please select a photo");
        return;
    }

    let skills = [];

    document.querySelectorAll('input[name="skill"]:checked').forEach(function(skill) {
        skills.push(skill.value);
    });

    if (skills.length === 0) {
        alert("Select at least one skill");
        return;
    }

    const student = {
        id: Date.now(),
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        dob: dobInput.value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        course: courseInput.value,
        skills: skills,
        about: aboutInput.value
    };

    students.push(student);

    displayStudents();

    form.reset();
});

function displayStudents() {
    studentContainer.innerHTML = "";

    students.forEach(function(student) {

        const card = document.createElement("div");
        card.classList.add("student-card");
        card.setAttribute("data-id", student.id);

        const heading = document.createElement("h3");
        heading.textContent = student.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + student.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: " + student.phone;

        const dob = document.createElement("p");
        dob.textContent = "DOB: " + student.dob;

        const gender = document.createElement("p");
        gender.textContent = "Gender: " + student.gender;

        const course = document.createElement("p");
        course.textContent = "Course: " + student.course;

        const skills = document.createElement("p");
        skills.textContent = "Skills: " + student.skills.join(", ");

        const about = document.createElement("p");
        about.textContent = "About: " + student.about;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");

        card.appendChild(heading);
        card.appendChild(email);
        card.appendChild(phone);
        card.appendChild(dob);
        card.appendChild(gender);
        card.appendChild(course);
        card.appendChild(skills);
        card.appendChild(about);
        card.appendChild(deleteButton);

        studentContainer.appendChild(card);
    });
}

studentContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const card = event.target.closest(".student-card");
        const id = card.getAttribute("data-id");

        students = students.filter(function(student) {
            return student.id != id;
        });

        displayStudents();
    }
});