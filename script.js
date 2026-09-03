const aboutField = document.getElementById("about");

const charCount = document.getElementById("charCount");

aboutField.addEventListener("input", () => {

    charCount.textContent = `${aboutField.value.length} / 200`;
});

function validateName(name) {
    const regex = /^[A-Za-z\s]{3,40}$/;

    return regex.test(name.trim());

}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email.trim());

}

function validatePhone(phone) {
    const regex = /^\d{10}$/;

    return regex.test(phone.trim());
}

function validateDOB(dob) {
    if (!dob) return false;
    const birthDate = new Date(dob);

    const today = new Date();
    if (birthDate > today) return false;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
    }
    return age >= 15;
}

function validateGender() {
    return document.querySelector('input[name="gender"]:checked') !== null;

}

function validateCourse(course) {
    return course !== "";

}

function validateSkills() {

    return document.querySelectorAll('input[name="skills"]:checked').length > 0;
}

function validateAbout(about) {
    const trimmed = about.trim();
    
    return trimmed.length >= 20 && trimmed.length <= 200;
}

function validatePhoto(photoInput) {
    if (!photoInput.files.length) return false;
    const file = photoInput.files[0];

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    return validTypes.includes(file.type);
}

const students = [];
let studentIdCounter = 1;
const form = document.getElementById("studentForm");
const studentContainer = document.getElementById("cards");

function renderStudents() {
    studentContainer.innerHTML = "";

    students.forEach(student => {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.setAttribute("data-id", student.id);


    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = `${student.name}'s photo`;
    card.appendChild(img);


    const nameHeading = document.createElement("h3");
    nameHeading.textContent = student.name;
    card.appendChild(nameHeading);

    card.appendChild(document.createElement("p")).textContent = `Email: ${student.email}`;
    card.appendChild(document.createElement("p")).textContent = `Phone: ${student.phone}`;
    card.appendChild(document.createElement("p")).textContent = `DOB: ${student.dob}`;

    card.appendChild(document.createElement("p")).textContent = `Gender: ${student.gender}`;
    card.appendChild(document.createElement("p")).textContent = `Course: ${student.course}`;
    card.appendChild(document.createElement("p")).textContent = `Skills: ${student.skills.join(", ")}`;
    card.appendChild(document.createElement("p")).textContent = `About: ${student.about}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.classList.add("edit-btn");
    card.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.classList.add("delete-btn");
    card.appendChild(deleteBtn);

    studentContainer.appendChild(card);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();


    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    
    const course = document.getElementById("course").value;
    const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(s => s.value);
    const about = document.getElementById("about").value;
    const photoInput = document.getElementById("photo");

    if (!validateName(name)) { alert("Invalid Name"); return; }

    if (!validateEmail(email)) { alert("Invalid Email"); return; }
    if (!validatePhone(phone)) { alert("Invalid Phone"); return; }

    if (!validateDOB(dob)) { alert("Invalid DOB"); return; }

    if (!validateGender()) { alert("Select Gender"); return; }
    if (!validateCourse(course)) { alert("Select Course"); return; }
    if (!validateSkills()) { alert("Select Skills"); return; }

    if (!validateAbout(about)) { alert("About must be 20–200 chars"); return; }

    if (!validatePhoto(photoInput)) { alert("Upload valid photo"); return; }

    const student = {
     id: studentIdCounter++,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    dob: dob,
    gender: gender,
    course: course,
    skills: skills,
    about: about.trim(),
    photo: URL.createObjectURL(photoInput.files[0])
    };

    students.push(student);
    renderStudents();

    form.reset();
    charCount.textContent = "0 / 200";
});
