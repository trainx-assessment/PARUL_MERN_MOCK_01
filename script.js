const form = document.querySelector('#studentForm');
const studentContainer = document.querySelector('#studentContainer');
const studentCount = document.querySelector('#studentCount');
const students = [];
let nextStudentId = 1;

const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const phonePattern = /^\d{10}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(fieldName, message) {
	const error = document.querySelector(`[data-error-for="${fieldName}"]`);
	if (error) error.textContent = message;
	const field = document.querySelector(`#${fieldName}`);
	if (field) field.classList.toggle('has-error', Boolean(message));
}

function clearErrors() {
	document.querySelectorAll('.error-message').forEach((error) => {
		error.textContent = '';
	});
	document.querySelectorAll('.has-error').forEach((field) => field.classList.remove('has-error'));
}

function validateForm() {
	const name = form.studentName.value.trim();
	const email = form.email.value.trim();
	const phone = form.phone.value.trim();
	const dob = form.dob.value;
	const gender = form.gender.value;
	const course = form.course.value;
	const skills = [...form.querySelectorAll('input[name="skills"]:checked')].map((skill) => skill.value);
	const about = form.about.value.trim();
	let isValid = true;

	const check = (field, condition, message) => {
		if (condition) setError(field, message);
		isValid = isValid && !condition;
	};

	check('studentName', !name, 'Name is required.');
	check('studentName', Boolean(name) && (name.length < 3 || !namePattern.test(name)), 'Use at least 3 letters and spaces only.');
	check('email', !email || !emailPattern.test(email), 'Enter a valid email address.');
	check('phone', !phone || !phonePattern.test(phone), 'Enter exactly 10 digits.');
	check('dob', !dob, 'Date of birth is required.');
	check('dob', Boolean(dob) && new Date(`${dob}T00:00:00`) > new Date(), 'Date of birth cannot be in the future.');
	check('gender', !gender, 'Select a gender.');
	check('course', !course, 'Select a course.');
	check('skills', skills.length === 0, 'Select at least one skill.');
	check('about', !about, 'About the student is required.');
	check('photo', form.photo.files.length === 0, 'Choose a profile photo.');

	return { isValid, values: { name, email, phone, dob, gender, course, skills, about, photo: form.photo.files[0] } };
}

function updateCount() {
	studentCount.textContent = `Total Students: ${students.length}`;
}

function createDetail(label, value) {
	const row = document.createElement('div');
	const term = document.createElement('dt');
	const description = document.createElement('dd');
	term.textContent = label;
	description.textContent = value;
	row.append(term, description);
	return row;
}

function renderStudent(student) {
	const emptyState = studentContainer.querySelector('.empty-state');
	if (emptyState) emptyState.remove();

	const card = document.createElement('article');
	card.classList.add('student-card');
	card.dataset.id = student.id;

	const photo = document.createElement('img');
	photo.classList.add('student-photo');
	photo.src = URL.createObjectURL(student.photo);
	photo.alt = `Profile photo of ${student.name}`;

	const content = document.createElement('div');
	content.classList.add('student-card-content');
	const heading = document.createElement('h3');
	heading.textContent = student.name;
	const details = document.createElement('dl');
	details.classList.add('student-details');
	details.append(createDetail('Email', student.email), createDetail('Phone', student.phone), createDetail('DOB', student.dob), createDetail('Gender', student.gender), createDetail('Course', student.course), createDetail('Skills', student.skills.join(', ')));
	const about = document.createElement('p');
	about.classList.add('about-text');
	about.textContent = student.about;
	const deleteButton = document.createElement('button');
	deleteButton.classList.add('delete-button');
	deleteButton.type = 'button';
	deleteButton.textContent = 'Delete student';
	content.append(heading, details, about, deleteButton);
	card.append(photo, content);
	studentContainer.appendChild(card);
}

form.addEventListener('submit', (event) => {
	event.preventDefault();
	clearErrors();
	const result = validateForm();
	if (!result.isValid) return;

	const student = { id: nextStudentId++, ...result.values };
	students.push(student);
	renderStudent(student);
	updateCount();
	form.reset();
	clearErrors();
});

studentContainer.addEventListener('click', (event) => {
	if (!event.target.classList.contains('delete-button')) return;
	const card = event.target.closest('.student-card');
	const studentId = Number(card.dataset.id);
	const studentIndex = students.findIndex((student) => student.id === studentId);
	if (studentIndex !== -1) students.splice(studentIndex, 1);
	card.remove();
	if (students.length === 0) {
		const emptyState = document.createElement('p');
		emptyState.classList.add('empty-state');
		emptyState.textContent = 'No applications yet. Your registered students will appear here.';
		studentContainer.appendChild(emptyState);
	}
	updateCount();
});
