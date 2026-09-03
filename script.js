const form = document.getElementById("studentForm");
const cards = document.getElementById("cards");
const about = document.getElementById("about");

let students = [];

about.addEventListener("input", function() {
    document.getElementById("count").innerText =
        about.value.length + " / 200";
});


form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let course = document.getElementById("course").value;
    let aboutText = about.value.trim();
    let gender = document.querySelector('input[name="gender"]:checked');
    let skills = document.querySelectorAll('input[name="skill"]:checked');
    let photo = document.getElementById("photo");

    if (!/^[A-Za-z ]{3,40}$/.test(name)) {
        alert("Enter valid name");
        return;
    }

    if (!email.includes("@")) {
        alert("Enter valid email");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Phone must be 10 digits");
        return;
    }

    if (dob == "" || new Date(dob) > new Date()) {
        alert("Enter valid date");
        return;
    }

    if (!gender) {
        alert("Select gender");
        return;
    }

    if (course == "") {
        alert("Select course");
        return;
    }

    if (skills.length == 0) {
        alert("Select at least one skill");
        return;
    }

    if (aboutText.length < 20) {
        alert("About must have at least 20 characters");
        return;
    }

    if (photo.files.length == 0) {
        alert("Select photo");
        return;
    }

    let skillList = [];

    for (let i = 0; i < skills.length; i++) {
        skillList.push(skills[i].value);
    }

    students.push({
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender.value,
        course: course,
        skills: skillList,
        about: aboutText,
        photo: URL.createObjectURL(photo.files[0])
    });

    showStudents();

    form.reset();
    document.getElementById("count").innerText = "0 / 200";
});


function showStudents() {

    cards.innerHTML = "";

    for (let i = 0; i < students.length; i++) {

        let s = students[i];

        cards.innerHTML += `
            <div class="student-card" data-id="${s.id}">
                <img src="${s.photo}">
                <h3>${s.name}</h3>
                <p>${s.email}</p>
                <p>${s.phone}</p>
                <p>${s.dob}</p>
                <p>${s.gender}</p>
                <p>${s.course}</p>
                <p>${s.skills.join(", ")}</p>
                <p>${s.about}</p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    }

    document.getElementById("total").innerText = students.length;
}


cards.addEventListener("click", function(e) {

    let card = e.target.closest(".student-card");

    if (e.target.classList.contains("delete-btn")) {

        if (confirm("Are you sure you want to delete this student?")) {

            let id = card.dataset.id;

            students = students.filter(function(s) {
                return s.id != id;
            });

            showStudents();
        }
    }

});


document.getElementById("search").addEventListener("input", function() {

    let text = this.value.toLowerCase();

    document.querySelectorAll(".student-card").forEach(function(card) {

        let name = card.querySelector("h3").innerText.toLowerCase();

        if (name.includes(text)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});


document.getElementById("filter").addEventListener("change", function() {

    let course = this.value;

    document.querySelectorAll(".student-card").forEach(function(card) {

        let studentCourse = card.querySelector("p:nth-of-type(6)").innerText;

        if (course == "" || studentCourse == course) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});