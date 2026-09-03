let students = [];
let editingStudentId = null;

document.addEventListener("DOMContentLoaded", function () {

    const studentForm = document.getElementById("studentForm");
    const studentName = document.getElementById("studentName");
    const studentEmail = document.getElementById("studentEmail");
    const studentPhone = document.getElementById("studentPhone");
    const studentDob = document.getElementById("studentDob");
    const studentCourse = document.getElementById("studentCourse");
    const studentAbout = document.getElementById("studentAbout");
    const studentPhoto = document.getElementById("studentPhoto");
    const charCount = document.getElementById("charCount");
    const submitBtn = document.getElementById("submitBtn");
    const resetBtn = document.getElementById("resetBtn");
    const studentContainer = document.getElementById("studentContainer");
    const noStudents = document.getElementById("noStudents");
    const searchInput = document.getElementById("searchInput");
    const filterCourse = document.getElementById("filterCourse");
    const darkModeBtn = document.getElementById("darkModeBtn");

    const statTotal = document.getElementById("statTotal");
    const statWebDev = document.getElementById("statWebDev");
    const statUiUx = document.getElementById("statUiUx");
    const statPython = document.getElementById("statPython");
    const statDataAnalytics = document.getElementById("statDataAnalytics");
    const statMern = document.getElementById("statMern");
    const statCloud = document.getElementById("statCloud");

    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        darkModeBtn.textContent = "Light Mode";
    }

    renderStudents(students);
    updateStatistics();

    function saveToLocalStorage() {
        const studentsToSave = students.map(function (student) {
            return {
                id: student.id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                dob: student.dob,
                gender: student.gender,
                course: student.course,
                skills: student.skills,
                about: student.about,
                photo: "saved"
            };
        });
        try {
            localStorage.setItem("students", JSON.stringify(studentsToSave));
        } catch (e) {
            localStorage.removeItem("students");
            localStorage.setItem("students", JSON.stringify(studentsToSave));
        }
    }

    studentAbout.addEventListener("input", function () {
        charCount.textContent = studentAbout.value.length + " / 200";
    });

    function showError(fieldId, errorElementId, message) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.classList.add("error");
        }
    }

    function clearError(fieldId, errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = "";
        }
        const inputElement = document.getElementById(fieldId);
        if (inputElement) {
            inputElement.classList.remove("error");
        }
    }

    function clearAllErrors() {
        document.querySelectorAll(".error-message").forEach(function (el) {
            el.textContent = "";
        });
        document.querySelectorAll(".error").forEach(function (el) {
            el.classList.remove("error");
        });
    }

    studentName.addEventListener("input", function () { clearError("studentName", "nameError"); });
    studentEmail.addEventListener("input", function () { clearError("studentEmail", "emailError"); });
    studentPhone.addEventListener("input", function () { clearError("studentPhone", "phoneError"); });
    studentDob.addEventListener("change", function () { clearError("studentDob", "dobError"); });
    studentCourse.addEventListener("change", function () { clearError("studentCourse", "courseError"); });
    studentAbout.addEventListener("input", function () { clearError("studentAbout", "aboutError"); });
    studentPhoto.addEventListener("change", function () { clearError("studentPhoto", "photoError"); });

    document.querySelectorAll('input[name="gender"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
            document.getElementById("genderError").textContent = "";
        });
    });

    document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            document.getElementById("skillsError").textContent = "";
        });
    });

    function validateForm() {
        let isValid = true;
        clearAllErrors();

        const nameValue = studentName.value.trim();
        const nameRegex = /^[A-Za-z\s]+$/;
        if (nameValue === "") {
            showError("studentName", "nameError", "Student Name is required.");
            isValid = false;
        } else if (nameValue.length < 3 || nameValue.length > 40) {
            showError("studentName", "nameError", "Name must be between 3 and 40 characters.");
            isValid = false;
        } else if (!nameRegex.test(nameValue)) {
            showError("studentName", "nameError", "Name can only contain letters and spaces.");
            isValid = false;
        }

        const emailValue = studentEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === "") {
            showError("studentEmail", "emailError", "Email is required.");
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            showError("studentEmail", "emailError", "Please enter a valid email address.");
            isValid = false;
        }

        const phoneValue = studentPhone.value.trim();
        const phoneRegex = /^\d{10}$/;
        if (phoneValue === "") {
            showError("studentPhone", "phoneError", "Phone number is required.");
            isValid = false;
        } else if (!phoneRegex.test(phoneValue)) {
            showError("studentPhone", "phoneError", "Phone number must be exactly 10 digits.");
            isValid = false;
        }

        const dobValue = studentDob.value;
        if (dobValue === "") {
            showError("studentDob", "dobError", "Date of Birth is required.");
            isValid = false;
        } else {
            const birthDate = new Date(dobValue);
            const today = new Date();
            if (birthDate > today) {
                showError("studentDob", "dobError", "Future dates are not accepted.");
                isValid = false;
            } else {
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (age < 15) {
                    showError("studentDob", "dobError", "Student must be at least 15 years old.");
                    isValid = false;
                }
            }
        }

        const selectedGender = document.querySelector('input[name="gender"]:checked');
        if (!selectedGender) {
            document.getElementById("genderError").textContent = "Please select a gender.";
            isValid = false;
        }

        if (studentCourse.value === "") {
            showError("studentCourse", "courseError", "Please select a course.");
            isValid = false;
        }

        const selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
        if (selectedSkills.length === 0) {
            document.getElementById("skillsError").textContent = "Please select at least one skill.";
            isValid = false;
        }

        const aboutValue = studentAbout.value.trim();
        if (aboutValue === "") {
            showError("studentAbout", "aboutError", "About Student is required.");
            isValid = false;
        } else if (aboutValue.length < 20 || aboutValue.length > 200) {
            showError("studentAbout", "aboutError", "About must be between 20 and 200 characters.");
            isValid = false;
        }

        if (!editingStudentId && studentPhoto.files.length === 0) {
            showError("studentPhoto", "photoError", "Profile photo is required.");
            isValid = false;
        } else if (studentPhoto.files.length > 0) {
            if (!studentPhoto.files[0].type.startsWith("image/")) {
                showError("studentPhoto", "photoError", "Only image files are accepted.");
                isValid = false;
            }
        }

        return isValid;
    }

    studentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const name = studentName.value.trim();
        const email = studentEmail.value.trim();
        const phone = studentPhone.value.trim();
        const dob = studentDob.value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const course = studentCourse.value;

        const skills = [];
        document.querySelectorAll('input[name="skills"]:checked').forEach(function (checkbox) {
            skills.push(checkbox.value);
        });

        const about = studentAbout.value.trim();

        if (studentPhoto.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                processStudentSave(name, email, phone, dob, gender, course, skills, about, e.target.result);
            };
            reader.readAsDataURL(studentPhoto.files[0]);
        } else {
            let existingPhoto = "https://via.placeholder.com/90?text=Photo";
            if (editingStudentId) {
                const existingStudent = students.find(function (s) { return s.id === editingStudentId; });
                if (existingStudent && existingStudent.photo && existingStudent.photo !== "saved") {
                    existingPhoto = existingStudent.photo;
                }
            }
            processStudentSave(name, email, phone, dob, gender, course, skills, about, existingPhoto);
        }
    });

    function processStudentSave(name, email, phone, dob, gender, course, skills, about, photo) {
        if (editingStudentId) {
            const index = students.findIndex(function (s) { return s.id === editingStudentId; });
            if (index !== -1) {
                students[index] = {
                    id: students[index].id,
                    name: name,
                    email: email,
                    phone: phone,
                    dob: dob,
                    gender: gender,
                    course: course,
                    skills: skills,
                    about: about,
                    photo: photo
                };
            }
            editingStudentId = null;
            submitBtn.textContent = "Register Student";
        } else {
            students.push({
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                dob: dob,
                gender: gender,
                course: course,
                skills: skills,
                about: about,
                photo: photo
            });
        }

        saveToLocalStorage();
        applyFilterAndSearch();
        updateStatistics();
        resetForm();
    }

    function resetForm() {
        studentForm.reset();
        charCount.textContent = "0 / 200";
        clearAllErrors();
        editingStudentId = null;
        submitBtn.textContent = "Register Student";
    }

    resetBtn.addEventListener("click", function (event) {
        event.preventDefault();
        resetForm();
    });

    function renderStudents(studentList) {
        studentContainer.innerHTML = "";

        if (studentList.length === 0) {
            noStudents.style.display = "block";
            return;
        }

        noStudents.style.display = "none";

        studentList.forEach(function (student) {
            const card = document.createElement("div");
            card.classList.add("student-card");
            card.setAttribute("data-id", student.id);

            const img = document.createElement("img");
            img.src = (student.photo && student.photo !== "saved") ? student.photo : "https://via.placeholder.com/90?text=Photo";
            img.alt = student.name;
            img.classList.add("student-photo");

            const heading = document.createElement("h3");
            heading.textContent = student.name;
            heading.classList.add("student-name");

            const pEmail = document.createElement("p");
            pEmail.innerHTML = "<strong>Email:</strong> " + student.email;

            const pPhone = document.createElement("p");
            pPhone.innerHTML = "<strong>Phone:</strong> " + student.phone;

            const pDob = document.createElement("p");
            pDob.innerHTML = "<strong>DOB:</strong> " + student.dob;

            const pGender = document.createElement("p");
            pGender.innerHTML = "<strong>Gender:</strong> " + student.gender;

            const pCourse = document.createElement("p");
            pCourse.innerHTML = "<strong>Course:</strong> " + student.course;

            const pSkills = document.createElement("p");
            pSkills.innerHTML = "<strong>Skills:</strong> " + student.skills.join(", ");

            const pAbout = document.createElement("p");
            pAbout.innerHTML = "<strong>About:</strong> " + student.about;

            const btnGroup = document.createElement("div");
            btnGroup.classList.add("card-buttons");

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.textContent = "Edit";
            editBtn.classList.add("edit-btn");

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");

            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            card.appendChild(img);
            card.appendChild(heading);
            card.appendChild(pEmail);
            card.appendChild(pPhone);
            card.appendChild(pDob);
            card.appendChild(pGender);
            card.appendChild(pCourse);
            card.appendChild(pSkills);
            card.appendChild(pAbout);
            card.appendChild(btnGroup);

            studentContainer.appendChild(card);
        });
    }

    studentContainer.addEventListener("click", function (event) {
        const card = event.target.closest(".student-card");
        if (!card) return;

        const studentId = Number(card.getAttribute("data-id"));

        if (event.target.classList.contains("delete-btn")) {
            const isConfirmed = confirm("Are you sure you want to delete this student?");
            if (isConfirmed) {
                students = students.filter(function (student) {
                    return student.id !== studentId;
                });

                if (editingStudentId === studentId) {
                    resetForm();
                }

                card.remove();

                if (students.length === 0) {
                    noStudents.style.display = "block";
                }

                saveToLocalStorage();
                updateStatistics();
            }
        }

        if (event.target.classList.contains("edit-btn")) {
            const studentToEdit = students.find(function (student) {
                return student.id === studentId;
            });

            if (studentToEdit) {
                editingStudentId = studentToEdit.id;
                studentName.value = studentToEdit.name;
                studentEmail.value = studentToEdit.email;
                studentPhone.value = studentToEdit.phone;
                studentDob.value = studentToEdit.dob;
                studentCourse.value = studentToEdit.course;
                studentAbout.value = studentToEdit.about;
                charCount.textContent = studentToEdit.about.length + " / 200";

                const genderRadio = document.querySelector('input[name="gender"][value="' + studentToEdit.gender + '"]');
                if (genderRadio) {
                    genderRadio.checked = true;
                }

                document.querySelectorAll('input[name="skills"]').forEach(function (checkbox) {
                    checkbox.checked = studentToEdit.skills.includes(checkbox.value);
                });

                submitBtn.textContent = "Update Student";
                studentForm.scrollIntoView({ behavior: "smooth" });
            }
        }
    });

    function updateStatistics() {
        statTotal.textContent = students.length;

        let webDevCount = 0;
        let uiUxCount = 0;
        let pythonCount = 0;
        let dataAnalyticsCount = 0;
        let mernCount = 0;
        let cloudCount = 0;

        students.forEach(function (student) {
            if (student.course === "Web Development") webDevCount++;
            else if (student.course === "UI/UX") uiUxCount++;
            else if (student.course === "Python") pythonCount++;
            else if (student.course === "Data Analytics") dataAnalyticsCount++;
            else if (student.course === "MERN Stack") mernCount++;
            else if (student.course === "Cloud Computing") cloudCount++;
        });

        statWebDev.textContent = webDevCount;
        statUiUx.textContent = uiUxCount;
        statPython.textContent = pythonCount;
        statDataAnalytics.textContent = dataAnalyticsCount;
        statMern.textContent = mernCount;
        statCloud.textContent = cloudCount;
    }

    function applyFilterAndSearch() {
        const searchQuery = searchInput.value.trim().toLowerCase();
        const selectedCourse = filterCourse.value;

        const filtered = students.filter(function (student) {
            const matchesName = student.name.toLowerCase().includes(searchQuery);
            const matchesCourse = selectedCourse === "All Courses" || student.course === selectedCourse;
            return matchesName && matchesCourse;
        });

        renderStudents(filtered);
    }

    searchInput.addEventListener("input", applyFilterAndSearch);
    filterCourse.addEventListener("change", applyFilterAndSearch);

    darkModeBtn.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeBtn.textContent = "Light Mode";
            localStorage.setItem("theme", "dark");
        } else {
            darkModeBtn.textContent = "Dark Mode";
            localStorage.setItem("theme", "light");
        }
    });

});
