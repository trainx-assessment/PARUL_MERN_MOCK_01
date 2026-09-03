
// write the code like a begginer developer who know basic js, and do not use any advance code


let students = [];



const form = document.getElementById('student-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const dobInput = document.getElementById('dob');
const genderInputs = document.getElementsByName('gender');
const courseSelect = document.getElementById('course');
const skillsInputs = document.getElementsByName('skills');
const aboutInput = document.getElementById('about');
const profilePhotoInput = document.getElementById('profile-photo');
const charCounter = document.getElementById('char-counter');
const studentCardsDiv = document.querySelector('.student-cards-div');
const searchInput = document.getElementById('student-search');
const courseFilterSelect = document.getElementById('course-filter');
const totalStudentsCount = document.querySelector('.total-students span');
const submitButton = form.querySelector('button[type="submit"]');
let editingStudentId = null;
const courseCountElements = {
	'Web Development': document.getElementById('web-development-count'),
	'UI/UX': document.getElementById('ui-ux-count'),
	'Python': document.getElementById('python-count'),
	'Data Analytics': document.getElementById('data-analytics-count'),
	'MERN Stack': document.getElementById('mern-stack-count'),
	'Cloud Computing': document.getElementById('cloud-computing-count')
};


function showError(errorId, message) {
	document.getElementById(errorId).textContent = message;
}

function clearError(errorId) {
	document.getElementById(errorId).textContent = '';
}

function validateName() {
	const name = nameInput.value.trim();

	if (name === '') {
		showError('name-error', 'Name is required.');
		return false;
	}
	if (name.length < 3 || name.length > 40) {
		showError('name-error', 'Name must be between 3 and 40 characters.');
		return false;
	}

	clearError('name-error');
	return true;
}

function validateEmail() {
	const email = emailInput.value.trim();

	if (email === '') {
		showError('email-error', 'Email is required.');
		return false;
	}

	clearError('email-error');
	return true;
}

function validatePhone() {
	const phone = phoneInput.value.trim();

	if (phone === '') {
		showError('phone-error', 'Phone number is required.');
		return false;
	}

	clearError('phone-error');
	return true;
}

function validateDateOfBirth() {
	const selectedDate = dobInput.value;
	const today = new Date().toISOString().split('T')[0];

	if (selectedDate === '') {
		showError('dob-error', 'Date of birth is required.');
		return false;
	}
	if (selectedDate > today) {
		showError('dob-error', 'Date of birth cannot be in the future.');
		return false;
	}

	clearError('dob-error');
	return true;
}

function validateGender() {
	let selectedGender = false;

	for (let gender of genderInputs) {
		if (gender.checked) {
			selectedGender = true;
		}
	}

	if (!selectedGender) {
		showError('gender-error', 'Please select a gender.');
		return false;
	}

	clearError('gender-error');
	return true;
}

function validateCourse() {
	if (courseSelect.value === '') {
		showError('course-error', 'Please select a course.');
		return false;
	}

	clearError('course-error');
	return true;
}

function validateSkills() {
	let selectedSkill = false;

	for (let skill of skillsInputs) {
		if (skill.checked) {
			selectedSkill = true;
		}
	}

	if (!selectedSkill) {
		showError('skills-error', 'Please select at least one skill.');
		return false;
	}

	clearError('skills-error');
	return true;
}

function validateAbout() {
	const about = aboutInput.value.trim();

	if (about === '') {
		showError('about-error', 'About student is required.');
		return false;
	}
	if (about.length < 20) {
		showError('about-error', 'Please enter at least 20 characters.');
		return false;
	}

	clearError('about-error');
	return true;
}

function validateProfilePhoto() {
	const photo = profilePhotoInput.files[0];

	if (editingStudentId !== null && !photo) {
		clearError('profile-photo-error');
		return true;
	}

	if (!photo) {
		showError('profile-photo-error', 'Profile photo is required.');
		return false;
	}
	if (!photo.type.startsWith('image/')) {
		showError('profile-photo-error', 'Please select an image file.');
		return false;
	}

	clearError('profile-photo-error');
	return true;
}

function fillFormForEditing(student) {
	nameInput.value = student.name;
	emailInput.value = student.email;
	phoneInput.value = student.phone;
	dobInput.value = student.dob;
	courseSelect.value = student.course.toLowerCase().replace(' ', '-').replace('/', '-');
	aboutInput.value = student.about;

	for (let gender of genderInputs) {
		gender.checked = gender.value === student.gender;
	}

	for (let skill of skillsInputs) {
		skill.checked = student.skills.includes(skill.value);
	}

	editingStudentId = student.id;
	submitButton.textContent = 'Update Student';
	updateCharacterCounter();
}

function updateCharacterCounter() {
	charCounter.textContent = aboutInput.value.length + ' / 200';
}

function addTextToCard(card, label, value) {
	const paragraph = document.createElement('p');
	const strong = document.createElement('strong');
	strong.textContent = label + ': ';
	paragraph.appendChild(strong);
	paragraph.append(value);
	card.appendChild(paragraph);
}

function updateStatistics() {
	totalStudentsCount.textContent = students.length;

	for (let course in courseCountElements) {
		let courseTotal = 0;

		for (let student of students) {
			if (student.course === course) {
				courseTotal++;
			}
		}

		courseCountElements[course].textContent = courseTotal;
	}
}

function createStudentCard(student) {
	const card = document.createElement('div');
	card.classList.add('student-card');
	card.setAttribute('data-id', student.id);

	const photo = document.createElement('img');
	photo.setAttribute('src', student.photo);
	photo.setAttribute('alt', student.name + ' photo');
	photo.classList.add('student-photo');
	card.appendChild(photo);

	const heading = document.createElement('h2');
	heading.textContent = student.name;
	card.appendChild(heading);

	addTextToCard(card, 'Email', student.email);
	addTextToCard(card, 'Phone', student.phone);
	addTextToCard(card, 'DOB', student.dob);
	addTextToCard(card, 'Gender', student.gender);
	addTextToCard(card, 'Course', student.course);
	addTextToCard(card, 'Skills', student.skills.join(', '));
	addTextToCard(card, 'About', student.about);

	const editButton = document.createElement('button');
	editButton.textContent = 'Edit';
	editButton.classList.add('edit-button');
	editButton.setAttribute('type', 'button');
	editButton.addEventListener('click', function () {
		const studentId = Number(card.getAttribute('data-id'));
		const studentToEdit = students.find(function (studentItem) {
			return studentItem.id === studentId;
		});

		if (studentToEdit) {
			fillFormForEditing(studentToEdit);
			nameInput.focus();
		}
	});

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.classList.add('delete-button');
	deleteButton.setAttribute('type', 'button');

	const buttonDiv = document.createElement('div');
	buttonDiv.classList.add('card-buttons');
	buttonDiv.append(editButton, deleteButton);
	card.appendChild(buttonDiv);

	return card;
}

studentCardsDiv.addEventListener('click', function (event) {
	if (event.target.classList.contains('delete-button')) {
		const studentCard = event.target.closest('.student-card');
		const studentId = Number(studentCard.getAttribute('data-id'));

		if (confirm('Are you sure you want to delete this student?')) {
			for (let i = 0; i < students.length; i++) {
				if (students[i].id === studentId) {
					students.splice(i, 1);
					studentCard.remove();
                    updateStatistics();
                    break;
				}
			}
		}
	}
});

function displayStudentCards() {
	studentCardsDiv.textContent = '';
	const searchText = searchInput.value.toLowerCase().trim();
	const selectedCourse = courseFilterSelect.value;
	let matchingStudents = [];

	for (let student of students) {
		const nameMatches = student.name.toLowerCase().includes(searchText);
		const courseMatches = selectedCourse === '' || student.course === selectedCourse;

		if (nameMatches && courseMatches) {
			matchingStudents.push(student);
		}
	}

	if (matchingStudents.length === 0) {
		studentCardsDiv.textContent = 'No students found';
	} else {
		for (let student of matchingStudents) {
			const card = createStudentCard(student);
			studentCardsDiv.appendChild(card);
		}
	}

	updateStatistics();
}

function validateForm() {
	const isValid = validateName()
		&& validateEmail()
		&& validatePhone()
		&& validateDateOfBirth()
		&& validateGender()
		&& validateCourse()
		&& validateSkills()
		&& validateAbout()
		&& validateProfilePhoto();

	return isValid;
}

form.addEventListener('submit', function (event) {
	event.preventDefault();

	if (validateForm()) {
		const selectedSkills = [];
		for (let skill of skillsInputs) {
			if (skill.checked) {
				selectedSkills.push(skill.value);
			}
		}

		const selectedGender = document.querySelector('input[name="gender"]:checked');
		const photoFile = profilePhotoInput.files[0];
		const updatedStudent = {
			id: editingStudentId,
			name: nameInput.value.trim(),
			email: emailInput.value.trim(),
			phone: phoneInput.value.trim(),
			dob: dobInput.value,
			gender: selectedGender.value,
			course: courseSelect.options[courseSelect.selectedIndex].text,
			skills: selectedSkills,
			about: aboutInput.value.trim(),
			photo: photoFile ? URL.createObjectURL(photoFile) : ''
		};

		if (editingStudentId === null) {
			let newStudentId = 1;

			for (let student of students) {
				if (student.id >= newStudentId) {
					newStudentId = student.id + 1;
				}
			}

			updatedStudent.id = newStudentId;
			updatedStudent.photo = URL.createObjectURL(photoFile);
			students.push(updatedStudent);
		} else {
			const studentIndex = students.findIndex(function (student) {
				return student.id === editingStudentId;
			});

			if (studentIndex !== -1) {
				if (!photoFile) {
					updatedStudent.photo = students[studentIndex].photo;
				}
				students[studentIndex] = updatedStudent;
			}
		}

		displayStudentCards();
		alert(editingStudentId === null ? 'Student registration is successful.' : 'Student details are updated.');
		editingStudentId = null;
		submitButton.textContent = 'Register Student';
		form.reset();
		updateCharacterCounter();
	}
});

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);
dobInput.addEventListener('change', validateDateOfBirth);
courseSelect.addEventListener('change', validateCourse);
aboutInput.addEventListener('input', function () {
	updateCharacterCounter();
	validateAbout();
});
searchInput.addEventListener('input', displayStudentCards);
courseFilterSelect.addEventListener('change', displayStudentCards);
profilePhotoInput.addEventListener('change', validateProfilePhoto);

for (let gender of genderInputs) {
	gender.addEventListener('change', validateGender);
}

for (let skill of skillsInputs) {
	skill.addEventListener('change', validateSkills);
}

form.addEventListener('reset', function () {
	editingStudentId = null;
	submitButton.textContent = 'Register Student';
	clearError('name-error');
	clearError('email-error');
	clearError('phone-error');
	clearError('dob-error');
	clearError('gender-error');
	clearError('course-error');
	clearError('skills-error');
	clearError('about-error');
	clearError('profile-photo-error');
	setTimeout(updateCharacterCounter, 0);
});

updateCharacterCounter();
displayStudentCards();


