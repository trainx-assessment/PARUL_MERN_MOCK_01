const aboutStudent = document.getElementById("student-about");
const characterCount = document.getElementById("character-count");

aboutStudent.addEventListener("input", function () {
    characterCount.textContent = aboutStudent.value.length + " / 200";
});