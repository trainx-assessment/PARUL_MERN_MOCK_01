const skillsDiv = document.createElement("div");
skillsDiv.classList.add("skills");
student.skills.forEach(function(skill) {
    const span = document.createElement("span");
    span.classList.add("skill");
    span.textContent = skill;
    skillsDiv.append(span);});
const buttons = document.createElement("div");
buttons.classList.add("card-buttons");
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        themeToggle.innerText = "Light Mode";
    } else {
        themeToggle.innerText = " Dark Mode";
    }
});