const about = document.getElementById('about');
const character = document.getElementById('character');
about.addEventListener('input', () => function(){
  character.textContent = `${this.value.length} / 200`;
});
addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('studentName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
   const dob = document.getElementById('dob').value;
   const course = document.getElementById('course').value;
   const about = document.getElementById('about').value;

   const gender = document.querySelector('input[name="gender"]:checked');
   const skills = document.querySelectorAll('input[name="skills"]:checked');
    const selectedSkills = Array.from(skills).map(skill => skill.value);
    const value = skills.length > 0 ? selectedSkills.join(', ') : 'None';

    document.querySelector('.display .info .name').textContent = `Name: ${name}`;
    document.querySelector('.display .info .email').textContent = `Email: ${email}`;
    document.querySelector('.display .info .phone').textContent = `Phone: ${phone}`;
    document.querySelector('.display .info .dob').textContent = `Date of Birth: ${dob}`;
    document.querySelector('.display .info .course').textContent = `Course: ${course}`;
    document.querySelector('.display .info .gender').textContent = `Gender: ${gender ? gender.value : 'Not specified'}`;
    document.querySelector('.display .info .skills').textContent = `Skills: ${value}`;
    document.querySelector('.display .info .about').textContent = `About: ${about}`;
});

document.getElementById('resetBtn').addEventListener('click', function() {
  document.querySelector('.display .info .name').textContent = 'Name: ';
  document.querySelector('.display .info .email').textContent = 'Email: ';
  document.querySelector('.display .info .phone').textContent = 'Phone: ';
  document.querySelector('.display .info .dob').textContent = 'Date of Birth: ';
  document.querySelector('.display .info .course').textContent = 'Course: ';
  document.querySelector('.display .info .gender').textContent = 'Gender: ';
  document.querySelector('.display .info .skills').textContent = 'Skills: ';
  document.querySelector('.display .info .about').textContent = 'About: ';
});