const students = [];
const form = document.querySelector(".form");
const cards = document.querySelector(".cards");
const search = document.querySelector("#search");

function showCards(list = students) {
    cards.innerHTML = "";

    if (list.length === 0) {
        const msg = document.createElement("p");
        msg.textContent = students.length === 0 ? "No registrations yet." : "No students found.";
        cards.appendChild(msg);
        return;
    }

    list.forEach((student) => {
        const card = document.createElement("article");
        card.className = "student-card";
        card.dataset.id = student.id;

        card.innerHTML = `
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone || "Not added"}</p>
            <p><strong>Course:</strong> ${student.course || "Not selected"}</p>
            <p><strong>About:</strong> ${student.about || "Not added"}</p>
            <button type="button" class="edit">Edit</button>
            <button type="button" class="del">Delete</button>
        `;

        cards.appendChild(card);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();

    if (!name) {
        alert("Please enter a valid name.");
        return;
    }
    if (!email) {
        alert("Please enter a valid email with @");
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    students.push({
        id: Date.now(),
        name,
        email,
        phone,
        course: document.querySelector("#course").selectedOptions[0].text,
        about: document.querySelector("#about").value
    });

    showCards();
    form.reset();
});

cards.addEventListener("click", (event) => {
    if (!event.target.classList.contains("del")) {
        return;
    }

    const card = event.target.closest(".student-card");
    const pos = students.findIndex((student) => student.id == card.dataset.id);

    students.splice(pos, 1);
    showCards();
});

search.addEventListener("input", () => {
    const word = search.value.toLowerCase();
    const found = students.filter((student) => student.name.toLowerCase().includes(word));

    showCards(found);
});

showCards();
