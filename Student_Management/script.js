let reg = document.getElementById("register");
let student = [];

let add = false;
let addbut = document.getElementById("New Student");
let form = document.querySelector(".form");

form.style.visibility = "hidden";

addbut.addEventListener("click", () => {
    add = !add;

    if (add) {
        form.style.visibility = "visible";
    } else {
        form.style.visibility = "hidden";
    }
});

function displayStudents() {
    let container = document.getElementById("Student-container");

    container.innerHTML = "";

    student.forEach((std, index) => {
        let card = document.createElement("div");

        card.classList.add("student-card");
        card.setAttribute("data-id", index + 1);

        card.innerHTML = `
            <img src="${std.stdPhoto}" alt="${std.stdName}">
            <h2>${std.stdName}</h2>
            <p>Email: ${std.stdMail}</p>
            <p>Phone: ${std.stdPhone}</p>
            <p>DOB: ${std.stddob}</p>
            <p>Gender: ${std.stdgender}</p>
            <p>Course: ${std.stdcourse}</p>
            <p>Skills: ${std.stdSkills.join(", ")}</p>
            <p>About: ${std.stdabout}</p>
            <button>Edit</button>
            <button>Delete</button>
        `;

        container.appendChild(card);
    });
}

reg.addEventListener("click", function(e) {
    e.preventDefault();

    let name = document.getElementById("stdname").value;
    let mail = document.getElementById("stdmail").value;
    let phone = document.getElementById("stdphone").value;
    let dob = document.getElementById("stddob").value;

    let gender =
        document.querySelector('input[name="gender"]:checked')?.id ||
        "Not specified";

    let course = document.getElementById("sel").value;

    let checkedSkillsBoxes =
        document.querySelectorAll('input[type="checkbox"]:checked');

    let selectedSkills =
        Array.from(checkedSkillsBoxes).map(box => box.nextSibling.textContent.trim());

    let about = document.getElementById("self").value;

    let photo = document.querySelector('input[type="file"]').files[0];

    if (name.length < 3 || name.length > 40) {
        alert("Enter a valid name");
        return;
    }

    if (course == "Select") {
        alert("Select at least one course");
        return;
    }

    if (selectedSkills.length == 0) {
        alert("Select at least one skill");
        return;
    }

    about = about.trim();

    if (about.length < 20 || about.length > 200) {
        alert("Enter valid data in about section");
        return;
    }

    let photourl = photo ? URL.createObjectURL(photo) : "";

    let std = {
        stdName: name,
        stdMail: mail,
        stdPhone: phone,
        stddob: dob,
        stdgender: gender,
        stdcourse: course,
        stdSkills: selectedSkills,
        stdabout: about,
        stdPhoto: photourl
    };

    student.push(std);

    displayStudents();

    alert("Successfully Registered The student");
});