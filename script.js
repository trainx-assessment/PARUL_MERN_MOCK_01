const submit = document.getElementById("btn1");
const reset = document.getElementById("btn2");


let users = [];
submit.addEventListener("click",()=>{
    let data = [];
    const name = document.getElementById("sname").value;
    const email = document.getElementById("email").value;
    const pnumber = document.getElementById("pnumber").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const course = document.getElementById("selector").value;
    const skills = document.getElementById("skills").value;
    const about = document.getElementById("about").value;
    const photo = document.getElementById("photo").value;

    const validname = isvalidname(name);
    const validemail = isvalidemail(email);
    const validnumber = isvalidnumber(pnumber);
    const validdob = isvaliddob(dob);
    const validgender = isvalidgender(gender);
    const validcourse = isvalidcourse(course);
    const validskill = isvalidskill(skills);
    const validabout = isvalidabout(about);
})

function isvalidname(s){
    if(s.length() > 40 && s.length() < 3){
        return false;
    }else{
        let isvalids = true;
        for(let c = 0;c<s.length();c++){
            if(s.charAt(c) == ''){
                if(isvalids){
                    isvalids = false;
                    continue;
                }else{
                    return false;
                }
            }
            else if((s.charAt(c)>='A' && s.charAt(c)<='Z') || (s.charAt(c)>='a' && s.charAt(c)<='z')){
                isvalids = true;
                continue;
            }else{
                return false;
            }
        }
    }
}

function isvalidemail(email){
    
}