const Form = document.getElementById("form");
Form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name =document.getElementById("name").value;
// console.log(name)
  const email =document.getElementById("email").value;
  const phone =document.getElementById("phone").value;
  const address =document.getElementById("address").value;
  const gender =document.querySelector('input[name="gender"]:checked').value;
  const course =document.getElementById("course").value;
  const dob = document.getElementById("dob").value;
const studentData = {
  name,
 email,
  phone,
  address,
  gender,
  course,
    dob,
  };

  const arr= [];
  arr.push(studentData);
  localStorage.setItem("studentData", JSON.stringify(arr));
  alert("saved successfully!");
  Form.reset();
});