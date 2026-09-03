const students = [];
const studentForm = document.getElementById("student-form");
const studentName = document.getElementById("student");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const dob = document.getElementById("dob");
const course = document.getElementById("course");
const about = document.getElementById("about");
const profilePhoto = document.getElementById("profilePhoto");
const charCount = document.getElementById("charCount");
const submitButton = document.getElementById("submitButton");
const resetButton = document.getElementById("resetButton");
about.addEventListener("input", function () {
    charCount.textContent = about.value.length;
});
