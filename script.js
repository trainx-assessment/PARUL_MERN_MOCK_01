const form = document.querySelector(#studentform);
const stuname = document.querySelector(#name);
const email = document.querySelector(#email);
const dob = document.querySelector(#dob);
const gender = document.querySelector(#gender-details);

form.addEventListener{
    "submit",
    function(event){
        const name = stuname.value;
        if(name.trim()===""){
            alert("Name is required");
        }
        
    }
}