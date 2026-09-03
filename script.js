const students = [
    {
        id: 1,
        name: 'Dhyey Joshi',
        email: 'dhyeyjoshi@gmail.com',
        number: '9876543210',
        dob: '2007-03-12',
        gender: 'male',
        course: 'Web Development',
        skills: ['HTML', 'CSS', 'JavaScript'],
        description: 'student'
    },
    {
        id: 2,
        name: 'Om Pujara',
        email: 'ompujara231@gmail.com',
        number: '9123456780',
        dob: '2001-08-22',
        gender: 'male',
        course: 'MERN Stack',
        skills: ['React', 'Node.js', 'Git'],
        description: 'student'
    }
];

const form = document.getElementById('studentForm');
const cardsContainer = document.getElementById('studentCards');
const emptyState = document.getElementById('emptyState');

function getSkills() {
    return [...document.querySelectorAll('input[name="skills"]:checked')].map((checkbox) => checkbox.value);
}

function renderCards() {
    if (students.length === 0) {
        cardsContainer.innerHTML = '';
        emptyState.classList.add('visible');
        return;
    }

    emptyState.classList.remove('visible');
    cardsContainer.innerHTML = students.map((student) => {
        const skillTags = student.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join('');

        return `
            <article class="student-card">
                <h3>${student.name}</h3>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Phone:</strong> ${student.number}</p>
                <p><strong>DOB:</strong> ${student.dob}</p>
                <p><strong>Gender:</strong> ${student.gender}</p>
                <p><strong>Course:</strong> ${student.course}</p>
                <div class="skill-list">${skillTags}</div>
                <p>${student.description}</p>
            </article>
        `;
    }).join('');
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name').toString().trim();
    const email = formData.get('email').toString().trim();
    const number = formData.get('number').toString().trim();
    const dob = formData.get('dob').toString();
    const gender = formData.get('gender');
    const course = formData.get('course');
    const description = formData.get('description').toString().trim();
    const selectedSkills = getSkills();

    if (!name || !email || !number || !dob || !gender || !course || selectedSkills.length === 0 || description.length < 20) {
        alert('Please fill all required fields correctly.');
        return;
    }

    students.unshift({
        id: Date.now(),
        name,
        email,
        number,
        dob,
        gender,
        course,
        skills: selectedSkills,
        description
    });

    form.reset();
    renderCards();
});

renderCards();
