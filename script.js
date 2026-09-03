const form = document.querySelector('.form');
const students = [];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const phone = document.querySelector('#phone');
    const dob = document.querySelector('#dob');
    const cardGrid = document.querySelector('.card-container')
    const course = document.querySelector('#courses');
    const about = document.querySelector('#about')

    if(name.value.length < 3 || name.value.length > 40) {
        alert("Name should be greater than 3 characters and less then 40 characters");
    }
    students.push({
        "name": name.value,
        "email": email.value,
        "phone": phone.value,
        "dob": dob.value,
        "courses": course.value
        
    })

    const newCard = document.createElement('div');
    newCard.classList.add('cards');

    newCard.innerHTML = `
        <p><b>Student Name: </b>  ${name.value}</p>
        <p><b>Email: </b> ${email.value}</p>
        <p><b>Phone Number: </b>${phone.value}</p>
        <p><b>Date of birth: </b> ${dob.value}</p>
        <p><b>Courses: </b> ${course.value}</p>
        <p><b>About Student: </b> ${about.value}</p>
        <button class="card-button">Edit</button>
        <button class="card-button">Remove</button>
    `
    cardGrid.append(newCard);
})

