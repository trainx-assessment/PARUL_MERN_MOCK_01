let students = [];

const form = document.querySelector("form");
const cards = document.querySelector("#cards");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,

        gender: document.querySelector(
            'input[name="gender"]:checked'
        )?.value,

        course: document.getElementById("course").value,

        skills: Array.from(
            document.querySelectorAll('input[name="skills"]:checked')
        ).map(skill => skill.value),

        about: document.getElementById("about").value,

        profile: document.getElementById("profile").files[0]
    };

    students.push(student);

    console.log(students);

    renderCards();

    form.reset();
});

function renderCards() {

    let elems = "";

    students.forEach(student => {

        let imageURL = "";

        if (student.profile) {
            imageURL = URL.createObjectURL(student.profile);
        }

        elems += `
            <div class="card">
                <img src="${imageURL}" alt="${student.name}">

                <h3>${student.name}</h3>

                <p>${student.about}</p>

                <p>Email: ${student.email}</p>

                <p>Phone: ${student.phone}</p>

                <p>Course: ${student.course}</p>

                <p>Gender: ${student.gender}</p>

                <p>Skills: ${student.skills.join(", ")}</p>

                <div class="connect">
                    Connect 💜
                </div>
            </div>
        `;
    });

    cards.innerHTML = elems;
}