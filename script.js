const students = [];
let sIdC = 1;

const form = document.querySelector("#sForm");
const sCont = document.querySelector("#sCont");
const totalEl = document.querySelector("#total");

const nErr = document.querySelector("#nErr");
const eErr = document.querySelector("#eErr");
const pErr = document.querySelector("#pErr");
const dErr = document.querySelector("#dErr");
const gErr = document.querySelector("#gErr");
const cErr = document.querySelector("#cErr");
const skErr = document.querySelector("#skErr");
const abErr = document.querySelector("#abErr");
const phErr = document.querySelector("#phErr");

const nameRegex = /^[A-Za-z\s]{3,}$/;
const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(element, message) {
    element.textContent = message;
    element.classList.add("visible");
    element.previousElementSibling?.classList.add("error");
}

function clearError(element) {
    element.textContent = "";
    element.classList.remove("visible");
    element.previousElementSibling?.classList.remove("error");
}

function clearAllErrors() {
    [nErr, eErr, pErr, dErr, gErr, cErr, skErr, abErr, phErr].forEach(clearError);
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
}

function validateName(name) {
    if (!name.trim()) {
        return "Student name is required";
    }
    if (!nameRegex.test(name.trim())) {
        return "Name must be at least 3 characters, only letters and spaces allowed";
    }
    return "";
}

function validateEmail(email) {
    if (!email.trim()) {
        return "Email is required";
    }
    if (!emailRegex.test(email.trim())) {
        return "Please enter a valid email address";
    }
    return "";
}

function validatePhone(phone) {
    if (!phone.trim()) {
        return "Phone number is required";
    }
    if (!phoneRegex.test(phone.trim())) {
        return "Phone number must be exactly 10 digits";
    }
    return "";
}

function validateDob(dob) {
    if (!dob) {
        return "Date of birth is required";
    }
    const selectedDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
        return "Future dates are not allowed";
    }
    return "";
}

function validateGender(formData) {
    const gender = formData.get("gender");
    if (!gender) {
        return "Please select a gender";
    }
    return "";
}

function validateCourse(course) {
    if (!course) {
        return "Please select a course";
    }
    return "";
}

function validateSkills(formData) {
    const skills = formData.getAll("skills");
    if (skills.length === 0) {
        return "Please select at least one skill";
    }
    return "";
}

function validateAbout(about) {
    if (!about.trim()) {
        return "About student is required";
    }
    if (!about.trim().replace(/\s/g, "").length) {
        return "About student cannot contain only spaces";
    }
    return "";
}

function validatePhoto(photo) {
    if (!photo || photo.size === 0) {
        return "Profile photo is required";
    }
    return "";
}

function createStudentCard(student) {
    const card = document.createElement("div");
    card.classList.add("s-card");
    card.setAttribute("data-id", student.id);

    const photoUrl = student.photo ? URL.createObjectURL(student.photo) : "";

    card.innerHTML = `
        ${photoUrl ? `<img src="${photoUrl}" alt="${student.name}'s photo">` : ""}
        <h3>${student.name}</h3>
        <div class="meta"><strong>Email:</strong> ${student.email}</div>
        <div class="meta"><strong>Phone:</strong> ${student.phone}</div>
        <div class="meta"><strong>Date of Birth:</strong> ${student.dob}</div>
        <div class="meta"><strong>Gender:</strong> ${student.gender}</div>
        <div class="meta"><strong>Course:</strong> ${student.course}</div>
        <div class="skills">
            ${student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}
        </div>
        <p class="about-text">${student.about}</p>
        <button class="delete-btn">Delete</button>
    `;

    return card;
}

function updateStudentCount() {
    totalEl.textContent = students.length;
    if (!document.querySelector(".empty-state")) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No students yet. Add your first student above.";
        sCont.prepend(empty);
    }
    document.querySelector(".empty-state").style.display = students.length ? "none" : "block";
}

function resetForm() {
    form.reset();
    clearAllErrors();
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearAllErrors();

    const formData = new FormData(form);

    const name = formData.get("sName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const dob = formData.get("dob");
    const gender = formData.get("gender");
    const course = formData.get("course");
    const skills = formData.getAll("skills");
    const about = formData.get("about");
    const photo = formData.get("photo");

    let isValid = true;

    const nameErr = validateName(name);
    if (nameErr) {
        showError(nErr, nameErr);
        document.querySelector("#sName").classList.add("error");
        isValid = false;
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
        showError(eErr, emailErr);
        document.querySelector("#email").classList.add("error");
        isValid = false;
    }

    const phoneErr = validatePhone(phone);
    if (phoneErr) {
        showError(pErr, phoneErr);
        document.querySelector("#phone").classList.add("error");
        isValid = false;
    }

    const dobErr = validateDob(dob);
    if (dobErr) {
        showError(dErr, dobErr);
        document.querySelector("#dob").classList.add("error");
        isValid = false;
    }

    const genderErr = validateGender(formData);
    if (genderErr) {
        showError(gErr, genderErr);
        isValid = false;
    }

    const courseErr = validateCourse(course);
    if (courseErr) {
        showError(cErr, courseErr);
        document.querySelector("#course").classList.add("error");
        isValid = false;
    }

    const skillsErr = validateSkills(formData);
    if (skillsErr) {
        showError(skErr, skillsErr);
        isValid = false;
    }

    const aboutErr = validateAbout(about);
    if (aboutErr) {
        showError(abErr, aboutErr);
        document.querySelector("#about").classList.add("error");
        isValid = false;
    }

    const photoErr = validatePhoto(photo);
    if (photoErr) {
        showError(phErr, photoErr);
        document.querySelector("#photo").classList.add("error");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const student = {
        id: sIdC++,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        dob: dob,
        gender: gender,
        course: course,
        skills: skills,
        about: about.trim(),
        photo: photo
    };

    students.push(student);

    const card = createStudentCard(student);
    sCont.appendChild(card);

    updateStudentCount();
    resetForm();
});

sCont.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.closest(".s-card");
        if (card) {
            const studentId = parseInt(card.getAttribute("data-id"), 10);
            const index = students.findIndex(s => s.id === studentId);
            if (index !== -1) {
                students.splice(index, 1);
            }
            card.remove();
            updateStudentCount();
        }
    }
});
