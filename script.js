let sList=[];
let eId=0;

let sData=localStorage.getItem('sData');
if(sData){
    sList=JSON.parse(sData);
}
const form=document.getElementById('studentForm');
const abtInp=document.getElementById('about');
const cCnt=document.getElementById('characterCount');
const cCont=document.getElementById('cardsContainer');
const totDisp=document.getElementById('totalStudents');
const subBtn=document.getElementById('submitBtn');
const srchInp=document.getElementById('searchInput');
const fltCrs=document.getElementById('filterCourse');
const crsSt=document.getElementById('courseStats');
const dkBtn=document.getElementById('darkModeBtn');

dkBtn.addEventListener('click',function(){
    document.body.classList.toggle('darkMode');
    if(document.body.classList.contains('darkMode')){
        dkBtn.textContent='Light Mode';
    }else{
        dkBtn.textContent='Dark Mode';
    }
});

abtInp.addEventListener('input',function(){
    let cLen=abtInp.value.length;
    cCnt.textContent=cLen+"/200";
});
form.addEventListener('submit',function(e){
    e.preventDefault();
    let isVal=true;

    let nVal=document.getElementById('name').value.trim();
if(nVal.length<3||nVal.length>40||!nReg.test(nVal)){
        document.getElementById('nameError').textContent='Invalid name';
        isVal=false;
    }else{
        document.getElementById('nameError').textContent='';
    }

    let eVal=document.getElementById('email').value.trim();
    if(eVal===""){
        document.getElementById('emailError').textContent='Required';
        isVal=false;
    }else{
        document.getElementById('emailError').textContent='';
    }
});
updDisp();