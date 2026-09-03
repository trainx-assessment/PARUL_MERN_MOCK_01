const students = [];
const form = document.querySelector(".registration-form");
const studentsContainer = document.querySelector(".students-container");

function showStudents() {
    studentsContainer.innerHTML = "";

    students.forEach((student) => {
        const card = document.createElement("article");
        card.className = "student-card";
        card.dataset.id = student.id;

        card.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone || "Not added"}</p>
            <p><strong>Course:</strong> ${student.course || "Not selected"}</p>
            <p><strong>About:</strong> ${student.about || "Not added"}</p>
            <button type="button" class="edit-button">Edit</button>
            <button type="button" class="delete-button">Delete</button>
        `;

        studentsContainer.appendChild(card);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();

    if (!name || !email) {
        alert("Please enter the student name and email.");
        return;
    }

    students.push({
        id: Date.now(),
        name,
        email,
        phone: document.querySelector("#number").value,
        course: document.querySelector("#course").selectedOptions[0].text,
        about: document.querySelector("#about").value
    });

    showStudents();
    form.reset();
});

studentsContainer.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-button")) {
        return;
    }

    const card = event.target.closest(".student-card");
    const studentIndex = students.findIndex((student) => student.id == card.dataset.id);

    students.splice(studentIndex, 1);
    showStudents();
});

showStudents();