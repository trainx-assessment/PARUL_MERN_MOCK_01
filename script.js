document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("studentRegistrationForm");
    
    const aboutInput = document.getElementById("aboutStudent");
    const counterDiv = document.createElement("div");
    counterDiv.id = "aboutCounter";
    counterDiv.style.fontSize = "0.9em";
    counterDiv.style.color = "#555";
    counterDiv.style.marginTop = "5px";
    counterDiv.textContent = "0 / 200";
    aboutInput.parentNode.appendChild(counterDiv);

    aboutInput.addEventListener("input", (e) => {
        counterDiv.textContent = `${e.target.value.length} / 200`;
    });

    
    function showError(element, message) {
        const parent = element.nodeType ? element.parentNode : element; 
        
        let errorMsg = parent.querySelector(".error-msg");
        if (!errorMsg) {
            errorMsg = document.createElement("span");
            errorMsg.className = "error-msg";
            errorMsg.style.color = "red";
            errorMsg.style.fontSize = "0.85em";
            errorMsg.style.display = "block";
            errorMsg.style.marginTop = "5px";
            parent.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    function clearError(element) {
        const parent = element.nodeType ? element.parentNode : element;
        const errorMsg = parent.querySelector(".error-msg");
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    form.addEventListener("input", (e) => {
        if (e.target.name === "gender") {
            clearError(document.querySelector(".gender"));
        } else if (e.target.name === "skills") {
            clearError(document.getElementById("skillHTML").parentNode);
        } else {
            clearError(e.target);
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        let isValid = true;
        const name = document.getElementById("studentName");
        const nameRegex = /^[A-Za-z\s]{3,40}$/;
        if (!nameRegex.test(name.value.trim())) {
            showError(name, "Name must be 3-40 characters, containing only letters and spaces.");
            isValid = false;
        }

        const email = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email, "Please enter a valid email address.");
            isValid = false;
        }

        const phone = document.getElementById("phone");
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showError(phone, "Phone number must be exactly 10 digits.");
            isValid = false;
        }

        const dob = document.getElementById("dob");
        if (!dob.value) {
            showError(dob, "Date of Birth is required.");
            isValid = false;
        } else {
            const dobDate = new Date(dob.value);
            const today = new Date();
            
            if (dobDate > today) {
                showError(dob, "Future dates are not accepted.");
                isValid = false;
            } else {
                let age = today.getFullYear() - dobDate.getFullYear();
                const monthDiff = today.getMonth() - dobDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                    age--;
                }
                if (age < 15) {
                    showError(dob, "Student must be at least 15 years old.");
                    isValid = false;
                }
            }
        }


        const genderContainer = document.querySelector(".gender");
        const genderSelected = document.querySelector('input[name="gender"]:checked');
        if (!genderSelected) {
            showError(genderContainer, "Please select a gender.");
            isValid = false;
        }

        const course = document.getElementById("course");
        if (!course.value) {
            showError(course, "Please select a valid course.");
            isValid = false;
        }

        const skillsContainer = document.getElementById("skillHTML").parentNode;
        const skillsSelected = document.querySelectorAll('input[name="skills"]:checked');
        if (skillsSelected.length === 0) {
            showError(skillsContainer, "Please select at least one skill.");
            isValid = false;
        }

        const aboutText = aboutInput.value.trim(); // .trim() prevents spaces-only inputs
        if (aboutText.length < 20 || aboutText.length > 200) {
            showError(aboutInput, "About section must be between 20 and 200 characters.");
            isValid = false;
        }

        const photo = document.getElementById("profilePhoto");
        if (photo.files.length === 0) {
            showError(photo, "Profile photo is required.");
            isValid = false;
        } else {
            const file = photo.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                showError(photo, "Only image files (.jpg, .jpeg, .png) are accepted.");
                isValid = false;
            }
        }

        if (isValid) {
            alert("Registration successful! All validations passed.");
            // form.submit(); // Uncomment to allow actual submission to a backend
        }
    });
    
    form.addEventListener("reset", () => {
        document.querySelectorAll(".error-msg").forEach(error => error.remove());
        counterDiv.textContent = "0 / 200";
    });
});