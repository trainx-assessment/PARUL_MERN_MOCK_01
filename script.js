const courses = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];
const skillNames = ["HTML", "CSS", "JavaScript", "Git", "React", "Node.js"];
const students = JSON.parse(localStorage.getItem("students") || "[]");
const form = document.querySelector("#studentForm");
const container = document.querySelector("#studentContainer");
const about = document.querySelector("#about");
const photoInput = document.querySelector("#photo");
let editingId = null;

document.querySelector(".skills").innerHTML = skillNames.map( (skill) => `<label><input type="checkbox" name="skills" value="${skill}"> ${skill}</label>`).join("");
const valueOf = (id) => document.querySelector(`#${id}`).value.trim();
const showError = (field, message) => {
    document.querySelector(`[data-error-for="${field}"]`).textContent = message;
}
;
const clearErrors = () => document.querySelectorAll(".error").forEach( (error) => {
    error.textContent = "";
}
);

function validate() {
    clearErrors();
    let valid = true;
    const fail = (field, message) => {
        showError(field, message);
        valid = false;
    }
    ;
    const name = valueOf("studentName")
      , email = valueOf("email")
      , phone = valueOf("phone")
      , dob = valueOf("dob")
      , course = valueOf("course")
      , aboutText = valueOf("about");
    const gender = document.querySelector("input[name='gender']:checked");
    const skills = [...document.querySelectorAll("input[name='skills']:checked")].map( (input) => input.value);
    if (!/^[A-Za-z ]{3,40}$/.test(name))
        fail("studentName", "Use 3-40 letters and spaces only.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        fail("email", "Enter a valid email address.");
    if (!/^\d{10}$/.test(phone))
        fail("phone", "Enter exactly 10 digits.");
    if (!dob || new Date(dob) > new Date())
        fail("dob", "Choose a valid past date.");
    else if (new Date().getFullYear() - new Date(dob).getFullYear() < 15)
        fail("dob", "Student must be at least 15 years old.");
    if (!gender)
        fail("gender", "Select a gender.");
    if (!course)
        fail("course", "Select a course.");
    if (!skills.length)
        fail("skills", "Select at least one skill.");
    if (aboutText.length < 20)
        fail("about", "Write at least 20 characters.");
    if (!editingId && (!photoInput.files[0] || !photoInput.files[0].type.startsWith("image/")))
        fail("photo", "Choose an image file.");
    return valid ? {
        name,
        email,
        phone,
        dob,
        gender: gender.value,
        course,
        skills,
        about: aboutText
    } : null;
}
function persist() {
    try {
        localStorage.setItem("students", JSON.stringify(students));
    } catch (error) {
        if (error.name === "QuotaExceededError") {
            alert("Storage is full. Please remove some student records or use smaller images.");
        } else {
            throw error;
        }
    }
}

function render() {
    const query = document.querySelector("#searchInput").value.toLowerCase()
      , filter = document.querySelector("#courseFilter").value;
    const visible = students.filter( (student) => student.name.toLowerCase().includes(query) && (filter === "All Courses" || student.course === filter));
    container.innerHTML = visible.length ? "" : '<p class="empty">No students found</p>';
    visible.forEach( (student) => {
        const card = document.createElement("article");
        card.className = "student-card";
        card.dataset.id = student.id;
        card.innerHTML = `<img src="${student.photo || ""}" alt="${student.name}'s profile photo"><h3>${student.name}</h3><p><b>Email:</b> ${student.email}<br><b>Phone:</b> ${student.phone}<br><b>DOB:</b> ${student.dob}<br><b>Gender:</b> ${student.gender}<br><b>Course:</b> ${student.course}</p><div>${student.skills.map( (skill) => `<span class="tag">${skill}</span>`).join("")}</div><p><b>About:</b> ${student.about}</p><div class="card-actions"><button class="edit-btn" type="button">Edit</button><button class="delete-btn" type="button">Delete</button></div>`;
        container.append(card);
    }
    );
    document.querySelector("#totalStudents").textContent = students.length;
    document.querySelector("#courseStats").innerHTML = courses.map( (course) => `<div class="course-stat"><span>${course}</span><strong>${students.filter( (student) => student.course === course).length}</strong></div>`).join("");
}

function resetForm() {
    form.reset();
    editingId = null;
    document.querySelector("#submitButton").textContent = "Register Student";
    document.querySelector("#formMode").textContent = "Create";
    about.dispatchEvent(new Event("input"));
    clearErrors();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = validate();
    if (!data)
        return;
    const file = photoInput.files[0];
    const save = (photo) => {
        data.photo = photo || (editingId && students.find( (student) => student.id === editingId)?.photo) || "";
        if (editingId)
            Object.assign(students.find( (student) => student.id === editingId), data);
        else
            students.push({
                id: Date.now(),
                ...data
            });
        persist();
        render();
        resetForm();
    }
    ;
    if (file) {
        const reader = new FileReader();
        reader.onload = () => save(reader.result);
        reader.readAsDataURL(file);
    } else
        save();
}
);

form.addEventListener("reset", (event) => {
    event.preventDefault();
    resetForm();
}
);
about.addEventListener("input", () => {
    document.querySelector("#characterCount").textContent = `${about.value.length} / 200`;
}
);

document.querySelector("#searchInput").addEventListener("input", render);
document.querySelector("#courseFilter").addEventListener("change", render);

container.addEventListener("click", (event) => {
    const card = event.target.closest(".student-card");
    if (!card)
        return;
    const id = Number(card.dataset.id);
    if (event.target.closest(".delete-btn") && confirm("Are you sure you want to delete this student?")) {
        students.splice(students.findIndex( (student) => student.id === id), 1);
        persist();
        render();
    }
    if (event.target.closest(".edit-btn")) {
        const student = students.find( (item) => item.id === id);
        editingId = id;
        ["studentName", "email", "phone", "dob", "course", "about"].forEach( (field) => {
            document.querySelector(`#${field}`).value = student[field];
        }
        );
        document.querySelector(`input[name='gender'][value='${student.gender}']`).checked = true;
        document.querySelectorAll("input[name='skills']").forEach( (input) => {
            input.checked = student.skills.includes(input.value);
        }
        );
        document.querySelector("#submitButton").textContent = "Update Student";
        document.querySelector("#formMode").textContent = "Editing";
        about.dispatchEvent(new Event("input"));
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}
);

document.querySelector("#themeToggle").addEventListener("click", (event) => {
    document.body.classList.toggle("dark-mode");
    event.target.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
}
);
render(); 
