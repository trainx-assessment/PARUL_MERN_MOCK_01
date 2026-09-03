const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phn-number");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("pfp");

const students = [];
let id = 1;

form.addEventListener("submit", function(event) {
    event.preventDefault();

    if (isValid()) {
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');

        const skills = [];

        selectedSkills.forEach(function(skill) {
            skills.push(skill.value);
        });

        const student = {
            id: id++,
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            dob: dobInput.value,
            gender: selectedGender.value,
            course: courseInput.value,
            skills: skills,
            about: aboutInput.value.trim(),
            photo: photoInput.value
        };

        students.push(student);
        console.log(students);
        updateStatistics();
        displayStudents();
        
    }
    else {
        alert("FORM NOT SUBMITTED : Details invalid or incomplete");
    }
});

function isValid() {
    let valid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const selectedGender = document.querySelector('input[name="gender"]:checked');

    if (name === "") {
        valid = false;
        alert("Name is required");
    }

    if (name.length < 3) {
        valid = false;
        alert("Name must be at least 3 characters");
    }

    if (name.length > 40) {
        valid = false;
        alert("Name cannot exceed 40 characters");
    }

    const nameRegex = /^[A-Za-z ]+$/;

    if (name !== "" && !nameRegex.test(name)) {
        valid = false;
        alert("Name can contain only letters and spaces");
    }

    if (email === "") {
        valid = false;
        alert("Enter email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== "" && !emailRegex.test(email)) {
        valid = false;
        alert("Enter a valid email");
    }

    if (phone === "") {
        valid = false;
        alert("Enter phone number");
    }

    const phoneRegex = /^\d{10}$/;

    if (phone !== "" && !phoneRegex.test(phone)) {
        valid = false;
        alert("Phone number must contain exactly 10 digits");
    }

    if (dob === "") {
        valid = false;
        alert("Date of birth is required");
    } else {
        const selected = new Date(dob);
        const today = new Date();

        if (selected > today) {
            valid = false;
            alert("Future dates are not allowed");
        }

        let age = today.getFullYear() - selected.getFullYear();
        const dif = today.getMonth() - selected.getMonth();

        if (dif < 0 || (dif === 0 && today.getDate() < selected.getDate())) {
            age--;
        }

        if (age < 15) {
            valid = false;
            alert("Student must be at least 15 years old");
        }
    }

    if (!selectedGender) {
        valid = false;
        alert("Please select a gender");
    }

    if (courseInput.value === "") {
        valid = false;
        alert("Please select a course");
    }

    const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');

    if (selectedSkills.length === 0) {
        valid = false;
        alert("Select at least one skill");
    }

    return valid;
}
const studentList = document.getElementById("studentList");
function displayStudents() {
    studentList.innerHTML = "";

    students.forEach(function(student) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-id", student.id);

        const name = document.createElement("p");
        name.textContent = student.name;

        const email = document.createElement("p");
        email.textContent = "Email: "+student.email;

        const phone = document.createElement("p");
        phone.textContent = "Phone: "+student.phone;

        const dob = document.createElement("p");
        dob.textContent = "DOB: "+student.dob;

        const gender = document.createElement("p");
        gender.textContent = "Gender: "+student.gender;

        const course = document.createElement("p");
        course.textContent = "Course: "+student.course;

        const skills = document.createElement("p");
        skills.textContent = "Skills: "+student.skills.join(", ");

        const about = document.createElement("p");
        about.textContent = "About: "+student.about;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        card.append(name);
        card.append(email);
        card.append(phone);
        card.append(dob);
        card.append(gender);
        card.append(course);
        card.append(skills);
        card.append(about);
        card.append(editButton);
        card.append(deleteButton);

        studentList.appendChild(card);
    });
}

const totalStudents = document.getElementById("totalStudents");
const webDev = document.getElementById("webDev");
const uiux = document.getElementById("uiux");
const python = document.getElementById("python");
const dataAnalytics = document.getElementById("dataAnalytics");
const mern = document.getElementById("mern");
const cloud = document.getElementById("cloud");

function updateStatistics() {
    let webDevCount = 0;
    let uiuxCount = 0;
    let pythonCount = 0;
    let dataAnalyticsCount = 0;
    let mernCount = 0;
    let cloudCount = 0;

    students.forEach(function(student) {
        if (student.course === "web-dev") {
            webDevCount++;
        } else if (student.course === "ui-ux") {
            uiuxCount++;
        } else if (student.course === "python") {
            pythonCount++;
        } else if (student.course === "data-analytics") {
            dataAnalyticsCount++;
        } else if (student.course === "mern") {
            mernCount++;
        } else if (student.course === "cloud") {
            cloudCount++;
        }
    });

    totalStudents.textContent = "Total Students: "+students.length;
    webDev.textContent = "Web Development: "+webDevCount;
    uiux.textContent = "UI/UX: "+uiuxCount;
    python.textContent = "Python: "+pythonCount;
    dataAnalytics.textContent = "Data Analytics: "+dataAnalyticsCount;
    mern.textContent = "MERN Stack: "+mernCount;
    cloud.textContent = "Cloud Computing: "+cloudCount;
}