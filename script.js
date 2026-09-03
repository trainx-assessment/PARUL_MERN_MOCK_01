const form = document.getElementById("studentForm");
const cardsContainer = document.getElementById("studentCardsContainer");

const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

const about = document.getElementById("about");
const charCount = document.getElementById("charCount");

const darkModeBtn = document.getElementById("darkModeBtn");


// Students array
let students = JSON.parse(localStorage.getItem("students")) || [];

let editId = null;


// Character counter
about.addEventListener("input", function () {
    charCount.textContent = about.value.length + "/200";
});


// Form submit
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const course = document.getElementById("course").value;
    const aboutText = about.value.trim();

    const skills = [];

    document.querySelectorAll('input[name="skills"]:checked').forEach(function (item) {
        skills.push(item.value);
    });


    // Validation

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        alert("Name must contain 3-40 letters only.");
        return;
    }

    if (!email.includes("@")) {
        alert("Enter a valid email.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must contain exactly 10 digits.");
        return;
    }

    if (dob === "") {
        alert("Please select Date of Birth.");
        return;
    }

    if (new Date(dob) > new Date()) {
        alert("Date of Birth cannot be in the future.");
        return;
    }

    if (!gender) {
        alert("Please select Gender.");
        return;
    }

    if (course === "") {
        alert("Please select Course.");
        return;
    }

    if (skills.length === 0) {
        alert("Please select at least one Skill.");
        return;
    }

    if (aboutText.length < 20 || aboutText.length > 200) {
        alert("About must contain 20-200 characters.");
        return;
    }


    // Create student object

    const student = {
        id: editId || Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skills,
        about: aboutText
    };


    // Add student

    if (editId === null) {

        students.push(student);

    } else {

        const index = students.findIndex(function (item) {
            return item.id === editId;
        });

        students[index] = student;

        editId = null;

        document.getElementById("submitBtn").textContent = "Register Student";
    }


    // Save

    localStorage.setItem("students", JSON.stringify(students));


    // Display

    displayStudents();
    updateStatistics();


    // Reset

    form.reset();
    charCount.textContent = "0/200";
});


// Display students

function displayStudents() {

    cardsContainer.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedCourse = courseFilter.value;


    const filteredStudents = students.filter(function (student) {

        const nameMatch = student.name.toLowerCase().includes(searchText);

        const courseMatch =
            selectedCourse === "All" ||
            student.course === selectedCourse;

        return nameMatch && courseMatch;
    });


    if (filteredStudents.length === 0) {

        cardsContainer.textContent = "No students found.";

        return;
    }


    filteredStudents.forEach(function (student) {

        const card = document.createElement("div");

        card.classList.add("student-card");

        card.setAttribute("data-id", student.id);


        const name = document.createElement("h3");
        name.textContent = student.name;


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


        const aboutText = document.createElement("p");
        aboutText.textContent = "About: " + student.about;


        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");


        card.append(
            name,
            email,
            phone,
            dob,
            gender,
            course,
            skills,
            aboutText,
            editButton,
            deleteButton
        );


        cardsContainer.appendChild(card);
    });
}


// Search

searchInput.addEventListener("input", displayStudents);


// Filter

courseFilter.addEventListener("change", displayStudents);


// Edit + Delete

cardsContainer.addEventListener("click", function (event) {

    const card = event.target.closest(".student-card");

    if (!card) {
        return;
    }


    const id = Number(card.dataset.id);


    // Delete

    if (event.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this student?")) {

            students = students.filter(function (student) {
                return student.id !== id;
            });


            localStorage.setItem("students", JSON.stringify(students));

            displayStudents();
            updateStatistics();
        }
    }


    // Edit

    if (event.target.classList.contains("edit-btn")) {

        const student = students.find(function (item) {
            return item.id === id;
        });


        document.getElementById("studentName").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;
        document.getElementById("dob").value = student.dob;
        document.getElementById("course").value = student.course;
        about.value = student.about;


        document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
            radio.checked = radio.value === student.gender;
        });


        document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
            checkbox.checked = student.skills.includes(checkbox.value);
        });


        charCount.textContent = student.about.length + "/200";


        editId = id;

        document.getElementById("submitBtn").textContent = "Update Student";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});


// Statistics

function updateStatistics() {

    document.getElementById("totalStudents").textContent = students.length;


    document.getElementById("webDevelopmentCount").textContent =
        students.filter(s => s.course === "Web Development").length;


    document.getElementById("uiuxCount").textContent =
        students.filter(s => s.course === "UI/UX").length;


    document.getElementById("pythonCount").textContent =
        students.filter(s => s.course === "Python").length;


    document.getElementById("dataAnalyticsCount").textContent =
        students.filter(s => s.course === "Data Analytics").length;


    document.getElementById("mernCount").textContent =
        students.filter(s => s.course === "MERN Stack").length;


    document.getElementById("cloudCount").textContent =
        students.filter(s => s.course === "Cloud Computing").length;
}


// Dark Mode

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    if (document.body.classList.contains("dark-mode")) {

        darkModeBtn.textContent = "Light Mode";

    } else {

        darkModeBtn.textContent = "Dark Mode";
    }
});


// Reset button

document.getElementById("resetBtn").addEventListener("click", function () {

    editId = null;

    document.getElementById("submitBtn").textContent = "Register Student";

    charCount.textContent = "0/200";
});


// Load data when page opens

displayStudents();
updateStatistics();