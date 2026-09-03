let students = [];
const studentForm = document.getElementById("studentForm");
const aboutStudent = document.getElementById("about");
const characterCount = document.getElementById("characterCount");
aboutStudent.addEventListener("input", function () {
    const currentLength = aboutStudent.value.length;
    characterCount.textContent =
        `${currentLength} / 200 characters`;
});
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Student registration form submitted.");
});
studentForm.addEventListener("reset", function () {
    setTimeout(function () {
        characterCount.textContent = "0 / 200 characters";
    }, 0);
});
