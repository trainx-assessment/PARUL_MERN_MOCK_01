const form = document.getElementById("studentForm")

// const name = document.getElementById("name")
// const nameV = name.value.trim();
// if(nameV === ""){
    
    
// }

form.addEventListener("submit",function(event){
    event.preventDefault();

    let valid = true;

    const name = document.getElementById("name")
    const nameValid = name.value.trim()

    if(nameValid === ""){
        // alert("Enter student name.")
        valid = false;
    }else if(nameV < 3 || nameV > 40){
        // alert("Student name must be between 3 to 40 charcters.");
        valid = false;
    } else if (!/^[A-Za-z ]+$/.test(nameV)) {
        valid = false;
    }

    const email = document.getElementById("email")
    const emailV = email.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV)){
        valid= false;
    }

    const phone = document.getElementById("phone")
    const phoneV = phone.value.trim();
    if(!/^\d{10}$/.test(phoneV)){
        valid= false;
    }

    /////
})