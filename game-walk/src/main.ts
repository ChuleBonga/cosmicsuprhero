import Phaser from "phaser";import {AudioDirector} from "./audio/AudioDirector";import {ProgressManager} from "./progress/ProgressManager";
const WIDTH=960,HEIGHT=540,WORLD=3200;const AUDIO=new AudioDirector(),PROGRESS=new ProgressManager();
const cover="https://cdn.amuse.io/cafc5a27-1bb5-4dd2-896f-9fde9e508317.800x800.jpg";
class TitleScene extends Phaser.Scene{
 constructor(){super("Title");}
 preload(){this.load.image("cover",cover);}
 create(){
  const g=this.add.graphics();g.fillStyle(0xf2eee7).fillRect(0,0,WIDTH,HEIGHT);
  if(this.textures.exists("cover")){const a=this.add.image(WIDTH/2,HEIGHT/2,"cover").setDisplaySize(540,540);a.setAlpha(.98);}
  else{this.add.rectangle(WIDTH/2,HEIGHT/2,470,540,0x263f88);this.add.circle(WIDTH/2+45,150,45,0xf58b29);}
  const sun=this.add.zone(WIDTH/2+25,145,145,145).setInteractive({useHandCursor:true});
  sun.on("pointerdown",()=>{void AUDIO.start();this.scene.start("Walk");});
  this.input.keyboard?.once("keydown-ENTER",()=>{void AUDIO.start();this.scene.start("Walk");});
  this.add.text(WIDTH/2,HEIGHT-58,"TOUCH THE SUN TO BEGIN",{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"28px",color:"#581a3b"}).setOrigin(.5);
 }
}
class WalkScene extends Phaser.Scene{
 private worldLayers:Phaser.GameObjects.Container[]=[];private hero!:Phaser.GameObjects.Container;private position=120;private direction=0;private keys!:Record<string,Phaser.Input.Keyboard.Key>;private touchStart:Phaser.Math.Vector2|null=null;private pickup!:Phaser.GameObjects.Container;private text!:Phaser.GameObjects.Text;private lastSave=0;
 constructor(){super("Walk");}
 create(){
  this.cameras.main.setBounds(0,0,WORLD,HEIGHT);this.cameras.main.setBackgroundColor("#1b3274");
  // Five independent parallax layers. Gray-box art uses Phaser primitives, not old hotspots.
  for(let i=0;i<5;i++){
   const group=this.add.container(0,0);this.worldLayers.push(group);
   const colors=[0x203878,0x314587,0x45518a,0x8c6975,0xb58050],base=[0,128,210,320,435][i];
   if(i===0){group.add(this.add.rectangle(1600,270,3400,550,colors[i]));group.add(this.add.circle(750,115,62,0xf68c2d));}
   else{const gfx=this.add.graphics();gfx.fillStyle(colors[i],1);gfx.beginPath();gfx.moveTo(-100,HEIGHT);for(let x=-100;x<3400;x+=80){const y=base+Math.sin(x/(200-i*18)+i*1.3)*30+Math.sin(x/(115+i*16))*19;gfx.lineTo(x,y);}gfx.lineTo(3400,HEIGHT);gfx.closePath();gfx.fillPath();group.add(gfx);}
   group.setScrollFactor([.04,.15,.29,.53,1][i]);group.setDepth(i);
  }
  const ground=this.add.graphics();ground.fillStyle(0x3a365e).fillRect(0,489,WORLD,51);ground.setDepth(6);
  this.hero=this.add.container(this.position,448);this.hero.setDepth(9);
  const figure=this.add.graphics();figure.fillStyle(0x143c59).fillEllipse(0,-45,26,36);figure.fillStyle(0x4b285c).fillRoundedRect(-19,-29,38,61,10);figure.fillStyle(0x113047).fillRoundedRect(-14,24,11,35,2).fillRoundedRect(3,24,11,35,2);figure.lineStyle(2,0xd8ac6d).strokeRoundedRect(-19,-29,38,61,10);this.hero.add(figure);
  document.getElementById("status")!.style.display="block";
  this.add.text(24,26,"GRAY-BOX: 5 LAYERS · HOLD TO WALK",{fontFamily:"Arial",fontSize:"12px",color:"#fff7e5",backgroundColor:"#19254899",padding:{x:10,y:7}}).setScrollFactor(0).setDepth(20);
  this.text=this.add.text(24,63,"AWAKENING 0%",{fontFamily:"Arial",fontSize:"13px",color:"#fff7e5"}).setScrollFactor(0).setDepth(20);
  this.pickup=this.add.container(1010,435).setDepth(10);
  const halo=this.add.circle(0,0,26,0xffd577,.17);const core=this.add.rectangle(0,0,20,28,0xf1c77d,.95).setAngle(25);const inner=this.add.line(0,0,0,-12,0,12,0xfffaf0,.7).setLineWidth(2);this.pickup.add([halo,core,inner]);
  this.add.text(1010,376,"FIRST CONTACT",{fontFamily:"Arial",fontSize:"14px",color:"#f9e1c4"}).setOrigin(.5).setDepth(11);
  if(PROGRESS.snapshot.firstContact)this.pickup.setVisible(false);
  this.keys=this.input.keyboard?.addKeys("LEFT,RIGHT,A,D") as Record<string,Phaser.Input.Keyboard.Key>;
  this.input.on("pointerdown",(p:Phaser.Input.Pointer)=>{this.touchStart=new Phaser.Math.Vector2(p.x,p.y);this.direction=p.x<WIDTH*.5?-1:1;});
  this.input.on("pointermove",(p:Phaser.Input.Pointer)=>{if(!p.isDown)return;this.direction=p.x<WIDTH*.5?-1:1;});
  this.input.on("pointerup",()=>{this.touchStart=null;this.direction=0;});
  this.input.on("gameout",()=>{this.touchStart=null;this.direction=0;});
  const cam=this.cameras.main;cam.startFollow(this.hero,true,.075,.075,-100,0);cam.setDeadzone(80,80);
  this.events.once("shutdown",()=>{this.direction=0;});
  document.getElementById("sound")!.style.display="block";document.getElementById("help")!.style.display="block";
  document.getElementById("sound")!.onclick=()=>{const mute=AUDIO.toggleMute();document.getElementById("sound")!.textContent=mute?"Sound off":"Sound on";};
 }
 update(_t:number,delta:number){
  const keyboard=((this.keys?.RIGHT?.isDown||this.keys?.D?.isDown)?1:0)-((this.keys?.LEFT?.isDown||this.keys?.A?.isDown)?1:0);
  const dir=keyboard||this.direction;const dt=Math.min(delta,42)/1000;
  const was=this.position;this.position=Phaser.Math.Clamp(this.position+dir*235*dt,75,WORLD-75);
  this.hero.x=this.position;this.hero.scaleX=dir<0?-1:1;
  const walking=Math.abs(this.position-was)>0.05;this.hero.y=448+(walking?Math.sin(this.time.now*.02)*2:0);
  const fraction=Phaser.Math.Clamp((this.position-120)/2300,0,1);AUDIO.update(fraction);
  this.text.setText("AWAKENING "+Math.round(fraction*100)+"%");
  if(!PROGRESS.snapshot.firstContact&&Math.abs(this.position-this.pickup.x)<42){PROGRESS.recoverFirstContact();this.pickup.setVisible(false);void AUDIO.playPickup();this.add.text(this.position,335,"FIRST CONTACT RECOVERED",{fontFamily:"Georgia",fontSize:"23px",color:"#ffe1b5"}).setOrigin(.5).setDepth(12);}
  if(this.time.now-this.lastSave>600){PROGRESS.setDistance(this.position);this.lastSave=this.time.now;}
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:"game",width:WIDTH,height:HEIGHT,backgroundColor:"#182b6c",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},render:{pixelArt:false,antialias:true},scene:[TitleScene,WalkScene],fps:{target:60,forceSetTimeOut:false}});
