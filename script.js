// ==================== STUDENT APPLICATION MANAGER ==================== //

// Initialize students array from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentsContainer = document.getElementById('studentsContainer');
const totalCountElement = document.getElementById('totalCount');

// Validation Regex Patterns
const nameRegex = /^[a-zA-Z\s]{3,}$/; // Only letters and spaces, min 3 chars
const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valid email format

// Event Listeners
studentForm.addEventListener('submit', handleFormSubmit);

// Event delegation for delete button
studentsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
        const deleteButton = event.target.closest('.delete-btn');
        const studentCard = deleteButton.closest('.student-card');
        
        if (studentCard) {
            const studentId = parseInt(studentCard.dataset.id);
            deleteStudent(studentId);
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateTotalCount();
    displayStudents();
});

// ==================== FORM VALIDATION ==================== //

function validateForm() {
    // Clear previous error messages
    clearValidationMessages();

    const formData = {
        name: document.getElementById('studentName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.querySelector('input[name="gender"]:checked'),
        course: document.getElementById('course').value,
        skills: document.querySelectorAll('input[name="skills"]:checked'),
        about: document.getElementById('about').value.trim(),
        profilePhoto: document.getElementById('profilePhoto').files,
    };

    let isValid = true;

    // Validate Student Name
    if (!formData.name) {
        showError('studentName', 'Student Name is required');
        isValid = false;
    } else if (!nameRegex.test(formData.name)) {
        showError('studentName', 'Student Name must contain only letters and spaces (minimum 3 characters)');
        isValid = false;
    }

    // Validate Email
    if (!formData.email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(formData.email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Phone Number
    if (!formData.phone) {
        showError('phone', 'Phone Number is required');
        isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
        showError('phone', 'Phone Number must contain exactly 10 digits');
        isValid = false;
    }

    // Validate Date of Birth
    if (!formData.dob) {
        showError('dob', 'Date of Birth is required');
        isValid = false;
    } else {
        const selectedDate = new Date(formData.dob);
        const today = new Date();
        if (selectedDate > today) {
            showError('dob', 'Date of Birth cannot be in the future');
            isValid = false;
        }
    }

    // Validate Gender
    if (!formData.gender) {
        showError('gender-group', 'Please select a gender');
        isValid = false;
    }

    // Validate Course
    if (!formData.course) {
        showError('course', 'Please select a course');
        isValid = false;
    }

    // Validate Skills
    if (formData.skills.length === 0) {
        showError('skills-group', 'Please select at least one skill');
        isValid = false;
    }

    // Validate About Student
    if (!formData.about) {
        showError('about', 'About Student is required');
        isValid = false;
    }

    // Validate Profile Photo
    if (formData.profilePhoto.length === 0) {
        showError('profilePhoto', 'Profile Photo is required');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let errorContainer = element.parentElement.querySelector('.error-message');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        element.parentElement.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
}

function clearValidationMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

// ==================== FORM SUBMISSION ==================== //

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        showNotification('Please fix the validation errors', 'error');
        return;
    }

    // Get form data
    const studentData = {
        id: Date.now(),
        name: document.getElementById('studentName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        course: document.getElementById('course').value,
        skills: getSelectedSkills(),
        about: document.getElementById('about').value.trim(),
        profilePhoto: null,
    };

    // Handle file upload
    const fileInput = document.getElementById('profilePhoto');
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            studentData.profilePhoto = e.target.result;
            addStudent(studentData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        addStudent(studentData);
    }
}

// ==================== HELPER FUNCTIONS ==================== //

function getSelectedSkills() {
    const skillsCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
    return Array.from(skillsCheckboxes).map(checkbox => checkbox.value);
}

function addStudent(studentData) {
    students.push(studentData);
    localStorage.setItem('students', JSON.stringify(students));

    // Show success message
    showNotification('Student registered successfully!');

    // Reset form
    studentForm.reset();

    // Update UI
    updateTotalCount();
    displayStudents();
}

function updateTotalCount() {
    totalCountElement.textContent = students.length;
    totalCountElement.style.animation = 'none';
    setTimeout(() => {
        totalCountElement.style.animation = 'pulse 0.5s ease';
    }, 10);
}

function displayStudents() {
    studentsContainer.innerHTML = '';

    if (students.length === 0) {
        studentsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #5f6368; padding: 40px;">No students registered yet.</p>';
        return;
    }

    students.forEach(student => {
        const studentCard = createStudentCard(student);
        studentsContainer.appendChild(studentCard);
    });
}

function createStudentCard(student) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.dataset.id = student.id;

    const profileImage = student.profilePhoto || getDefaultAvatar(student.name);

    const skillsHTML = student.skills.length > 0
        ? student.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')
        : '<span class="skill-tag" style="opacity: 0.5;">No skills selected</span>';

    const dobDate = new Date(student.dob).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    card.innerHTML = `
        <div class="student-card-image">
            ${student.profilePhoto ? `<img src="${profileImage}" alt="${student.name}">` : `<i class="fas fa-user"></i>`}
        </div>
        <div class="student-card-content">
            <h3>${student.name}</h3>
            <p><i class="fas fa-envelope"></i> ${student.email}</p>
            <p><i class="fas fa-phone"></i> ${student.phone}</p>
            <p><i class="fas fa-calendar"></i> ${dobDate}</p>
            <p><i class="fas fa-venus-mars"></i> ${student.gender}</p>
            <p><i class="fas fa-book"></i> <strong>${student.course}</strong></p>
            <div class="about">"${student.about || 'No description provided'}"</div>
            <div class="skills">${skillsHTML}</div>
            <button class="delete-btn" style="
                margin-top: 15px;
                padding: 8px 16px;
                background-color: #ea4335;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                width: 100%;
                transition: opacity 0.3s ease;
            " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(student => student.id !== studentId);
        localStorage.setItem('students', JSON.stringify(students));
        updateTotalCount();
        displayStudents();
        showNotification('Student deleted successfully!');
    }
}

function getDefaultAvatar(name) {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#ea4335'];
    const colorIndex = name.length % colors.length;
    const bgColor = colors[colorIndex];

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="${bgColor}"/>
            <text x="100" y="120" font-size="80" font-family="Arial" fill="white" text-anchor="middle" font-weight="bold">${firstLetter}</text>
        </svg>
    `;

    return 'data:image/svg+xml;base64,' + btoa(svg);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error'
        ? 'linear-gradient(135deg, #ea4335 0%, #c5221f 100%)'
        : 'linear-gradient(135deg, #34a853 0%, #2d7e3c 100%)';

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease forwards;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}



const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);
