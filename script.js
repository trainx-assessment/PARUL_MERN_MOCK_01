const form = document.getElementById('form');
const cards = document.querySelector('.cards');

let id = 1;

form.addEventListener('submit', function(event) {
    event.preventDefault();
    let name = document.getElementById('stdname').value;
    let email = document.getElementById('stdmail').value;
    let phone = document.getElementById('stdphone').value;
    let dob = document.getElementById('stddob').value;
    let course = document.getElementById('course').value;
    let about = document.getElementById('about').value;
    let genderInput = document.querySelector('input[name="gender"]:checked');
    let gender = genderInput.value;
    let checkedSkills = document.querySelectorAll('input[name="skills"]:checked');
    let Selectedskills = Array.from(checkedSkills).map(checkbox => checkbox.value);
    let fileInput = document.getElementById('fileinput');
    let photoUrl = 'https://placeholder.com';
    if (fileInput.files && fileInput.files[0]) {
        photoUrl = URL.createObjectURL(fileInput.files[0]);
    }

    const newStudent = {
        id: id++,
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        gender: gender,
        course: course,
        skills: Selectedskills,
        about: about,
        photo: photoUrl
    };

    createStd(newStudent);
    form.reset();
});

function createStd(std) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${std.photo}" alt="${std.name}" style="max-width: 150px; border-radius: 8px;">
        <div>
        <h2>Name: ${std.name}</h2>
        <p><strong>Id:</strong>${std.id}</p>
        <p><strong>DOB:</strong>${std.dob}</p>
        <p><strong>Email:</strong>${std.email}</p>
        <p><strong>Phone:</strong>${std.phone}</p>
        <p><strong>Gender:</strong>${std.gender}</p>
        <p><strong>Course:</strong>${std.course}</p>
        <p><strong>Skills:</strong>${std.skills}</p>
        <p><strong>About:</strong>${std.about}</p>
        </div>
    `;

    cards.appendChild(card);
}
