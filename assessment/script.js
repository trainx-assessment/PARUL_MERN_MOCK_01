const form = document.getElementById("student-form");
const errorContainer = document.getElementById("error-messages");
const aboutInput = document.getElementById("about");
const charCount = document.getElementById("char-count");
const cardsContainer = document.querySelector(".student-cards-container");

const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");

const students = [];
let editingStudentId = null;

aboutInput.addEventListener("input", function() {
    const currentLength = aboutInput.value.length;
    charCount.textContent = currentLength + " / 200";
});

function updateStats() {
    let total = students.length;
    let web = 0;
    let ui = 0;
    let python = 0;
    let data = 0;
    let mern = 0;
    let cloud = 0;

    for (let i = 0; i < students.length; i++) {
        const c = students[i].course;
        if (c === "Web Development") { web++; }
        if (c === "UI/UX") { ui++; }
        if (c === "Python") { python++; }
        if (c === "Data Analytics") { data++; }
        if (c === "MERN Stack") { mern++; }
        if (c === "Cloud Computing") { cloud++; }
    }

    document.getElementById("stat-total").textContent = "Total Students: " + total;
    document.getElementById("stat-web").textContent = "Web Development: " + web;
    document.getElementById("stat-ui").textContent = "UI/UX: " + ui;
    document.getElementById("stat-python").textContent = "Python: " + python;
    document.getElementById("stat-data").textContent = "Data Analytics: " + data;
    document.getElementById("stat-mern").textContent = "MERN Stack: " + mern;
    document.getElementById("stat-cloud").textContent = "Cloud Computing: " + cloud;
}

function renderCards() {
    cardsContainer.innerHTML = "";
    
    const searchText = searchInput.value.toLowerCase();
    const filterCourse = courseFilter.value;
    
    let matchCount = 0;

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
        let nameMatch = false;
        if (student.name.toLowerCase().indexOf(searchText) !== -1) {
            nameMatch = true;
        }
        
        let courseMatch = false;
        if (filterCourse === "All Courses" || student.course === filterCourse) {
            courseMatch = true;
        }

        if (nameMatch && courseMatch) {
            matchCount++;
            
            const card = document.createElement("div");
            card.classList.add("student-card");
            card.setAttribute("data-id", student.id);

            const nameEl = document.createElement("h3");
            nameEl.textContent = student.name;

            const emailEl = document.createElement("p");
            emailEl.textContent = "Email: " + student.email;

            const phoneEl = document.createElement("p");
            phoneEl.textContent = "Phone: " + student.phone;

            const dobEl = document.createElement("p");
            dobEl.textContent = "DOB: " + student.dob;

            const genderEl = document.createElement("p");
            genderEl.textContent = "Gender: " + student.gender;

            const courseEl = document.createElement("p");
            courseEl.textContent = "Course: " + student.course;

            const skillsEl = document.createElement("p");
            skillsEl.textContent = "Skills: " + student.skills.join(", ");

            const aboutEl = document.createElement("p");
            aboutEl.textContent = "About: " + student.about;

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("btn-container");

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.classList.add("edit-btn");

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.classList.add("delete-btn");

            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);

            card.appendChild(nameEl);
            card.appendChild(emailEl);
            card.appendChild(phoneEl);
            card.appendChild(dobEl);
            card.appendChild(genderEl);
            card.appendChild(courseEl);
            card.appendChild(skillsEl);
            card.appendChild(aboutEl);
            card.appendChild(btnContainer);

            cardsContainer.appendChild(card);
        }
    }

    if (matchCount === 0) {
        const msg = document.createElement("p");
        msg.textContent = "No students found";
        msg.classList.add("no-results");
        cardsContainer.appendChild(msg);
    }
}

searchInput.addEventListener("input", renderCards);
courseFilter.addEventListener("change", renderCards);

form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    errorContainer.innerHTML = "";
    let hasErrors = false;

    function showError(message) {
        const p = document.createElement("p");
        p.textContent = message;
        errorContainer.appendChild(p);
        hasErrors = true;
    }

    const name = document.getElementById("studentName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const about = document.getElementById("about").value;
    const photo = document.getElementById("photo").value;

    const genders = document.getElementsByName("gender");
    let genderSelected = false;
    let selectedGender = "";
    for (let i = 0; i < genders.length; i++) {
        if (genders[i].checked) {
            genderSelected = true;
            selectedGender = genders[i].value;
            break;
        }
    }

    const skills = document.getElementsByName("skills");
    let skillsCount = 0;
    let selectedSkills = [];
    for (let i = 0; i < skills.length; i++) {
        if (skills[i].checked) {
            skillsCount++;
            selectedSkills.push(skills[i].value);
        }
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (name.length < 3 || name.length > 40) {
        showError("Student Name must be between 3 and 40 characters.");
    } else if (!nameRegex.test(name)) {
        showError("Student Name must contain only letters and spaces.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("Please enter a valid email address.");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        showError("Phone Number must be exactly 10 digits.");
    }

    if (!dob) {
        showError("Date of Birth is required.");
    } else {
        const dobDate = new Date(dob);
        const today = new Date();
        
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
        }

        if (dobDate > today) {
            showError("Date of Birth cannot be in the future.");
        } else if (age < 15) {
            showError("Student must be at least 15 years old.");
        }
    }

    if (!genderSelected) {
        showError("Please select a Gender.");
    }

    if (course === "") {
        showError("Please select a Course.");
    }

    if (skillsCount === 0) {
        showError("Please select at least one Skill.");
    }

    const aboutTrimmed = about.trim();
    if (aboutTrimmed.length < 20) {
        showError("About Student must be at least 20 characters long.");
    } else if (aboutTrimmed.length > 200) {
        showError("About Student cannot exceed 200 characters.");
    }

    if (!photo && editingStudentId === null) {
        showError("Profile Photo is required.");
    } else if (photo) {
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        if (!allowedExtensions.test(photo)) {
            showError("Profile Photo must be a valid image file (.jpg, .jpeg, .png).");
        }
    }

    if (hasErrors) {
        window.scrollTo(0, 0);
        return;
    }

    if (editingStudentId !== null) {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === editingStudentId) {
                students[i].name = name;
                students[i].email = email;
                students[i].phone = phone;
                students[i].dob = dob;
                students[i].gender = selectedGender;
                students[i].course = course;
                students[i].skills = selectedSkills;
                students[i].about = aboutTrimmed;
                if (photo) {
                    students[i].photo = photo;
                }
                break;
            }
        }
        document.querySelector("button[type='submit']").textContent = "Register Student";
        editingStudentId = null;
    } else {
        const studentId = Date.now().toString();
        const studentObj = {
            id: studentId,
            name: name,
            email: email,
            phone: phone,
            dob: dob,
            gender: selectedGender,
            course: course,
            skills: selectedSkills,
            about: aboutTrimmed,
            photo: photo
        };
        students.push(studentObj);
    }

    form.reset();
    charCount.textContent = "0 / 200";
    
    updateStats();
    renderCards();
});

cardsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (confirmDelete) {
            const card = event.target.closest(".student-card");
            const id = card.getAttribute("data-id");
            
            for (let i = 0; i < students.length; i++) {
                if (students[i].id === id) {
                    students.splice(i, 1);
                    break;
                }
            }
            
            updateStats();
            renderCards();
        }
    }
    
    if (event.target.classList.contains("edit-btn")) {
        const card = event.target.closest(".student-card");
        const id = card.getAttribute("data-id");
        
        let student = null;
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === id) {
                student = students[i];
                break;
            }
        }
        
        if (student) {
            document.getElementById("studentName").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("phone").value = student.phone;
            document.getElementById("dob").value = student.dob;
            document.getElementById("course").value = student.course;
            document.getElementById("about").value = student.about;
            
            const genders = document.getElementsByName("gender");
            for (let i = 0; i < genders.length; i++) {
                if (genders[i].value === student.gender) {
                    genders[i].checked = true;
                } else {
                    genders[i].checked = false;
                }
            }
            
            const skills = document.getElementsByName("skills");
            for (let i = 0; i < skills.length; i++) {
                let hasSkill = false;
                for (let j = 0; j < student.skills.length; j++) {
                    if (student.skills[j] === skills[i].value) {
                        hasSkill = true;
                    }
                }
                if (hasSkill) {
                    skills[i].checked = true;
                } else {
                    skills[i].checked = false;
                }
            }
            
            charCount.textContent = student.about.length + " / 200";
            document.querySelector("button[type='submit']").textContent = "Update Student";
            editingStudentId = id;
            
            window.scrollTo(0, 0);
        }
    }
});