
var form = document.querySelector('#studentForm');

var nameInput = document.querySelector('#studentName');
var emailInput = document.querySelector('#studentEmail');
var phoneInput = document.querySelector('#studentPhone');
var dobInput = document.querySelector('#studentDob');
var courseSelect = document.querySelector('#studentCourse');
var aboutInput = document.querySelector('#studentAbout');
var photoInput = document.querySelector('#studentPhoto');

var studentContainer = document.querySelector('#studentContainer');
var rosterEmpty = document.querySelector('#rosterEmpty');
var studentCountEl = document.querySelector('#studentCount');


var students = [];
var nextId = 1;


dobInput.max = new Date().toISOString().split('T')[0];


var NAME_REGEX = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/; 
var PHONE_REGEX = /^\d{10}$/; 
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 


function setError(fieldId, message) {
  var errorEl = document.querySelector('#err-' + fieldId);
  if (errorEl) {
    errorEl.textContent = message;
    var fieldWrapper = errorEl.closest('.field');
    if (fieldWrapper) {
      fieldWrapper.classList.add('has-error');
    }
  }
}

function clearError(fieldId) {
  var errorEl = document.querySelector('#err-' + fieldId);
  if (errorEl) {
    errorEl.textContent = '';
    var fieldWrapper = errorEl.closest('.field');
    if (fieldWrapper) {
      fieldWrapper.classList.remove('has-error');
    }
  }
}

function clearAllErrors() {
  var errorEls = document.querySelectorAll('.field__error');
  for (var i = 0; i < errorEls.length; i++) {
    errorEls[i].textContent = '';
  }

  var errorFields = document.querySelectorAll('.has-error');
  for (var j = 0; j < errorFields.length; j++) {
    errorFields[j].classList.remove('has-error');
  }
}


function validateForm(data) {
  var isValid = true;


  var name = data.name.trim();
  if (name === '') {
    setError('studentName', 'Name is required.');
    isValid = false;
  } else if (name.length < 3) {
    setError('studentName', 'Name must be at least 3 characters.');
    isValid = false;
  } else if (!NAME_REGEX.test(name)) {
    setError('studentName', 'Only letters and spaces are allowed.');
    isValid = false;
  }

 
  var email = data.email.trim();
  if (email === '') {
    setError('studentEmail', 'Email is required.');
    isValid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    setError('studentEmail', 'Enter a valid email address.');
    isValid = false;
  }


  var phone = data.phone.trim();
  if (phone === '') {
    setError('studentPhone', 'Phone number is required.');
    isValid = false;
  } else if (!PHONE_REGEX.test(phone)) {
    setError('studentPhone', 'Enter exactly 10 digits, numbers only.');
    isValid = false;
  }


  if (data.dob === '') {
    setError('studentDob', 'Date of birth is required.');
    isValid = false;
  } else {
    var dobDate = new Date(data.dob);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dobDate > today) {
      setError('studentDob', 'Date of birth cannot be in the future.');
      isValid = false;
    }
  }


  if (!data.gender) {
    setError('studentGender', 'Please select a gender.');
    isValid = false;
  }

 
  if (!data.course) {
    setError('studentCourse', 'Please select a course.');
    isValid = false;
  }

  
  if (data.skills.length === 0) {
    setError('studentSkills', 'Select at least one skill.');
    isValid = false;
  }

 
  if (data.about.trim() === '') {
    setError('studentAbout', 'This field is required.');
    isValid = false;
  }


  if (!data.photoFile) {
    setError('studentPhoto', 'Please choose a profile photo.');
    isValid = false;
  }

  return isValid;
}


function readFormData() {
  var genderInput = document.querySelector('input[name="studentGender"]:checked');
  var skillInputs = document.querySelectorAll('input[name="studentSkills"]:checked');

  var skills = [];
  for (var i = 0; i < skillInputs.length; i++) {
    skills.push(skillInputs[i].value);
  }

  var data = {};
  data.name = nameInput.value;
  data.email = emailInput.value;
  data.phone = phoneInput.value;
  data.dob = dobInput.value;
  data.gender = genderInput ? genderInput.value : '';
  data.course = courseSelect.value;
  data.skills = skills;
  data.about = aboutInput.value;
  data.photoFile = photoInput.files[0] ? photoInput.files[0] : null;

  return data;
}


function renderStudentCard(student) {
  var card = document.createElement('div');
  card.classList.add('student-card');
  card.setAttribute('data-id', student.id);

  
  var deleteButton = document.createElement('button');
  deleteButton.classList.add('student-card__delete');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Remove';
  card.appendChild(deleteButton);

  var topRow = document.createElement('div');
  topRow.classList.add('student-card__top');

  var photo = document.createElement('img');
  photo.classList.add('student-card__photo');
  photo.src = student.photo;
  photo.alt = 'Photo of ' + student.name;
  topRow.appendChild(photo);

  var identity = document.createElement('div');

  var nameEl = document.createElement('h3');
  nameEl.classList.add('student-card__name');
  nameEl.textContent = student.name;
  identity.appendChild(nameEl);

  var courseEl = document.createElement('p');
  courseEl.classList.add('student-card__course');
  courseEl.textContent = student.course;
  identity.appendChild(courseEl);

  topRow.appendChild(identity);
  card.appendChild(topRow);

  
  var emailEl = document.createElement('p');
  emailEl.classList.add('student-card__field');
  var emailLabel = document.createElement('strong');
  emailLabel.textContent = 'Email: ';
  emailEl.appendChild(emailLabel);
  emailEl.append(student.email);
  card.appendChild(emailEl);

  var phoneEl = document.createElement('p');
  phoneEl.classList.add('student-card__field');
  var phoneLabel = document.createElement('strong');
  phoneLabel.textContent = 'Phone: ';
  phoneEl.appendChild(phoneLabel);
  phoneEl.append(student.phone);
  card.appendChild(phoneEl);

  var dobEl = document.createElement('p');
  dobEl.classList.add('student-card__field');
  var dobLabel = document.createElement('strong');
  dobLabel.textContent = 'Date of Birth: ';
  dobEl.appendChild(dobLabel);
  dobEl.append(student.dob);
  card.appendChild(dobEl);

  var genderEl = document.createElement('p');
  genderEl.classList.add('student-card__field');
  var genderLabel = document.createElement('strong');
  genderLabel.textContent = 'Gender: ';
  genderEl.appendChild(genderLabel);
  genderEl.append(student.gender);
  card.appendChild(genderEl);

  
  var skillsWrap = document.createElement('div');
  skillsWrap.classList.add('student-card__skills');
  for (var i = 0; i < student.skills.length; i++) {
    var pill = document.createElement('span');
    pill.classList.add('student-card__skill');
    pill.textContent = student.skills[i];
    skillsWrap.appendChild(pill);
  }
  card.appendChild(skillsWrap);

 
  var aboutEl = document.createElement('p');
  aboutEl.classList.add('student-card__about');
  aboutEl.textContent = student.about;
  card.appendChild(aboutEl);

  studentContainer.appendChild(card);
}

function updateStudentCount() {
  studentCountEl.textContent = 'Total Students: ' + students.length;
  if (students.length === 0) {
    rosterEmpty.style.display = 'block';
  } else {
    rosterEmpty.style.display = 'none';
  }
}


nameInput.addEventListener('input', function () {
  clearError('studentName');
});

emailInput.addEventListener('input', function () {
  clearError('studentEmail');
});

phoneInput.addEventListener('input', function () {
  clearError('studentPhone');
});

dobInput.addEventListener('input', function () {
  clearError('studentDob');
});

courseSelect.addEventListener('change', function () {
  clearError('studentCourse');
});

aboutInput.addEventListener('input', function () {
  clearError('studentAbout');
});

photoInput.addEventListener('change', function () {
  clearError('studentPhoto');
});

var genderInputs = document.querySelectorAll('input[name="studentGender"]');
for (var g = 0; g < genderInputs.length; g++) {
  genderInputs[g].addEventListener('change', function () {
    clearError('studentGender');
  });
}

var skillInputsAll = document.querySelectorAll('input[name="studentSkills"]');
for (var s = 0; s < skillInputsAll.length; s++) {
  skillInputsAll[s].addEventListener('change', function () {
    clearError('studentSkills');
  });
}


function resetForm() {
  form.reset();
  clearAllErrors();
}


form.addEventListener('submit', function (event) {
  event.preventDefault();

  var data = readFormData();
  clearAllErrors();

  var isValid = validateForm(data);
  if (!isValid) {
    return;
  }

 
  var reader = new FileReader();

  reader.onload = function () {
    var student = {};
    student.id = nextId;
    nextId = nextId + 1;
    student.name = data.name.trim();
    student.email = data.email.trim();
    student.phone = data.phone.trim();
    student.dob = data.dob;
    student.gender = data.gender;
    student.course = data.course;
    student.skills = data.skills;
    student.about = data.about.trim();
    student.photo = reader.result;

    students.push(student);
    renderStudentCard(student);
    updateStudentCount();
    resetForm();
  };

  reader.readAsDataURL(data.photoFile);
});


studentContainer.addEventListener('click', function (event) {
  var deleteButton = event.target.closest('.student-card__delete');
  if (!deleteButton) {
    return;
  }

  var card = deleteButton.closest('.student-card');
  if (!card) {
    return;
  }

  var studentId = Number(card.getAttribute('data-id'));

  var indexToRemove = -1;
  for (var i = 0; i < students.length; i++) {
    if (students[i].id === studentId) {
      indexToRemove = i;
      break;
    }
  }

  if (indexToRemove !== -1) {
    students.splice(indexToRemove, 1);
  }

  card.remove();
  updateStudentCount();
});


updateStudentCount();