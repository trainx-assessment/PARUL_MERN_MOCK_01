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

