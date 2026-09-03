let students = [];
const form = document.getElementById('registration');
const currStudents = document.getElementById('currStudents');
const totalCount = document.getElementById('totalCount');
const avgAge = document.getElementById('avgAge');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-email').value;
    const contact = document.getElementById('student-contact').value;
    const birth = document.getElementById('student-birth').value;
    
    const birthDate = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const genderElement = document.querySelector('input[name="gender"]:checked');
    const gender = genderElement ? genderElement.value : '';

    const course = document.getElementById('student-course').value;
    
    const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
        .map(cb => cb.value)
        .join(', ');

    const about = document.getElementById('student-about').value;
    const fileInput = document.getElementById('student-profile');
    
    let profilePicUrl = '';

    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            profilePicUrl = event.target.result;
            addStudent(name, email, contact, birth, age, gender, course, selectedSkills, about, profilePicUrl);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        addStudent(name, email, contact, birth, age, gender, course, selectedSkills, about, profilePicUrl);
    }
});

function addStudent(name, email, contact, birth, age, gender, course, skills, about, profilePicUrl) {
    const student = {
        id: Date.now(),
        name,
        email,
        contact,
        birth,
        age,
        gender,
        course,
        skills,
        about,
        profilePicUrl
    };

    students.push(student);
    form.reset();
    renderStudents();
}

function renderStudents() {
    currStudents.innerHTML = '';
    let totalAge = 0;

    students.forEach(student => {
        totalAge += student.age;

        const card = document.createElement('div');
        card.className = 'studentsList';

        let imgHtml = '';
        if (student.profilePicUrl) {
            imgHtml = `<img src="${student.profilePicUrl}">`;
        }

        card.innerHTML = `
            ${imgHtml}
            <h3>${student.name}</h3>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Contact:</strong> ${student.contact}</p>
            <p><strong>DOB:</strong> ${student.birth} (Age: ${student.age})</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Skills:</strong> ${student.skills}</p>
            <p><strong>About:</strong> ${student.about}</p>
            <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete Student</button>
        `;

        currStudents.appendChild(card);
    });

    updateStats(totalAge);
}

function updateStats(totalAge) {
    totalCount.textContent = students.length;
    if (students.length > 0) {
        avgAge.textContent = (totalAge / students.length).toFixed(1);
    } else {
        avgAge.textContent = '0';
    }
}

function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    renderStudents();
}