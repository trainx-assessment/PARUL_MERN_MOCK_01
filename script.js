const STORAGE_KEY = "studentApplicationManagementStudents";
const THEME_KEY = "studentApplicationManagementTheme";

let students = loadStudents();
let editingStudentId = null;

const form = document.querySelector("#studentForm");

const studentName = document.querySelector("#studentName");
const studentEmail = document.querySelector("#studentEmail");
const studentPhone = document.querySelector("#studentPhone");
const studentDob = document.querySelector("#studentDob");
const studentCourse = document.querySelector("#studentCourse");
const studentAbout = document.querySelector("#studentAbout");
const studentPhoto = document.querySelector("#studentPhoto");

const studentContainer =
    document.querySelector("#studentContainer");

const searchInput =
    document.querySelector("#searchInput");

const courseFilter =
    document.querySelector("#courseFilter");

const submitButton =
    document.querySelector("#submitButton");

const resetButton =
    document.querySelector("#resetButton");

const characterCounter =
    document.querySelector("#characterCounter");

const statsContainer =
    document.querySelector("#statsContainer");

const resultCount =
    document.querySelector("#resultCount");

const formMode =
    document.querySelector("#formMode");

const themeToggle =
    document.querySelector("#themeToggle");


const courseNames = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];


document.addEventListener("DOMContentLoaded", () => {

    

    setDateMaximum();

    updateCharacterCounter();

    renderStudents();

    updateStatistics();

});


form.addEventListener("submit", async (event) => {

    event.preventDefault();

    clearValidationMessages();


    const validation = validateForm();




    if (!validation.isValid) {

        displayValidationMessages(
            validation.errors
        );

        return;
    }




    const photoData = await getPhotoData();




    if (editingStudentId !== null) {

        const studentIndex =
            students.findIndex(
                (student) =>
                    student.id === editingStudentId
            );


        if (studentIndex !== -1) {

            const existingPhoto =
                students[studentIndex].photo;


            students[studentIndex] = {

                ...students[studentIndex],

                ...validation.data,

                photo:
                    photoData || existingPhoto

            };

        }

    }




    else {

        const newStudent = {

            id: generateUniqueId(),

            ...validation.data,

            photo: photoData

        };


        students.push(newStudent);

    }



    saveStudents();




    renderStudents();

    updateStatistics();



    resetForm();

});




resetButton.addEventListener(
    "click",
    resetForm
);




studentAbout.addEventListener(
    "input",
    updateCharacterCounter
);




searchInput.addEventListener(
    "input",
    renderStudents
);

courseFilter.addEventListener(
    "change",
    renderStudents
);

studentContainer.addEventListener(
    "click",
    (event) => {



        const deleteButton =
            event.target.closest(".delete-btn");



        const editButton =
            event.target.closest(".edit-btn");




        const studentCard =
            event.target.closest(".student-card");


        if (!studentCard) {
            return;
        }




        const studentId =
            Number(studentCard.dataset.id);



        if (deleteButton) {

            deleteStudent(studentId);

        }




        if (editButton) {

            editStudent(studentId);

        }

    }
);

function validateForm() {

    const errors = {};



    const name =
        studentName.value.trim();

    const email =
        studentEmail.value.trim();

    const phone =
        studentPhone.value.trim();

    const dob =
        studentDob.value;

    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        )?.value || "";

    const course =
        studentCourse.value;

    const skills =
        [
            ...document.querySelectorAll(
                'input[name="skills"]:checked'
            )
        ].map(
            (checkbox) =>
                checkbox.value
        );

    const about =
        studentAbout.value.trim();

    const photo =
        studentPhoto.files[0];



    const nameRegex =
        /^[A-Za-z ]+$/;


    const phoneRegex =
        /^\d{10}$/;


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!name) {

        errors.studentName =
            "Student name is required.";

    }

    else if (name.length < 3) {

        errors.studentName =
            "Student name must be at least 3 characters.";

    }

    else if (name.length > 40) {

        errors.studentName =
            "Student name must not exceed 40 characters.";

    }

    else if (!nameRegex.test(name)) {

        errors.studentName =
            "Name may contain only letters and spaces.";

    }




    if (!email) {

        errors.studentEmail =
            "Email is required.";

    }

    else if (!emailRegex.test(email)) {

        errors.studentEmail =
            "Enter a valid email address.";

    }



    if (!phone) {

        errors.studentPhone =
            "Phone number is required.";

    }

    else if (!phoneRegex.test(phone)) {

        errors.studentPhone =
            "Phone number must contain exactly 10 digits.";

    }




    if (!dob) {

        errors.studentDob =
            "Date of birth is required.";

    }

    else {

        const selectedDate =
            new Date(`${dob}T00:00:00`);


        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );




        if (selectedDate > today) {

            errors.studentDob =
                "Future dates are not allowed.";

        }




        else if (
            !isAtLeast15YearsOld(
                selectedDate,
                today
            )
        ) {

            errors.studentDob =
                "Student age must be at least 15 years.";

        }

    }




    if (!gender) {

        errors.gender =
            "Please select a gender.";

    }


    if (!course) {

        errors.studentCourse =
            "Please select a course.";

    }

    if (skills.length === 0) {

        errors.skills =
            "Select at least one skill.";

    }

    if (!studentAbout) {
        errors.studentAbout = "about student is required"

    } else if (studentAbout < 20) {
        errors.studentAbout = "about student is less than 20 words";
    }
    else if (studentAbout > 200) {
        errors.studentAbout = "about studen is more than 200 words";
    }

    if (
        editingStudentId === null &&
        !photo
    ) {

        errors.studentPhoto =
            "Profile photo is required.";

    }

    else if (
        photo &&
        !photo.type.startsWith("image/")
    ) {

        errors.studentPhoto =
            "Only image files are allowed.";

    }

    return {

        isValid:
            Object.keys(errors).length === 0,

        errors,

        data: {

            name,

            email,

            phone,

            dob,

            gender,

            course,

            skills,

            about

        }

    };

}


function displayValidationMessages(errors) {

    Object.entries(errors).forEach(
        ([field, message]) => {

            const errorElement =
                document.querySelector(
                    `#${field}Error`
                );


            const inputElement =
                document.querySelector(
                    `#${field}`
                );


            if (errorElement) {

                errorElement.textContent =
                    message;

            }


            if (inputElement) {

                inputElement.classList.add(
                    "input-invalid"
                );

            }

        }
    );

}




function clearValidationMessages() {

    const errorFields = [

        "studentName",

        "studentEmail",

        "studentPhone",

        "studentDob",

        "gender",

        "studentCourse",

        "skills",

        "studentAbout",

        "studentPhoto"

    ];


    errorFields.forEach(
        (field) => {

            const errorElement =
                document.querySelector(
                    `#${field}Error`
                );


            const inputElement =
                document.querySelector(
                    `#${field}`
                );


            if (errorElement) {

                errorElement.textContent = "";

            }


            if (inputElement) {

                inputElement.classList.remove(
                    "input-invalid"
                );

            }

        }
    );

}




function renderStudents() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCourse =
        courseFilter.value;


    

    const filteredStudents =
        students.filter(
            (student) => {

                const matchesSearch =
                    student.name
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesCourse =
                    !selectedCourse ||
                    student.course === selectedCourse;


                return (
                    matchesSearch &&
                    matchesCourse
                );

            }
        );


   

    studentContainer.innerHTML = "";


   

    resultCount.textContent =
        `${filteredStudents.length} student${
            filteredStudents.length === 1
                ? ""
                : "s"
        }`;


   
    if (filteredStudents.length === 0) {

        const emptyState =
            document.createElement("div");


        emptyState.className =
            "empty-state";


        emptyState.textContent =
            "No students found";


        studentContainer.appendChild(
            emptyState
        );


        return;
    }


  

    filteredStudents.forEach(
        (student) => {

            const card =
                createStudentCard(student);


            studentContainer.appendChild(
                card
            );

        }
    );

}



function createStudentCard(student) {


    const card =
        document.createElement("article");


    card.classList.add(
        "student-card"
    );


    card.setAttribute(
        "data-id",
        student.id
    );


 

    const photo =
        document.createElement("img");


    photo.classList.add(
        "student-photo"
    );


    photo.src =
        student.photo;


    photo.alt =
        `${student.name} profile photo`;


  

    const content =
        document.createElement("div");


    content.classList.add(
        "student-content"
    );


   

    const name =
        document.createElement("h3");


    name.textContent =
        student.name;


   

    const email =
        createDetail(
            "Email",
            student.email
        );


    const phone =
        createDetail(
            "Phone Number",
            student.phone
        );


    const dob =
        createDetail(
            "Date of Birth",
            formatDate(student.dob)
        );


    const gender =
        createDetail(
            "Gender",
            student.gender
        );


    const course =
        createDetail(
            "Course",
            student.course
        );


   

    const skillsBlock =
        document.createElement("div");


    skillsBlock.classList.add(
        "student-detail"
    );


    const skillsLabel =
        document.createElement("strong");


    skillsLabel.textContent =
        "Skills:";


    skillsBlock.appendChild(
        skillsLabel
    );


    const skills =
        document.createElement("div");


    skills.classList.add(
        "skills"
    );


    student.skills.forEach(
        (skill) => {

            const skillTag =
                document.createElement("span");


            skillTag.classList.add(
                "skill-tag"
            );


            skillTag.textContent =
                skill;


            skills.appendChild(
                skillTag
            );

        }
    );


    skillsBlock.appendChild(
        skills
    );


  

    const about =
        document.createElement("div");


    about.classList.add(
        "student-detail",
        "student-about"
    );


    const aboutLabel =
        document.createElement("strong");


    aboutLabel.textContent =
        "About:";


    const aboutText =
        document.createElement("p");


    aboutText.textContent =
        student.about;


    about.appendChild(
        aboutLabel
    );


    about.appendChild(
        aboutText
    );




    const actions =
        document.createElement("div");


    actions.classList.add(
        "card-actions"
    );


  

    const editButton =
        document.createElement("button");


    editButton.type = "button";


    editButton.classList.add(
        "secondary-button",
        "edit-btn"
    );


    editButton.textContent =
        "Edit";


   

    const deleteButton =
        document.createElement("button");


    deleteButton.type = "button";


    deleteButton.classList.add(
        "danger-button",
        "delete-btn"
    );


    deleteButton.textContent =
        "Delete";


    actions.append(
        editButton,
        deleteButton
    );




    content.append(

        name,

        email,

        phone,

        dob,

        gender,

        course,

        skillsBlock,

        about,

        actions

    );


  

    card.append(

        photo,

        content

    );


    return card;

}


function createDetail(label, value) {

    const detail =
        document.createElement("p");


    detail.classList.add(
        "student-detail"
    );


    const strong =
        document.createElement("strong");


    strong.textContent =
        `${label}: `;


    detail.append(

        strong,

        document.createTextNode(value)

    );


    return detail;

}
function updateStatistics() {

    statsContainer.innerHTML = "";


    

    const totalCard =
        createStatCard(
            "Total Students",
            students.length
        );


    totalCard.classList.add(
        "total"
    );


    statsContainer.appendChild(
        totalCard
    );



    courseNames.forEach(
        (course) => {

            const count =
                students.filter(
                    (student) =>
                        student.course === course
                ).length;


            const card =
                createStatCard(
                    course,
                    count
                );


            statsContainer.appendChild(
                card
            );

        }
    );

}


function createStatCard(label, value) {

    const card =
        document.createElement("div");


    card.classList.add(
        "stat-card"
    );


    const labelElement =
        document.createElement("p");


    labelElement.classList.add(
        "stat-label"
    );


    labelElement.textContent =
        label;


    const valueElement =
        document.createElement("strong");


    valueElement.classList.add(
        "stat-value"
    );


    valueElement.textContent =
        value;


    card.append(

        labelElement,

        valueElement

    );


    return card;

}




function deleteStudent(studentId) {

    const student =
        students.find(
            (item) =>
                item.id === studentId
        );


    if (!student) {
        return;
    }


    

    const shouldDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!shouldDelete) {
        return;
    }


   

    students =
        students.filter(
            (item) =>
                item.id !== studentId
        );


    

    if (
        editingStudentId === studentId
    ) {

        resetForm();

    }


    

    saveStudents();

    renderStudents();

    updateStatistics();

}




function editStudent(studentId) {

    const student =
        students.find(
            (item) =>
                item.id === studentId
        );


    if (!student) {
        return;
    }



    editingStudentId =
        studentId;


    

    studentName.value =
        student.name;


    studentEmail.value =
        student.email;


    studentPhone.value =
        student.phone;


    studentDob.value =
        student.dob;


    studentCourse.value =
        student.course;


    studentAbout.value =
        student.about;


   

    document
        .querySelectorAll(
            'input[name="gender"]'
        )
        .forEach(
            (input) => {

                input.checked =
                    input.value ===
                    student.gender;

            }
        );



    document
        .querySelectorAll(
            'input[name="skills"]'
        )
        .forEach(
            (input) => {

                input.checked =
                    student.skills.includes(
                        input.value
                    );

            }
        );


    

    studentPhoto.value = "";


    

    submitButton.textContent =
        "Update Student";


    formMode.textContent =
        "Editing Student";


    clearValidationMessages();

    updateCharacterCounter();


   

    document
        .querySelector("#registration-title")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}




function resetForm() {

    form.reset();


    

    editingStudentId = null;


    

    submitButton.textContent =
        "Register Student";


    formMode.textContent =
        "New Student";


   

    clearValidationMessages();


    

    updateCharacterCounter();

}




function updateCharacterCounter() {

    characterCounter.textContent =
        `${studentAbout.value.length} / 200`;

}




function generateUniqueId() {

    const ids =
        students.map(
            (student) =>
                Number(student.id)
        );


    if (ids.length === 0) {
        return 1;
    }


    return Math.max(...ids) + 1;

}




function saveStudents() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );

}




function loadStudents() {

    try {

        const savedStudents =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            );


        return Array.isArray(
            savedStudents
        )
            ? savedStudents
            : [];

    }

    catch (error) {

        console.error(
            "Unable to load student data:",
            error
        );


        return [];

    }

}




function getPhotoData() {

    const file =
        studentPhoto.files[0];




    if (!file) {

        return Promise.resolve("");

    }



    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                resolve(
                    reader.result
                );

            };


            reader.onerror = () => {

                reject(
                    new Error(
                        "Unable to read profile photo."
                    )
                );

            };


            reader.readAsDataURL(file);

        }
    );

}



function formatDate(dateString) {

    const [
        year,
        month,
        day
    ] = dateString.split("-");


    return `${day}/${month}/${year}`;

}




function isAtLeast15YearsOld(
    dateOfBirth,
    today
) {

    let age =
        today.getFullYear() -
        dateOfBirth.getFullYear();


    const monthDifference =
        today.getMonth() -
        dateOfBirth.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
            dateOfBirth.getDate()
        )
    ) {

        age--;

    }


    return age >= 15;

}




function setDateMaximum() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    studentDob.max =
        `${year}-${month}-${day}`;

}















