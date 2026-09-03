const register = document.getElementsByClassName("register")
const reset = document.getElementsByClassName("reset")
const form = document.getElementById("form")

register.addEventListener((e)=>{
    e.preventdefault()
    let isValid = true

    const regexP = /[0-9]/
    const regexN = /[a-zA-z]/
    const regerx = /[a-zA-z0-9]+@gmail\.com/

    document.getElementById("namee").innerText = ""
    document.getElementById("emaile").innerText = ""
    document.getElementById("phoneNoe").innerText = ""
    document.getElementById("birthe").innerText = ""
    document.getElementById("coursee").innerText = ""
    document.getElementById("aboute").innerText = ""
    document.getElementById("photoe").innerText = ""
    

    const Name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phoneNo").value
    const course = document.getElementById("course").value
    const about = document.getElementById("about").value
    const photo = document.getElementById("photo").value
    const age = document.getElementById("birth").value
    
    if(regerx.test(email) || email=="") {
        document.getElementById("emaile").innerText = "abc12@gamil.com"
        isValid = false
    }

    if(regexN.test(Name) || Name=="") {
        document.getElementById("namee").innerText = "Write a name"
        isValid = false
    }

    if(regexP.test(phone) || phone=="") {
        document.getElementById("phoneNoe").innerText = "Write only number"
        isValid = false
    }

    if(course=="") {
        document.getElementById("coursee").innerText = "Enter a course"
        isValid = false
    }

    if(about=="") {
        document.getElementById("aboute").innerText = "Write yourself"
        isValid = false
    }

    if(photo=="") {
        document.getElementById("photoe").innerText = "Enter a photo"
    }

    if(age=="") {
        document.getElementById("agee").innerText = "Enter birthdate"
    } 
    if(isValid) {
        document.getElementById("forme").innerText = "Register Successfully"
        form.reset()
    }
})



