let formm = document.querySelector('form')

// const email = document.querySelector('.email')
// const phn = document.querySelector('.phnumber')
// const dob = document.querySelector('.dob')
// const course = document.querySelector('.Course')
// const skills = document.querySelector('.Skills')
// const abst = document.querySelector('.abstudent')
// const pfp = document.querySelector('.pfp')
const regstu = document.querySelector('.regstu')


// formm.addEventListener('submit', (event) => {
//     event.preventDefault()

// })

let i = 0
const stats = document.querySelector('.stats')
stats.textContent = `Total Students ${i}`


const cards = document.querySelector('.cards')

regstu.addEventListener('click', (event) => {

    let flag = true
    event.preventDefault()
    const name = document.querySelector('#name')


    if(!validateName(name))flag = false

    const email = document.getElementById("email")

    if(!validateEmail(email))flag = false
    const phone = document.getElementById("phnumber")
    if(!validatePhone(phone))flag = false
    const dob = document.getElementById("dob")
    if(!validateDOB(dob))flag = false
    const gender = document.querySelectorAll(".gend")
    let gend
    gender.forEach(ele => {
        if (ele.checked) {
            gend = ele.value
        }
    });
    if (!gend){
        alert("Select a gender")
        flag = false
    } 

    console.log(gend)

    const course = document.querySelector('.Course').value

    if (course === "Select Course") {
        alert("Select a course")
        flag = false
    }

    console.log(course)

    const skills = document.querySelectorAll('.Skills')
    let skar = []
    let str = ""
    skills.forEach(ele => {
        if (ele.checked) {
            skar.push(ele.value)
        }
    });
    if (skar.length == 0){
        alert("Select atleast one skill")
        flag = false
    }

    skar.forEach(element => {
        strr = element + " ,"
        str+=strr
    });
    let curse =  str.slice(0,str.length-1)

    const pfp = document.querySelector('.pfp').value
    console.log(pfp)
    let extt = pfp.split(".")
    let ext = extt[extt.length - 1]
    if (!(ext === "jpg" || ext === "jpeg" || ext === "png")) {
        alert("File Type Wrong")
        flag = false
    }

    const txtar = document.querySelector('.abstudent').value
    console.log(flag)

    if(flag){
        i++
        stats.textContent = `Total Students ${i}`

        let stcards = document.createElement('div')
        stcards.classList.add('student-card')
        
        stcards.setAttribute("data-id" , i)

        let edit = document.createElement('button')
        edit.classList.add('edit')

        let del = document.createElement('button')
        del.classList.add('del')

        stcards.innerHTML = `
        <img class="dp" src="${pfp}" alt="Cannot access image">

        <p> ${name.value.trim()}</p>
        <p> E-mail: ${email.value}</p>
        <p> Phone: ${phone.value}</p>
        <p> DOB: ${dob.value}</p>
        <p> Gender: ${gend}</p>
        <p> Course: ${course}</p>
        <p> Skills:</p>
        <p> ${curse}</p>
        <p> About:</p>
        <p> ${txtar}</p>

        `
        let ename = name.value.trim()
        let eemail = email.value
        let ephn = phone.value
        let edob = dob.value
        let egend = gend
        let ecourse = course
        let etxt = txtar

        edit.innerHTML = `Edit`
        del.innerHTML = `Delete`
        stcards.appendChild(edit)
        stcards.appendChild(del)

        cards.appendChild(stcards)

        edit.addEventListener('click',()=>{
            cards.removeChild(stcards)    
            
            i--
            stats.textContent = `Total Students ${i}`

            name.value = ename
            email.value = eemail
            phone.value = ephn
            dob.value = edob
            gender.forEach(ele => {

                if (ele.value === egend) {
                    ele.checked = true
                } else {
                    ele.checked = false
                }

            })

            courseEle.value = ecourse
            skills.forEach(ele => {

                if (eskills.includes(ele.value)) {
                    ele.checked = true
                } else {
                    ele.checked = false
                }

            })
            txtArea.value = etxt

        })

        del.addEventListener('click',()=>{
            i--
            stats.textContent = `Total Students ${i}`
            cards.removeChild(stcards)   
        })

    }


    function validateName() {
        let canContain = /^[a-zA-Z\s]+$/;
        if (!canContain.test(name.value.trim())) {
            alert("Name can only contain letters and spaces");
            return false;
        }
        let nameValue = name.value.trim();
        if (nameValue.length > 40) {
            alert("Name cannot exceed 40 characters");
            return false;
        }
        if (nameValue.length < 3) {
            alert("Name must be at least 3 characters long");
            return false;
        }
        if (nameValue === "") {
            alert("Name is required");
            return false;
        }
        return true;
    }

    function validateEmail() {
        let emailValue = email.value.trim();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
            alert("Please enter a valid email address");
            return false;
        }
        return true;
    }

    function validatePhone() {
        let phoneValue = phone.value.trim();
        if (phoneValue.length !== 10) {
            alert("Please enter a valid 10-digit phone number");
            return false;
        }
        return true;
    }

    function validateDOB() {
        let dobValue = dob.value;
        if (!dobValue) {
            alert("Please select a date of birth");
            return false;
        } else if (new Date(dobValue) > new Date()) {
            alert("Date of birth cannot be in the future");
            return false;
        }
        else if (new Date(dobValue) > new Date('2011-09-02')) {
            alert("Date of birth cannot be after 2011");
            return false;
        }


        return true;
    }

})


