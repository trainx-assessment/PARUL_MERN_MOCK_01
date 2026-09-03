let form = document.querySelector('.forms')
let names = document.querySelector('#name')
let email = document.querySelector('#email')
let number = document.querySelector('#number')
let birth = document.querySelector('#birth')
let detail = document.querySelector('#stu-details')
let detail_parent = document.querySelector('.detail')
let profile = document.querySelector('#profile')
let register = document.querySelector('.register')
let course = document.querySelector('#course')
let lengths = 0
let parent_student = document.querySelector('.parent-student')
const students = []

form.addEventListener('submit',(e)=>{
  e.preventDefault();
  let n = names.value
  n = n.trim()

  // console.log(n)

  //  name validation
  let len = n.length
  if(len<3 || len>40){
    names.placeholder = 'Enter valid name'
  }else{
    for(let i=0;i<len;i++){
      if(!((n.charAt(i)>='a' && n.charAt(i)<='z') || 
            (n.charAt(i)>='A' && n.charAt(i)<='Z') || 
          (n.charAt(i)>='0' && names.charAt(i)<='9') || n.charAt(i)==' ')){
            names.placeholder = 'Enter valid name'
      }
    }
  }


  // email validation
  let emails = email.value
  len = emails.length
  let char = 0 , numbers = 0 , specialchar = 0 , dot = 0; 
  for(let i=0;i<len;i++){
    if(emails.charAt(i)>='0' && emails.charAt(i)<='9') numbers++;
    else if(emails.charAt(i)>='a' && emails.charAt(i)<='z') char++;
    else if(emails.charAt(i)>='A' && emails.charAt(i)<='Z') char++;
    else if(emails.charAt(i)=='@') specialchar++;
    else if(emails.charAt(i)=='.') dot++;
  }

  if(!(dot==1 && numbers>=1 && char>=1 && specialchar==1)){
    email.placeholder = "Enter valid email"
  }

  //number validation
  let num = number.value 
  if(num.length!=10){
    number.placeholder = 'Enter valid number'
  }else if(num.length==0){
     number.placeholder = 'Enter valid number'
  }
  else{
    for(let i=0;i<num.length;i++){
      if(!(num.charAt(i)>='0' && num.charAt(i)<='9')){
        alert("Enter valid number")
      }
    }
  }

  let dates = birth.value 
  if((course.val)===('Select Course')){
    course.placeholder = 'Select a course'
  }

  let studentDetail = detail.value
  lengths = studentDetail
  if(studentDetail.length==0){
    detail.textContent = 'Enter student deatils'
  }else if(studentDetail.length>200 || studentDetail.length<20){
    detail.textContent = 'Insufficient Details'
  }

  let obj = {
    name : n,
    email : emails,
    phone : num,
    dob : dates,
    about : studentDetail
  }

  students.push(obj)
})


let counter = document.createElement('div')
  counter.classList.add('count')
  detail_parent.appendChild(counter)
  let count = 0
  let stu = detail.value
  detail.addEventListener('input',()=>{
      count=(Number(detail.value.length))
      counter.textContent = count  
})


// email phone number dob about edit delete

let student = document.createElement('div')
student.classList.add('student')
register.addEventListener('click',()=>{
  students.forEach((ele)=>{
    let stu = document.createElement('div')
    stu.classList.add('stu')
    let namesStu = document.createElement('div')
    namesStu.textContent = ele.name
    stu.appendChild(namesStu)
    

     let email = document.createElement('div')
    email.textContent = ele.email
    stu.appendChild(email)

    
     let phone = document.createElement('div')
    phone.textContent = ele.phone
    stu.appendChild(phone)


     let about = document.createElement('div')
    about.textContent = ele.about
    stu.appendChild(about)

    let buttons = document.createElement('div')
    let edit = document.createElement('button')
    edit.classList.add('button')
    let deletes = document.createElement('button')
    deletes.classList.add('button')
    stu.appendChild(buttons)
    student.appendChild(stu)
    parent_student.appendChild(student)
  })
})
