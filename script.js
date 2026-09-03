const form = document.querySelector("#studentForm");

const studentName = document.querySelector("#studentName");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const course = document.querySelector("#course");
const about = document.querySelector("#about");
const photo = document.querySelector("#photo");

const studentContainer = document.querySelector("#studentContainer");
const searchInput = document.querySelector("#searchInput");
const filterCourse = document.querySelector("#filterCourse");

const submitBtn = document.querySelector("#submitBtn");
const resetBtn = document.querySelector("#resetBtn");

const charCount = document.querySelector("#charCount");
const emptyMessage = document.querySelector("#emptyMessage");
const resultCount = document.querySelector("#resultCount");

const themeBtn = document.querySelector("#themeBtn");

const STORAGE_KEY = "students";

let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;
let editingPhoto = "";


function saveStudents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}


function setError(field, message) {
    const error = document.querySelector(`[data-error="${field}"]`);

    if (error) {
        error.textContent = message;
    }
}


function clearErrors() {
    document.querySelectorAll(".error").forEach((error) => {
        error.textContent = "";
    });
}


function getGender() {
    const selected = document.querySelector(
        'input[name="gender"]:checked'
    );

    return selected ? selected.value : "";
}


function getSkills() {
    return [...document.querySelectorAll(
        'input[name="skills"]:checked'
    )].map((skill) => skill.value);
}


function calculateAge(date) {
    const birthDate = new Date(`${date}T00:00:00`);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const month =
        today.getMonth() - birthDate.getMonth();

    if (
        month < 0 ||
        (month === 0 &&
            today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}


function validateForm() {

    clearErrors();

    let valid = true;

    const nameValue = studentName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value;
    const genderValue = getGender();
    const courseValue = course.value;
    const skillsValue = getSkills();
    const aboutValue = about.value.trim();
    const photoFile = photo.files[0];


    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Name
    if (!nameValue) {

        setError(
            "studentName",
            "Student name is required."
        );

        valid = false;

    } else if (
        nameValue.length < 3 ||
        nameValue.length > 40
    ) {

        setError(
            "studentName",
            "Name must be between 3 and 40 characters."
        );

        valid = false;

    } else if (!nameRegex.test(nameValue)) {

        setError(
            "studentName",
            "Only letters and spaces are allowed."
        );

        valid = false;
    }


    // Email
    if (!emailValue) {

        setError(
            "email",
            "Email is required."
        );

        valid = false;

    } else if (!emailRegex.test(emailValue)) {

        setError(
            "email",
            "Enter a valid email address."
        );

        valid = false;
    }


    // Phone
    if (!phoneValue) {

        setError(
            "phone",
            "Phone number is required."
        );

        valid = false;

    } else if (!phoneRegex.test(phoneValue)) {

        setError(
            "phone",
            "Phone must contain exactly 10 digits."
        );

        valid = false;
    }


    // DOB
    if (!dobValue) {

        setError(
            "dob",
            "Date of birth is required."
        );

        valid = false;

    } else {

        const selectedDate =
            new Date(`${dobValue}T00:00:00`);

        const today = new Date();

        if (selectedDate > today) {

            setError(
                "dob",
                "Future dates are not allowed."
            );

            valid = false;

        } else if (calculateAge(dobValue) < 15) {

            setError(
                "dob",
                "Student must be at least 15 years old."
            );

            valid = false;
        }
    }


    // Gender
    if (!genderValue) {

        setError(
            "gender",
            "Please select a gender."
        );

        valid = false;
    }


    // Course
    if (!courseValue) {

        setError(
            "course",
            "Please select a course."
        );

        valid = false;
    }


    // Skills
    if (skillsValue.length === 0) {

        setError(
            "skills",
            "Select at least one skill."
        );

        valid = false;
    }


    // About
    if (!aboutValue) {

        setError(
            "about",
            "About Student is required."
        );

        valid = false;

    } else if (
        aboutValue.length < 20 ||
        aboutValue.length > 200
    ) {

        setError(
            "about",
            "About must be between 20 and 200 characters."
        );

        valid = false;
    }


    // Photo
    if (!editingId && !photoFile) {

        setError(
            "photo",
            "Profile photo is required."
        );

        valid = false;

    } else if (
        photoFile &&
        !["image/jpeg", "image/png"].includes(
            photoFile.type
        )
    ) {

        setError(
            "photo",
            "Only JPG, JPEG and PNG images are allowed."
        );

        valid = false;
    }


    return valid;
}


function readPhoto(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
}


function formatDate(date) {

    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString("en-GB");
}


function renderStudents() {

    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedCourse =
        filterCourse.value;


    const filteredStudents =
        students.filter((student) => {

            const nameMatches =
                student.name
                    .toLowerCase()
                    .includes(searchText);

            const courseMatches =
                selectedCourse === "All Courses" ||
                student.course === selectedCourse;

            return nameMatches && courseMatches;
        });


    studentContainer.innerHTML = "";


    filteredStudents.forEach((student) => {

        const card =
            document.createElement("article");

        card.classList.add("student-card");

        card.setAttribute(
            "data-id",
            student.id
        );


        const image =
            document.createElement("img");

        image.setAttribute(
            "src",
            student.photo
        );

        image.setAttribute(
            "alt",
            `${student.name} profile photo`
        );


        const heading =
            document.createElement("h3");

        heading.textContent =
            student.name;


        const info =
            document.createElement("div");

        info.classList.add("student-info");


        const details = [
            ["Email", student.email],
            ["Phone", student.phone],
            ["DOB", formatDate(student.dob)],
            ["Gender", student.gender],
            ["Course", student.course]
        ];


        details.forEach(([label, value]) => {

            const line =
                document.createElement("div");

            const strong =
                document.createElement("strong");

            strong.textContent =
                `${label}: `;

            line.appendChild(strong);

            line.appendChild(
                document.createTextNode(value)
            );

            info.appendChild(line);
        });


        const skills =
            document.createElement("div");

        skills.classList.add("skills");

        const skillStrong =
            document.createElement("strong");

        skillStrong.textContent =
            "Skills: ";

        skills.appendChild(skillStrong);

        skills.appendChild(
            document.createTextNode(
                student.skills.join(", ")
            )
        );


        const aboutText =
            document.createElement("p");

        aboutText.classList.add("about");

        const aboutStrong =
            document.createElement("strong");

        aboutStrong.textContent =
            "About: ";

        aboutText.appendChild(aboutStrong);

        aboutText.appendChild(
            document.createTextNode(student.about)
        );


        const buttons =
            document.createElement("div");

        buttons.classList.add("card-buttons");


        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.classList.add("edit-btn");

        editButton.dataset.action = "edit";

        editButton.textContent = "Edit";


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.classList.add("delete-btn");

        deleteButton.dataset.action = "delete";

        deleteButton.textContent = "Delete";


        buttons.append(
            editButton,
            deleteButton
        );


        card.append(
            image,
            heading,
            info,
            skills,
            aboutText,
            buttons
        );


        studentContainer.appendChild(card);
    });


    resultCount.textContent =
        `${filteredStudents.length} student${
            filteredStudents.length === 1
                ? ""
                : "s"
        }`;


    if (filteredStudents.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";
    }
}


function updateStats() {

    document.querySelector("#totalStudents")
        .textContent = students.length;


    document.querySelector("#webCount")
        .textContent =
        students.filter(
            (student) =>
                student.course === "Web Development"
        ).length;


    document.querySelector("#uiuxCount")
        .textContent =
        students.filter(
            (student) =>
                student.course === "UI/UX"
        ).length;


    document.querySelector("#pythonCount")
        .textContent =
        students.filter(
            (student) =>
                student.course === "Python"
        ).length;


    document.querySelector("#dataCount")
        .textContent =
        students.filter(
            (student) =>
                student.course === "Data Analytics"
        ).length;


    document.querySelector("#mernCount")
        .textContent =
        students.filter(
            (student) =>
                student.course === "MERN Stack"
        ).length;


    document.querySelector("#cloudCount")
        .textContent =
        students.filter(
            (student) =>
                student.course === "Cloud Computing"
        ).length;
}


function resetForm() {

    form.reset();

    clearErrors();

    charCount.textContent = "0";

    editingId = null;

    editingPhoto = "";

    submitBtn.textContent =
        "Register Student";

    document.querySelector("#formTitle")
        .textContent =
        "Student Registration";
}


function editStudent(id) {

    const student =
        students.find(
            (item) => item.id === id
        );

    if (!student) return;


    editingId = id;

    editingPhoto = student.photo;


    studentName.value =
        student.name;

    email.value =
        student.email;

    phone.value =
        student.phone;

    dob.value =
        student.dob;

    course.value =
        student.course;

    about.value =
        student.about;


    document.querySelector(
        `input[name="gender"][value="${student.gender}"]`
    ).checked = true;


    document.querySelectorAll(
        'input[name="skills"]'
    ).forEach((checkbox) => {

        checkbox.checked =
            student.skills.includes(
                checkbox.value
            );
    });


    charCount.textContent =
        about.value.length;


    photo.value = "";


    submitBtn.textContent =
        "Update Student";


    document.querySelector("#formTitle")
        .textContent =
        "Edit Student";


    clearErrors();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        const photoFile =
            photo.files[0];


        let photoData =
            editingPhoto;


        if (photoFile) {

            photoData =
                await readPhoto(photoFile);
        }


        const studentData = {

            name: studentName.value.trim(),

            email: email.value.trim(),

            phone: phone.value.trim(),

            dob: dob.value,

            gender: getGender(),

            course: course.value,

            skills: getSkills(),

            about: about.value.trim(),

            photo: photoData
        };


        if (editingId) {

            const student =
                students.find(
                    (item) =>
                        item.id === editingId
                );

            Object.assign(
                student,
                studentData
            );

        } else {

            const newStudent = {

                id: Date.now(),

                ...studentData
            };


            students.push(newStudent);
        }


        saveStudents();

        renderStudents();

        updateStats();

        resetForm();
    }
);


studentContainer.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");

        if (!button) return;


        const card =
            event.target.closest(".student-card");

        if (!card) return;


        const id =
            Number(card.dataset.id);


        if (
            button.dataset.action ===
            "delete"
        ) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this student?"
                );


            if (!confirmed) return;


            students =
                students.filter(
                    (student) =>
                        student.id !== id
                );


            saveStudents();

            renderStudents();

            updateStats();


            if (editingId === id) {
                resetForm();
            }
        }


        if (
            button.dataset.action ===
            "edit"
        ) {

            editStudent(id);
        }
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


about.addEventListener(
    "input",
    function () {

        charCount.textContent =
            about.value.length;
    }
);


resetBtn.addEventListener(
    "click",
    resetForm
);


themeBtn.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        const darkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        themeBtn.textContent =
            darkMode
                ? "Light Mode"
                : "Dark Mode";


        localStorage.setItem(
            "darkMode",
            darkMode
        );
    }
);


if (
    localStorage.getItem("darkMode") ===
    "true"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeBtn.textContent =
        "Light Mode";
}


renderStudents();
updateStats();