let form = document.getElementById("studentForm");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;

    alert("Registration successful for " + name);

    form.reset();
});