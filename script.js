const students = [];
let nextStudentId = 1;

const form = document.querySelector('#studentForm');
const studentNameInput = document.querySelector('#studentName');
const studentEmailInput = document.querySelector('#studentEmail');
const studentPhoneInput = document.querySelector('#studentPhone');
const studentDobInput = document.querySelector('#studentDob');
const studentCourseInput = document.querySelector('#studentCourse');
const studentAboutInput = document.querySelector('#studentAbout');
const studentPhotoInput = document.querySelector('#studentPhoto');
const studentContainer = document.querySelector('#studentContainer');
const studentCount = document.querySelector('#studentCount');

const errorFields = {
    studentName: document.querySelector('#studentNameError'),
    studentEmail: document.querySelector('#studentEmailError'),
    studentPhone: document.querySelector('#studentPhoneError'),
    studentDob: document.querySelector('#studentDobError'),
    gender: document.querySelector('#genderError'),
    course: document.querySelector('#courseError'),
    skills: document.querySelector('#skillsError'),
    about: document.querySelector('#aboutError'),
    photo: document.querySelector('#photoError')
};

function clearErrors() {
    Object.values(errorFields).forEach((field) => {
        field.textContent = '';
    });
}

function setError(fieldName, message) {
    errorFields[fieldName].textContent = message;
}

function updateStudentCount() {
    studentCount.textContent = students.length;
}

function getSelectedGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    return selectedGender ? selectedGender.value : '';
}

function getSelectedSkills() {
    return Array.from(document.querySelectorAll('input[name="skills"]:checked')).map((skill) => skill.value);
}

function validateForm() {
    clearErrors();
    let isValid = true;

    const nameValue = studentNameInput.value.trim();
    const emailValue = studentEmailInput.value.trim();
    const phoneValue = studentPhoneInput.value.trim();
    const dobValue = studentDobInput.value;
    const genderValue = getSelectedGender();
    const courseValue = studentCourseInput.value;
    const skillsValue = getSelectedSkills();
    const aboutValue = studentAboutInput.value.trim();
    const photoValue = studentPhotoInput.files[0];

    const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameValue) {
        setError('studentName', 'Student name is required.');
        isValid = false;
    } else if (nameValue.length < 3) {
        setError('studentName', 'Student name must be at least 3 characters.');
        isValid = false;
    } else if (!nameRegex.test(nameValue)) {
        setError('studentName', 'Only letters and spaces are allowed.');
        isValid = false;
    }

    if (!emailValue) {
        setError('studentEmail', 'Email is required.');
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        setError('studentEmail', 'Enter a valid email address.');
        isValid = false;
    }

    if (!phoneValue) {
        setError('studentPhone', 'Phone number is required.');
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        setError('studentPhone', 'Phone number must contain exactly 10 digits.');
        isValid = false;
    }

    if (!dobValue) {
        setError('studentDob', 'Date of birth is required.');
        isValid = false;
    } else {
        const selectedDate = new Date(`${dobValue}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            setError('studentDob', 'Future dates are not allowed.');
            isValid = false;
        }
    }

    if (!genderValue) {
        setError('gender', 'Please select a gender.');
        isValid = false;
    }

    if (!courseValue) {
        setError('course', 'Please select a course.');
        isValid = false;
    }

    if (skillsValue.length === 0) {
        setError('skills', 'Select at least one skill.');
        isValid = false;
    }

    if (!aboutValue) {
        setError('about', 'About student is required.');
        isValid = false;
    }

    if (!photoValue) {
        setError('photo', 'Please choose a profile photo.');
        isValid = false;
    }

    return {
        isValid,
        values: {
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            dob: dobValue,
            gender: genderValue,
            course: courseValue,
            skills: skillsValue,
            about: aboutValue,
            photo: photoValue
        }
    };
}

function createStudentCard(student) {
    const card = document.createElement('div');
    card.classList.add('student-card');
    card.dataset.id = student.id;

    const image = document.createElement('img');
    image.src = student.photo;
    image.alt = `${student.name} profile photo`;

    const heading = document.createElement('h3');
    heading.textContent = student.name;

    const meta = document.createElement('div');
    meta.classList.add('student-meta');

    const email = document.createElement('p');
    email.textContent = `Email: ${student.email}`;

    const phone = document.createElement('p');
    phone.textContent = `Phone: ${student.phone}`;

    const dob = document.createElement('p');
    dob.textContent = `Date of Birth: ${student.dob}`;

    const gender = document.createElement('p');
    gender.textContent = `Gender: ${student.gender}`;

    const course = document.createElement('p');
    course.textContent = `Course: ${student.course}`;

    const skillsWrapper = document.createElement('div');
    skillsWrapper.classList.add('student-skills');

    student.skills.forEach((skillName) => {
        const skill = document.createElement('span');
        skill.classList.add('skill-pill');
        skill.textContent = skillName;
        skillsWrapper.appendChild(skill);
    });

    const about = document.createElement('p');
    about.classList.add('student-about');
    about.textContent = `About: ${student.about}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';

    meta.appendChild(email);
    meta.appendChild(phone);
    meta.appendChild(dob);
    meta.appendChild(gender);
    meta.appendChild(course);
    meta.appendChild(skillsWrapper);
    meta.appendChild(about);

    card.appendChild(image);
    card.appendChild(heading);
    card.appendChild(meta);
    card.appendChild(deleteButton);

    return card;
}

function resetForm() {
    form.reset();
    clearErrors();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const result = validateForm();

    if (!result.isValid) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        const student = {
            id: nextStudentId++,
            name: result.values.name,
            email: result.values.email,
            phone: result.values.phone,
            dob: result.values.dob,
            gender: result.values.gender,
            course: result.values.course,
            skills: result.values.skills,
            about: result.values.about,
            photo: reader.result
        };

        students.push(student);
        studentContainer.appendChild(createStudentCard(student));
        updateStudentCount();
        resetForm();
    };

    reader.readAsDataURL(result.values.photo);
});

studentContainer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const card = event.target.closest('.student-card');

    if (!card) {
        return;
    }

    const studentId = Number(card.dataset.id);
    const studentIndex = students.findIndex((student) => student.id === studentId);

    if (studentIndex !== -1) {
        students.splice(studentIndex, 1);
    }

    card.remove();
    updateStudentCount();
});
