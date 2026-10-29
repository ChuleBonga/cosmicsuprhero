import Phaser from 'phaser';
import {WorldBase} from './WorldBase';
import {progress} from '../systems/ProgressManager';
import {audioDirector} from '../systems/AudioDirector';
import {announce} from '../ui/events';
export class EncounterNameScene extends WorldBase {
 private motesToCollect:Phaser.GameObjects.Arc[]=[];
 private collected=new Set<number>();
 private clearPoint=710;
 private available=false;
 private completed=false;
 private lastHint='';
 constructor(){super('EncounterName')}
 create(){
  this.setUpWorld('name',1550,Math.max(100,Math.min(progress.data.position,1050)));
  this.clearPoint=Math.max(560,this.canvasW*.55+180);
  this.completed=progress.data.found.includes('xaba');
  const halo=this.add.circle(this.clearPoint,this.groundAt(this.clearPoint)-95,112,0xe4ae69,.06).setStrokeStyle(1,0xf2ce93,.3).setDepth(7);
  this.tweens.add({targets:halo,alpha:.15,scale:1.2,duration:3000,repeat:-1,yoyo:true});
  for(let i=0;i<3;i++){
   const theta=Math.PI*2*i/3-Math.PI/2;
   const orb=this.add.circle(this.clearPoint+Math.cos(theta)*72,this.groundAt(this.clearPoint)-105+Math.sin(theta)*49,11,0xf2bb76,1).setStrokeStyle(3,0xffe0a1,.7).setDepth(20);
   orb.setInteractive(new Phaser.Geom.Circle(0,0,29),Phaser.Geom.Circle.Contains);
   const capture=()=>{if(this.available)this.capture(i)};
   orb.on('pointerdown',capture);this.motesToCollect.push(orb);
   this.tweens.add({targets:orb,y:orb.y-6,duration:1200+i*220,repeat:-1,yoyo:true,ease:'Sine.inOut'});
  }
  this.input.on('pointermove',(pointer:Phaser.Input.Pointer)=>{
   if(!pointer.isDown||!this.available)return;
   const x=pointer.worldX,y=pointer.worldY;
   this.motesToCollect.forEach((m,i)=>{if(!this.collected.has(i)&&Phaser.Math.Distance.Between(x,y,m.x,m.y)<35)this.capture(i)});
  });
  this.input.keyboard?.on('keydown-SPACE',()=>this.interact());this.input.keyboard?.on('keydown-E',()=>this.interact());
  if(this.completed){this.motesToCollect.forEach(x=>x.setVisible(false));announce({phase:'II / THE NAME',instruction:'This memory is recovered.',completed:true,awake:.52});}
  else{announce({phase:'II / THE NAME',instruction:'The valley holds three lights. Walk into the clearing.',action:null});}
 }
 private capture(index:number){if(this.collected.has(index)||this.completed)return;
  this.collected.add(index);const orb=this.motesToCollect[index];
  this.tweens.add({targets:orb,scale:0,alpha:0,duration:350,ease:'Sine.easeIn',onComplete:()=>orb.setVisible(false)});
  this.cameras.main.shake(75,.0012);
  announce({instruction:`Light gathered / ${this.collected.size} of 3.`,action:this.collected.size<3?'interact':null,actionLabel:'Gather light'});
  if(this.collected.size===3)this.recoverName();
 }
 private recoverName(){this.completed=true;this.available=false;
  progress.add('xaba');progress.update({encounter:'complete',motes:3,awake:.52,position:this.actor.x});audioDirector.setAwakening(.52);
  void audioDirector.playPickup('xaba').then(result=>{
   announce({phase:'II / THE NAME',instruction:'Xaba / A memory recovered.',journal:result==='played'?'XABA / Listen to the recovered passage.':'XABA / Recovered. Music excerpt awaiting approval.',completed:true,awake:.52,action:null});
  });
  this.cameras.main.flash(750,243,178,110,true);
 }
 protected interact(){if(!this.available||this.completed)return;const next=[0,1,2].find(i=>!this.collected.has(i));if(next!==undefined)this.capture(next);}
 update(time:number,delta:number){if(this.paused)return;this.updateWalking(time,delta);
  if(this.completed)return;
  this.available=Math.abs(this.actor.x-this.clearPoint)<140;
  const hint=this.available?'at-clearing':'walking';
  if(hint!==this.lastHint){this.lastHint=hint;
   announce(this.available?{instruction:'Sweep across the lights, or tap Gather.',action:'interact',actionLabel:'Gather light'}:
    {instruction:'Follow the valley to the three lights.',action:null});
  }
 }
}
