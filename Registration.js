document.getElementById('Register_Student').addEventListener('click', function() {
    let name = document.getElementById('Student_Name').value;
    let email = document.getElementById('Student_Email').value;
    let phone = document.getElementById('Phone_number').value;
    let dob = document.getElementById('Date_of_birth').value;
    let course = document.querySelector('.course').value;
    let about = document.querySelector('#about input').value;
    let gender = '';
    let radios = document.querySelectorAll('input[name="gender"]');
    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            gender = radios[i].value;
        }
    }
    let skills = [];
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) {
            skills.push(checkboxes[i].value);
        }
    }
    if(name === '' || name === 'Student_Name') {
        alert('Please enter your name');
        return;
    }
    if (email === '' || email === 'Student_Email') {
        alert('Please enter your email');
        return;
    }
    if (phone === '' || phone === 'Phone_number') {
        alert('Please enter your phone number');
        return;
    }
    if (gender === '') {
        alert('Please select your gender');
        return;
    }
    if (skills.length === 0) {
        alert('Please select at least one skill');
        return;
    }
    alert('Student Registered Successfully');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('DOB:', dob);
    console.log('Gender:', gender);
    console.log('Course:', course);
    console.log('Skills:', skills);
    console.log('About:', about);
});
document.querySelector('button a[href="reset.html"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('Student_Name').value = '';
    document.getElementById('Student_Email').value = '';
    document.getElementById('Phone_number').value = '';
    document.getElementById('Date_of_birth').value = '';
    document.querySelector('#about input').value = '';
    let radios = document.querySelectorAll('input[name="gender"]');
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
    document.querySelector('.course').selectedIndex = 0;
});