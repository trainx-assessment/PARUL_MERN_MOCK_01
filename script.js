const form = document.querySelector('#form');
const cards = document.querySelector('#cards');

form.addEventListener('submit', (event) => {
	event.preventDefault();

	const formData = new FormData(form);
	const studentCard = document.createElement('article');
	studentCard.className = 'student-card';

	const photo = document.querySelector('#photo').files[0];
	const photoMarkup = photo
		? `<img src="${URL.createObjectURL(photo)}" alt="Student photo">`
		: '';
	const skills = formData.getAll('skills').join(', ') || 'No skills selected';

	studentCard.innerHTML = `
		${photoMarkup}
		<h3>${formData.get('student-name')}</h3>
		<p><strong>Email:</strong> ${formData.get('email')}</p>
		<p><strong>Phone:</strong> ${formData.get('phone')}</p>
		<p><strong>Date of birth:</strong> ${formData.get('date-of-birth')}</p>
		<p><strong>Gender:</strong> ${formData.get('gender')}</p>
		<p><strong>Course:</strong> ${formData.get('course') || 'Not selected'}</p>
		<p><strong>Skills:</strong> ${skills}</p>
		<p>${formData.get('about')}</p>
	`;

	cards.appendChild(studentCard);
	form.reset();
});
