const students = [];
const courseOptions = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];

let editingStudentId = null;

const form = document.getElementById("studentForm");
const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const studentPhoneInput = document.getElementById("studentPhone");
const studentDobInput = document.getElementById("studentDob");
const studentCourseInput = document.getElementById("studentCourse");
const aboutInput = document.getElementById("aboutStudent");
const photoInput = document.getElementById("studentPhoto");
const searchInput = document.getElementById("searchStudent");
const courseFilter = document.getElementById("courseFilter");
const studentContainer = document.getElementById("studentContainer");
const statsContainer = document.getElementById("statsContainer");
const charCount = document.getElementById("charCount");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const clearError = (fieldName) => {
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = "";
    }
};

const setError = (fieldName, message) => {
    const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorElement) {
        errorElement.textContent = message;
    }
};

const getSelectedGender = () => {
    const selected = document.querySelector('input[name="studentGender"]:checked');
    return selected ? selected.value : "";
};

const getSelectedSkills = () => {
    return [...document.querySelectorAll('input[name="skill"]:checked')].map((item) => item.value);
};

const updateCharCounter = () => {
    const length = aboutInput.value.length;
    charCount.textContent = length;
};

const escapeHtml = (value = "") => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const validateForm = async (studentData) => {
    const errors = {};

    if (!studentData.name || studentData.name.trim().length < 3) {
        errors.studentName = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z ]+$/.test(studentData.name.trim())) {
        errors.studentName = "Name can contain only letters and spaces.";
    } else if (studentData.name.trim().length > 40) {
        errors.studentName = "Name cannot exceed 40 characters.";
    }

    if (!studentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email.trim())) {
        errors.studentEmail = "Please enter a valid email address.";
    }

    if (!studentData.phone || !/^\d{10}$/.test(studentData.phone.trim())) {
        errors.studentPhone = "Phone number must be exactly 10 digits.";
    }

    if (!studentData.dob) {
        errors.studentDob = "Date of birth is required.";
    } else {
        const birthDate = new Date(studentData.dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (birthDate > today) {
            errors.studentDob = "Date of birth cannot be in the future.";
        } else if (age < 15 || (age === 15 && monthDiff < 0)) {
            errors.studentDob = "Student must be at least 15 years old.";
        }
    }

    if (!studentData.gender) {
        errors.studentGender = "Please select a gender.";
    }

    if (!studentData.course) {
        errors.studentCourse = "Please select a course.";
    }

    if (!studentData.skills || studentData.skills.length === 0) {
        errors.studentSkills = "Please select at least one skill.";
    }

    if (!studentData.about || studentData.about.trim().length < 20) {
        errors.aboutStudent = "About student must be at least 20 characters.";
    } else if (studentData.about.trim().length > 200) {
        errors.aboutStudent = "About student cannot exceed 200 characters.";
    }

    const photoFile = studentData.photoFile;
    if (!studentData.photo && !photoFile) {
        if (studentData.isEditing) {
            // Keep the existing student photo when editing without replacing it.
        } else {
            errors.studentPhoto = "Profile photo is required.";
        }
    } else if (photoFile) {
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const fileName = photoFile.name.toLowerCase();
        const isValidType = validTypes.includes(photoFile.type) || /\.(jpg|jpeg|png)$/i.test(fileName);

        if (!isValidType) {
            errors.studentPhoto = "Please upload a valid image file (.jpg, .jpeg, .png).";
        }
    }

    return errors;
};

const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read image file."));
        reader.readAsDataURL(file);
    });
};

const renderStatistics = () => {
    const counts = {};
    courseOptions.forEach((course) => {
        counts[course] = 0;
    });

    students.forEach((student) => {
        if (counts[student.course] !== undefined) {
            counts[student.course] += 1;
        }
    });

    let statsHtml = `<div class="stats-item">Total Students: ${students.length}</div>`;
    courseOptions.forEach((course) => {
        statsHtml += `<div class="stats-item">${course}: ${counts[course]}</div>`;
    });

    statsContainer.innerHTML = statsHtml;
};

const getFilteredStudents = () => {
    const searchTerm = (searchInput?.value || "").trim().toLowerCase();
    const filterCourse = (courseFilter?.value || "").trim();

    return students.filter((student) => {
        const matchesSearch = !searchTerm || student.name.toLowerCase().includes(searchTerm);
        // treat empty or 'All Courses' as no filter
        const matchesCourse = !filterCourse || filterCourse === "All Courses" || student.course === filterCourse;
        return matchesSearch && matchesCourse;
    });
};

const renderStudents = () => {
    const filteredStudents = getFilteredStudents();
    studentContainer.innerHTML = "";

    console.log('DEBUG renderStudents: filteredStudents =', filteredStudents);

    if (filteredStudents.length === 0) {
        studentContainer.innerHTML = '<p class="empty-message">No students found</p>';
        return;
    }

    filteredStudents.forEach((student) => {
        const card = document.createElement("article");
        card.className = "student-card";
        card.setAttribute("data-id", String(student.id));

        card.innerHTML = `
      <img src="${escapeHtml(student.photo)}" alt="${escapeHtml(student.name)} profile" class="student-photo" />
      <h3>${escapeHtml(student.name)}</h3>
      <p><strong>Email:</strong> ${escapeHtml(student.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(student.phone)}</p>
      <p><strong>DOB:</strong> ${escapeHtml(student.dob)}</p>
      <p><strong>Gender:</strong> ${escapeHtml(student.gender)}</p>
      <p><strong>Course:</strong> ${escapeHtml(student.course)}</p>
      <p><strong>Skills:</strong> ${escapeHtml(student.skills.join(", ") || "N/A")}</p>
      <p><strong>About:</strong> ${escapeHtml(student.about)}</p>
      <div class="card-actions">
        <button type="button" class="edit-btn">Edit</button>
        <button type="button" class="delete-btn">Delete</button>
      </div>
    `;

        studentContainer.appendChild(card);
    });

    console.log('DEBUG renderStudents: studentContainer children =', studentContainer.children.length);
};

const resetForm = () => {
    form.reset();
    aboutInput.value = "";
    updateCharCounter();
    editingStudentId = null;
    submitBtn.textContent = "Register Student";

    document.querySelectorAll(".error-message").forEach((msg) => {
        msg.textContent = "";
    });

    if (photoInput) {
        photoInput.value = "";
    }
};

const populateFormForEdit = (student) => {
    studentNameInput.value = student.name;
    studentEmailInput.value = student.email;
    studentPhoneInput.value = student.phone;
    studentDobInput.value = student.dob;
    aboutInput.value = student.about;
    updateCharCounter();

    document.querySelectorAll('input[name="studentGender"]').forEach((radio) => {
        radio.checked = radio.value === student.gender;
    });

    studentCourseInput.value = student.course;

    document.querySelectorAll('input[name="skill"]').forEach((checkbox) => {
        checkbox.checked = student.skills.includes(checkbox.value);
    });

    submitBtn.textContent = "Update Student";
    editingStudentId = student.id;
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentStudent = editingStudentId !== null
        ? students.find((student) => student.id === editingStudentId)
        : null;

    const studentData = {
        name: studentNameInput.value,
        email: studentEmailInput.value,
        phone: studentPhoneInput.value,
        dob: studentDobInput.value,
        gender: getSelectedGender(),
        course: studentCourseInput.value,
        skills: getSelectedSkills(),
        about: aboutInput.value,
        photo: currentStudent ? currentStudent.photo : "",
        photoFile: photoInput.files[0] || null,
        isEditing: Boolean(currentStudent)
    };

    const errors = await validateForm(studentData);

    Object.keys(errors).forEach((fieldName) => {
        setError(fieldName, errors[fieldName]);
    });

    Object.keys({
        studentName: studentNameInput,
        studentEmail: studentEmailInput,
        studentPhone: studentPhoneInput,
        studentDob: studentDobInput,
        studentGender: document.querySelector('input[name="studentGender"]'),
        studentCourse: studentCourseInput,
        studentSkills: document.querySelector('input[name="skill"]'),
        aboutStudent: aboutInput,
        studentPhoto: photoInput
    }).forEach((fieldName) => {
        if (!errors[fieldName]) {
            clearError(fieldName);
        }
    });

    if (Object.keys(errors).length > 0) {
        return;
    }

    try {
        const photoData = studentData.photoFile ? await readFileAsDataUrl(studentData.photoFile) : "";

        if (editingStudentId !== null) {
            const currentIndex = students.findIndex((student) => student.id === editingStudentId);
            if (currentIndex !== -1) {
                const currentStudent = students[currentIndex];
                students[currentIndex] = {
                    ...currentStudent,
                    name: studentData.name.trim(),
                    email: studentData.email.trim(),
                    phone: studentData.phone.trim(),
                    dob: studentData.dob,
                    gender: studentData.gender,
                    course: studentData.course,
                    skills: studentData.skills,
                    about: studentData.about.trim(),
                    photo: photoData || currentStudent.photo
                };
            }
            console.log('DEBUG: student updated, total students =', students.length);
        } else {
            students.push({
                id: Date.now(),
                name: studentData.name.trim(),
                email: studentData.email.trim(),
                phone: studentData.phone.trim(),
                dob: studentData.dob,
                gender: studentData.gender,
                course: studentData.course,
                skills: studentData.skills,
                about: studentData.about.trim(),
                photo: photoData
            });
            console.log('DEBUG: student added, total students =', students.length);
        }

        // show filtered count for debug
        try { console.log('DEBUG: filtered count =', getFilteredStudents().length); } catch (e) { /* ignore */ }

        renderStudents();
        renderStatistics();
        resetForm();
    } catch (error) {
        setError("studentPhoto", "Unable to process the selected image file.");
    }
});

studentContainer.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete-btn");
    if (deleteBtn) {
        const card = event.target.closest(".student-card");
        const studentId = Number(card?.dataset.id);

        if (card && window.confirm("Are you sure you want to delete this student?")) {
            const studentIndex = students.findIndex((student) => student.id === studentId);
            if (studentIndex !== -1) {
                students.splice(studentIndex, 1);
                renderStudents();
                renderStatistics();
            }
        }
        return;
    }

    const editBtn = event.target.closest(".edit-btn");
    if (editBtn) {
        const card = event.target.closest(".student-card");
        const studentId = Number(card?.dataset.id);
        const studentToEdit = students.find((student) => student.id === studentId);

        if (studentToEdit) {
            populateFormForEdit(studentToEdit);
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    }
});

searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);
aboutInput.addEventListener("input", updateCharCounter);

Object.entries({
    studentName: studentNameInput,
    studentEmail: studentEmailInput,
    studentPhone: studentPhoneInput,
    studentDob: studentDobInput,
    studentCourse: studentCourseInput,
    aboutStudent: aboutInput,
    studentPhoto: photoInput
}).forEach(([fieldName, input]) => {
    if (input) {
        input.addEventListener("input", () => clearError(fieldName));
        input.addEventListener("change", () => clearError(fieldName));
    }
});

document.querySelectorAll('input[name="studentGender"]').forEach((radio) => {
    radio.addEventListener("change", () => clearError("studentGender"));
});

document.querySelectorAll('input[name="skill"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => clearError("studentSkills"));
});

resetBtn.addEventListener("click", resetForm);


updateCharCounter();
renderStatistics();
renderStudents();
resetForm();
