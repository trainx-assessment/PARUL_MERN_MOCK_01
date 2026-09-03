const registrationForm = document.querySelector('form');
const resetBtn = document.getElementById('resetBtn');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const skillsCheckboxes = document.querySelectorAll('input[name="skills"]');
const studentList = document.getElementById('studentList');
const studentCount = document.getElementById('studentCount');
const studentSearch = document.getElementById('studentSearch');
const courseFilter = document.getElementById('courseFilter');
const phoneInput = document.getElementById('phonenumber');
const photoInput = document.getElementById('pfp');
const registerButton = document.getElementById('registerBtn');
const students = [];
let editingIndex = null;

const getInputValue = (id) => document.getElementById(id).value.trim();

const resetForm = () => {
    registrationForm.reset();
    editingIndex = null;
    registerButton.textContent = 'Register Student';
};

const getStudentData = (existingPhoto = '') => ({
    username: getInputValue('username'),
    email: getInputValue('email'),
    phonenumber: getInputValue('phonenumber'),
    DOB: getInputValue('DOB'),
    gender: Array.from(genderInputs).find(input => input.checked)?.value || 'Not specified',
    course: getInputValue('course'),
    skills: Array.from(skillsCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value),
    about: getInputValue('about'),
    pfp: photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : existingPhoto
});

const addDetail = (card, label, value) => {
    const detail = document.createElement('p');
    detail.innerHTML = `${label}:`;
    detail.append(document.createTextNode(value || 'Not provided'));
    card.appendChild(detail);
};

const editStudent = (index) => {
    const student = students[index];

    document.getElementById('username').value = student.username;
    document.getElementById('email').value = student.email;
    document.getElementById('phonenumber').value = student.phonenumber;
    document.getElementById('DOB').value = student.DOB;
    document.getElementById('course').value = student.course;
    document.getElementById('about').value = student.about;
    genderInputs.forEach(input => {
        input.checked = input.value === student.gender;
    });
    skillsCheckboxes.forEach(checkbox => {
        checkbox.checked = student.skills.includes(checkbox.value);
    });

    editingIndex = index;
    registerButton.textContent = 'Update Student';
};

const deleteStudent = (index) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
        return;
    }

    students.splice(index, 1);
    if (editingIndex === index) {
        resetForm();
    } else if (editingIndex > index) {
        editingIndex -= 1;
    }
    displayRegisteredStudents();
};

const getFilteredStudents = () => {
    const searchTerm = studentSearch.value.trim().toLowerCase();
    const selectedCourse = courseFilter.value;

    return students.filter(student => {
        const searchableText = [
            student.username,
            student.email,
            student.phonenumber,
            student.course,
            student.skills.join(' ')
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm)
            && (!selectedCourse || student.course === selectedCourse);
    });
};

const displayRegisteredStudents = () => {
    studentList.replaceChildren();
    const filteredStudents = getFilteredStudents();
    studentCount.textContent = filteredStudents.length;

    filteredStudents.forEach((student, index) => {
        const originalIndex = students.indexOf(student);
        const card = document.createElement('article');
        card.className = 'student-card';

        if (student.pfp) {
            const image = document.createElement('img');
            image.src = student.pfp;
            image.alt = `${student.username}'s profile photo`;
            card.appendChild(image);
        }

        const heading = document.createElement('h4');
        heading.textContent = `Student ${index + 1}: ${student.username}`;
        card.appendChild(heading);
        addDetail(card, 'Email', student.email);
        addDetail(card, 'Phone', student.phonenumber);
        addDetail(card, 'DOB', student.DOB);
        addDetail(card, 'Gender', student.gender);
        addDetail(card, 'Course', student.course);
        addDetail(card, 'Skills', student.skills.join(', '));
        addDetail(card, 'About', student.about);

        const actions = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editStudent(originalIndex));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteStudent(originalIndex));

        actions.append(editButton, deleteButton);
        card.appendChild(actions);
        studentList.appendChild(card);
    });

    if (filteredStudents.length === 0 && students.length > 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No students found.';
        studentList.appendChild(emptyMessage);
    }
};

phoneInput.pattern = '[0-9]{10}';
phoneInput.title = 'Enter a valid 10-digit phone number';

registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!registrationForm.checkValidity()) {
        registrationForm.reportValidity();
        return;
    }

    if (editingIndex === null) {
        students.push(getStudentData());
    } else {
        students[editingIndex] = getStudentData(students[editingIndex].pfp);
    }
    displayRegisteredStudents();
    resetForm();
});

resetBtn.addEventListener('click', resetForm);
studentSearch.addEventListener('input', displayRegisteredStudents);
courseFilter.addEventListener('change', displayRegisteredStudents);
displayRegisteredStudents();

