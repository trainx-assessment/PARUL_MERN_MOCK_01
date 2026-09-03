let students = [];
const studentForm = document.getElementById("studentForm");
const studentCardsContainer = document.getElementById("studentCardsContainer");
if (studentForm) {
  studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(studentForm);
    const student = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      course: formData.get("course"),
      grade: parseFloat(formData.get("grade")),
      photo: formData.get("photo") ? URL.createObjectURL(formData.get("photo")) : null,
    };
    students.push(student);
    renderStudentCards();
    studentForm.reset();       
   });
    const submitButton =document.getElementByClass("submit");         
   if (submitButton.click()) {
    totalStudents = students.length;
    totalStudentsElement = document.getElementById("totalStudents");
    totalStudentsElement.textContent = totalStudents+1;
    
    
   }

