const form = document.getElementById('registrationForm');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');
const cardsContainer = document.getElementById('cardsContainer');
const statsContainer = document.getElementById('courseStats');
const totalStudentsEl = document.getElementById('totalStudents');
const searchInput = document.getElementById('searchInput');
const filterCourse = document.getElementById('filterCourse');
const themeToggle = document.getElementById('themeToggle');
const noResultsMsg = document.getElementById('noResultsMsg');

// --- State Variables ---
let students = JSON.parse(localStorage.getItem('students')) || [];
let editingId = null;
let currentPhotoBase64 = null; // Store photo data URL

// --- Event Listeners ---
form.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetForm);
cardsContainer.addEventListener('click', handleCardActions);
searchInput.addEventListener('input', renderCards);
filterCourse.addEventListener('change', renderCards);
themeToggle.addEventListener('click', toggleTheme);

// Character Counter
const aboutInput = document.getElementById('studentAbout');
const charCount = document.getElementById('charCount');
aboutInput.addEventListener('input', () => {
    charCount.textContent = aboutInput.value.length;
});

// File Reader for Photo
const photoInput = document.getElementById('studentPhoto');
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => currentPhotoBase64 = event.target.result;
        reader.readAsDataURL(file);
    } else {
        currentPhotoBase64 = null;
    }
});

// Initial Render
updateStats();
renderCards();

// --- Validation and Submit (Task 4, 5, 9) ---
function handleFormSubmit(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const phone = document.getElementById('studentPhone').value.trim();
    const dob = document.getElementById('studentDob').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const course = document.getElementById('studentCourse').value;
    const skillsElements = document.querySelectorAll('input[name="skills"]:checked');
    const skills = Array.from(skillsElements).map(el => el.value);
    const about = document.getElementById('studentAbout').value;
    
    let isValid = true;

    // Validation Rules
    if (!/^[A-Za-z\s]{3,40}$/.test(name)) {
        showError('nameError', 'Must be 3-40 letters/spaces only.');
        isValid = false;
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        showError('emailError', 'Enter a valid email address.');
        isValid = false;
    }

    if (!/^\d{10}$/.test(phone)) {
        showError('phoneError', 'Must be exactly 10 digits.');
        isValid = false;
    }

    if (!dob) {
        showError('dobError', 'Date of Birth is required.');
        isValid = false;
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (birthDate > today) {
            showError('dobError', 'Future dates are not allowed.');
            isValid = false;
        } else if (age < 15) {
            showError('dobError', 'Student must be at least 15 years old.');
            isValid = false;
        }
    }

    if (!gender) {
        showError('genderError', 'Select a gender.');
        isValid = false;
    }

    if (!course) {
        showError('courseError', 'Select a valid course.');
        isValid = false;
    }

    if (skills.length === 0) {
        showError('skillsError', 'Select at least one skill.');
        isValid = false;
    }

    if (about.trim() === '' || about.length < 20 || about.length > 200) {
        showError('aboutError', 'Must be between 20 and 200 characters.');
        isValid = false;
    }

    if (!currentPhotoBase64 && !editingId) {
        showError('photoError', 'Profile photo is required.');
        isValid = false;
    }

    if (!isValid) return;

    // Create / Update Object
    const studentData = {
        id: editingId ? editingId : Date.now(),
        name,
        email,
        phone,
        dob,
        gender,
        course,
        skills,
        about,
        photo: currentPhotoBase64 
    };

    if (editingId) {
        const index = students.findIndex(s => s.id === editingId);
        if (!currentPhotoBase64) studentData.photo = students[index].photo;
        students[index] = studentData;
        editingId = null;
        submitBtn.textContent = 'Register Student';
    } else {
        students.push(studentData);
    }

    saveData();
    resetForm();
    renderCards();
    updateStats();
}

