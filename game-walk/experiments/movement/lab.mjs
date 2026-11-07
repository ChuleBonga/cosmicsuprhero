import { createState, stepMotion, MOTION } from './movement-model.mjs';

// Engineering visualization: all structures are original vector blockouts.
// The physics contacts use the exact world units and X/Y positions shown here.
const c=document.querySelector('#world'),g=c.getContext('2d');
import { floorAt, points, gap, WORLD_END } from './terrain.mjs';
const VIEW_H=540;
const input={left:false,right:false,jump:false};
let state=createState(95,floorAt),before={...state},camera=0,paused=false,debug=false,
  accumulator=0,previous=0,frameCounter=0,fps=0,fpsTimer=0,tipDismissed=false;
function reset(){state=createState(95,floorAt);before={...state};camera=0;accumulator=0;}
function resize(){let w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
  c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.style.width=w+'px';c.style.height=h+'px';
  g.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',resize);resize();
function button(id,key){const el=document.getElementById(id);const release=e=>{e?.preventDefault();input[key]=false;el.classList.remove('active')};
 el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);input[key]=true;el.classList.add('active')});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,release);
}
button('left','left');button('right','right');button('jump','jump');
window.addEventListener('blur',()=>{input.left=input.right=input.jump=false;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){input.left=input.right=input.jump=false;previous=0;accumulator=0;}});
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' ','a','d','w'].includes(e.key))e.preventDefault();
 if(e.repeat&&(e.key.toLowerCase()==='g'||e.key.toLowerCase()==='r'||e.key.toLowerCase()==='p'))return;
 switch(e.key.toLowerCase()){
 case 'arrowleft':case 'a':input.left=true;break;case 'arrowright':case 'd':input.right=true;break;
 case ' ':case 'arrowup':case 'w':input.jump=true;break;
 case 'r':reset();break;case 'p':paused=!paused;break;case 'g':debug=!debug;break;
 }});
window.addEventListener('keyup',e=>{switch(e.key.toLowerCase()){
 case 'arrowleft':case 'a':input.left=false;break;case 'arrowright':case 'd':input.right=false;break;
 case ' ':case 'arrowup':case 'w':input.jump=false;break;
 }});
function polygon(vertices,fill,stroke=null,line=1){g.beginPath();vertices.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=line;g.stroke();}}
function stoneRect(x,y,w,h){g.fillStyle='#77523c';g.fillRect(x+5,y+7,w,h);g.fillStyle='#b68c62';g.fillRect(x,y,w,h);g.fillStyle='#d9ad79';g.fillRect(x,y,w,5);g.strokeStyle='#644936';g.strokeRect(x+.5,y+.5,w-1,h-1);
 for(let py=y+29;py<y+h-5;py+=35){g.strokeStyle='#8c694a';g.beginPath();g.moveTo(x+4,py);g.lineTo(x+w-4,py);g.stroke();}}
function columns(x,y,w,h,number=3){
 stoneRect(x,y,w,17);for(let i=0;i<number;i++){
 const cx=x+18+(w-36)*i/Math.max(1,number-1);stoneRect(cx-10,y+17,20,h-17);
 g.fillStyle='#473b39';g.fillRect(cx-13,y+16,26,6);
 }
}
function landmark(x){
 const y=floorAt(x)?.y??420;
 if(x===550){columns(x-80,y-135,158,135,3);stoneRect(x-92,y-149,182,20);
  g.fillStyle='#172234';g.fillRect(x-38,y-110,76,65);}
 if(x===1110){stoneRect(x-85,y-172,40,172);stoneRect(x+46,y-172,40,172);stoneRect(x-100,y-184,202,23);
  g.fillStyle='#172438';g.beginPath();g.arc(x,y-50,40,Math.PI,0);g.lineTo(x+40,y);g.lineTo(x-40,y);g.closePath();g.fill();}
 if(x===1510){columns(x-105,y-113,210,112,4);}
 if(x===2240){stoneRect(x-92,y-188,30,188);stoneRect(x+65,y-188,30,188);stoneRect(x-107,y-202,215,21);
  g.fillStyle='#e9b46d';g.fillRect(x-42,y-199,84,5);}
}
function ridge(base,parallax,vertices,color,viewW){
 const shift=camera*parallax;g.fillStyle=color;g.beginPath();g.moveTo(-50,VIEW_H);
 for(let x=-50;x<=viewW+50;x+=18){const a=(x+shift)*.009;
 const y=base+Math.sin(a)*22+Math.sin(a*.37+2.3)*43+Math.cos(a*1.7)*9;
 g.lineTo(x,y);}g.lineTo(viewW+50,VIEW_H);g.fill();
}
function draw(t){
 const scale=innerHeight/VIEW_H,viewW=innerWidth/scale;
 g.setTransform(c.width/innerWidth,0,0,c.height/innerHeight,0,0);
 g.clearRect(0,0,innerWidth,innerHeight);g.save();g.scale(scale,scale);
 const sky=g.createLinearGradient(0,0,0,VIEW_H);sky.addColorStop(0,'#06162d');sky.addColorStop(.55,'#284358');sky.addColorStop(1,'#b78a66');
 g.fillStyle=sky;g.fillRect(0,0,viewW,VIEW_H);
 const sx=viewW*.73-camera*.018;const sun=g.createRadialGradient(sx,145,6,sx,145,110);
 sun.addColorStop(0,'#ffb77b');sun.addColorStop(.3,'#e38550a9');sun.addColorStop(1,'#e3855000');g.fillStyle=sun;g.fillRect(sx-120,20,240,250);
 g.beginPath();g.arc(sx,145,40,0,Math.PI*2);g.fillStyle='#cc633f';g.fill();
 ridge(302,.08,null,'#263b48',viewW);ridge(347,.19,null,'#334451',viewW);
 g.save();g.translate(-camera,0);
 // Backdrop architecture is deliberately non-colliding in this study.
 for(const x of [550,1110,1510,2240]){g.globalAlpha=.7;landmark(x);g.globalAlpha=1;}
 for(let i=0;i<points.length-1;i++){
 const a=points[i],b=points[i+1],left=a.x,right=b.x;
 const intervals=[[left,Math.min(right,gap.start)],[Math.max(left,gap.end),right]].filter(([l,r])=>l<r);
 for(const [l,r] of intervals){if(l===r||l>=gap.start&&r<=gap.end)continue;
 const f1=floorAt(l),f2=floorAt(r);if(!f1||!f2)continue;
 polygon([[l,f1.y],[r,f2.y],[r,540],[l,540]],'#594839');
 g.strokeStyle='#d5ad7c';g.lineWidth=5;g.beginPath();g.moveTo(l,f1.y);g.lineTo(r,f2.y);g.stroke();
 }}
 // Physical landmark for listening interaction testing; no audio assets used.
 const crystalX=1390,cy=(floorAt(crystalX)?.y??370)-32;
 const pulse=1+.06*Math.sin(t*2);g.save();g.translate(crystalX,cy);g.scale(pulse,pulse);
 polygon([[0,-22],[12,-3],[6,18],[-8,18],[-13,-1]],'#6aa5ae','#e6d5b9',2);g.restore();
 const px=state.x,py=state.y;
 g.save();g.translate(px,py);
 // Temporary proportion guide: 30 x 52 logical units, pivot at feet.
 g.fillStyle='#0c1830';g.beginPath();g.ellipse(0,0,17,4,0,0,Math.PI*2);g.fill();
 const bob=state.grounded&&Math.abs(state.vx)>12?Math.sin(t*11)*1.2:0;
 g.translate(0,bob);g.scale(state.facing,1);
 polygon([[-7,-34],[-23,-8],[-8,-3],[9,-4],[16,-13],[9,-36]],'#793d40');
 g.fillStyle='#253e50';g.fillRect(-8,-30,16,22);g.fillRect(-7,-9,6,9);g.fillRect(3,-9,6,9);
 g.beginPath();g.arc(0,-42,10,0,Math.PI*2);g.fillStyle='#446c77';g.fill();
 g.fillStyle='#e5b17f';g.fillRect(4,-43,3,2);g.restore();
 if(debug){g.strokeStyle='#91d1b4';g.lineWidth=1;g.beginPath();for(let x=0;x<WORLD_END;x+=3){const f=floorAt(x);if(!f)continue;if(x===0||!floorAt(x-3))g.moveTo(x,f.y);else g.lineTo(x,f.y);}g.stroke();
 g.strokeStyle='#ffdf8b';g.strokeRect(px-15,py-52,30,52);g.fillStyle='#edc084';g.fillText(`x ${px.toFixed(1)} y ${py.toFixed(1)}`,px+20,py-55);}
 g.restore();
 const vignette=g.createLinearGradient(0,0,viewW,0);vignette.addColorStop(0,'#06132080');vignette.addColorStop(.2,'#00000000');vignette.addColorStop(.8,'#00000000');vignette.addColorStop(1,'#06132080');g.fillStyle=vignette;g.fillRect(0,0,viewW,VIEW_H);
 g.restore();
}
function frame(ms){
 if(!previous)previous=ms;const dt=Math.min(.05,Math.max(0,(ms-previous)/1000));previous=ms;
 if(!paused){accumulator+=dt;let steps=0;while(accumulator>=1/MOTION.hz&&steps<4){
   before={...state};const axis=Number(input.right)-Number(input.left);
   state=stepMotion(state,{axis,jumpPressed:input.jump},floorAt);
   input.jump=false;accumulator-=1/MOTION.hz;steps++;
 }
 if(state.y>580||state.x>WORLD_END-10)reset();
 const vWidth=innerWidth/(innerHeight/VIEW_H);const target=Math.max(0,Math.min(WORLD_END-vWidth,state.x-vWidth*.34));
 camera+=(target-camera)*(1-Math.exp(-7*dt));
 }
 draw(ms/1000);
 frameCounter++;fpsTimer+=dt;if(fpsTimer>=.75){fps=frameCounter/fpsTimer;frameCounter=0;fpsTimer=0;
  document.getElementById('x').textContent=String(Math.round(state.x));
  document.getElementById('phase').textContent=state.phase;
  document.getElementById('ground').textContent=state.grounded?'yes':'no';
  document.getElementById('fps').textContent=String(Math.round(fps));}
 if(!tipDismissed&&state.x>180){document.getElementById('tip').style.display='none';tipDismissed=true;}
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);