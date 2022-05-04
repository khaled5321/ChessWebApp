const timeControl1=document.getElementById("timecontrol1");
const timeControl2=document.getElementById("timecontrol2");
const select1=document.getElementById("select1");
const select2=document.getElementById("select2");

function toggle(select, timeControl){
    if(select.value==="time"){
        timeControl.style.display="block";
    }
    if(select.value==="unlimited"){
        timeControl.style.display="none";
    }
}

select1.addEventListener('change',()=>{
   toggle(select1, timeControl1);
});

select2.addEventListener('change',()=>{
    toggle(select2, timeControl2);
})