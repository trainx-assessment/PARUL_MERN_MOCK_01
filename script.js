const students = [];

const form = document.querySelector("#studentForm");

const studentContainer =
    document.querySelector("#studentContainer");


const nameInput =
    document.querySelector("#name");

const emailInput =
    document.querySelector("#email");

const phoneInput =
    document.querySelector("#phone");

const dobInput =
    document.querySelector("#dob");

const courseInput =
    document.querySelector("#course");

const aboutInput =
    document.querySelector("#about");

const photoInput =
    document.querySelector("#photo");

const searchInput =
    document.querySelector("#search");

const filterInput =
    document.querySelector("#filter");

const submitButton =
    document.querySelector("#submitButton");

const counter =
    document.querySelector("#counter");


let editId = null;



aboutInput.addEventListener("input", function () {

    counter.textContent =
        aboutInput.value.length + " / 200";

});


form.addEventListener("submit", function (event) {

    event.preventDefault();


    const name = nameInput.value.trim();

    const email = emailInput.value.trim();

    const phone = phoneInput.value.trim();

    const dob = dobInput.value;

    const course = courseInput.value;

    const about = aboutInput.value.trim();




    const namePattern = /^[A-Za-z ]+$/;


    if (name === "") {


        return;
    }


    if (name.length < 3 || name.length > 40) {

        return;
    }


    if (!namePattern.test(name)) {


        return;
    }




    if (email === "") {


        return;
    }


    if (!email.includes("@") || !email.includes(".")) {


        return;
    }



    const phonePattern = /^[0-9]{10}$/;  //yaha regex


    if (phone === "") {


        return;
    }


    if (!phonePattern.test(phone)) {

        alert("Phone must contain exactly 10 digits");

        return;
    }




    if (dob === "") {


        return;
    }


    const today = new Date();

    const selectedDate = new Date(dob);


    if (selectedDate > today) {


        return;
    }



    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );


    if (!gender) {


        return;
    }



    if (course === "") {


        return;
    }



    const selectedSkills =
        document.querySelectorAll(
            'input[type="checkbox"]:checked'
        );


    if (selectedSkills.length === 0) {

        return;
    }


    const skills = [];


    selectedSkills.forEach(function (skill) {

        skills.push(skill.value);

    });




    if (about === "") {



        return;
    }


    if (about.length < 20) {

        return;
    }


    if (about.length > 200) {


        return;
    }




    if (
        photoInput.files.length === 0 &&
        editId === null
    ) {


        return;
    }

    if (editId !== null) {

        const student =
            students.find(function (student) {

                return student.id === editId;

            });


        student.name = name;

        student.email = email;

        student.phone = phone;

        student.dob = dob;

        student.gender = gender.value;

        student.course = course;

        student.skills = skills;

        student.about = about;


        editId = null;

        submitButton.textContent =
            "Register Student";

    }


    else {

        const student = {

            id: Date.now(),

            name: name,

            email: email,

            phone: phone,

            dob: dob,

            gender: gender.value,

            course: course,

            skills: skills,

            about: about

        };


        students.push(student);

    }


    displayStudents();

    updateStatistics();

    form.reset();

    counter.textContent = "0 / 200";

});




function displayStudents() {

    studentContainer.innerHTML = "";


    const searchText =
        searchInput.value.toLowerCase();


    const selectedCourse =
        filterInput.value;


    const filteredStudents =
        students.filter(function (student) {

            const nameMatch =
                student.name
                    .toLowerCase()
                    .includes(searchText);


            const courseMatch =
                selectedCourse === "All Courses" ||
                student.course === selectedCourse;


            return nameMatch && courseMatch;

        });


    if (filteredStudents.length === 0) {

        studentContainer.innerHTML =
            "<p>No students found</p>";

        return;
    }


    filteredStudents.forEach(function (student) {

        createStudentCard(student);

    });

}

function createStudentCard(student) {

    const card =
        document.createElement("div");


    card.classList.add("student-card");


    card.setAttribute(
        "data-id",
        student.id
    );


    const heading =
        document.createElement("h3");


    heading.textContent =
        student.name;


    const email =
        document.createElement("p");


    email.textContent =
        "Email: " + student.email;


    const phone =
        document.createElement("p");


    phone.textContent =
        "Phone: " + student.phone;


    const dob =
        document.createElement("p");


    dob.textContent =
        "DOB: " + student.dob;


    const gender =
        document.createElement("p");


    gender.textContent =
        "Gender: " + student.gender;


    const course =
        document.createElement("p");


    course.textContent =
        "Course: " + student.course;


    const skills =
        document.createElement("p");


    skills.textContent =
        "Skills: " +
        student.skills.join(", ");


    const about =
        document.createElement("p");


    about.textContent =
        "About: " + student.about;


    const editButton =
        document.createElement("button");


    editButton.textContent =
        "Edit";


    editButton.classList.add(
        "edit-btn"
    );


    editButton.type = "button";


    const deleteButton =
        document.createElement("button");


    deleteButton.textContent =
        "Delete";


    deleteButton.classList.add(
        "delete-btn"
    );


    deleteButton.type = "button";


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


    studentContainer.appendChild(card);

}


studentContainer.addEventListener(
    "click",
    function (event) {


        const card =
            event.target.closest(
                ".student-card"
            );


        if (!card) {

            return;

        }


        const id =
            Number(
                card.getAttribute("data-id")
            );



        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {


            const answer =
                confirm(
                    "Are you sure you want to delete this student?"
                );


            if (!answer) {

                return;

            }


            const index =
                students.findIndex(
                    function (student) {

                        return student.id === id;

                    }
                );


            if (index !== -1) {

                students.splice(index, 1);

            }


            displayStudents();

            updateStatistics();

        }




        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {


            const student =
                students.find(
                    function (student) {

                        return student.id === id;

                    }
                );


            if (!student) {

                return;

            }


            nameInput.value =
                student.name;


            emailInput.value =
                student.email;


            phoneInput.value =
                student.phone;


            dobInput.value =
                student.dob;


            courseInput.value =
                student.course;


            aboutInput.value =
                student.about;


            counter.textContent =
                aboutInput.value.length +
                " / 200";


            const genderInputs =
                document.querySelectorAll(
                    'input[name="gender"]'
                );


            genderInputs.forEach(
                function (input) {

                    if (
                        input.value ===
                        student.gender
                    ) {

                        input.checked = true;

                    }

                }
            );


            const skillInputs =
                document.querySelectorAll(
                    'input[type="checkbox"]'
                );


            skillInputs.forEach(
                function (input) {

                    if (
                        student.skills.includes(
                            input.value
                        )
                    ) {

                        input.checked = true;

                    } else {

                        input.checked = false;

                    }

                }
            );


            editId = student.id;


            submitButton.textContent =
                "Update Student";


            window.scrollTo(0, 0);

        }

    }
);




searchInput.addEventListener(
    "input",
    function () {

        displayStudents();

    }
);




filterInput.addEventListener(
    "change",
    function () {

        displayStudents();

    }
);




function updateStatistics() {


    document.querySelector(
        "#totalStudents"
    ).textContent =
        "Total Students: " +
        students.length;


    let web = 0;

    let ui = 0;

    let python = 0;

    let data = 0;

    let mern = 0;

    let cloud = 0;


    students.forEach(function (student) {


        if (
            student.course ===
            "Web Development"
        ) {

            web++;

        }


        if (
            student.course ===
            "UI/UX"
        ) {

            ui++;

        }


        if (
            student.course ===
            "Python"
        ) {

            python++;

        }


        if (
            student.course ===
            "Data Analytics"
        ) {

            data++;

        }


        if (
            student.course ===
            "MERN Stack"
        ) {

            mern++;

        }


        if (
            student.course ===
            "Cloud Computing"
        ) {

            cloud++;

        }

    });


    document.querySelector(
        "#webCount"
    ).textContent =
        "Web Development: " + web;


    document.querySelector(
        "#uiCount"
    ).textContent =
        "UI/UX: " + ui;


    document.querySelector(
        "#pythonCount"
    ).textContent =
        "Python: " + python;


    document.querySelector(
        "#dataCount"
    ).textContent =
        "Data Analytics: " + data;


    document.querySelector(
        "#mernCount"
    ).textContent =
        "MERN Stack: " + mern;


    document.querySelector(
        "#cloudCount"
    ).textContent =
        "Cloud Computing: " + cloud;

}



form.addEventListener(
    "reset",
    function () {

        editId = null;

        submitButton.textContent =
            "Register Student";

        counter.textContent =
            "0 / 200";

    }
);