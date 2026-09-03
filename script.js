const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const course = document.getElementById("course").value;
    const skills = document.querySelectorAll('input[name="courses"]:checked');
    const about = document.getElementById("about").value;

    const skillsList = [];
    skills.forEach(s => skillsList.push(s.value));

    let existingBox = document.getElementById("display-box");
    if (existingBox) existingBox.remove();

    const box = document.createElement("div");
    box.id = "display-box";
    box.style.cssText = "margin-top:20px;padding:20px;border:2px solid #333;background:#fff;width:500px;";

    box.innerHTML = `
        <h3 style="margin-bottom:10px;">Entered Data</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>DOB:</strong> ${dob}</p>
        <p><strong>Gender:</strong> ${gender ? gender.value : "Not selected"}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Skills:</strong> ${skillsList.length ? skillsList.join(", ") : "None"}</p>
        <p><strong>About:</strong> ${about}</p>
    `;

    document.getElementById("app").appendChild(box);
});

form.addEventListener("reset", () => {
    const existingBox = document.getElementById("display-box");
    if (existingBox) existingBox.remove();
});
