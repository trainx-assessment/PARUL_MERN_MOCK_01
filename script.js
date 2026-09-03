document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const aboutTextarea = document.getElementById("student-about");
    const counterDisplay = document.getElementById("char-counter");
    const cardsContainer = document.querySelector(".cards-container");

    const totalStudentsCount = document.getElementById("total-students");
    const statElements = {
        "Web Development": document.getElementById("web-dev-count"),
        "UI/UX": document.getElementById("ui-ux-count"),
        "Python": document.getElementById("python-count"),
        "Data Analytics": document.getElementById("data-analytics-count"),
        "MERN Stack": document.getElementById("mern-count"),
        "Cloud Computing": document.getElementById("cloud-count")
    };

    const searchInput = document.getElementById("search-input");
    const filterCourse = document.getElementById("filter-course");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    const students = [];
    let editingId = null;

    aboutTextarea.addEventListener("input", () => {
        const currentLength = aboutTextarea.value.length;
        counterDisplay.textContent = `${currentLength} / 200`;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearAllErrors();

        let isValid = true;

        const nameInput = document.getElementById("name");
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameValue) {
            showError(nameInput, "Student name is required.");
            isValid = false;
        } else if (nameValue.length < 3 || nameValue.length > 40) {
            showError(nameInput, "Name must be between 3 and 40 characters.");
            isValid = false;
        } else if (!nameRegex.test(nameValue)) {
            showError(nameInput, "Name can only contain letters and spaces.");
            isValid = false;
        }

        const emailInput = document.getElementById("email");
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValue) {
            showError(emailInput, "Email is required.");
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            showError(emailInput, "Please enter a valid email address.");
            isValid = false;
        }

        const phoneInput = document.getElementById("phone");
        const phoneValue = phoneInput.value.trim();
        const phoneRegex = /^\d{10}$/;
        if (!phoneValue) {
            showError(phoneInput, "Phone number is required.");
            isValid = false;
        } else if (!phoneRegex.test(phoneValue)) {
            showError(phoneInput, "Phone number must be exactly 10 digits.");
            isValid = false;
        }

        const dobInput = document.getElementById("DateOfBirth");
        const dobValue = dobInput.value;
        if (!dobValue) {
            showError(dobInput, "Date of birth is required.");
            isValid = false;
        } else {
            const dobDate = new Date(dobValue);
            const today = new Date();

            if (dobDate > today) {
                showError(dobInput, "Future dates are not accepted.");
                isValid = false;
            } else {
                let age = today.getFullYear() - dobDate.getFullYear();
                const monthDiff = today.getMonth() - dobDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
                    age--;
                }
                if (age < 15) {
                    showError(dobInput, "Student must be at least 15 years old.");
                    isValid = false;
                }
            }
        }

        const genderRadios = document.getElementsByName("gender");
        let genderValue = "";
        for (const radio of genderRadios) {
            if (radio.checked) {
                genderValue = radio.value;
                break;
            }
        }
        if (!genderValue) {
            const genderWrapper = document.querySelector('input[name="gender"]').closest(".form-group");
            showError(genderWrapper, "At least one gender option must be selected.");
            isValid = false;
        }

        const courseSelect = document.getElementById("student-course");
        if (!courseSelect.value) {
            showError(courseSelect, "Please select a valid course.");
            isValid = false;
        }
        const courseText = courseSelect.options[courseSelect.selectedIndex].text;

        const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
        const selectedSkills = [];
        skillCheckboxes.forEach(cb => selectedSkills.push(cb.value));
        if (selectedSkills.length === 0) {
            const skillsWrapper = document.querySelector(".skills-group").closest(".form-group");
            showError(skillsWrapper, "At least one skill must be selected.");
            isValid = false;
        }

        const aboutValue = aboutTextarea.value;
        const aboutTrimmed = aboutValue.trim();
        if (!aboutValue) {
            showError(aboutTextarea, "About Student description is required.");
            isValid = false;
        } else if (!aboutTrimmed) {
            showError(aboutTextarea, "Spaces-only entries are not accepted.");
            isValid = false;
        } else if (aboutTrimmed.length < 20 || aboutTrimmed.length > 200) {
            showError(aboutTextarea, "Description must be between 20 and 200 characters.");
            isValid = false;
        }

        const photoInput = document.getElementById("profile-picture");
        let photoURL = "";
        if (!photoInput.files || photoInput.files.length === 0) {
            showError(photoInput, "Profile photo is required.");
            isValid = false;
        } else {
            const file = photoInput.files[0];
            const allowedTypes = ["image/jpeg", "image/png"];
            if (!allowedTypes.includes(file.type)) {
                showError(photoInput, "Only image files (.jpg, .jpeg, .png) are accepted.");
                isValid = false;
            } else {
                photoURL = URL.createObjectURL(file);
            }
        }

        if (isValid) {
            const studentObject = {
                id: editingId !== null ? editingId : Date.now(),
                name: nameValue,
                email: emailValue,
                phone: phoneValue,
                dob: dobValue,
                gender: genderValue,
                course: courseText,
                skills: selectedSkills,
                about: aboutTrimmed,
                photo: photoURL
            };

            if (editingId !== null) {
                const index = students.findIndex(s => s.id === editingId);
                if (index !== -1) {
                    if (!photoURL) {
                        studentObject.photo = students[index].photo;
                    }
                    students[index] = studentObject;
                }
                editingId = null;
                form.querySelector('button[type="submit"]').textContent = "Register";
            } else {
                students.push(studentObject);
            }

            filterAndRenderCards();
            updateStatistics();

            form.reset();
            counterDisplay.textContent = "0 / 200";
        }
    });

    form.querySelectorAll("input, select, textarea").forEach(input => {
        input.addEventListener("input", () => {
            clearFieldError(input);
        });
        input.addEventListener("change", () => {
            clearFieldError(input);
        });
    });

    form.querySelector('button[type="reset"]').addEventListener("click", () => {
        clearAllErrors();
        editingId = null;
        form.querySelector('button[type="submit"]').textContent = "Register";
        setTimeout(() => {
            counterDisplay.textContent = "0 / 200";
        }, 0);
    });

    searchInput.addEventListener("input", filterAndRenderCards);
    filterCourse.addEventListener("change", filterAndRenderCards);

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    });

    const courseValueMap = {
        "Web Development": "web-dev",
        "UI/UX": "ui-ux",
        "Python": "python",
        "Data Analytics": "data-analytics",
        "MERN Stack": "mern-stack",
        "Cloud Computing": "cloud-computing"
    };

    function filterAndRenderCards() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const courseFilter = filterCourse.value;

        const filtered = students.filter(student => {
            const nameMatch = student.name.toLowerCase().includes(searchTerm);
            const studentCourseValue = courseValueMap[student.course] || "";
            const courseMatch = courseFilter === "all" || studentCourseValue === courseFilter;
            return nameMatch && courseMatch;
        });

        renderStudentCards(filtered);
    }

    function renderStudentCards(list) {
        cardsContainer.innerHTML = "";
        const displayList = list || students;

        displayList.forEach(student => {
            const card = document.createElement("div");
            card.classList.add("student-card");
            card.setAttribute("data-id", student.id);

            const dobFormatted = new Date(student.dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });

            const img = document.createElement("img");
            img.src = student.photo;
            img.alt = student.name;
            img.classList.add("card-avatar");

            const nameEl = document.createElement("h3");
            nameEl.textContent = student.name;

            const photoLabel = document.createElement("p");
            photoLabel.classList.add("card-label");
            photoLabel.textContent = "Student Photo";

            card.appendChild(photoLabel);
            card.appendChild(img);
            card.appendChild(nameEl);

            const fields = [
                { label: "Email", value: student.email },
                { label: "Phone", value: student.phone },
                { label: "DOB", value: dobFormatted },
                { label: "Gender", value: student.gender.charAt(0).toUpperCase() + student.gender.slice(1) },
                { label: "Course", value: student.course }
            ];

            fields.forEach(field => {
                const p = document.createElement("p");
                p.innerHTML = `<strong>${field.label}:</strong> ${field.value}`;
                card.appendChild(p);
            });

            const skillsHeading = document.createElement("p");
            skillsHeading.innerHTML = "<strong>Skills:</strong>";
            card.appendChild(skillsHeading);

            const skillsDiv = document.createElement("div");
            skillsDiv.classList.add("card-skills");
            student.skills.forEach(skill => {
                const span = document.createElement("span");
                span.textContent = skill;
                skillsDiv.appendChild(span);
            });
            card.appendChild(skillsDiv);

            const aboutP = document.createElement("p");
            aboutP.innerHTML = `<strong>About:</strong> ${student.about}`;
            card.appendChild(aboutP);

            const btnGroup = document.createElement("div");
            btnGroup.classList.add("card-buttons");

            const editBtn = document.createElement("button");
            editBtn.type = "button";
            editBtn.classList.add("edit-btn");
            editBtn.textContent = "Edit";
            editBtn.addEventListener("click", () => {
                editStudent(student.id);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "Delete";

            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);
            card.appendChild(btnGroup);

            cardsContainer.appendChild(card);
        });
    }

    function editStudent(id) {
        const student = students.find(s => s.id === id);
        if (!student) return;

        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;
        document.getElementById("DateOfBirth").value = student.dob;

        const genderRadios = document.getElementsByName("gender");
        for (const radio of genderRadios) {
            radio.checked = radio.value === student.gender;
        }

        const courseSelect = document.getElementById("student-course");
        for (let i = 0; i < courseSelect.options.length; i++) {
            if (courseSelect.options[i].text === student.course) {
                courseSelect.selectedIndex = i;
                break;
            }
        }

        document.querySelectorAll('input[name="skills"]').forEach(cb => {
            cb.checked = student.skills.includes(cb.value);
        });

        aboutTextarea.value = student.about;
        counterDisplay.textContent = `${student.about.length} / 200`;

        editingId = id;
        form.querySelector('button[type="submit"]').textContent = "Update";
        form.scrollIntoView({ behavior: "smooth" });
    }

    cardsContainer.addEventListener("click", (event) => {
        const deleteBtn = event.target.closest(".delete-btn");
        if (!deleteBtn) return;

        const card = event.target.closest(".student-card");
        if (!card) return;

        const id = Number(card.getAttribute("data-id"));
        const confirmed = confirm("Are you sure you want to delete this student?");
        if (confirmed) {
            deleteStudent(id);
        }
    });

    function deleteStudent(id) {
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students.splice(index, 1);
        }
        filterAndRenderCards();
        updateStatistics();
    }

    function updateStatistics() {
        totalStudentsCount.textContent = students.length;

        Object.keys(statElements).forEach(course => {
            const count = students.filter(student => student.course === course).length;
            statElements[course].textContent = count;
        });
    }

    function showError(element, message) {
        const container = element.classList.contains("form-group") ? element : element.closest(".form-group");
        if (!container) return;
        container.classList.add("error-active");

        let errorSpan = container.querySelector(".error-msg");
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.classList.add("error-msg");
            container.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
    }

    function clearFieldError(element) {
        const container = element.closest(".form-group");
        if (container && container.classList.contains("error-active")) {
            container.classList.remove("error-active");
            const errorSpan = container.querySelector(".error-msg");
            if (errorSpan) {
                errorSpan.remove();
            }
        }
    }

    function clearAllErrors() {
        document.querySelectorAll(".form-group").forEach(container => {
            container.classList.remove("error-active");
            const errorSpan = container.querySelector(".error-msg");
            if (errorSpan) {
                errorSpan.remove();
            }
        });
    }
});
