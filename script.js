const searchStudent=document.querySelector("#searchStudent")
const searchStudentBtn=document.querySelector("#searchStudentBtn")
const close=document.querySelector("#close")
const studentFilter=document.querySelector("#studentFilter");
const submit=document.querySelector("#register")
const name=document.querySelector("#name")
const mail=document.querySelector("#mail")
const phone=document.querySelector("#phone")
const dob=document.querySelector("#dob")
const course=document.querySelector("#course")
const db=[];

searchStudentBtn.addEventListener("click",()=>{
    let student=searchStudent.value
    console.log(student)
    let contain=false;
    studentFilter.style.display="flex";
    for(let i=0;i<db.length;i++){
        console.log(db[i].Name)
        if(db[i].Name==student){
            contain=true;
            const h1=document.createElement("h1");
            const h2=document.createElement("h1");
            const h3=document.createElement("h1");
            const h4=document.createElement("h1");
            const h5=document.createElement("h1");

            h1.textContent=`Name:${db[i].Name}`
            h2.textContent=`Email:${db[i].Mail}`
            h3.textContent=`Phone No:${db[i].Phone}`
            h4.textContent=`DOB:${db[i].Date}`
            h5.textContent=`Course:${db[i].Course}`
            
            studentFilter.appendChild(h1);
            studentFilter.appendChild(h2);
            studentFilter.appendChild(h3);
            studentFilter.appendChild(h5);

            break;
        }
    }
    if(!contain){
        const h1=document.createElement("h1");
        h1.textContent=`No Student FOUND with name ${student}`;

        studentFilter.appendChild(h1);
    }
    
})

close.addEventListener("click",()=>{
    studentFilter.style.display="none";
    studentFilter.textContent=""
})

submit.addEventListener("click",(e)=>{
    e.preventDefault();
    alert("Registration Successful!!")
    const Name=name.value
    const Mail=mail.value
    const Course=course.value
    const Date=dob.value;
    const Phone=phone.value;

    let temp={
        "Name":Name,
        "Mail":Mail,
        "Phone":Phone,
        "Date":Date,
        "Course":Course
    }

    db.push(temp)

    console.log(db);

})

