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

regstu.addEventListener('click', (event) => {
    event.preventDefault()
    const name = document.querySelector('#name')


    validateName(name)

    const email = document.getElementById("email")
    validateEmail(email)
    const phone = document.getElementById("phnumber")
    validatePhone(phone)
    const dob = document.getElementById("dob")
    validateDOB(dob)
    const gender = document.querySelectorAll(".gend")
    let gend
    gender.forEach(ele => {
        if (ele.checked) {
            gend = ele.value
        }
    });
    if (!gend) alert("Select a gender")

    console.log(gend)

    const course = document.querySelector('.Course').value

    if (course === "Select Course") {
        alert("Select a course")
    }

    console.log(course)

    const skills = document.querySelectorAll('.Skills')
    let skar = []
    skills.forEach(ele => {
        if (ele.checked) {
            skar.push(ele.value)
        }
    });
    if (skar.length == 0) alert("Select atleast one skill")
    console.log(skar)

    const pfp = document.querySelector('.pfp').value
    console.log(pfp)
    let extt = pfp.split(".")
    let ext = extt[extt.length - 1]
    if (!(ext === "jpg" || ext === "jpeg" || ext === "png")) {
        alert("File Type Wrong")
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


