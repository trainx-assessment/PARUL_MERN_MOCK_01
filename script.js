let form = document.getElementById("studentForm");
let cardsContainer = document.getElementById("studentCardsContainer");


form.onsubmit = function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let dob = document.getElementById("dob").value;
    let course = document.getElementById("course").value;
    let about = document.getElementById("about").value;

    let gender = document.querySelector('input[name="gender"]:checked');
    let genderVal = gender ? gender.value : "";

    let skills = [];
    for (let box of document.querySelectorAll('input[name="skills"]:checked')) {
        skills.push(box.value);
    }

    let photoInput = document.getElementById("photo");
    let photo = photoInput.files[0];
    let photoUrl = photo ? URL.createObjectURL(photo) : "";

    let card = document.createElement("div");
    card.className = "student-card";
    card.innerHTML = `
        <img src="${photoUrl}" alt="${name}">
        <h3>${name}</h3>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>DOB: ${dob}</p>
        <p>Gender: ${genderVal}</p>
        <p>Course: ${course}</p>
        <p>Skills: ${skills.join(", ")}</p>
        <p>About: ${about}</p>
    `;

    cardsContainer.appendChild(card);
    form.reset();
    
};
