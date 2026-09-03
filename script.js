// Database Array
let students = [];

// DOM Elements
const form = document.getElementById('stuForm');
const container = document.getElementById('studentContainer');
const aboutInput = document.getElementById('about');
const charCount = document.getElementById('charCount');
const resetBtn = document.getElementById('resetBtn');
const totalStudentsEl = document.getElementById('totalStudents');

// Character Counter
aboutInput.addEventListener('input', () => {
    charCount.textContent = `${aboutInput.value.length} / 200`;
});

// Form Submission Event
form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {
        saveStudent();
    }
});

// Reset Button Configuration
resetBtn.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    charCount.textContent = "0 / 200";
}

// --- Validation Functions ---

function validateForm() {
    let formIsValid = true;
    let finalErrorMessage = "";

    // 1. Name Validation
    const stuName = document.querySelector('#studentName').value.trim();
    const nameResult = validateName(stuName);
    if (!nameResult.valid) {
        formIsValid = false;
        finalErrorMessage = nameResult.error;
    }

    // 2. Email Validation
    if (formIsValid) {
        const email = document.querySelector('#email').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            finalErrorMessage = "Please enter a valid email address.";
            formIsValid = false;
        }
    }

    // 3. Phone Validation
    if (formIsValid) {
        const phoneNumber = document.querySelector('#phone').value.trim();
        const phoneResult = validatePhone(phoneNumber);
        if (!phoneResult.valid) {
            formIsValid = false;
            finalErrorMessage = phoneResult.error;
        }
    }

    // 4. DOB Validation
    if (formIsValid) {
        const dob = document.getElementById('dob').value;
        const dobResult = validateDOB(dob);
        if (!dobResult.valid) {
            formIsValid = false;
            finalErrorMessage = dobResult.error;
        }
    }

    // 5. Gender Validation
    if (formIsValid) {
        const gender = document.querySelector('input[name="gender"]:checked');
        if (!gender) {
            finalErrorMessage = 'Please select a gender.';
            formIsValid = false;
        }
    }

    // 6. Course Validation
    if (formIsValid) {
        const course = document.getElementById('course').value;
        if (course === "") {
            finalErrorMessage = 'Please select a course.';
            formIsValid = false;
        }
    }

    // 7. Skills Validation
    if (formIsValid) {
        const skills = document.querySelectorAll('input[name="skills"]:checked');
        if (skills.length === 0) {
            finalErrorMessage = 'Select at least one skill.';
            formIsValid = false;
        }
    }

    // 8. About Validation
    if (formIsValid) {
        const about = document.getElementById('about').value.trim();
        if (about.length < 20 || about.length > 200) {
            finalErrorMessage = 'About section must be between 20 and 200 characters.';
            formIsValid = false;
        }
    }

    // 9. Photo Validation
    if (formIsValid) {
        const photo = document.getElementById('photo');
        if (photo.files.length === 0) {
            finalErrorMessage = 'Profile photo is required.';
            formIsValid = false;
        } else {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(photo.files[0].type)) {
                finalErrorMessage = 'Only .jpg, .jpeg, and .png layout formats allowed.';
                formIsValid = false;
            }
        }
    }
    
    if (!formIsValid) {
        alert(finalErrorMessage);
    }
    return formIsValid;
}

function validateName(name) {
    if (name === "") return { valid: false, error: "Name is required." };
    if (name.length < 3 || name.length > 40) return { valid: false, error: "Name must be between 3 and 40 characters long." };

    for (let i = 0; i < name.length; i++) {
        const char = name[i];
        const isSpace = (char === " ");
        const isLetter = (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");

        if (!isLetter && !isSpace) {
            return { valid: false, error: "Name can only contain letters and spaces." };
        }
    }
    return { valid: true, error: "" };
}

function validatePhone(number) {
    if (number === "") return { valid: false, error: "Phone number is required." };
    if (number.length !== 10) return { valid: false, error: "Number must be exactly 10 digits long." };

    for (let i = 0; i < number.length; i++) {
        const char = number[i];
        if (char < "0" || char > "9") {
            return { valid: false, error: "Phone number must contain only digits." };
        }
    }
    return { valid: true, error: "" };
}

function validateDOB(dob) {
    if (!dob) return { valid: false, error: 'Date of birth is required.' };
    
    const dobDate = new Date(dob);
    const today = new Date();
    
    if (dobDate > today) {
        return { valid: false, error: 'Future dates are not allowed.' };
    } 

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }

    if (age < 15) {
        return { valid: false, error: 'Student must be at least 15 years old.' };
    }
    return { valid: true, error: "" };
}

// --- Save & Render Logic ---

function saveStudent() {
    const photoInput = document.getElementById('photo');
    let photoUrl = "";
    
    if (photoInput.files.length > 0) {
        photoUrl = URL.createObjectURL(photoInput.files[0]);
    }

    const studentData = {
        id: Date.now(),
        name: document.getElementById('studentName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        course: document.getElementById('course').value,
        skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value),
        about: document.getElementById('about').value.trim(),
        photo: photoUrl
    };

    students.push(studentData);
    
    resetForm();
    renderStudents();
    updateStatistics();
}

function renderStudents() {
    container.innerHTML = '';

    students.forEach(student => {
        const card = document.createElement('div');
        card.classList.add('student-card');

        card.innerHTML = `
            <img src="${student.photo}" alt="${student.name}'s Photo" style="width:100px; height:100px; object-fit:cover;">
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>DOB:</strong> ${student.dob}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Skills:</strong> ${student.skills.join(', ')}</p>
            <p><strong>About:</strong> ${student.about}</p>
        `;
        container.appendChild(card);
    });
}

function updateStatistics() {
    totalStudentsEl.textContent = `Total Students: ${students.length}`;
    
    const courseSpans = document.querySelectorAll('#courseStats span');
    courseSpans.forEach(span => {
        const courseName = span.getAttribute('data-course');
        const count = students.filter(s => s.course === courseName).length;
        span.textContent = count;
    });
}