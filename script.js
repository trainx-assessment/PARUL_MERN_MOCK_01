 const form = document.querySelector("#studentForm");

const container = document.querySelector("#studentContainer");

const counter = document.querySelector("#counter");

let students = [];

 

form.addEventListener("submit", function(event) {

    event.preventDefault();


    let name = document.querySelector("#studentName").value.trim();

    let email = document.querySelector("#email").value.trim();

    let phone = document.querySelector("#phone").value.trim();

    let dob = document.querySelector("#dob").value;

    let course = document.querySelector("#course").value;

    let about = document.querySelector("#about").value.trim();

    let photo = document.querySelector("#photo").files[0];


    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );


    let skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );

 

    if (name == "") {
        alert("Enter student name");
        return;
    }

    if (name.length < 3 || name.length > 40) {
        alert("Name must be 3 to 40 characters");
        return;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
        alert("Name should contain only letters");
        return;
    }

 

    if (email == "") {
        alert("Enter email");
        return;
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter valid email");
        return;
    }


 

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone must contain 10 digits");
        return;
    }

 

    if (dob == "") {
        alert("Select date of birth");
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



    if (about.length < 20 || about.length > 200) {
        alert("About must be 20 to 200 characters");
        return;
    }


   

    if (!photo) {
        alert("Select profile photo");
        return;
    }


    if (!photo.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
    }



    let skillList = [];

    skills.forEach(function(skill) {

        skillList.push(skill.value);

    });


   

    let photoURL = URL.createObjectURL(photo);

 

    let student = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        dob: dob,

        gender: gender.value,

        course: course,

        skills: skillList,

        about: about,

        photo: photoURL

    };



    students.push(student);



    showStudents();



    updateCount();


    form.reset();

    counter.textContent = "0 / 200";

});

 

function showStudents() {

    container.innerHTML = "";


    students.forEach(function(student) {


        let card = document.createElement("div");

        card.classList.add("student-card");

        card.setAttribute("data-id", student.id);


        let image = document.createElement("img");

        image.src = student.photo;

        image.classList.add("student-photo");


        let heading = document.createElement("h3");

        heading.textContent = student.name;


        let email = document.createElement("p");

        email.textContent = "Email: " + student.email;


        let phone = document.createElement("p");

        phone.textContent = "Phone: " + student.phone;


        let dob = document.createElement("p");

        dob.textContent = "DOB: " + student.dob;


        let gender = document.createElement("p");

        gender.textContent = "Gender: " + student.gender;


        let course = document.createElement("p");

        course.textContent = "Course: " + student.course;


        let skills = document.createElement("p");

        skills.textContent =
            "Skills: " + student.skills.join(", ");


        let about = document.createElement("p");

        about.textContent = "About: " + student.about;


        let editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.classList.add("edit-btn");


        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-btn");


        card.appendChild(image);

        card.appendChild(heading);

        card.appendChild(email);

        card.appendChild(phone);

        card.appendChild(dob);

        card.appendChild(gender);

        card.appendChild(course);

        card.appendChild(skills);

        card.appendChild(about);

        card.appendChild(editButton);

        card.appendChild(deleteButton);


        container.appendChild(card);

    });

}



function updateCount() {

    document.querySelector("#totalStudents").textContent =
        students.length;

}


document.querySelector("#about").addEventListener("input",
    function() {

        counter.textContent = this.value.length + " / 200";

    }
);