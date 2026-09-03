
const form = document.getElementById("form");

const name = document.getElementById("studentName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("aboutstudent");
const photo = document.getElementById("profilephoto");
const charCount = document.getElementById("charCount");

const students = [];

let nextId = 1;


function error(input, message) {

    let old = input.parentElement.querySelector(".error");

    if (old) {
        old.remove();
    }

    let p = document.createElement("p");

    p.className = "error";

    p.textContent = message;

    input.parentElement.appendChild(p);
}


function removeError(input) {

    let old = input.parentElement.querySelector(".error");

    if (old) {
        old.remove();
    }
}


const statistics = document.createElement("div");

statistics.id = "statistics";

statistics.innerHTML = `
    <h2>Student Statistics</h2>

    <p>Total Students: <span id="totalStudents">0</span></p>

    <p>Web Development: <span id="web-development">0</span></p>

    <p>UI/UX: <span id="ui-ux">0</span></p>

    <p>Python: <span id="python">0</span></p>

    <p>Data Analytics: <span id="data-analytics">0</span></p>

    <p>MERN Stack: <span id="mern-stack">0</span></p>

    <p>Cloud Computing: <span id="cloud-computing">0</span></p>
`;

form.parentElement.appendChild(statistics);


const studentContainer = document.createElement("div");

studentContainer.id = "studentContainer";

form.parentElement.appendChild(studentContainer);


form.addEventListener("submit", function (event) {

    event.preventDefault();

    let valid = true;


    let nameValue = name.value.trim();

    if (nameValue === "") {

        error(name, "Name is required");

        valid = false;

    }
    else if (nameValue.length < 3) {

        error(name, "Name must have at least 3 characters");

        valid = false;

    }
    else if (nameValue.length > 40) {

        error(name, "Name cannot exceed 40 characters");

        valid = false;

    }
    else {

        removeError(name);

    }


    let emailValue = email.value.trim();

    if (emailValue === "") {

        error(email, "Email is required");

        valid = false;

    }
    else if (!emailValue.includes("@")) {

        error(email, "Email must contain @");

        valid = false;

    }
    else if (!emailValue.includes(".")) {

        error(email, "Email must contain .");

        valid = false;

    }
    else {

        removeError(email);

    }


    let phoneValue = phone.value.trim();

    if (phoneValue === "") {

        error(phone, "Phone number is required");

        valid = false;

    }
    else if (phoneValue.length !== 10) {

        error(phone, "Phone must contain 10 digits");

        valid = false;

    }
    else if (isNaN(phoneValue)) {

        error(phone, "Phone must contain only numbers");

        valid = false;

    }
    else {

        removeError(phone);

    }


    if (dob.value === "") {

        error(dob, "Date of birth is required");

        valid = false;

    }
    else {

        let birthDate = new Date(dob.value);

        let today = new Date();

        if (birthDate > today) {

            error(dob, "Future date is not allowed");

            valid = false;

        }
        else {

            let age =
                today.getFullYear() -
                birthDate.getFullYear();

            if (age < 15) {

                error(dob, "Age must be at least 15 years");

                valid = false;

            }
            else {

                removeError(dob);

            }
        }
    }


    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (!gender) {

        alert("Please select gender");

        valid = false;

    }


    if (course.value === "") {

        error(course, "Please select a course");

        valid = false;

    }
    else {

        removeError(course);

    }


    let skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

    if (skills.length === 0) {

        alert("Please select at least one skill");

        valid = false;

    }


    let aboutValue = about.value.trim();

    if (aboutValue === "") {

        error(about, "About student is required");

        valid = false;

    }
    else if (aboutValue.length < 20) {

        error(about, "Minimum 20 characters required");

        valid = false;

    }
    else if (aboutValue.length > 200) {

        error(about, "Maximum 200 characters allowed");

        valid = false;

    }
    else {

        removeError(about);

    }


    if (photo.files.length === 0) {

        error(photo, "Profile photo is required");

        valid = false;

    }
    else {

        let fileName = photo.files[0].name.toLowerCase();

        if (
            !fileName.endsWith(".jpg") &&
            !fileName.endsWith(".jpeg") &&
            !fileName.endsWith(".png")
        ) {

            error(
                photo,
                "Only JPG, JPEG and PNG files are allowed"
            );

            valid = false;

        }
        else {
            removeError(photo);

        }
    }


    if (valid) {

        let skillArray = [];

        skills.forEach(function (skill) {
            skillArray.push(skill.value);
        });


        let photoURL =
            URL.createObjectURL(photo.files[0]);


        let student = {

            id: nextId,

            name: nameValue,

            email: emailValue,

            phone: phoneValue,

            dob: dob.value,

            gender: gender.value,

            course: course.value,

            skills: skillArray,

            about: aboutValue,

            photo: photoURL

        };


        nextId++;
        students.push(student);
        displayStudents();
        updateStatistics();
        alert("Student registered successfully!");
        form.reset();
    }

});

function createStudentCard(student) {

    let card = document.createElement("div");

    card.classList.add("student-card");

    card.setAttribute("data-id", student.id);


    let image = document.createElement("img");

    image.setAttribute("src", student.photo);

    image.setAttribute("alt", student.name);


    let studentName = document.createElement("h3");

    studentName.textContent = student.name;


    let emailText = document.createElement("p");

    emailText.textContent =
        "Email: " + student.email;


    let phoneText = document.createElement("p");

    phoneText.textContent =
        "Phone: " + student.phone;


    let dobText = document.createElement("p");

    dobText.textContent =
        "DOB: " + student.dob;


    let genderText = document.createElement("p");

    genderText.textContent =
        "Gender: " + student.gender;


    let courseText = document.createElement("p");

    courseText.textContent =
        "Course: " + student.course;


    let skillsText = document.createElement("p");

    skillsText.textContent =
        "Skills: " + student.skills.join(", ");


    let aboutText = document.createElement("p");

    aboutText.textContent =
        "About: " + student.about;


    let editButton = document.createElement("button");

    editButton.textContent = "Edit";

    editButton.type = "button";


    editButton.addEventListener("click", function () {

        editStudent(student.id);

    });


    let deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.type = "button";


    deleteButton.addEventListener("click", function () {

        deleteStudent(student.id);

    });


    card.appendChild(image);

    card.appendChild(studentName);

    card.appendChild(emailText);

    card.appendChild(phoneText);

    card.appendChild(dobText);

    card.appendChild(genderText);

    card.appendChild(courseText);

    card.appendChild(skillsText);

    card.appendChild(aboutText);

    card.appendChild(editButton);

    card.appendChild(deleteButton);


    return card;

}


function displayStudents() {

    studentContainer.innerHTML = "";


    students.forEach(function (student) {

        let card = createStudentCard(student);

        studentContainer.appendChild(card);

    });

}


function deleteStudent(id) {

    let index = -1;


    for (let i = 0; i < students.length; i++) {

        if (students[i].id === id) {

            index = i;

            break;

        }

    }


    if (index !== -1) {

        students.splice(index, 1);

        displayStudents();

        updateStatistics();

    }

}


function editStudent(id) {

    let student = null;


    for (let i = 0; i < students.length; i++) {

        if (students[i].id === id) {

            student = students[i];

            break;

        }

    }


    if (student === null) {

        return;

    }


    name.value = student.name;

    email.value = student.email;

    phone.value = student.phone;

    dob.value = student.dob;

    course.value = student.course;

    about.value = student.about;


    let genderInputs =
        document.querySelectorAll(
            'input[name="gender"]'
        );


    genderInputs.forEach(function (input) {

        if (input.value === student.gender) {

            input.checked = true;

        }

    });


    let skillInputs =
        document.querySelectorAll(
            'input[name="skills"]'
        );


    skillInputs.forEach(function (input) {

        if (student.skills.includes(input.value)) {

            input.checked = true;

        }
        else {

            input.checked = false;

        }

    });


    deleteStudent(id);


    form.scrollIntoView({
        behavior: "smooth"
    });

}


function updateStatistics() {

    document.getElementById("totalStudents").textContent =
        students.length;


    let webDevelopment = 0;

    let uiux = 0;

    let python = 0;

    let dataAnalytics = 0;

    let mernStack = 0;

    let cloudComputing = 0;


    students.forEach(function (student) {

        if (student.course === "Web Development") {

            webDevelopment++;

        }


        if (student.course === "UI/UX") {

            uiux++;

        }


        if (student.course === "Python") {

            python++;

        }


        if (student.course === "Data Analytics") {

            dataAnalytics++;
        }

        if (student.course === "MERN Stack") {

            mernStack++;
        }


        if (student.course === "Cloud Computing") {

            cloudComputing++;

        }

    });


    document.getElementById("web-development").textContent =
        webDevelopment;


    document.getElementById("ui-ux").textContent =
        uiux;


    document.getElementById("python").textContent =
        python;


    document.getElementById("data-analytics").textContent =
        dataAnalytics;


    document.getElementById("mern-stack").textContent =
        mernStack;


    document.getElementById("cloud-computing").textContent =
        cloudComputing;

}


about.addEventListener("input", function () {

    charCount.textContent =
        about.value.length + " / 200";


    if (about.value.trim().length >= 20) {

        removeError(about);

    }

});


name.addEventListener("input", function () {

    if (name.value.trim().length >= 3) {

        removeError(name);

    }

});


email.addEventListener("input", function () {

    if (
        email.value.includes("@") &&
        email.value.includes(".")
    ) {

        removeError(email);

    }

});


phone.addEventListener("input", function () {

    if (
        phone.value.length === 10 &&
        !isNaN(phone.value)
    ) {

        removeError(phone);

    }

});


course.addEventListener("change", function () {

    if (course.value !== "") {

        removeError(course);

    }

});


photo.addEventListener("change", function () {

    if (photo.files.length > 0) {

        removeError(photo);

    }

});


form.addEventListener("reset", function () {

    setTimeout(function () {

        document
            .querySelectorAll(".error")
            .forEach(function (item) {

                item.remove();

            });


        charCount.textContent = "0 / 200";

    }, 10);

});


updateStatistics();

