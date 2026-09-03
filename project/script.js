class Student{
    constructor(name, email, number, dob, gender, course, skills, about, photo){
     this.name = name;
     this.email = email;
     this.number = number
     this.dob = dob
     this.gender = gender
     this.course = course
     this.skills = skills
     this.about = about
     this.photo = photo
    }
}

let db = []
// declarations
const name = document.getElementById("name")
const email = document.getElementById("email")
const pnumber = document.getElementById("pnumber")
const dob = document.getElementById("dob")
const genderdata = document.getElementsByClassName("gender")

let gender;
for(let g of genderdata){
    if(g.checked === true){
        gender = g.id
    }
}

const course = document.getElementById("course")
const skills = document.getElementsByName("skills")
let skill = []
for(let s of skills){
    if(s.checked === true){
        skill.push(s.id)
    }
}

const desc = document.getElementById("about")
const pfp = document.getElementById("pfp")

// working
// validation

function hasNumber(s){
    for(let i of s){
        if(i >= "0" && i <= "9"){
            return true;
        }
    }
    return false
}
function hasSpecial(s){
    for(let i of s){
        if(i === "!" || i === "@" || i == "#" || i === "$" || i === "%"){
            return true
        }
    }
    return false
}
function numberCheck(s){
    for(let i of s){
        if((i >= "a" && i <= "z") || (i >= "A" && i <= "Z")){
            return false
        }
    }
    if(s.length !== 10){
        return false
    }
    return true
}
function dateCheck(s){
    let day = s.substring(8,10)
    let month = s.substring(5,7)
    let year = s.substring(0,4)
    console.log(day)
    console.log(month)
    console.log(year)
    if(year > 2026){
        return false
    }
    else if(2026 - year >= 15){
        return "Above or equal 15"
    }
    else{
        return "not 15"
    }
}

const form = document.getElementById("form")
form.addEventListener("submit", function(e){
    e.preventDefault();
    if(hasNumber(name.value)){
        document.getElementById("nameError").textContent = "Name has Numbers"
        form.reset()
    }
    if(hasSpecial(name.value)){
        document.getElementById("nameError").textContent = "Name has Special Characters"
        form.reset()
    }
    if(numberCheck(pnumber.value)){
        document.getElementById("NumberError").textContent = "Number is not valid"
        form.reset()
    }
    let s = new Student(name.value, email.value, pnumber.value,dob.value,gender,course.value,skill,desc.value,pfp.value)
    db.push(s)
    showCards()
})
const cards = document.getElementById("cards")
function showCards(){
    db.forEach(e => {
        const card =document.createElement("div")
        card.class = "student-card";
        card.dataid = 1;
        const name = document.createElement("p")
        name.textContent = e.name
        const email = document.createElement("p")
        email.textContent = e.email
        const number = document.createElement("p")
        number.textContent = e.number
        const dob = document.createElement("p")
        dob.textContent = e.dob
        const gender = document.createElement("p")
        gender.textContent = e.gender
        const course = document.createElement("p")
        course.textContent = e.course
        const skills = document.createElement("p")
        skills.textContent = e.skills
        const about = document.createElement("p")
        about.textContent = e.about
        
        const edit = document.createElement("button")
        edit.textContent = "Edit"
        edit.class = 'edit'

        const del = document.createElement("button")
        del.textContent = "Delete"
        del.class = "delete"
        del.addEventListener("onclick",function(e){
            document.querySelector('.student-card').remove()
        })
        card.append(name,email,number,dob, gender, course,skills, about, edit, del)
        cards.append(card)
    });
}