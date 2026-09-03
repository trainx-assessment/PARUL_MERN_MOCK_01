console.log("yooooo");

const students = [];

let nextId = 1;

const form = document.getElementById("studentForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("ph_no");
const dobInput = document.getElementById("dob");

const courseInput = document.getElementById("c");

const aboutInput = document.getElementById("about");
const charCount = document.getElementById("charCount");

const fileInput = document.getElementById("file");

const studentContainer = document.getElementById("studentContainer");

aboutInput.addEventListener("input", function () {
const length = aboutInput.value.length;
    charCount.textContent = `${length} / 200`;
});

function validateName(name) {
    const nameRegex = /^[A-Za-z ]+$/;
    if (name.trim() === "") {
        return "Name is required.";
    }

    if (name.length < 3) {
        return "Name must contain at least 3 characters.";
    }

    if (name.length > 40) {
        return "Name cannot exceed 40 characters.";
    }

    if (!nameRegex.test(name)) {
        return "Name can contain only letters and spaces.";
    }
    return null;
}

function validateEmail(email) {
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
        return "Email is required.";
    }

    if (!emailRegex.test(email)) {
        return "Enter a valid email address.";
    }

    return null;
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    if (phone.trim() === "") {
        return "Phone number is required.";
    }

    if (!phoneRegex.test(phone)) {
        return "Phone number must contain exactly 10 digits.";
    }

    return null;
}

function validateDOB(dob) {
    if (dob === "") {
        return "Date of birth is required.";
    }
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) {
        return "Date of birth cannot be in the future.";
    }
    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    if (age < 15) {
        return "Student must be at least 15 years old.";
    }

    return null;
}

function getGender() {
    const selectedGender =document.querySelector('input[name="gender"]:checked');

    if (!selectedGender) {
        return null;
    }

    return selectedGender.value;
}

function validateCourse() {
    if (courseInput.value === "") {
        return "Please select a course.";
    }

    return null;
}

function getSkills() {

    const checkedSkills =document.querySelectorAll('input[type="checkbox"]:checked');

    const skills = [];

    checkedSkills.forEach(function (skill) {

        if (skill.id !== "agree") {
            skills.push(skill.value);
        }

    });

    return skills;
}


function validateSkills(skills) {

    if (skills.length === 0) {
        return "Select at least one skill.";
    }

    return null;
}

function validateAbout(about) {
    if (about.trim() === "") {
        return "About the student is required.";
    }
    const trimmedAbout = about.trim();
    if (trimmedAbout.length < 20) {
        return "About section must contain at least 20 characters.";
    }
    if (trimmedAbout.length > 200) {
        return "About section cannot exceed 200 characters.";
    }

    return null;
}

function validatePhoto() {

    if (fileInput.files.length === 0) {
        return "Profile photo is required.";
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith("image/")) {
        return "Only image files are allowed.";
    }

    return null;
}

function validateAgreement() {

    const agree =document.getElementById("agree");

    if (!agree.checked) {
        return "You must agree before continuing.";
    }

    return null;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const dob = dobInput.value;
    const gender = getGender();
    const skills = getSkills();
    const about = aboutInput.value;
    let error;

    error = validateName(name);
    if (error) {
        alert(error);
        return;
    }

    error = validateEmail(email);
    if (error) {
        alert(error);
        return;
    }

    error = validatePhone(phone);
    if (error) {
        alert(error);
        return;
    }

    error = validateDOB(dob);
    if (error) {
        alert(error);
        return;
    }

    if (!gender) {
        alert("Please select a gender.");
        return;
    }

    error = validateCourse();
    if (error) {
        alert(error);
        return;
    }

    error = validateSkills(skills);
    if (error) {
        alert(error);
        return;
    }

    error = validateAbout(about);
    if (error) {
        alert(error);
        return;
    }

    error = validatePhoto();
    if (error) {
        alert(error);
        return;
    }

    error = validateAgreement();
    if (error) {
        alert(error);
        return;
    }


    const photo =fileInput.files[0];

    const student = {
id: nextId,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: courseInput.value,
        skills: skills,
        about: about.trim(),
        photo: photo.name
    };

    students.push(student);
    nextId++;
    createStudentCard(student);
    form.reset();
    charCount.textContent = "0 / 200";
    console.log(students);
    alert("Student registered successfully!");

});

function createStudentCard(student) {
    const card =document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute(
        "data-id",
        student.id
    );


   
    const photo =document.createElement("div");
    photo.textContent =`📷 ${student.photo}`;

    const name =document.createElement("h2");
    name.textContent =student.name;

    const email = document.createElement("p");
    email.textContent =`Email: ${student.email}`;

    const phone =document.createElement("p");
    phone.textContent =`Phone: ${student.phone}`;

    const dob =document.createElement("p");

    dob.textContent =`DOB: ${student.dob}`;
    const gender =document.createElement("p");
    gender.textContent =`Gender: ${student.gender}`;
    const course =document.createElement("p");
    course.textContent =`Course: ${student.course}`;

    const skills =
        document.createElement("p");

    skills.textContent =`Skills: ${student.skills.join(", ")}`;


    const about =document.createElement("p");
    about.textContent =`About: ${student.about}`;


    const editButton =
        document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener(
        "click",
        function () {
            editStudent(student.id);
        }
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.classList.add("delete-btn");

    deleteButton.addEventListener(
        "click",
        function () {
            deleteStudent(student.id);
        }
    );


    const buttons =
        document.createElement("div");

    buttons.append(
        editButton,
        deleteButton
    );


    card.append(
        photo,
        name,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        buttons
    );


    studentContainer.appendChild(card);
}


function deleteStudent(id) {

    const index =
        students.findIndex(
            student => student.id === id
        );

    if (index === -1) {
        return;
    }

    students.splice(index, 1);


    const card =
        document.querySelector(
            `.student-card[data-id="${id}"]`
        );

    if (card) {
        card.remove();
    }

    console.log(students);
}


function editStudent(id) {

    const student =
        students.find(
            student => student.id === id
        );

    if (!student) {
        return;
    }

    nameInput.value = student.name;

    emailInput.value = student.email;

    phoneInput.value = student.phone;

    dobInput.value = student.dob;

    courseInput.value = student.course;

    aboutInput.value = student.about;

    charCount.textContent =
        `${student.about.length} / 200`;


    document.querySelectorAll(
        'input[name="gender"]'
    ).forEach(function (radio) {

        radio.checked =
            radio.value === student.gender;

    });

    document.querySelectorAll(
        'input[type="checkbox"]'
    ).forEach(function (checkbox) {

        if (checkbox.id === "agree") {
            return;
        }

        checkbox.checked =
            student.skills.includes(
                checkbox.value
            );

    });

    deleteStudent(id);
  
    form.scrollIntoView({
        behavior: "smooth"
    });
}

