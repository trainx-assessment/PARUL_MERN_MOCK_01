let studenlet Student = [];

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("studentName").value.trim();

    if (name.length < 3) {
        alert("Name must be at least 3 characters");
        return;
    }

    students.push(name);
    document.getElementById("studentContainer").innerHTML =
        students.map(s => `<div class="student-card"><h3>${s}</h3></div>`).join("");

    this.reset();
});