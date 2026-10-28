const menu=document.getElementById('menu-toggle');
const nav=document.getElementById('primary-nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';}));
const slider=document.getElementById('aperture');
const left=document.getElementById('gate-left'),right=document.getElementById('gate-right'),frame=document.getElementById('exp-frame');
const percentage=document.getElementById('percentage'),label=document.getElementById('state-label');
let current=0;
function setOpening(n){
const value=Math.min(100,Math.max(0,Math.round(Number(n)||0)));
current=value;slider.value=String(value);left.style.transform='translate3d(-'+value+'%,0,0)';right.style.transform='translate3d('+value+'%,0,0)';
percentage.textContent=String(value).padStart(2,'0');
const state=value<12?'Withheld':value<40?'First light':value<75?'Opening':value<98?'Almost there':'Revealed';
if(label.textContent!==state)label.textContent=state;
frame.classList.toggle('complete',value>=98);
}
slider.addEventListener('input',e=>setOpening(e.target.value));
document.getElementById('close-step').addEventListener('click',()=>setOpening(current-10));
document.getElementById('open-step').addEventListener('click',()=>setOpening(current+10));
document.getElementById('reset-window').addEventListener('click',()=>setOpening(0));
setOpening(0);
