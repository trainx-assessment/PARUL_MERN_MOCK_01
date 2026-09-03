const students = [];
let error = "";

const form = document.getElementById("form");
const student_name = document.getElementById("student_name");
const name_error = document.getElementById("name_error");

const email = document.getElementById("email");
const email_error = document.getElementById("email_error");

const phone_number = document.getElementById("phone_number");
const phone_number_error = document.getElementById("phone_number_error");

const dob = document.getElementById("dob");
const dob_error = document.getElementById("dob_error");

const gender_field = document.getElementsByClassName("gender_field");
const male = document.getElementById("male");
const female = document.getElementById("female");
const other = document.getElementById("other");

const courses = document.getElementById("courses");
const skills = document.getElementById("skills");
const about_student = document.getElementById("about_student");
const profile_photo = document.getElementById("profile_photo");

const validate = () => {
    const name = student_name.value.trim();
    // name validation
    // const student_name = "abc";
    if(name.length < 3){
        name_error.textContent = "Minimum 3 character required";
        return false;
    } else if(name.length > 40){
        name_error.textContent = "maximum 40 character";
        return false;
    } 
    for(let i=0; i<name.length; i++){
        let char = name.charAt(i);
        if(('a' <= char && char <= 'z') || ('A' <= char && char <= 'Z') || char == " "){
            continue;
        }
        name_error.textContent = "Only chars are allowed. No numbers are allowed";
        return false;
    }
    // email validation
    if(email.value.length < 5){
        email_error.textContent = "Write proper email";
        return false;
    }

    // phone number
    if(phone_number.value.length != 10){
        phone_number_error.textContent = "number must be 10 digit number";
        return false;
    }
    // dob validation
    let dob_num = Number.parseInt(dob);
    if(Date.now() < dob_num){
        dob_error.textContent = "Date of birth can't be from future";
        return false;
    }
    // file validation
    

    name_error.textContent = "";
    phone_number_error.textContent = "";
    dob_error.textContent = "";
    return true;
}
form.addEventListener("submit", e => {
    e.preventDefault();
    
    // gender selection
    let selected_gender = null;
    [...gender_field].forEach(gender_div => {
        // console.log(gender_div)
        const [input] = gender_div.children;
        // console.log(input.checked)
        if(input.checked){
            selected_gender = input.id;
        }
    });
    // skill selection
    let selected_skills = [];
    [...skills.children].forEach(skill => {
        // console.log(skill.children)
        const [input_f] = skill.children;
        // console.log(input_f.checked)
        if(input_f.checked){
            selected_skills.push(input_f.id);
        }
    });
    let selected_course = null;
    [...courses.children].forEach(option => {
        if(option.selected){
            selected_course = option.value;
        }
    })
    if(!validate()) return;
    // console.log(typeof (profile_photo))

    students.push({
        id: Date.now(),
        student_name: student_name.value,
        email: email.value,
        phone_number: phone_number.value,
        dob: dob.value,
        gender: selected_gender,
        course: selected_course,
        skills: selected_skills,
        about_student: about_student.value,
        profile_photo: profile_photo.value,
        about_student: about_student.value,
    });
    console.log(students);
    display();
});

function display(){
    // display student statitics
    const student_aggregated_data = document.getElementById("student_aggregated_data");
    student_aggregated_data.replaceChildren(null);
    const t_s = students.length;
    let t_ui_ux = 0;
    
    student_aggregated_data.innerHTML = `
    <p>Total Students: 0</p>
    <div>
        <p>UI/UX: 0</p>
        <p>Python: 0</p>
        <p>Data Analytics: 0</p>
        <p>MERN Stack: 0</p>
        <p>Cloud Computing: 0</p>
    </div>
    `;

    // display student cards
    const student_container = document.getElementById("student_container");
    student_container.replaceChildren("");
    students.forEach(student => {
        const card = document.createElement("div");
        card.setAttribute("class", "card");
        card.innerHTML = `
        <img src="${student.profile_photo}">
        <div class="card_details">
            <p>Name: ${student.student_name}</p>
            <p>email: ${student.email}</p>
            <p>phone number: ${student.phone_number}</p>
            <p>gender: ${student.gender}</p>
            <p>course: ${student.course}</p>
            <p>skills: ${student.skills.toLocaleString()}</p>
            <p>about:</p>
            <p>${student.about_student}</p>
        </div>
        `;

        student_container.appendChild(card);
    });

}