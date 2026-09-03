let nameInput = document.querySelector("#name");
let phoneInput = document.querySelector("#phone");
let emailInput = document.querySelector("#email");
let dateInput = document.querySelector("#date");
let courseInput = document.querySelector("#select");
let registerBtn = document.querySelector(".btn1");
let resetBtn = document.querySelector(".btn2");
let cardContainer = document.querySelector("#cardContainer");

registerBtn.addEventListener("click", function() {

    let name = nameInput.value;
    let phone = phoneInput.value;
    let email = emailInput.value;
    let date = dateInput.value;
    let course = courseInput.value;


    let genderInput = document.querySelector(
        'input[name="gender"]:checked'
    );

    let gender = "";

    if(genderInput) {
        gender = genderInput.value;
    }


    let skills = [];

    let skillInputs = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );

    skillInputs.forEach(function(skill) {
        skills.push(skill.value);
    });


    if(name === "" || phone === "" || email === "" || date === "") {
        alert("add somthing......");
        return;
    }


    let card = document.createElement("div");
    card.classList.add("student-card");

    card.innerHTML = `
        <h2>Student Details</h2>

        <p><b>Name:</b> ${name}</p>

        <p><b>Phone:</b> ${phone}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Date of Birth:</b> ${date}</p>

        <p><b>Gender:</b> ${gender}</p>

        <p><b>Course:</b> ${course}</p>

        <p><b>Skills:</b> ${skills}</p>
    `;
    cardContainer.appendChild(card);
});


resetBtn.addEventListener("click", function() {

    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    dateInput.value = "";

    courseInput.value = "";

    let genderInputs = document.querySelectorAll(
        'input[name="gender"]'
    );

    genderInputs.forEach(function(gender) {
        gender.checked = false;
    });


    let skillInputs = document.querySelectorAll(
        'input[type="checkbox"]'
    );

    skillInputs.forEach(function(skill) {
        skill.checked = false;
    });
});