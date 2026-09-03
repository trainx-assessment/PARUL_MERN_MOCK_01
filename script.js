document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("student-form");
    const nameInput = document.getElementById("studentName");
    const nameCharCountDisplay = document.getElementById("nameCharCount");
    const aboutInput = document.getElementById("about");
    const charCountDisplay = document.getElementById("charCount");

    let studentContainer = document.getElementById("student-container") || document.querySelector(".student-cards");

    if (!studentContainer) {
        studentContainer = document.createElement("div");
        studentContainer.id = "student-container";
        document.body.appendChild(studentContainer);
    }

    let statsContainer = document.getElementById("stats-container");

    if (!statsContainer) {
        statsContainer = document.createElement("div");
        statsContainer.id = "stats-container";
        document.body.insertBefore(statsContainer, studentContainer);
    }

    const students = [];

    if (nameInput && nameCharCountDisplay) {
        nameInput.addEventListener("input", function () {
            const length = nameInput.value.trim().length;

            nameCharCountDisplay.textContent = length;

            if (length < 5 || length > 25) {
                nameCharCountDisplay.style.color = "#e74c3c";
                nameCharCountDisplay.style.fontWeight = "bold";
            } else {
                nameCharCountDisplay.style.color = "#2ecc71";
                nameCharCountDisplay.style.fontWeight = "normal";
            }
        });
    }

    if (aboutInput && charCountDisplay) {
        aboutInput.addEventListener("input", function () {
            const length = aboutInput.value.trim().length;

            charCountDisplay.textContent = length;

            if (length < 20 || length > 200) {
                charCountDisplay.style.color = "#e74c3c";
                charCountDisplay.style.fontWeight = "bold";
            } else {
                charCountDisplay.style.color = "#2ecc71";
                charCountDisplay.style.fontWeight = "normal";
            }
        });
    }

    function updateStats() {
        if (!statsContainer) return;

        const total = students.length;

        const courses = [
            "Web Development",
            "UI/UX",
            "Python",
            "Data Analytics",
            "MERN Stack",
            "Cloud Computing"
        ];

        let statsHTML = `<h3>Student Statistics</h3>`;

        statsHTML += `<p><strong>Total Registered Students:</strong> ${total}</p><ul>`;

        courses.forEach(c => {
            const count = students.filter(s => s.course === c).length;

            statsHTML += `<li><strong>${c}:</strong> ${count}</li>`;
        });

        statsHTML += `</ul>`;

        statsContainer.innerHTML = statsHTML;
    }

    function renderStudents() {
        studentContainer.innerHTML = "";

        students.forEach((student) => {

            const card = document.createElement("div");

            card.className = "student-card";

            card.setAttribute("data-id", student.id);

            card.innerHTML = `
                <img src="${student.photo}" alt="${student.name}" width="100" style="border-radius: 8px;">
                <h3>${student.name}</h3>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Phone:</strong> ${student.phone}</p>
                <p><strong>DOB:</strong> ${student.dob}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
                <p><strong>About:</strong> ${student.about}</p>
                <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            `;

            studentContainer.appendChild(card);
        });
    }

    window.deleteStudent = function (id) {

        const index = students.findIndex(s => s.id === id);

        if (index !== -1) {
            students.splice(index, 1);

            renderStudents();

            updateStats();

            console.log("Updated Students Array:", students);
        }
    };

    window.editStudent = function (id) {

        const student = students.find(s => s.id === id);

        if (!student) return;

        document.getElementById("studentName").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;
        document.getElementById("dob").value = student.dob;

        const genderRadio = document.querySelector(
            `input[name="gender"][value="${student.gender}"]`
        );

        if (genderRadio) {
            genderRadio.checked = true;
        }

        document.getElementById("course").value = student.course;

        document.querySelectorAll('input[name="skills"]').forEach(cb => {
            cb.checked = student.skills.includes(cb.value);
        });

        if (nameInput) {

            nameInput.value = student.name;

            if (nameCharCountDisplay) {

                const length = student.name.trim().length;

                nameCharCountDisplay.textContent = length;

                nameCharCountDisplay.style.color =
                    (length >= 5 && length <= 25)
                        ? "#2ecc71"
                        : "#e74c3c";

                nameCharCountDisplay.style.fontWeight =
                    (length >= 5 && length <= 25)
                        ? "normal"
                        : "bold";
            }
        }

        if (aboutInput) {

            aboutInput.value = student.about;

            if (charCountDisplay) {

                const length = student.about.length;

                charCountDisplay.textContent = length;

                charCountDisplay.style.color =
                    (length >= 20 && length <= 200)
                        ? "#2ecc71"
                        : "#e74c3c";

                charCountDisplay.style.fontWeight =
                    (length >= 20 && length <= 200)
                        ? "normal"
                        : "bold";
            }
        }

        deleteStudent(id);
    };

    updateStats();

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        let isValid = true;

        function check(condition, el, msg) {

            if (!el) return;

            const parent = el.closest("div") || el.parentElement;

            let errorSpan = parent.querySelector(".error-message");

            if (!errorSpan) {

                errorSpan = document.createElement("span");

                errorSpan.className = "error-message";

                errorSpan.style.color = "#e74c3c";
                errorSpan.style.fontSize = "0.85rem";
                errorSpan.style.display = "block";

                parent.appendChild(errorSpan);
            }

            if (condition) {

                errorSpan.textContent = msg;

                isValid = false;

            } else {

                errorSpan.textContent = "";
            }
        }

        const nameEl = document.getElementById("studentName");

        const name = nameEl
            ? nameEl.value.trim()
            : "";

        const isNameValid =
            /^[A-Za-z]+(\s[A-Za-z]+)*$/.test(name) &&
            name.length >= 5 &&
            name.length <= 25;

        check(
            !name || !isNameValid,
            nameEl,
            "5 to 25 characters; only single spaces between letters permitted"
        );

        const emailEl = document.getElementById("email");

        const email = emailEl
            ? emailEl.value.trim()
            : "";

        check(
            !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            emailEl,
            "Enter a valid email address"
        );

        const phoneEl = document.getElementById("phone");

        const phone = phoneEl
            ? phoneEl.value.trim()
            : "";

        check(
            !phone || !/^[0-9]{10}$/.test(phone),
            phoneEl,
            "Must be exactly 10 digits"
        );

        const dobEl = document.getElementById("dob");

        const dob = dobEl
            ? dobEl.value
            : "";

        if (!dob) {

            check(
                true,
                dobEl,
                "Date of birth is required"
            );

        } else {

            const today = new Date();

            const birthDate = new Date(dob);

            let age =
                today.getFullYear() -
                birthDate.getFullYear();

            const m =
                today.getMonth() -
                birthDate.getMonth();

            if (
                m < 0 ||
                (m === 0 &&
                    today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            check(
                birthDate > today || age < 15,
                dobEl,
                "Must be at least 15 years old and not in the future"
            );
        }

        const genderChecked =
            document.querySelector(
                'input[name="gender"]:checked'
            );

        const genderEl =
            document.querySelector(
                'input[name="gender"]'
            );

        check(
            !genderChecked,
            genderEl,
            "Please select a gender"
        );

        const courseEl =
            document.getElementById("course");

        const course =
            courseEl
                ? courseEl.value
                : "";

        check(
            !course ||
            course === "Select Course" ||
            course === "",
            courseEl,
            "Please select a course"
        );

        const skillsChecked =
            document.querySelectorAll(
                'input[name="skills"]:checked'
            );

        const skillsEl =
            document.querySelector(
                'input[name="skills"]'
            );

        check(
            !skillsChecked.length,
            skillsEl,
            "Please select at least one skill"
        );

        const about =
            aboutInput
                ? aboutInput.value.trim()
                : "";

        check(
            !about ||
            about.length < 20 ||
            about.length > 200,
            aboutInput,
            "Must be between 20 and 200 characters"
        );

        const photoEl =
            document.getElementById("profilePhoto");

        const file =
            photoEl && photoEl.files
                ? photoEl.files[0]
                : null;

        const isPhotoValid =
            file &&
            [
                "image/jpeg",
                "image/png",
                "image/jpg"
            ].includes(file.type) &&
            file.size <= 2 * 1024 * 1024;

        check(
            !isPhotoValid,
            photoEl,
            "JPG/PNG image under 2MB required"
        );

        if (isValid) {

            const student = {

                id: Date.now(),

                name: name,

                email: email,

                phone: phone,

                dob: dob,

                gender: genderChecked.value,

                course: course,

                skills:
                    Array.from(skillsChecked)
                        .map(cb => cb.value),

                about: about,

                photo:
                    URL.createObjectURL(file)
            };

            students.push(student);

            console.log(
                "Current Students Array:",
                students
            );

            renderStudents();

            updateStats();

            alert(
                "Student registered and stored successfully!"
            );

            form.reset();

            if (nameCharCountDisplay) {
                nameCharCountDisplay.textContent = "0"
                nameCharCountDisplay.style.color = "inherit";
                nameCharCountDisplay.style.fontWeight = "normal";
            }

            if (charCountDisplay) {
                charCountDisplay.textContent = "0";
                charCountDisplay.style.color = "inherit";
                charCountDisplay.style.fontWeight = "normal";
            }
        }
    });
});