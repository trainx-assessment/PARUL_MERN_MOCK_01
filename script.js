const form = document.getElementById("studentForm");
const studentCards = document.getElementById("studentCards");

let students = [];

form.addEventListener("submit", function (garwit) {
    garwit.preventDefault();

  
    const skills = [];
    document.querySelectorAll('input[name="skills"]:checked').forEach(skill => {
        skills.push(skill.value);
    });

    
    const photo = document.getElementById("profilePhoto").files[0];
    const image = photo ? URL.createObjectURL(photo) : "profile1.jpg";

  













    const student = {
        name: document.getElementById("studentName").value,
        email: document.getElementById("studentEmail").value,
        phone: document.getElementById("studentPhone").value,
        dob: document.getElementById("dateOfBirth").value,
        course: document.getElementById("course").value,
        about: document.getElementById("aboutStudetn").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        skills: skills,
        image: image
    };

    students.push(student);

    
    studentCards.innerHTML = "";

    students.forEach(student => {
        studentCards.innerHTML += `
            <article class="student-card">
                <h3>${student.name}</h3>

                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Phone:</strong> ${student.phone}</p>
                <p><strong>Date of Birth:</strong> ${student.dob}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <p><strong>Skills:</strong> ${student.skills.join(", ")}</p>
                <p><strong>About:</strong> ${student.about}</p>

                <img src="${student.image}" 
                     class="profile-photo" 
                     alt="${student.name}">
            </article>
        `;
    });

    form.reset();
});
