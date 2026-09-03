const form = document.getElementById("studentForm");
const message = document.getElementById("message");
const themeButton = document.getElementById("themeButton");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    message.textContent = "Student registered successfully!";
    form.reset();
});
