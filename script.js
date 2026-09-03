const name = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const maleRadio = document.getElementById("male");
const femaleRadio = document.getElementById("female");
const otherRadio = document.getElementById("other");
const course = document.getElementById("course");
const html = document.getElementById("html")
const css = document.getElementById("css")
const js = document.getElementById("js")
const git = document.getElementById("git");
const react = document.getElementById("react");
const node = document.getElementById("node");
const about = document.getElementById("textArea");
const img = document.getElementById("img");
const submit = document.getElementById("submit");
const cards = document.querySelector("cards");

let arr = [
    {
    id: 1,
    fullname: "Tvisha Singh Thakur",
    email: "example@gmail.com",
    phone: "+91 94628XXXXX",
    gender: "female",
    DOB : "01/10/2005",
    Course: "ui/ux"
},
    {
    id: 2,
    fullname: "Amit kumar",
    email: "example@gmail.com",
    phone: "+91 94628XXXXX",
    gender: "male",
    DOB : "01/10/2005",
    Course: "ui/ux"
},
    {
    id: 3,
    fullname: "Anil Kumar",
    email: "example@gmail.com",
    phone: "+91 94628XXXXX",
    gender: "male",
    DOB : "01/10/2005",
    Course: "ui/ux"
},
    {
    id: 4,
    fullname: "Esha patel",
    email: "example@gmail.com",
    phone: "+91 94628XXXXX",
    gender: "female",
    DOB : "01/10/2005",
    Course: "ui/ux"
},
];

submit.addEventListener("click",()=>{
    let fullname = name.value;
    let email = emailInput.value;
    let phone = phoneInput.value
    let male = maleRadio.value
    let female = femaleRadio.value
    let other = otherRadio.value
    let crs = course.value
    let HTML = html.value
    let CSS = css.value
    let JS = js.value
    let GIT = git.value
    let REACT = react.value
    let NODE = node.value
    let ABOUT = about.value
    let pp = img.value
    console.log(fullname);
    console.log(email);
    console.log(phone);
    console.log(male, female, other);
})

