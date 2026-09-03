const students = [];
let nextId = 1;

const form = document.querySelector('form');
const cardsContainer = document.querySelector('.student-cards-container');
const statsSection = document.querySelector('#stats-heading').parentElement;

cardsContainer.innerHTML = '';

const statsContainer = document.createElement('div');
statsSection.appendChild(statsContainer);

const courses = [
    "Web Development",
    "UI/UX",
    "Python",
    "Data Analytics",
    "MERN Stack",
    "Cloud Computing"
];

function updateStats() {
    statsContainer.innerHTML = '';
    
    const totalElement = document.createElement('p');
    totalElement.textContent = `Total Students: ${students.length}`;
    statsContainer.appendChild(totalElement);
    
    courses.forEach(course => {
        const count = students.filter(student => student.course === course).length;
        const courseStatElement = document.createElement('p');
        courseStatElement.textContent = `${course}: ${count}`;
        statsContainer.appendChild(courseStatElement);
    });
}

function renderCards() {
    cardsContainer.innerHTML = '';
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.classList.add('student-card');
        card.setAttribute('data-id', student.id);
        
        const photo = document.createElement('img');
        photo.src = student.photo || '';
        photo.alt = "Student Photo";
        photo.style.width = "100px";
        photo.style.height = "100px";
        photo.style.objectFit = "cover";
        
        const name = document.createElement('h3');
        name.textContent = student.name;
        
        const email = document.createElement('p');
        email.textContent = `Email: ${student.email}`;
        
        const phone = document.createElement('p');
        phone.textContent = `Phone: ${student.phone}`;
        
        const dob = document.createElement('p');
        dob.textContent = `DOB: ${student.dob}`;
        
        const gender = document.createElement('p');
        gender.textContent = `Gender: ${student.gender}`;
        
        const course = document.createElement('p');
        course.textContent = `Course: ${student.course}`;
        
        const skills = document.createElement('p');
        skills.textContent = `Skills: ${student.skills.join(', ')}`;
        
        const about = document.createElement('p');
        about.textContent = `About: ${student.about}`;
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        
        card.append(photo, name, email, phone, dob, gender, course, skills, about, editBtn, deleteBtn);
        cardsContainer.appendChild(card);
    });
    
    updateStats();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const skillsArray = [];
    
    form.querySelectorAll('input[name="skills"]:checked').forEach(checkbox => {
        skillsArray.push(checkbox.value);
    });
    
    const fileInput = document.getElementById('profile-photo');
    let photoURL = "";
    if (fileInput.files && fileInput.files[0]) {
        photoURL = URL.createObjectURL(fileInput.files[0]);
    }
    
    const newStudent = {
        id: nextId++,
        name: formData.get('student_name'),
        email: formData.get('student_email'),
        phone: formData.get('student_phone'),
        dob: formData.get('student_dob'),
        gender: formData.get('gender'),
        course: formData.get('course'),
        skills: skillsArray,
        about: formData.get('about_student'),
        photo: photoURL
    };
    
    students.push(newStudent);
    renderCards();
    form.reset();
});

cardsContainer.addEventListener('click', function(e) {
    const card = e.target.closest('.student-card');
    if (!card) return;
    
    const studentId = parseInt(card.getAttribute('data-id'));
    const studentIndex = students.findIndex(s => s.id === studentId);
    
    if (e.target.classList.contains('delete-btn')) {
        if (studentIndex > -1) {
            students.splice(studentIndex, 1);
            renderCards();
        }
    } 
    
    if (e.target.classList.contains('edit-btn')) {
        if (studentIndex > -1) {
            const student = students[studentIndex];
            
            form.elements['student_name'].value = student.name;
            form.elements['student_email'].value = student.email;
            form.elements['student_phone'].value = student.phone;
            form.elements['student_dob'].value = student.dob;
            form.elements['gender'].value = student.gender;
            form.elements['course'].value = student.course;
            form.elements['about_student'].value = student.about;
            
            form.querySelectorAll('input[name="skills"]').forEach(checkbox => {
                checkbox.checked = student.skills.includes(checkbox.value);
            });
            
            students.splice(studentIndex, 1);
            renderCards();
        }
    }
});

updateStats();