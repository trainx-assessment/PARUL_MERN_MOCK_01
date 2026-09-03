// --- DOM Elements ---
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
        photo: currentPhotoBase64 // Will retain old photo if editing and unchanged
    };

    if (editingId) {
        const index = students.findIndex(s => s.id === editingId);
        // keep old photo if a new one wasn't uploaded during edit
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

function showError(id, msg) {
    document.getElementById(id).textContent = msg;
}

function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}


// --- Dynamic Cards & Search/Filter (Task 6, 10, 11) ---
function renderCards() {
    cardsContainer.innerHTML = '';
    const searchText = searchInput.value.toLowerCase();
    const filterText = filterCourse.value;

    const filtered = students.filter(student => {
        const matchName = student.name.toLowerCase().includes(searchText);
        const matchCourse = filterText === 'All' || student.course === filterText;
        return matchName && matchCourse;
    });

    if (filtered.length === 0) {
        noResultsMsg.style.display = 'block';
    } else {
        noResultsMsg.style.display = 'none';
        filtered.forEach(student => {
            const card = document.createElement('div');
            card.classList.add('student-card');
            card.setAttribute('data-id', student.id);

            card.innerHTML = `
                <img src="${student.photo}" alt="Profile Photo">
                <h3>${student.name}</h3>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Phone:</strong> ${student.phone}</p>
                <p><strong>DOB:</strong> ${student.dob}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Skills:</strong> ${student.skills.join(', ')}</p>
                <p><strong>About:</strong> ${student.about}</p>
                <div class="card-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="danger-btn delete-btn">Delete</button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    }
}
// --- Statistics (Task 7) ---
function updateStats() {
    totalStudentsEl.textContent = `Total Students: ${students.length}`;
    
    const courses = ["Web Development", "UI/UX", "Python", "Data Analytics", "MERN Stack", "Cloud Computing"];
    statsContainer.innerHTML = '';

    courses.forEach(course => {
        const count = students.filter(s => s.course === course).length;
        const div = document.createElement('div');
        div.innerHTML = `<strong>${course}:</strong> ${count}`;
        statsContainer.appendChild(div);
    });
}

// --- Event Delegation (Task 8 & 9) ---
function handleCardActions(e) {
    const card = e.target.closest('.student-card');
    if (!card) return;
    const id = parseInt(card.getAttribute('data-id'));

    if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this student?')) {
            students = students.filter(s => s.id !== id);
            saveData();
            renderCards();
            updateStats();
        }
    }

    if (e.target.classList.contains('edit-btn')) {
        const student = students.find(s => s.id === id);
        if (student) {
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('studentPhone').value = student.phone;
            document.getElementById('studentDob').value = student.dob;
            document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
            document.getElementById('studentCourse').value = student.course;
            
            document.querySelectorAll('input[name="skills"]').forEach(cb => {
                cb.checked = student.skills.includes(cb.value);
            });
            
            document.getElementById('studentAbout').value = student.about;
            charCount.textContent = student.about.length;
            
            // Note: Cannot programmatically set file input value for security reasons.
            // Photo state is handled by keeping the old base64 if unchanged.
            currentPhotoBase64 = null; 
            
            editingId = id;
            submitBtn.textContent = 'Update Student';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// --- Form Reset (Task 12) ---
function resetForm() {
    form.reset();
    clearErrors();
    charCount.textContent = '0';
    currentPhotoBase64 = null;
    editingId = null;
    submitBtn.textContent = 'Register Student';
}

// --- Local Storage (Assessment Requirement) ---
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
}

// --- Dark Mode (Bonus) ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = 'Light Mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
    }
}