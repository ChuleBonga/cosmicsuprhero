// Arcturian Awakening: immediate, deterministic interaction. Nothing depends on a GPU or audio permission.
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const menu=$('#menu-toggle'),nav=$('#primary-nav');
menu?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.textContent=open?'Close':'Menu';
});
$$('a',nav).forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.textContent='Menu';
}));

let scene=1,opening=0;
const sceneNodes=$$('.journey-scene');
function showScene(next,moveFocus=true){
  scene=Math.min(3,Math.max(1,Number(next)||1));
  sceneNodes.forEach(node=>{node.hidden=Number(node.dataset.scene)!==scene;});
  $$('.journey-nav__step').forEach(button=>{
    const isCurrent=Number(button.dataset.goScene)===scene;
    button.classList.toggle('is-current',isCurrent);
    if(isCurrent)button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  });
  if(moveFocus){
    const heading=$('.journey-scene:not([hidden]) .journey-scene__note strong');
    if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
    $('#experience').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
}
$$('[data-go-scene]').forEach(button=>button.addEventListener('click',()=>showScene(button.dataset.goScene)));
$$('[data-next-scene]').forEach(button=>button.addEventListener('click',()=>showScene(button.dataset.nextScene)));
$('#restart-journey')?.addEventListener('click',()=>{setOpening(0);setDaylight(16);showScene(1);});

const slider=$('#aperture'),left=$('#gate-left'),right=$('#gate-right'),frame=$('#exp-frame');
const percentage=$('#percentage'),label=$('#state-label');
function setOpening(n){
  const value=Math.min(100,Math.max(0,Math.round(Number(n)||0)));
  opening=value;
  slider.value=String(value);
  left.style.transform='translate3d(-'+value+'%,0,0)';
  right.style.transform='translate3d('+value+'%,0,0)';
  percentage.textContent=String(value).padStart(2,'0');
  const state=value<12?'Withheld':value<40?'First light':value<75?'Opening':value<98?'Almost there':'Revealed';
  if(label.textContent!==state)label.textContent=state;
  frame.classList.toggle('complete',value>=98);
}
slider.addEventListener('input',e=>setOpening(e.target.value));
$('#close-step').addEventListener('click',()=>setOpening(opening-10));
$('#open-step').addEventListener('click',()=>setOpening(opening+10));
$('#reset-window').addEventListener('click',()=>setOpening(0));
let drag=null;
frame.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  drag={x:e.clientX,value:opening,id:e.pointerId};
  frame.setPointerCapture?.(e.pointerId);
});
frame.addEventListener('pointermove',e=>{
  if(!drag||drag.id!==e.pointerId)return;
  const width=frame.getBoundingClientRect().width;
  if(width>0)setOpening(drag.value+(e.clientX-drag.x)/width*140);
});
for(const type of ['pointerup','pointercancel','lostpointercapture']){
  frame.addEventListener(type,()=>{drag=null;});
}
frame.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();setOpening(opening+5);}
  if(e.key==='ArrowLeft'){e.preventDefault();setOpening(opening-5);}
});
const memories={
  distance:{
    number:'I / III',title:'Between two places',
    copy:"From Port Elizabeth to a life far away, there are distances that no map can describe. The music doesn't resolve them. It lets them be heard.",
    alt:'Atmospheric night image from the Cosmicsuprhero archive',
  },
  inheritance:{
    number:'II / III',title:'The people we carry',
    copy:'A voice, a family name, an absence. Even music about the cosmos eventually has to answer to a human life.',
    alt:'Sunlit and earth-toned archive imagery',
  },
  belief:{
    number:'III / III',title:'Questions that remain',
    copy:'Faith and uncertainty do not always cancel each other out. Some of the most important questions remain open.',
    alt:'Threshold architecture drawn from the Cosmicsuprhero archive',
  }
};
function chooseMemory(name){
  const m=memories[name];if(!m)return;
  $('#memory-number').textContent=m.number;
  $('#memory-title').textContent=m.title;
  $('#memory-copy').textContent=m.copy;
  const image=$('#memory-image');
  image.dataset.memory=name;
  image.setAttribute('aria-label',m.alt);
  $$('.memory-room__tabs button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.memory===name)));
}
$$('[data-memory]').forEach(button=>button.addEventListener('click',()=>chooseMemory(button.dataset.memory)));

const daySlider=$('#daylight'),field=$('#return-field'),dayValue=$('#daylight-value'),returnLine=$('#return-line');
function setDaylight(n){
  const amount=Math.min(100,Math.max(0,Math.round(Number(n)||0)));
  daySlider.value=String(amount);
  dayValue.textContent=amount+'%';
  field.style.setProperty('--daylight',String(amount/100));
  const veil=$('.return-field__veil',field);
  if(veil)veil.style.opacity=String(.88-amount/100*.8);
  const bg=$('.return-field__background',field);
  if(bg)bg.style.filter='brightness('+(0.45+amount/100*.72)+') saturate(.75)';
  const text=amount<33?'A place, just before morning.':amount<80?'The ordinary world begins to appear.':'The sky is above us. The earth is beneath us.';
  if(returnLine.textContent!==text)returnLine.textContent=text;
}
daySlider.addEventListener('input',e=>setDaylight(e.target.value));
$('#bring-daylight').addEventListener('click',()=>setDaylight(100));
setOpening(0);chooseMemory('distance');setDaylight(16);showScene(1,false);
