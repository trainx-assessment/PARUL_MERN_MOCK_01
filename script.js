document.addEventListener("DOMContentLoaded", () => {
    
    let students = [];
    let isEditing = false;
    let currentPhotoCache = "";


    const form = document.getElementById("studentForm");
    const formHeading = document.getElementById("formHeading");
    const studentId = document.getElementById("studentId");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const dobInput = document.getElementById("dob");
    const courseSelect = document.getElementById("course");
    const aboutInput = document.getElementById("about");
    const photoInput = document.getElementById("photo");
    const charCount = document.getElementById("charCount");
    const submitBtn = document.getElementById("submitBtn");
    const resetBtn = document.getElementById("resetBtn");

    const cardsContainer = document.getElementById("cardsContainer");
    const emptyMsg = document.getElementById("emptyMsg");
    const searchInput = document.getElementById("searchInput");
    const courseFilter = document.getElementById("courseFilter");

    
    const totalCount = document.getElementById("totalCount");
    const countWeb = document.getElementById("countWeb");
    const countUI = document.getElementById("countUI");
    const countPython = document.getElementById("countPython");
    const countData = document.getElementById("countData");
    const countMERN = document.getElementById("countMERN");
    const countCloud = document.getElementById("countCloud");

    
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    aboutInput.addEventListener("input", () => {
        charCount.textContent = `${aboutInput.value.length} / 200`;
    });

    
    function getAge(dobValue) {
        const today = new Date();
        const birthDate = new Date(dobValue);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

   
    function resetErrors() {
        document.querySelectorAll(".error").forEach(span => span.textContent = "");
    }

   
    function validateForm() {
        let valid = true;
        resetErrors();

    
        const nameVal = nameInput.value.trim();
        if (!nameVal) {
            document.getElementById("nameError").textContent = "Name is required.";
            valid = false;
        } else if (nameVal.length < 3 || nameVal.length > 40) {
            document.getElementById("nameError").textContent = "Name must be 3 to 40 characters.";
            valid = false;
        } else if (!namePattern.test(nameVal)) {
            document.getElementById("nameError").textContent = "Only letters and spaces allowed.";
            valid = false;
        }

      
        const emailVal = emailInput.value.trim();
        if (!emailVal) {
            document.getElementById("emailError").textContent = "Email is required.";
            valid = false;
        } else if (!emailPattern.test(emailVal)) {
            document.getElementById("emailError").textContent = "Enter a valid email.";
            valid = false;
        }

        
        const phoneVal = phoneInput.value.trim();
        if (!phoneVal) {
            document.getElementById("phoneError").textContent = "Phone number is required.";
            valid = false;
        } else if (!phonePattern.test(phoneVal)) {
            document.getElementById("phoneError").textContent = "Must be exactly 10 digits.";
            valid = false;
        }

       
        const dobVal = dobInput.value;
        if (!dobVal) {
            document.getElementById("dobError").textContent = "Date of birth is required.";
            valid = false;
        } else {
            const today = new Date();
            if (new Date(dobVal) > today) {
                document.getElementById("dobError").textContent = "Future dates not allowed.";
                valid = false;
            } else if (getAge(dobVal) < 15) {
                document.getElementById("dobError").textContent = "Age must be at least 15 years.";
                valid = false;
            }
        }

       
        const genderVal = document.querySelector('input[name="gender"]:checked');
        if (!genderVal) {
            document.getElementById("genderError").textContent = "Select a gender.";
            valid = false;
        }

        
        if (!courseSelect.value) {
            document.getElementById("courseError").textContent = "Select a course.";
            valid = false;
        }

       
        const checkedSkills = document.querySelectorAll('input[name="skills"]:checked');
        if (checkedSkills.length === 0) {
            document.getElementById("skillsError").textContent = "Select at least one skill.";
            valid = false;
        }

        
        const aboutVal = aboutInput.value.trim();
        if (!aboutVal) {
            document.getElementById("aboutError").textContent = "About field is required.";
            valid = false;
        } else if (aboutVal.length < 20 || aboutVal.length > 200) {
            document.getElementById("aboutError").textContent = "Must be 20 to 200 characters.";
            valid = false;
        }

        
        if (!isEditing && photoInput.files.length === 0) {
            document.getElementById("photoError").textContent = "Photo is required.";
            valid = false;
        }

        return valid;
    }

    
    function updateStats() {
        totalCount.textContent = students.length;

        const counts = {
            "Web Development": 0,
            "UI/UX": 0,
            "Python": 0,
            "Data Analytics": 0,
            "MERN Stack": 0,
            "Cloud Computing": 0
        };

        students.forEach(s => {
            if (counts[s.course] !== undefined) {
                counts[s.course]++;
            }
        });

        countWeb.textContent = counts["Web Development"];
        countUI.textContent = counts["UI/UX"];
        countPython.textContent = counts["Python"];
        countData.textContent = counts["Data Analytics"];
        countMERN.textContent = counts["MERN Stack"];
        countCloud.textContent = counts["Cloud Computing"];
    }

   
    function renderCards() {
        cardsContainer.innerHTML = "";

        const search = searchInput.value.toLowerCase().trim();
        const selectedCourse = courseFilter.value;

        const filtered = students.filter(student => {
            const matchName = student.name.toLowerCase().includes(search);
            const matchCourse = (selectedCourse === "All" || student.course === selectedCourse);
            return matchName && matchCourse;
        });

        if (filtered.length === 0) {
            emptyMsg.style.display = "block";
        } else {
            emptyMsg.style.display = "none";
        }

        filtered.forEach(student => {
            const card = document.createElement("div");
            card.classList.add("student-card");
            card.setAttribute("data-id", student.id);

            const img = document.createElement("img");
            img.classList.add("card-img");
            img.src = student.photo;
            img.alt = student.name;

            const name = document.createElement("h3");
            name.classList.add("card-name");
            name.textContent = student.name;

            const info = document.createElement("div");
            info.classList.add("card-info");
            info.innerHTML = `
                <p><b>Email:</b> ${student.email}</p>
                <p><b>Phone:</b> ${student.phone}</p>
                <p><b>DOB:</b> ${student.dob}</p>
                <p><b>Gender:</b> ${student.gender}</p>
                <p><b>Course:</b> ${student.course}</p>
                <p><b>Skills:</b> ${student.skills.join(", ")}</p>
            `;

            const about = document.createElement("p");
            about.classList.add("card-about");
            about.textContent = `About: ${student.about}`;

            const actions = document.createElement("div");
            actions.classList.add("card-actions");

            const editBtn = document.createElement("button");
            editBtn.classList.add("btn-secondary", "edit-btn");
            editBtn.type = "button";
            editBtn.textContent = "Edit";

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn-danger", "delete-btn");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Delete";

            actions.append(editBtn, deleteBtn);
            card.append(img, name, info, about, actions);
            cardsContainer.appendChild(card);
        });
    }

    // Reset Form
    function resetForm() {
        form.reset();
        studentId.value = "";
        charCount.textContent = "0 / 200";
        resetErrors();
        isEditing = false;
        currentPhotoCache = "";
        formHeading.textContent = "Student Registration";
        submitBtn.textContent = "Register Student";
    }

    resetBtn.addEventListener("click", resetForm);

    // Save or Edit
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(el => el.value);
        const gender = document.querySelector('input[name="gender"]:checked').value;

        function saveRecord(photoData) {
            if (isEditing) {
                const id = parseInt(studentId.value);
                const index = students.findIndex(s => s.id === id);
                if (index !== -1) {
                    students[index] = {
                        id: id,
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        phone: phoneInput.value.trim(),
                        dob: dobInput.value,
                        gender: gender,
                        course: courseSelect.value,
                        skills: skills,
                        about: aboutInput.value.trim(),
                        photo: photoData || currentPhotoCache
                    };
                }
            } else {
                const newStudent = {
                    id: Date.now(),
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    dob: dobInput.value,
                    gender: gender,
                    course: courseSelect.value,
                    skills: skills,
                    about: aboutInput.value.trim(),
                    photo: photoData
                };
                students.push(newStudent);
            }

            resetForm();
            updateStats();
            renderCards();
        }

        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => saveRecord(event.target.result);
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            saveRecord(null);
        }
    });

   
    cardsContainer.addEventListener("click", (e) => {
        const deleteButton = e.target.closest(".delete-btn");
        const editButton = e.target.closest(".edit-btn");

       
        if (deleteButton) {
            const card = deleteButton.closest(".student-card");
            const id = parseInt(card.getAttribute("data-id"));

            if (confirm("Are you sure you want to delete this student?")) {
                students = students.filter(s => s.id !== id);
                if (isEditing && parseInt(studentId.value) === id) {
                    resetForm();
                }
                updateStats();
                renderCards();
            }
            return;
        }

       
        if (editButton) {
            const card = editButton.closest(".student-card");
            const id = parseInt(card.getAttribute("data-id"));
            const student = students.find(s => s.id === id);

            if (!student) return;

            studentId.value = student.id;
            nameInput.value = student.name;
            emailInput.value = student.email;
            phoneInput.value = student.phone;
            dobInput.value = student.dob;
            courseSelect.value = student.course;
            aboutInput.value = student.about;
            charCount.textContent = `${student.about.length} / 200`;

            const genderRadio = document.querySelector(`input[name="gender"][value="${student.gender}"]`);
            if (genderRadio) genderRadio.checked = true;

            document.querySelectorAll('input[name="skills"]').forEach(cb => {
                cb.checked = student.skills.includes(cb.value);
            });

            currentPhotoCache = student.photo;
            isEditing = true;
            resetErrors();

            formHeading.textContent = "Edit Student Application";
            submitBtn.textContent = "Update Student";
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });

    // Search and Filter Listeners
    searchInput.addEventListener("input", renderCards);
    courseFilter.addEventListener("change", renderCards);

    // Initial setup
    updateStats();
    renderCards();
});