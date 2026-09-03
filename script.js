let savedStudents = localStorage.getItem("students");
let students = [];

try {
    let parsedStudents = savedStudents ? JSON.parse(savedStudents) : [];
    if (Array.isArray(parsedStudents)) {
        students = parsedStudents;
    }
} catch (error) {
    students = [];
}

for (let i = 0; i < students.length; i++) {
    if (students[i].course === "computer-science") students[i].course = "Web Development";
    if (students[i].course === "mathematics") students[i].course = "UI/UX";
    if (students[i].course === "physics") students[i].course = "Python";
    if (!students[i].skills || students[i].skills.length === 0) {
        students[i].skills = ["Not provided"];
    }
}
saveStudents();

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function addStudent(event) {
    event.preventDefault();
    const form = document.getElementById("studentForm");

    if (!form.checkValidity()) {
        const message = document.getElementById("formMessage");
        if (message) message.textContent = "Please complete all required fields.";
        form.reportValidity();
        return;
    }

    let editId = Number(new URLSearchParams(window.location.search).get("edit"));
    let oldPhoto = "";
    if (editId) {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === editId) oldPhoto = students[i].photo;
        }
    }
    let selectedSkills = document.querySelectorAll('input[name="skills"]:checked');
    if (selectedSkills.length === 0) {
        alert("Please select at least one skill.");
        return;
    }

    let student = {
        id: editId || students.length + 1,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("date").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        course: document.getElementById("course").options[document.getElementById("course").selectedIndex].text,
        skills: [],
        about: document.getElementById("About").value,
        photo: oldPhoto
    };

    for (let i = 0; i < selectedSkills.length; i++) {
        student.skills.push(selectedSkills[i].value);
    }

    let photo = document.getElementById("Profile Image");

    function finishStudent(photoData) {
        student.photo = photoData;
        if (editId) {
            for (let i = 0; i < students.length; i++) {
                if (students[i].id === editId) students[i] = student;
            }
        } else {
            students.push(student);
        }
        saveStudents();
        form.reset();
        window.location.href = "student_dashboard.html";
    }

    if (photo.files.length > 0) {
        let reader = new FileReader();

        reader.onload = function() {
            finishStudent(reader.result);
        };

        reader.readAsDataURL(photo.files[0]);
    } else {
        finishStudent("");
    }
}

function showStudents() {
    let list = document.getElementById("studentList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    let searchBox = document.getElementById("searchStudent");
    let courseFilter = document.getElementById("courseFilter");
    let searchText = searchBox ? searchBox.value.toLowerCase() : "";
    let selectedCourse = courseFilter ? courseFilter.value : "All Courses";
    let visibleStudents = [];

    for (let i = 0; i < students.length; i++) {
        let nameMatches = students[i].name.toLowerCase().includes(searchText);
        let courseMatches = selectedCourse === "All Courses" || students[i].course === selectedCourse;
        if (nameMatches && courseMatches) visibleStudents.push(students[i]);
    }

    if (visibleStudents.length === 0) {
        if (students.length === 0) {
            list.innerHTML = '<p class="empty-state">No students registered yet.</p>';
        } else {
            list.innerHTML = '<p class="empty-state">No students found.</p>';
        }
        return;
    }

    for (let i = 0; i < visibleStudents.length; i++) {
        let student = visibleStudents[i];

        let card = document.createElement("div");
        card.className = "student-card";
        card.setAttribute("data-id", student.id);

        let photo = document.createElement("img");
        photo.className = "student-photo";
        photo.src = student.photo || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80";
        let name = document.createElement("h3");
        name.textContent = student.name;
        let email = document.createElement("p");
        email.textContent = "Email: " + student.email;
        let phone = document.createElement("p");
        phone.textContent = "Phone: " + student.phone;
        let dob = document.createElement("p");
        dob.textContent = "DOB: " + student.dob;
        let gender = document.createElement("p");
        gender.textContent = "Gender: " + student.gender;
        let course = document.createElement("p");
        course.textContent = "Course: " + student.course;
        let skills = document.createElement("p");
        skills.textContent = "Skills: " + (student.skills || []).join(", ");
        let about = document.createElement("p");
        about.textContent = "About: " + student.about;
        let actions = document.createElement("div");
        actions.className = "student-card-actions";
        let edit = document.createElement("a");
        edit.className = "card-button edit-button";
        edit.href = "student_register.html?edit=" + student.id;
        edit.textContent = "Edit";
        let button = document.createElement("button");
        button.className = "card-button delete-button";
        button.type = "button";
        button.textContent = "Delete";
        actions.append(edit, button);

        card.append(photo,name,email,phone,dob,gender,course,skills,about,actions);
        list.appendChild(card);
    }
}

function showStatistics() {
    const courseCounts = {
        "Web Development": 0,
        "UI/UX": 0,
        "Python": 0,
        "Data Analytics": 0,
        "MERN Stack": 0,
        "Cloud Computing": 0
    };
    for (let i =0;i <students.length; i++) {
        if (courseCounts[students[i].course] !== undefined) {
            courseCounts[students[i].course]++;
        }
    }
    const total = document.getElementById("totalStudents");
    const count = document.getElementById("studentCount");
    const indexCount = document.getElementById("indexStudentCount");
    if (total) total.textContent = students.length;
    if (count) count.textContent = "Total Students: "+students.length;
    if (indexCount) indexCount.textContent = "Total Students: " + students.length;

    const courseIds = {"Web Development": "web","UI/UX": "uiux","Python": "python","Data Analytics": "analytics","MERN Stack": "mern","Cloud Computing": "cloud"};
    for (let course in courseIds) {
        const element = document.getElementById(courseIds[course]);
        if (element) element.textContent = courseCounts[course];
    }
}
let form = document.getElementById("studentForm");
if (form) {
    form.addEventListener("submit", addStudent);
}
let list = document.getElementById("studentList");
if (list) {
    list.addEventListener("click", function(event) {
        if (!event.target.classList.contains("delete-button")) {
            return;
        }
        let card = event.target.closest(".student-card");
        let id = Number(card.getAttribute("data-id"));

        for(let i= 0;i <students.length; i++) {
            if (students[i].id == id) {
                students.splice(i, 1);
                break;
            }
        }
        saveStudents();
        showStudents();
        showStatistics();
    });
}

let searchStudent = document.getElementById("searchStudent");
let courseFilter = document.getElementById("courseFilter");
if (searchStudent) searchStudent.addEventListener("input", showStudents);
if (courseFilter) courseFilter.addEventListener("change", showStudents);

showStudents();
showStatistics();

let editId = Number(new URLSearchParams(window.location.search).get("edit"));
if (form && editId) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id === editId) {
            document.getElementById("name").value = students[i].name;
            document.getElementById("email").value = students[i].email;
            document.getElementById("phone").value = students[i].phone;
            document.getElementById("date").value = students[i].dob;
            document.getElementById("About").value = students[i].about;
            document.getElementById("submitButton").textContent = "Update Student";
            break;
        }
    }
}
