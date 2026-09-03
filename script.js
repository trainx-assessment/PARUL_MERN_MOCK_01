let students = [];
let editId = null;

let form = document.getElementById("myForm");
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let phoneInput = document.getElementById("phone");
let dobInput = document.getElementById("dob");
let courseInput = document.getElementById("course");
let aboutInput = document.getElementById("about");
let photoInput = document.getElementById("photo");
let searchInput = document.getElementById("search");
let filterInput = document.getElementById("filter");
let cardsDiv = document.getElementById("cards");

let addBtn = document.getElementById("addBtn");
let resetBtn = document.getElementById("resetBtn");
let counter = document.getElementById("counter");

resetBtn.addEventListener("click", function() {
    form.reset();
    editId = null;
    addBtn.textContent = "Register Student";
}); 


form.addEventListener("submit", function(event) {
    event.preventDefault();
    let isValid = true;

    let nameValue = nameInput.value.trim();
    let namePattern = /^[A-Za-z\s]{3,40}$/;
    if (!namePattern.test(nameValue) || nameValue === "") isValid = false;

    let emailValue = emailInput.value.trim();
    if (!emailValue.includes("@") || !emailValue.includes(".")) isValid = false;

    let phoneValue = phoneInput.value.trim();
    let phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phoneValue)) isValid = false;

    let dobValue = dobInput.value;
    if (dobValue == "") isValid = false;
    else {
        let today = new Date();
        let selectedDate = new Date(dobValue);
        if (selectedDate > today) isValid = false;
        else {
            let age = today.getFullYear() - selectedDate.getFullYear();
            if (age < 15) isValid = false;
        }
    }

    let genderRadios = document.getElementsByName("gender");
    let genderValue = "";
    for (let i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            genderValue = genderRadios[i].value;
        }
    }
    if (genderValue == "") isValid = false;

    let courseValue = courseInput.value;
    if (courseValue == "Select Course") isValid = false;

    let skillCheckboxes = document.getElementsByName("skill");
    let skillValues = [];
    for (let i = 0; i < skillCheckboxes.length; i++) {
        if (skillCheckboxes[i].checked) {
            skillValues.push(skillCheckboxes[i].value);
        }
    }
    if (skillValues.length == 0) isValid = false;


    let aboutValue = aboutInput.value.trim();
    if (aboutValue.length < 20 || aboutValue.length > 200 || aboutValue == "") isValid = false;

    let photoFile = photoInput.files[0];
    let photoUrl = "";
    if (editId == null) {
        if (photoFile == undefined) isValid = false;
        else {
            let fileName = photoFile.name.toLowerCase();
            if (fileName.endsWith(".jpg") == false && fileName.endsWith(".jpeg") == false && fileName.endsWith(".png") == false) {
                isValid = false;
            } else {
                photoUrl = URL.createObjectURL(photoFile);
            }
        }
    } else {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id == editId) {
                photoUrl = students[i].photo;
            }
        }
        if (photoFile != undefined) {
            let fileName = photoFile.name.toLowerCase();
            if (!fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg") && !fileName.endsWith(".png")) isValid = false;
            else photoUrl = URL.createObjectURL(photoFile);
        }
    }

    if (isValid) {
        if (editId == null) {
            let newStudent = {
                id: Date.now(), name: nameValue, email: emailValue,
                phone: phoneValue, dob: dobValue, gender: genderValue,
                course: courseValue, skills: skillValues, about: aboutValue,
                photo: photoUrl
            };
            students.push(newStudent);
        } else {
            for (let i = 0; i < students.length; i++) {
                if (students[i].id == editId) {
                    students[i].name = nameValue;
                    students[i].email = emailValue;
                    students[i].phone = phoneValue;
                    students[i].dob = dobValue;
                    students[i].gender = genderValue;
                    students[i].course = courseValue;
                    students[i].skills = skillValues;
                    students[i].about = aboutValue;
                    students[i].photo = photoUrl;
                }
            }
            editId = null;
            addBtn.textContent = "Register Student";
        }
        form.reset();
        showCards();
        showStats();
    } else {
        alert("Please check your form. Some fields are invalid or missing.");
    }
});

function showCards() {
    cardsDiv.innerHTML = "";
    
    let searchText = searchInput.value.toLowerCase();
    let filterText = filterInput.value;

    for (let i = 0; i < students.length; i++) {
        let s = students[i];
        
        let matchSearch = false;
        if (s.name.toLowerCase().includes(searchText)) matchSearch = true;
        
        let matchFilter = false;
        if (filterText == "All Courses" || s.course == filterText) matchFilter = true;

        if (matchSearch && matchFilter) {
            let div = document.createElement("div");
            div.className = "student-card";
            div.setAttribute("data-id", s.id);

            let img = document.createElement("img");
            img.src = s.photo;
            div.appendChild(img);

            let h3 = document.createElement("h3");
            h3.textContent = s.name;
            div.appendChild(h3);

            let pEmail = document.createElement("p");
            pEmail.textContent = "Email: " + s.email;
            div.appendChild(pEmail);

            let pPhone = document.createElement("p");
            pPhone.textContent = "Phone: " + s.phone;
            div.appendChild(pPhone);

            let pDob = document.createElement("p");
            pDob.textContent = "DOB: " + s.dob;
            div.appendChild(pDob);

            let pGender = document.createElement("p");
            pGender.textContent = "Gender: " + s.gender;
            div.appendChild(pGender);

            let pCourse = document.createElement("p");
            pCourse.textContent = "Course: " + s.course;
            div.appendChild(pCourse);

            let pSkills = document.createElement("p");
            pSkills.textContent = "Skills: " + s.skills.join(", ");
            div.appendChild(pSkills);

            let pAbout = document.createElement("p");
            pAbout.textContent = "About: " + s.about;
            div.appendChild(pAbout);

            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";
            div.appendChild(editButton);

            let space = document.createTextNode(" ");
            div.appendChild(space);

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";
            div.appendChild(deleteButton);

            cardsDiv.appendChild(div);
        }
    }
    if (cardsDiv.innerHTML == "") cardsDiv.innerHTML = "<p>No students found</p>";
}

function showStats() {
    let total = students.length, web=0, ui=0, py=0, data=0, mern=0, cloud=0;
    for (let i = 0; i < students.length; i++) {
        let c = students[i].course;
        if (c == "Web Development") web++;
        if (c == "UI/UX") ui++;
        if (c == "Python") py++;
        if (c == "Data Analytics") data++;
        if (c == "MERN Stack") mern++;
        if (c == "Cloud Computing") cloud++;
    }
    document.getElementById("totalCount").textContent = "Total Students: " + total;
    document.getElementById("webCount").textContent = "Web Development: " + web;
    document.getElementById("uiCount").textContent = "UI/UX: " + ui;
    document.getElementById("pyCount").textContent = "Python: " + py;
    document.getElementById("dataCount").textContent = "Data Analytics: " + data;
    document.getElementById("mernCount").textContent = "MERN Stack: " + mern;
    document.getElementById("cloudCount").textContent = "Cloud Computing: " + cloud;
}

cardsDiv.addEventListener("click", function(event) {
    if (event.target.className == "delete-btn") {
        let card = event.target.closest(".student-card");
        let studentId = card.getAttribute("data-id");

        let confirmDelete = confirm("Are you sure you want to delete this student?");
        if (confirmDelete == true) {
            let newStudents = [];
            for (let i = 0; i < students.length; i++) {
                if (students[i].id != studentId) {
                    newStudents.push(students[i]);
                }
            }
            students = newStudents;
            showCards();
            showStats();
        }
    }

    if (event.target.className == "edit-btn") {
        let card = event.target.closest(".student-card");
        let studentId = card.getAttribute("data-id");
        editId = studentId; 

        for (let i = 0; i < students.length; i++) {
            if (students[i].id == studentId) {
                nameInput.value = students[i].name;
                emailInput.value = students[i].email;
                phoneInput.value = students[i].phone;
                dobInput.value = students[i].dob;
                courseInput.value = students[i].course;
                aboutInput.value = students[i].about;
                let genderRadios = document.getElementsByName("gender");
                for (let j = 0; j < genderRadios.length; j++) {
                    if (genderRadios[j].value == students[i].gender) {
                        genderRadios[j].checked = true;
                    }
                }

                let skillCheckboxes = document.getElementsByName("skill");
                for (let j = 0; j < skillCheckboxes.length; j++) {
                    skillCheckboxes[j].checked = false;
                    for (let k = 0; k < students[i].skills.length; k++) {
                        if (skillCheckboxes[j].value == students[i].skills[k]) {
                            skillCheckboxes[j].checked = true;
                        }
                    }
                }
            }
        }
        addBtn.textContent = "Update Student";
    }
});

searchInput.addEventListener("input", function() {
    showCards();
});

filterInput.addEventListener("change", function() {
    showCards();
});

showCards();
showStats();
