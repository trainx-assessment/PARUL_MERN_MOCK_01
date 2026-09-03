const students = [];
let nextId = 1;

const form = document.querySelector("form");
const cardsContainer = document.getElementById("cards-container");
const studentCount = document.getElementById("student-count");

function setError(id, msg) {
    document.getElementById(id).textContent = msg;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

function validate(data) {
    let valid = true;
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(data.name)) {
        setError("err-name", "Name must be at least 3 characters, letters and spaces only.");
        valid = false;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        setError("err-email", "Enter a valid email address.");
        valid = false;
    }
    if (!phoneRegex.test(data.phone)) {
        setError("err-phone", "Phone must be exactly 10 digits.");
        valid = false;
    }
    if (!data.dob) {
        setError("err-dob", "Date of birth is required.");
        valid = false;
    } else if (new Date(data.dob) >= new Date()) {
        setError("err-dob", "Date of birth cannot be a future date.");
        valid = false;
    }
    if (!data.gender) {
        setError("err-gender", "Please select a gender.");
        valid = false;
    }
    if (!data.course) {
        setError("err-course", "Please select a course.");
        valid = false;
    }
    if (data.skills.length === 0) {
        setError("err-skills", "Select at least one skill.");
        valid = false;
    }
    if (!data.about.trim()) {
        setError("err-about", "About section is required.");
        valid = false;
    }
    if (!data.photo) {
        setError("err-photo", "Please upload a profile photo.");
        valid = false;
    }
    return valid;
}

function createCard(student) {
    const card = document.createElement("div");
    card.classList.add("student-card");
    card.dataset.id = student.id;

    const img = document.createElement("img");
    img.src = student.photo;
    img.alt = student.name;

    const h3 = document.createElement("h3");
    h3.textContent = student.name;

    const details = [
        student.email,
        student.phone,
        `DOB: ${student.dob} · ${student.gender}`,
        `Course: ${student.course}`,
        `Skills: ${student.skills.join(", ")}`,
    ];

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    card.appendChild(img);
    card.appendChild(h3);
    details.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        card.appendChild(p);
    });

    const about = document.createElement("p");
    about.classList.add("about");
    about.textContent = student.about;
    card.appendChild(about);
    card.appendChild(deleteBtn);

    return card;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const data = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value,
        gender: (document.querySelector("input[name='gender']:checked") || {}).value || "",
        course: document.getElementById("course").value,
        skills: [...document.querySelectorAll("input[name='skills']:checked")].map(cb => cb.value),
        about: document.getElementById("about").value,
        photo: document.getElementById("photo").files[0]
            ? URL.createObjectURL(document.getElementById("photo").files[0])
            : "",
    };

    if (!validate(data)) return;

    const student = { id: nextId++, ...data };
    students.push(student);

    cardsContainer.appendChild(createCard(student));
    studentCount.textContent = students.length;

    form.reset();
});
 
cardsContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("delete-btn")) return;
    const card = e.target.closest(".student-card");
    const id = Number(card.dataset.id);
    students.splice(students.findIndex(s => s.id === id), 1);
    card.remove();
    studentCount.textContent = students.length;
});
