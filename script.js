let studentForm = document.querySelector('.student-form form');
const students = [];
let form = document.querySelector('#studentForm');
let button = document.querySelector(".btn")

studentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let object = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    gender: form.gender.value,
    about: form.about.value,
    Dob: form.Dob.value,
    course: form.course.value,
    skills:form.skills.value,
  };
  students.push(object);
  console.log(students);
  form.name.value = "";
  form.email.value = "";
  form.phone.value = "";
  form.gender.value = "";
  form.about.value = "";
  form.Dob.value = "";
  form.course.value = "";
  form.skills.value = "";

      button.addEventListener("click", function() {
let display = document.createElement('div');

  let add = document.createElement("div");
  let photo = document.createElement("photo")
  let image = document.createElement("img")
  let info = document.createElement("div")
  let h3 = document.createElement("h3")
  let p1 = document.createElement("p")
  let p2 = document.createElement("p")
  let p3 = document.createElement("p")
  info.appendChild(h3);
  info.appendChild(p1)
photo.appendChild(image);
add.appendChild(photo)
add.appendChild(info)
display.appendChild(add)
display.innerText = add;
}) 

});
