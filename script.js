
const form = document.getElementById("studentForm");
const studentContainer =document.getElementById("studentContainer");
const searchInput =document.getElementById("searchInput");
const filterCourse =document.getElementById("filterCourse");
const statistics=document.getElementById("statistics");
const noStudents =document.getElementById("noStudents");
const about =document.getElementById("about");
const charCount =document.getElementById("charCount");
const photo =document.getElementById("photo");
const photoPreview =document.getElementById("photoPreview");
const submitBtn =document.getElementById("submitBtn");
const themeBtn =document.getElementById("themeBtn");
let students =JSON.parse(localStorage.getItem("students")) || [];
let editId=null;
let selectedPhoto = "";



const courses = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];



function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}




function showError(id, message) {
    document.getElementById(id).textContent =
        message;
}



function clearErrors() {
    document.querySelectorAll(".error")
        .forEach(error => {
            error.textContent = "";
        });
}




/* gender wala part */
function getGender() {
    const selected =
        document.querySelector(
            'input[name="gender"]:checked'
        );
    return selected
        ? selected.value
        : "";
}

function getSkills() {
    return [
        ...document.querySelectorAll(
            'input[name="skills"]:checked'
        )
    ].map(skill => skill.value);

}




function validateForm() {
    clearErrors();
    const name =
        document.getElementById("studentName")
            .value.trim();
    const email =
        document.getElementById("email")
            .value.trim();
    const phone =
        document.getElementById("phone")
            .value.trim();
    const dob =
        document.getElementById("dob")
            .value;
    const gender =
        getGender();
    const course =
        document.getElementById("course")
            .value;
    const skills =
        getSkills();
    const aboutText =
        about.value.trim();
    const photoFile =
        photo.files[0];
    let valid = true;
    const nameRegex =
        /^[A-Za-z ]+$/;
    const phoneRegex =
        /^\d{10}$/;
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) {
        showError(
            "nameError",
            "Name is required."
        );
        valid = false;
    }
    else if (name.length < 3) {
        showError(
            "nameError",
            "Minimum 3 characters."
        );
        valid = false;
    }
    else if (name.length > 40) {
        showError(
            "nameError",
            "Maximum 40 characters."
        );
        valid = false;
    }
    else if (!nameRegex.test(name)) {
        showError("nameError","Only letters and spaces allowed."
        );
        valid = false;

    }
    if (!email){
        showError(
            "emailError",
            "Email is required."
        );
        valid = false;
    }
    else if (!emailRegex.test(email)) {
        showError(
            "emailError",
            "Enter a valid email."
        );
        valid = false;
    }
    if (!phone) {
        showError(
            "phoneError",
            "Phone is required."
        );
        valid = false;
    }
    else if (!phoneRegex.test(phone)) {
        showError(
            "phoneError",
            "Enter exactly 10 digits."
        );

        valid = false;
    }

    if (!dob) {

        showError(
            "dobError",
            "Date of birth is required."
        );

        valid = false;

    }else {
        const birthDate =
            new Date(dob + "T00:00:00");

        const today =
            new Date();
        if(birthDate > today) {
            showError(
                "dobError",
                "Future dates are not allowed."
            );

            valid = false;
        }
        let age =
            today.getFullYear()
            - birthDate.getFullYear();
        const monthDifference =
            today.getMonth()
            - birthDate.getMonth();
        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }
        if(age < 15) {
            showError(
                "dobError",
                "Student must be at least 15 years old."
            );
            valid = false;
        }

    }
    if (!gender) {
        showError(
            "genderError",
            "Select a gender."
        );
        valid = false;

    }
    if (!course) {
        showError(
            "courseError",
            "Select a course."
        );
        valid = false;

    }
    if (skills.length === 0) {
        showError(
            "skillsError",
            "Select at least one skill."
        );
        valid = false;
    }
    if (!aboutText) {
        showError(
            "aboutError",
            "About section is required."
        );
        valid = false;
    }
    else if (aboutText.length < 20) {
        showError(
            "aboutError",
            "Minimum 20 characters required."
        );
        valid = false;
    }
    if (!photoFile && !selectedPhoto) {
        showError(
            "photoError",
            "Profile photo is required."
        );
        valid = false;
    }
    else if (photoFile) {
        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];
        if (!allowedTypes.includes(photoFile.type)) {
            showError(
                "photoError",
                "Only JPG, JPEG and PNG allowed."
            );

            valid = false;

        }

    }
    return valid;

}

function readPhoto(file) {
    return new Promise(resolve => {
        if (!file) {
            resolve(selectedPhoto);
            return;
        }
        const reader =
            new FileReader();
        reader.onload =
            function (event) {
                resolve(
                    event.target.result
                );
            };
        reader.readAsDataURL(file);
    });

}

form.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        if (!validateForm()) {

            return;

        }
        const name =
            document.getElementById("studentName")
                .value.trim();
        const email =
            document.getElementById("email")
                .value.trim();
        const phone =
            document.getElementById("phone")
                .value.trim();
        const dob =
            document.getElementById("dob")
                .value;
        const gender =
            getGender();
        const course =
            document.getElementById("course")
                .value;
        const skills =
            getSkills();
        const aboutText =
            about.value.trim();
        const photoData =
            await readPhoto(photo.files[0]);
        if (editId === null) {

            const student = {

                id: Date.now(),

                name: name,

                email: email,

                phone: phone,

                dob: dob,

                gender: gender,

                course: course,

                skills: skills,

                about: aboutText,

                photo: photoData

            };


            students.push(student);

        }

        else {

            const student =
                students.find(
                    s => s.id === editId
                );


            if (student) {

                student.name = name;

                student.email = email;

                student.phone = phone;

                student.dob = dob;

                student.gender = gender;

                student.course = course;

                student.skills = skills;

                student.about = aboutText;

                student.photo = photoData;

            }

        }


        saveStudents();

        renderStudents();

        updateStatistics();

        resetForm();

    }
);

form.addEventListener(
    "reset",
    function () {

        setTimeout(
            resetForm,
            0
        );

    }
);


function resetForm() {

    form.reset();

    clearErrors();

    charCount.textContent = "0";

    photoPreview.style.display =
        "none";

    photoPreview.src = "";

    selectedPhoto = "";

    editId = null;

    submitBtn.textContent =
        "Register Student";

}

about.addEventListener(
    "input",
    function () {

        charCount.textContent =
            about.value.length;

    }
);

photo.addEventListener(
    "change",
    function () {

        const file =
            photo.files[0];


        if (!file) {

            return;

        }


        const allowedTypes = [
            "image/jpeg",
            "image/png"
        ];


        if (!allowedTypes.includes(file.type)) {

            showError(
                "photoError",
                "Only JPG and PNG allowed."
            );

            photo.value = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                selectedPhoto =
                    event.target.result;


                photoPreview.src =
                    selectedPhoto;


                photoPreview.style.display =
                    "block";

            };


        reader.readAsDataURL(file);

    }
);

searchInput.addEventListener(
    "input",
    renderStudents
);



filterCourse.addEventListener(
    "change",
    renderStudents
);


studentContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target;


        /* Delete */

        if (
            button.classList.contains(
                "delete-btn"
            )
        ) {

            const card =
                button.closest(
                    ".student-card"
                );


            const id =
                Number(card.dataset.id);


            if (
                confirm(
                    "Are you sure you want to delete this student?"
                )
            ) {

                students =
                    students.filter(
                        student =>
                            student.id !== id
                    );


                saveStudents();

                renderStudents();

                updateStatistics();

            }

        }


        /* Edit */

        if (
            button.classList.contains(
                "edit-btn"
            )
        ) {

            const card =
                button.closest(
                    ".student-card"
                );


            const id =
                Number(card.dataset.id);


            editStudent(id);

        }

    }
);

function renderStudents() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const course =
        filterCourse.value;


    studentContainer.innerHTML = "";


    const filteredStudents =
        students.filter(student => {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search);


            const matchesCourse =
                course === ""
                ||
                student.course === course;


            return (
                matchesSearch &&
                matchesCourse
            );

        });


    if (filteredStudents.length === 0) {

        noStudents.style.display =
            "block";

    }

    else {

        noStudents.style.display =
            "none";

    }


    filteredStudents.forEach(
        student => {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "student-card"
            );
            card.dataset.id =
                student.id;
            const img =
                document.createElement(
                    "img"
                );
            img.src =
                student.photo;


            img.alt =
                student.name;


            const content =
                document.createElement(
                    "div"
                );


            content.classList.add(
                "card-content"
            );


            content.innerHTML = `

                <h3>
                    ${escapeHTML(student.name)}
                </h3>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(student.email)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(student.phone)}
                </p>

                <p>
                    <strong>DOB:</strong>
                    ${escapeHTML(student.dob)}
                </p>

                <p>
                    <strong>Gender:</strong>
                    ${escapeHTML(student.gender)}
                </p>

                <p>
                    <strong>Course:</strong>
                    ${escapeHTML(student.course)}
                </p>

                <p>
                    <strong>Skills:</strong>
                    ${student.skills
                    .map(escapeHTML)
                    .join(", ")}
                </p>

                <p>
                    <strong>About:</strong>
                    ${escapeHTML(student.about)}
                </p>

            `;


            const buttons =
                document.createElement(
                    "div"
                );


            buttons.classList.add(
                "card-buttons"
            );


            const editButton =
                document.createElement(
                    "button"
                );


            editButton.classList.add(
                "edit-btn"
            );


            editButton.textContent =
                "Edit";


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.classList.add(
                "delete-btn"
            );


            deleteButton.textContent =
                "Delete";


            buttons.append(
                editButton,
                deleteButton
            );


            content.appendChild(
                buttons
            );


            card.append(
                img,
                content
            );


            studentContainer.appendChild(
                card
            );

        }
    );

}
function editStudent(id) {

    const student =
        students.find(
            s => s.id === id
        );
    if (!student) {

        return;

    }
    editId = id;
    document.getElementById(
        "studentName"
    ).value = student.name;


    document.getElementById(
        "email"
    ).value = student.email;


    document.getElementById(
        "phone"
    ).value = student.phone;


    document.getElementById(
        "dob"
    ).value = student.dob;


    document.getElementById(
        "course"
    ).value = student.course;


    about.value =
        student.about;


    charCount.textContent =
        about.value.length;

    document
        .querySelectorAll(
            'input[name="gender"]'
        )
        .forEach(radio => {

            radio.checked =
                radio.value ===
                student.gender;

        });
    document
        .querySelectorAll(
            'input[name="skills"]'
        )
        .forEach(checkbox => {

            checkbox.checked =
                student.skills.includes(
                    checkbox.value
                );
        });
    selectedPhoto =
        student.photo;

    photo.value = "";

    photoPreview.src =
        student.photo;


    photoPreview.style.display =
        "block";


    submitBtn.textContent =
        "Update Student";


    window.scrollTo({
        top: 0,

        behavior: "smooth"

    });

}

function updateStatistics() {

    statistics.innerHTML = "";

    const total =
        document.createElement(
            "div"
        );


    total.classList.add(
        "stat"
    );


    total.innerHTML = `
        <strong>${students.length}</strong>
        Total Students
    `;


    statistics.appendChild(
        total
    );

    courses.forEach(course => {

        const count =
            students.filter(
                student =>
                    student.course === course
            ).length;


        const stat =
            document.createElement(
                "div"
            );


        stat.classList.add(
            "stat"
        );


        stat.innerHTML = `
            <strong>${count}</strong>
            ${course}
        `;


        statistics.appendChild(
            stat
        );

    });

}

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}

renderStudents();

updateStatistics();