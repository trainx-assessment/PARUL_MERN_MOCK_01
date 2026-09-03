const form = document.getElementById('student-form');
const aboutInput = document.getElementById('about');
const charCount = document.getElementById('char-count');
const resetBtn = document.getElementById('reset-btn');


aboutInput.addEventListener('input', () => {
    const length = aboutInput.value.length;
    charCount.textContent = length;
    
    
    if (length > 200) {
        aboutInput.value = aboutInput.value.substring(0, 200);
        charCount.textContent = 200;
    }
});

// --- form reset ---
resetBtn.addEventListener('click', () => {
    
    setTimeout(() => {
        charCount.textContent = '0';
        document.querySelectorAll('.error-msg').forEach(el => {
            el.style.display = 'none';
        });
    }, 10);
});

// --- Intercept Form Submission ---
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Stop default browser refresh

    if (validateForm()) {
        alert("Validation successful! (Data storage for Task 5 not yet implemented)");
        // In Task 5+, you will trigger the object creation and array push here.
    }
});

// --- Core Validation Function ---
function validateForm() {
    let isValid = true;

    
    const setError = (id, message) => {
        const errorElement = document.getElementById(`${id}-error`);
        if (message) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            isValid = false;
        } else {
            errorElement.style.display = 'none';
        }
    };

    // 1. Validate Name 
    const name = document.getElementById('name').value.trim();
    const nameRegex = /^[a-zA-Z\s]{3,40}$/;
    if (!nameRegex.test(name)) {
        setError('name', 'Name must be 3 to 40 characters, letters and spaces only.');
    } else {
        setError('name', '');
    }

    // 2. Validate Email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('email', 'Please enter a valid email address.');
    } else {
        setError('email', '');
    }

    // 3. Validate Phone Number (Exactly 10 digits)
    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        setError('phone', 'Phone number must be exactly 10 digits.');
    } else {
        setError('phone', '');
    }

    // 4. Validate Date of Birth & Age 
    const dob = document.getElementById('dob').value;
    if (!dob) {
        setError('dob', 'Date of birth is required.');
    } else {
        const birthDate = new Date(dob);
        const today = new Date();
        
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            setError('dob', 'Future dates are not allowed.');
        } else if (age < 15) {
            setError('dob', 'Student must be at least 15 years old.');
        } else {
            setError('dob', '');
        }
    }

    // 5. Validate Gender
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    if (!genderChecked) {
        setError('gender', 'Please select a gender.');
    } else {
        setError('gender', '');
    }

    // 6. Validate Course
    const course = document.getElementById('course').value;
    if (course === "") {
        setError('course', 'Please select a valid course.');
    } else {
        setError('course', '');
    }

    // 7. Validate Skills 
    const skillsChecked = document.querySelectorAll('input[name="skills"]:checked');
    if (skillsChecked.length === 0) {
        setError('skills', 'Please select at least one skill.');
    } else {
        setError('skills', '');
    }

    // 8. Validate About text 
    const about = document.getElementById('about').value.trim();
    if (about.length < 20 || about.length > 200) {
        setError('about', 'About section must be between 20 and 200 characters.');
    } else {
        setError('about', '');
    }

    // 9. Validate Profile Photo 
    const photoInput = document.getElementById('photo');
    const photo = photoInput.files[0];
    if (!photo) {
        setError('photo', 'Profile photo is required.');
    } else {
        const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validExtensions.includes(photo.type)) {
            setError('photo', 'Only .jpg, .jpeg, or .png image files are accepted.');
        } else {
            setError('photo', '');
        }
    }

    return isValid;
}