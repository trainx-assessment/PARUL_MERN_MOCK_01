let form = document.getElementById("studentForm");
let nameInput = document.getElementById("studentName");
let emailInput = document.getElementById("email");
let phoneInput = document.getElementById("phone");
let dobInput = document.getElementById("dob");
let courseInput = document.getElementById("course");
let aboutInput = document.getElementById("about");
let photoInput = document.getElementById("photo");
let studentContainer = document.getElementById("studentContainer");
let searchInput = document.getElementById("searchInput");
let filterCourse = document.getElementById("filterCourse");
let totalStudents = document.getElementById("totalStudents");
let charCount = document.getElementById("charCount");


let students = [];

form.addEventListener("submit", function (event) {
    event.preventDefault();
    let name = nameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;
    let dob = dobInput.value;
    let course = courseInput.value;
    let about = aboutInput.value;

    let gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    if (name.trim() == "") {
        alert("Please enter your name");
        return;

    }
    if (name.length < 3) {
        alert("Name must have at least 3 characters");
        return;

    }
    if (email.trim() == "") {
        alert("Please enter email");
        return;

    }

    if (phone.length != 10) {

        alert("Phone number must be 10 digits");
        return;

    }
    if (dob == "") {

        alert("Please select date of birth");
        return;

    }
    if (gender == null) {

        alert("Please select gender");
        return;

    }
    if (course == "") {

        alert("Please select course");
        return;

    }
    if (skills.length == 0) {

        alert("Please select at least one skill");
        return;

    }
    if (about.trim() == "") {

        alert("Please enter about");
        return;

    }
    if (about.length < 20) {

        alert("About must have at least 20 characters");
        return;

    }
    if (photoInput.files.length == 0) {

        alert("Please select a photo");
        return;

    }
});
