const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const courseInput = document.getElementById("course");
const aboutInput = document.getElementById("about");
const photoInput = document.getElementById("photo");
const studentDetails = document.getElementById("studentDetails");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );
    const skills = document.querySelectorAll(
        'input[name="skills"]:checked'
    );
    let skillsText = "";
    skills.forEach(function(skill) {
        skillsText += skill.value + " ";
    });
    studentDetails.innerHTML = `
        <div class="student-card">
            <h2>Student Details</h2>
            <p><strong>Name:</strong> ${nameInput.value}</p>
            <p><strong>Email:</strong> ${emailInput.value}</p>
            <p><strong>Phone:</strong> ${phoneInput.value}</p>
            <p><strong>Date of Birth:</strong> ${dobInput.value}</p>
            <p><strong>Gender:</strong> ${gender.value}</p>
            <p><strong>Course:</strong> ${courseInput.value}</p>
            <p><strong>Skills:</strong> ${skillsText}</p>
            <p><strong>About:</strong> ${aboutInput.value}</p>
        </div>
    `;
});