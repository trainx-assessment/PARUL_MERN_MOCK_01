let students = [];

const courses = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];

const form = document.getElementById("studentForm");
const cards = document.getElementById("studentCards");
const statistics = document.getElementById("statistics");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const noStudents = document.getElementById("noStudents");

function courseId(course) {
    return course.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function createStatistics() {
    statistics.innerHTML = `
        <div class="stat-card">
            <p>Total Students</p>
            <strong id="totalStudents">0</strong>
        </div>
        ${courses.map(c => `
            <div class="stat-card">
                <p>${c}</p>
                <strong id="${courseId(c)}">0</strong>
            </div>
        `).join("")}
    `;
}

function updateStatistics() {
    document.getElementById("totalStudents").textContent = students.length;

    courses.forEach(course => {
        let count = students.filter(s => s.course === course).length;
        document.getElementById(courseId(course)).textContent = count;
    });
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let gender = document.querySelector('input[name="gender"]:checked');
    let skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(x => x.value);

    students.push({
        id: Date.now(),
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value,
        gender: gender ? gender.value : "Not specified",
        course: document.getElementById("course").value,
        skills: skills,
        about: document.getElementById("about").value.trim(),
        status: "Pending"
    });

    renderStudents();
    updateStatistics();
    form.reset();
});

function renderStudents() {
    cards.innerHTML = "";
    noStudents.style.display = students.length ? "none" : "block";

    students.forEach(student => {
        let card = document.createElement("article");
        card.className = "student-card";
        card.dataset.id = student.id;
        card.dataset.name = student.name.toLowerCase();
        card.dataset.email = student.email.toLowerCase();
        card.dataset.course = student.course;

        let initials = student.name.split(" ").map(x => x[0]).join("").substring(0, 2).toUpperCase();

        card.innerHTML = `
            <div class="student-header">
                <div class="avatar">${initials}</div>
                <div>
                    <h3>${student.name}</h3>
                    <span class="status">${student.status}</span>
                </div>
            </div>
            <div class="student-details">
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Phone:</strong> ${student.phone}</p>
                <p><strong>Date of Birth:</strong> ${student.dob}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                <p><strong>Skills:</strong> ${student.skills.join(", ") || "None"}</p>
                <p><strong>About:</strong> ${student.about || "Not provided"}</p>
            </div>
            <div class="card-buttons">
                <button class="edit-btn">Edit Course</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        cards.appendChild(card);
    });

    filterStudents();
}

cards.addEventListener("click", function(e) {
    const card = e.target.closest(".student-card");
    if (!card) return;

    const id = Number(card.dataset.id);
    const student = students.find(s => s.id === id);

    if (e.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this student?")) {
            students = students.filter(s => s.id !== id);
            renderStudents();
            updateStatistics();
        }
    }

    if (e.target.classList.contains("edit-btn")) {
        let newCourse = prompt("Enter new course:\n" + courses.join("\n"), student.course);

        if (newCourse && courses.includes(newCourse.trim())) {
            student.course = newCourse.trim();
            renderStudents();
            updateStatistics();
        } else if (newCourse !== null) {
            alert("Please enter a valid course.");
        }
    }
});

function filterStudents() {
    let text = search.value.toLowerCase();
    let course = filter.value;

    document.querySelectorAll(".student-card").forEach(card => {
        let matchText =
            card.dataset.name.includes(text) ||
            card.dataset.email.includes(text);

        let matchCourse =
            !course || card.dataset.course === course;

        card.style.display =
            matchText && matchCourse ? "block" : "none";
    });
}

search.addEventListener("input", filterStudents);
filter.addEventListener("change", filterStudents);

createStatistics();
updateStatistics();
renderStudents();