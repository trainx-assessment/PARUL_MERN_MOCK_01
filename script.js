var form = document.querySelector("#studentForm");
var studentContainer = document.querySelector("#studentContainer");
var submitBtn = document.querySelector("#submitBtn");
var resetBtn = document.querySelector("#resetBtn");
var searchInput = document.querySelector("#searchInput");
var courseFilter = document.querySelector("#courseFilter");
var charCount = document.querySelector("#charCount");
var aboutInput = document.querySelector("#about");
var statsContainer = document.querySelector("#statsContainer");
var resultCount = document.querySelector("#resultCount");
var themeBtn = document.querySelector("#themeBtn");
var photoInput = document.querySelector("#photo");
var courses = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];
var students = [];
var editingId = null;
var editingPhoto = "";

function getValue(id) {
    return document.querySelector("#" + id).value.trim();
}
function setError(id, message) {
    document.querySelector("#" + id + "Error").textContent = message;
}
function clearErrors() {
    var errors = document.querySelectorAll(".error");
    for (var i = 0; i < errors.length; i++) {
        errors[i].textContent = "";
    }
}
function getSelectedGender() {
    var genders = document.querySelectorAll('input[name="gender"]');
    for (var i = 0; i < genders.length; i++) {
        if (genders[i].checked) {
            return genders[i].value;
        }
    }
    return "";
}
function getSelectedSkills() {
    var checkboxes = document.querySelectorAll('input[name="skills"]:checked');
    var skills = [];
    for (var i = 0; i < checkboxes.length; i++) {
        skills.push(checkboxes[i].value);
    }
    return skills;
}
function calculateAge(dob) {
    var birthDate = new Date(dob);
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var month = today.getMonth() - birthDate.getMonth();

    if (
        month < 0 ||
        (month == 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return age;
}
function validateForm() {
    clearErrors();

    var valid = true;
    var name = getValue("studentName");
    var email = getValue("email");
    var phone = getValue("phone");
    var dob = getValue("dob");
    var gender = getSelectedGender();
    var course = document.querySelector("#course").value;
    var skills = getSelectedSkills();
    var about = getValue("about");
    var nameRegex = /^[A-Za-z ]{3,40}$/;

    if (name == "") {
        setError(
            "studentName",
            "Student name is required."
        );
        valid = false;
    } else if (!nameRegex.test(name)) {
        setError(
            "studentName",
            "Use 3-40 characters with letters and spaces only."
        );
        valid = false;
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email == "") {
        setError(
            "email",
            "Email is required."
        );
        valid = false;
    } else if (!emailRegex.test(email)) {
        setError(
            "email",
            "Enter a valid email address."
        );
        valid = false;
    }
    var phoneRegex = /^[0-9]{10}$/;
    if (phone == "") {
        setError(
            "phone",
            "Phone number is required."
        );
        valid = false;

    } else if (!phoneRegex.test(phone)) {
        setError(
            "phone",
            "Phone number must contain exactly 10 digits."
        );
        valid = false;
    }
    if (dob == "") {
        setError(
            "dob",
            "Date of birth is required."
        );
        valid = false;
    } else {
        var selectedDate = new Date(dob);
        var today = new Date();
        if (selectedDate > today) {
            setError(
                "dob",
                "Future dates are not allowed."
            );
            valid = false;
        } else {

            var age = calculateAge(dob);
            if (age < 15) {
                setError(
                    "dob",
                    "Student must be at least 15 years old."
                );
                valid = false;
            }
        }
    }
    if (gender == "") {
        setError(
            "gender",
            "Please select a gender."
        );
        valid = false;
    }
    if (course == "") {
        setError(
            "course",
            "Please select a course."
        );
        valid = false;
    }
    if (skills.length == 0) {
        setError(
            "skills",
            "Select at least one skill."
        );
        valid = false;
    }
    if (about == "") {
        setError(
            "about",
            "About Student is required."
        );
        valid = false;
    } else if (about.length < 20) {
        setError(
            "about",
            "About Student must be at least 20 characters."
        );
        valid = false;
    } else if (about.length > 200) {
        setError(
            "about",
            "About Student cannot exceed 200 characters."
        );
        valid = false;
    }
    if (editingId == null && !photoInput.files[0]) {
        setError(
            "photo",
            "Profile photo is required."
        );
        valid = false;
    }
    if (photoInput.files[0]) {
        var file = photoInput.files[0];
        var allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];
        var allowed = false;
        for (var i = 0; i < allowedTypes.length; i++) {
            if (file.type == allowedTypes[i]) {
                allowed = true;
            }
        }
        if (!allowed) {
            setError(
                "photo",
                "Only JPG, JPEG, and PNG files are accepted."
            );
            valid = false;
        }
    }
    return valid;
}
function readPhoto(file, callback) {
    if (!file) {
        callback(editingPhoto);
        return;
    }
    var reader = new FileReader();
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function () {
        setError(
            "photo",
            "Could not process the selected photo."
        );
    };
    reader.readAsDataURL(file);
}
function createStudentObject(photo) {
    var student = {
        id: editingId != null ? editingId : Date.now(),
        name: getValue("studentName"),
        email: getValue("email"),
        phone: getValue("phone"),
        dob: getValue("dob"),
        gender: getSelectedGender(),
        course: document.querySelector("#course").value,
        skills: getSelectedSkills(),
        about: getValue("about"),
        photo: photo
    };
    return student;
}
function renderStudents() {
    var searchText = searchInput.value.trim().toLowerCase();
    var selectedCourse = courseFilter.value;
    var count = 0;

    studentContainer.innerHTML = "";
    for (var i = 0; i < students.length; i++) {
        var student = students[i];
        var studentName = student.name.toLowerCase();
        var nameMatch = false;
        var courseMatch = false;

        if (studentName.indexOf(searchText) != -1) {
            nameMatch = true;
        }
        if (selectedCourse == "" || student.course == selectedCourse) {
            courseMatch = true;
        }
        if (nameMatch && courseMatch) {
            createStudentCard(student);
            count++;
        }
    }
    resultCount.textContent = count + " result(s)";
    if (count == 0) {
        var emptyMessage = document.createElement("div");
        emptyMessage.className = "empty";
        emptyMessage.textContent = "No students found";
        studentContainer.appendChild(emptyMessage);
    }
}
function createStudentCard(student) {
    var card = document.createElement("article");
    card.className = "student-card";
    card.setAttribute("data-id", student.id);

    var image = document.createElement("img");
    image.className = "student-photo";
    image.src = student.photo;
    image.alt = student.name + "'s profile photo";

    var content = document.createElement("div");
    content.className = "student-content";

    var heading = document.createElement("h3");
    heading.textContent = student.name;

    var email = document.createElement("p");
    email.textContent = "Email: " + student.email;

    var phone = document.createElement("p");
    phone.textContent = "Phone: " + student.phone;

    var dob = document.createElement("p");
    dob.textContent = "DOB: " + formatDate(student.dob);

    var gender = document.createElement("p");
    gender.textContent = "Gender: " + student.gender;

    var course = document.createElement("p");
    course.textContent = "Course: " + student.course;
    var skillsTitle = document.createElement("p");
    skillsTitle.textContent = "Skills:";
    var skillsDiv = document.createElement("div");
    skillsDiv.className = "skills";

    for (var i = 0; i < student.skills.length; i++) {
        var skill = document.createElement("span");
        skill.className = "skill";
        skill.textContent = student.skills[i];
        skillsDiv.appendChild(skill);
    }
    var about = document.createElement("p");
    about.textContent = "About: " + student.about;
    var actions = document.createElement("div");
    actions.className = "card-actions";
    var editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    editButton.onclick = function () {
        editStudent(student.id);
    };
    deleteButton.onclick = function () {
        deleteStudent(student.id);
    };
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    content.appendChild(heading);
    content.appendChild(email);
    content.appendChild(phone);
    content.appendChild(dob);
    content.appendChild(gender);
    content.appendChild(course);
    content.appendChild(skillsTitle);
    content.appendChild(skillsDiv);
    content.appendChild(about);
    content.appendChild(actions);
    card.appendChild(image);
    card.appendChild(content);
    studentContainer.appendChild(card);
}
function formatDate(dateString) {
    if (dateString == "") {
        return "";
    }
    var parts = dateString.split("-");
    var year = parts[0];
    var month = parts[1];
    var day = parts[2];
    return day + "/" + month + "/" + year;
}
function updateStatistics() {
    statsContainer.innerHTML = "";
    var totalStat = document.createElement("div");
    totalStat.className = "stat";
    var totalTitle = document.createElement("span");
    totalTitle.textContent = "Total Students";
    var totalNumber = document.createElement("strong");
    totalNumber.textContent = students.length;
    totalStat.appendChild(totalTitle);
    totalStat.appendChild(totalNumber);
    statsContainer.appendChild(totalStat);

    for (var i = 0; i < courses.length; i++) {
        var courseName = courses[i];
        var count = 0;
        for (var j = 0; j < students.length; j++) {
            if (students[j].course == courseName) {
               count++;
            }
        }
        var stat = document.createElement("div");
        stat.className = "stat";
        var title = document.createElement("span");
        title.textContent = courseName;
        var number = document.createElement("strong");
        number.textContent = count;
        stat.appendChild(title);
        stat.appendChild(number);
        statsContainer.appendChild(stat);
    }
}
function renderAll() {
    renderStudents();
    updateStatistics();
}
function resetForm() {
    form.reset();
    clearErrors();
    charCount.textContent = "0";
    editingId = null;
    editingPhoto = "";
    submitBtn.textContent = "Register Student";
}
function fillForm(student) {
    document.querySelector("#studentName").value = student.name;
    document.querySelector("#email").value = student.email;
    document.querySelector("#phone").value = student.phone;
    document.querySelector("#dob").value = student.dob;
    document.querySelector("#course").value = student.course;
    document.querySelector("#about").value = student.about;
    charCount.textContent = student.about.length;
    var genders = document.querySelectorAll(
        'input[name="gender"]'
    );
    for (var i = 0; i < genders.length; i++) {
        if (genders[i].value == student.gender) {
            genders[i].checked = true;
        } else {
            genders[i].checked = false;
        }
    }
    var checkboxes = document.querySelectorAll(
        'input[name="skills"]'
    );
    for (var i = 0; i < checkboxes.length; i++) {
        var found = false;
        for (var j = 0; j < student.skills.length; j++) {
            if (checkboxes[i].value == student.skills[j]) {
                found = true;
                break;
            }
        }
        checkboxes[i].checked = found;
    }
    editingId = student.id;
    editingPhoto = student.photo;
    submitBtn.textContent = "Update Student";
    window.scrollTo(0, 0);
}
function editStudent(id) {
    for (var i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            fillForm(students[i]);
            break;
        }
    }
}
function deleteStudent(id) {
    var answer = confirm(
        "Are you sure you want to delete this student?"
    );
    if (!answer) {
        return;
    }
    for (var i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            students.splice(i, 1);
            break;
        }
    }
    if (editingId == id) {
        resetForm();
    }
   renderAll();
}
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    var file = photoInput.files[0];
    readPhoto(file, function (photo) {
        if (editingId != null) {
            for (var i = 0; i < students.length; i++) {
                if (students[i].id == editingId) {
                    students[i] = createStudentObject(photo);
                    break;
                }
            }
        }
        else {
            var student = createStudentObject(photo);
            students.push(student);
        }
        renderAll();
        resetForm();
    });
});
searchInput.addEventListener("input", function () {
    renderStudents();
});
courseFilter.addEventListener("change", function () {
    renderStudents();
});
aboutInput.addEventListener("input", function () {
    charCount.textContent = aboutInput.value.length;

});
resetBtn.addEventListener("click", function () {
    resetForm();
});
themeBtn.addEventListener("click", function () {
    var body = document.body;
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        themeBtn.textContent = "Dark Mode";
    } else {
        body.classList.add("dark-mode");
        themeBtn.textContent = "Light Mode";
    }

});
renderAll();