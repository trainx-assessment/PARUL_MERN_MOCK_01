const students = [];
let editingStudentId = null;
const form = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentPhone = document.getElementById("studentPhone");
const studentDob = document.getElementById("studentDob");
const course = document.getElementById("course");
const aboutStudent = document.getElementById("aboutStudent");
const profilePhoto = document.getElementById("profilePhoto");
const characterCount = document.getElementById("characterCount");
const studentContainer = document.getElementById("studentContainer");
const submitButton = document.getElementById("submitButton");
const searchStudent = document.getElementById("searchStudent");
const courseFilter = document.getElementById("courseFilter");
aboutStudent.addEventListener("input", function() {
    characterCount.textContent = aboutStudent.value.length;
});
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const name = studentName.value.trim();
    const namePattern = /^[A-Za-z ]+$/;
    if (name === "") {
       alert("Name is required");
        return;
    }
    else if (name.length < 3) {
        alert("Name must be at least 3 characters");
        return;
    }
    else if (name.length > 40) {
        alert("Name cannot be more than 40 characters");
        return;
    }
    else if (!namePattern.test(name)) {
        alert("Name can contain only letters and spaces");
        return;
    }

    const email = studentEmail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
       alert("Email is required");
        return;
    }
    else if (!emailPattern.test(email)) {
        alert("Enter a valid email");
        return;
    }
    const phone = studentPhone.value.trim();
    const phonePattern = /^[0-9]{10}$/;
    if (phone === "") {
        alert("Phone number is required");
        return;
    }
    else if (!phonePattern.test(phone)) {
        alert("Phone number must contain exactly 10 digits");
        return;
    }

    const dob = studentDob.value;
    if (dob === "") {
        alert("Date of birth is required");
        return;
    }
    else {
        const selectedDate = new Date(dob);
        const today = new Date();
        if (selectedDate > today){
            alert("Future date is not allowed");
            return;
        }
            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDifference =
                today.getMonth() - selectedDate.getMonth();
            if (
                monthDifference < 0 ||
                (
                    monthDifference === 0 &&
                    today.getDate() < selectedDate.getDate()
                )
            ) {
                age--;
            }
            if (age < 15) {
            alert("Student must be at least 15 years old");
            return;
            }
    }
    const genderOptions =
        document.querySelectorAll('input[name="gender"]');
    let gender = "";
    for (let i = 0; i < genderOptions.length; i++) {
        if (genderOptions[i].checked) {
            gender = genderOptions[i].value;
        }
    }
    if (gender === "") {
        alert("Please select a gender");
        return;
    }
    const selectedCourse = course.value;
    if (selectedCourse === "") {
        alert("Please select a course");
        return;
    }
    const skillOptions =
        document.querySelectorAll('input[name="skills"]');
    const skills = [];
    for (let i = 0; i < skillOptions.length; i++) {
        if (skillOptions[i].checked) {
            skills.push(skillOptions[i].value);
        }
    }
    if (skills.length === 0) {
        alert("Please select at least one skill");
        return;
    }
    const about = aboutStudent.value.trim();
    if (about === "") {
        alert("About student is required");
        return;
    }
    else if (about.length < 20) {
        alert("About student must be at least 20 characters");
        return;
    }
    else if (about.length > 200) {
        alert("About student cannot be more than 200 characters");
        return;
    }
    const photo = profilePhoto.files[0];
    if (!photo) {
       alert("Profile photo is required");
        return;
    }
    else {
        const fileName = photo.name.toLowerCase();
        if (
            !fileName.endsWith(".jpg") &&
            !fileName.endsWith(".jpeg") &&
            !fileName.endsWith(".png")
        ) {
           alert("Only JPG, JPEG and PNG files are allowed");
            return;
        }
    }
    const student={
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: selectedCourse,
        skills: skills,
        about: about,
        photo: URL.createObjectURL(photo)
    }
    students.push(student)
    displayStudents();
    updateStatistics()
    form.reset();
    characterCount.textContent = "0";
});
// function displayStudents() {
//     studentContainer.innerHTML = "";
//     const noStudentsMessage=document.getElementById("noStudentsMessage");
//     if (students.length === 0) {
//          noStudentsMessage.style.display = "block";
//         return;
//     }
//     noStudentsMessage.style.display = "none";
//     for (let i = 0; i < students.length; i++){
function displayStudents() {
    studentContainer.innerHTML = "";
    const noStudentsMessage =
        document.getElementById("noStudentsMessage");
    const searchText =
        searchStudent.value.toLowerCase();
    const selectedFilter =
        courseFilter.value;
    let foundStudents = 0;
    for (let i = 0; i < students.length; i++){
        const student = students[i];
        if (!student.name.toLowerCase().includes(searchText)) {
            continue;
        }
        if (
            selectedFilter !== "All Courses" &&
            student.course !== selectedFilter
        ) {
            continue;
        }
        foundStudents++;
        const card = document.createElement("div")
        card.classList.add("student-card")
        card.setAttribute("data-id", student.id)
        const image = document.createElement("img")
        image.setAttribute("src", student.photo)
        image.setAttribute("alt", student.name)
        const heading = document.createElement("h3")
        heading.textContent = student.name
        const email = document.createElement("p");
        email.textContent = "Email: " + student.email;
        const phone = document.createElement("p");
        phone.textContent = "Phone: " + student.phone;
        const dob = document.createElement("p");
        dob.textContent = "DOB: " + student.dob;
        const gender = document.createElement("p");
        gender.textContent = "Gender: " + student.gender;
        const course = document.createElement("p");
        course.textContent = "Course: " + student.course;
        const skills = document.createElement("p");
        skills.textContent ="Skills: " + student.skills.join(", ");
        const about = document.createElement("p");
        about.textContent = "About: " + student.about;
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        card.appendChild(image);
        card.appendChild(heading);
        card.appendChild(email);
        card.appendChild(phone);
        card.appendChild(dob);
        card.appendChild(gender);
        card.appendChild(course);
        card.appendChild(skills);
        card.appendChild(about);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
        studentContainer.appendChild(card);
    }
    if (foundStudents === 0) {
        noStudentsMessage.style.display = "block";
    }else {
        noStudentsMessage.style.display = "none";
    }
}
function updateStatistics(){
    document.getElementById("totalStudents").textContent =
        students.length;
    let webDevelopment = 0;
    let uiux = 0;
    let python = 0;
    let dataAnalytics = 0;
    let mernStack = 0;
    let cloudComputing = 0;
    for (let i = 0; i < students.length; i++) {
        if (students[i].course==="Web Development") {
            webDevelopment++;
        }
        if (students[i].course==="UI/UX") {
            uiux++;
        }
        if (students[i].course==="Python") {
            python++;
        }
        if (students[i].course==="Data Analytics") {
            dataAnalytics++;
        }
        if (students[i].course==="MERN Stack") {
            mernStack++;
        }
        if (students[i].course==="Cloud Computing") {
            cloudComputing++;
        }
    }
    document.getElementById("webDevelopmentCount").textContent =
        webDevelopment;
    document.getElementById("uiuxCount").textContent =
        uiux;
    document.getElementById("pythonCount").textContent =
        python;
    document.getElementById("dataAnalyticsCount").textContent =
        dataAnalytics;
    document.getElementById("mernStackCount").textContent =
        mernStack;
    document.getElementById("cloudComputingCount").textContent =
        cloudComputing;
}
studentContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("delete-btn")){
        const card = event.target.closest(".student-card");
        const studentId = Number(card.getAttribute("data-id"));
        const answer=confirm("Are you sure you want to delete this student?");
        if(answer){
            for (let i = 0; i < students.length; i++) {
                if (students[i].id === studentId) {
                    students.splice(i, 1);
                    break;
                }
            }
            displayStudents();
            updateStatistics();
        }
    }
});
searchStudent.addEventListener("input", function() {
    displayStudents();
});
courseFilter.addEventListener("change", function() {
    displayStudents();
});
displayStudents();
updateStatistics();