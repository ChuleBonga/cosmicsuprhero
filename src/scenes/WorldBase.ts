import Phaser from 'phaser';
import {audioDirector} from '../systems/AudioDirector';
import {progress} from '../systems/ProgressManager';
import {announce,onAction} from '../ui/events';
export type WorldPhase='prologue'|'name';

/** Procedural terrain and placeholder character intentionally stand in for pending approved layered art. */
export abstract class WorldBase extends Phaser.Scene {
 protected actor!:Phaser.GameObjects.Container;
 protected cloak!:Phaser.GameObjects.Graphics;
 protected scaleFactor=1;
 protected floor=0;
 protected worldLength=2600;
 protected stage='prologue' as WorldPhase;
 protected vx=0;
 protected facing=1;
 protected pointerDirection=0;
 protected keys!:Record<string,Phaser.Input.Keyboard.Key>;
 protected paused=false;
 protected lastSave=0;
 protected lastFootstep=0;
 protected cleanup:()=>void=()=>{};
 protected ground!:Phaser.GameObjects.Graphics;
 protected ambient!:Phaser.GameObjects.Graphics;
 protected skyline!:Phaser.GameObjects.Graphics;
 protected sun!:Phaser.GameObjects.Arc;
 protected horizon!:Phaser.GameObjects.Graphics;
 protected motes:Phaser.GameObjects.Arc[]=[];
 protected canvasW=960;
 protected canvasH=540;
 constructor(key:string){super(key)}
 protected setUpWorld(phase:WorldPhase,length:number,startX:number){
  this.stage=phase;this.worldLength=length;this.canvasW=this.scale.width;this.canvasH=this.scale.height;
  this.floor=Math.round(this.canvasH*.81);
  this.cameras.main.setBackgroundColor(0x192c6c);
  this.cameras.main.setBounds(0,0,this.worldLength,this.canvasH);
  this.cameras.main.setRoundPixels(false);
  this.renderWorld();
  this.createActor(startX);
  this.cameras.main.startFollow(this.actor,true,.065,.08,-this.canvasW*.12,this.canvasH*.11);
  this.keys=this.input.keyboard?.addKeys('A,D,LEFT,RIGHT,SPACE,E') as Record<string,Phaser.Input.Keyboard.Key> || {};
  this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{if(this.paused)return;
   this.pointerDirection=pointer.x<this.canvasW*.34?-1:1;
  });
  this.input.on('pointerup',()=>this.pointerDirection=0);
  this.input.on('pointerupoutside',()=>this.pointerDirection=0);
  const stop=()=>{this.pointerDirection=0};window.addEventListener('blur',stop);
  const visibility=()=>{this.paused=document.hidden;if(this.paused){this.pointerDirection=0;audioDirector.pause();}}
  document.addEventListener('visibilitychange',visibility);
  this.cleanup=onAction(action=>{if(action==='pause'){this.paused=!this.paused;this.pointerDirection=0;if(this.paused){this.scene.pause();audioDirector.pause();}else{this.scene.resume();void audioDirector.resume();}}
   else if(action==='interact')this.interact();else if(action==='resume'){this.paused=false;this.scene.resume();void audioDirector.resume();}
  });
  this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.cleanup();window.removeEventListener('blur',stop);document.removeEventListener('visibilitychange',visibility)});
  announce({phase:phase==='prologue'?'I / First Contact':'II / The Name',instruction:'Hold the right edge to walk. Release to stop.',awake:audioDirector.currentAwakening});
 }
 private renderWorld(){
  const w=this.canvasW,h=this.canvasH;
  // Pale grainless banding is a temporary material study. Final art requires artist-approved separated layers.
  this.skyline=this.add.graphics().setScrollFactor(0).setDepth(-6);
  for(let i=0;i<11;i++){const f=i/10;this.skyline.fillStyle(Phaser.Display.Color.GetColor(Math.round(20+f*24),Math.round(39+f*28),Math.round(94+f*29)),1);
   this.skyline.fillRect(0,h*i/11,w,h/11+2);}
  this.sun=this.add.circle(w*.74,h*.19,Math.max(33,Math.min(57,w*.08)),0xf68c26).setScrollFactor(0).setDepth(-4);
  const makeRidge=(depth:number,color:number,factor:number,baseline:number,span:number,peak:number)=>{
   const g=this.add.graphics().setDepth(depth).setScrollFactor(factor);
   g.fillStyle(color,1);g.beginPath();g.moveTo(-500,h);
   for(let i=0;i<=15;i++){const x=-500+i*span;const jitter=((i*37)%7)/7;
    const y=baseline-((i%3===0)?peak:peak*.3)-jitter*peak*.24;
    g.lineTo(x,y);g.lineTo(x+span*.25,y+peak*.1);}
   g.lineTo(this.worldLength+600,h);g.closePath();g.fillPath();return g;
  };
  makeRidge(-3,0x223477,.18,h*.59,240,h*.22);
  makeRidge(-2,0x344071,.38,h*.69,255,h*.19);
  this.horizon=makeRidge(-1,0x5b4961,.62,h*.79,206,h*.13);
  this.ground=this.add.graphics().setDepth(1);
  this.ground.fillStyle(0x80624d,1);this.ground.beginPath();this.ground.moveTo(-30,h+30);
  for(let x=0;x<=this.worldLength+40;x+=18){this.ground.lineTo(x,this.groundAt(x)+24);}
  this.ground.lineTo(this.worldLength+40,h+40);this.ground.closePath();this.ground.fillPath();
  const path=this.add.graphics().setDepth(2);path.lineStyle(2,0xd8a564,.45);path.beginPath();
  for(let x=0;x<=this.worldLength;x+=14){const y=this.groundAt(x)+18;if(x===0)path.moveTo(x,y);else path.lineTo(x,y);}path.strokePath();
  this.ambient=this.add.graphics().setScrollFactor(0).setDepth(50);
  for(let i=0;i<14;i++){
   const m=this.add.circle((i*97)%Math.max(1,w),(i*71)%Math.max(1,h),1+(i%3),0xe8b57a,.3).setScrollFactor(.35).setDepth(5);
   this.motes.push(m);
  }
 }
 protected groundAt(x:number){return this.floor+Math.sin(x/180)*13+Math.sin(x/67)*6;}
 private createActor(startX:number){
  const head=this.add.ellipse(0,-72,24,27,0x357886).setStrokeStyle(1,0x6da0a2,.9);
  const neck=this.add.rectangle(0,-55,13,17,0x31646f);
  this.cloak=this.add.graphics();
  this.cloak.fillStyle(0x5b244c,1);this.cloak.fillPoints([new Phaser.Geom.Point(-20,-53),new Phaser.Geom.Point(17,-56),new Phaser.Geom.Point(28,-2),new Phaser.Geom.Point(-23,2)],true);
  this.cloak.lineStyle(1.2,0xb77c8d,.7);this.cloak.strokeLineShape(new Phaser.Geom.Line(-17,-52,10,-45));
  const legs=this.add.graphics();legs.lineStyle(4,0x252a52,1);legs.lineBetween(-8,-4,-11,14);legs.lineBetween(9,-4,12,14);
  this.actor=this.add.container(startX,this.groundAt(startX),[legs,neck,this.cloak,head]).setDepth(18);
  this.actor.setScale(Math.max(.8,Math.min(1.1,this.canvasH/540)));
 }
 protected updateWalking(time:number,delta:number){
  const elapsed=Math.min(delta,45)/1000;
  let command=this.pointerDirection;
  if(this.keys?.LEFT?.isDown||this.keys?.A?.isDown)command=-1;
  if(this.keys?.RIGHT?.isDown||this.keys?.D?.isDown)command=1;
  const terrainSlope=(this.groundAt(this.actor.x+20)-this.groundAt(this.actor.x-20))/40;
  const target=command*155*(terrainSlope*command>0?.88:1.07);
  const acceleration=command?11:16;this.vx=Phaser.Math.Linear(this.vx,target,1-Math.exp(-elapsed*acceleration));
  const prev=this.actor.x;this.actor.x=Phaser.Math.Clamp(this.actor.x+this.vx*elapsed,45,this.worldLength-65);
  this.actor.y=this.groundAt(this.actor.x)+Math.sin(time/160)*Math.min(2.6,Math.abs(this.vx)/100*2.2);
  if(Math.abs(this.vx)>3){this.facing=Math.sign(this.vx);this.actor.scaleX=Math.abs(this.actor.scaleX)*this.facing;
   this.cloak.rotation=Math.sin(time*.012)*.025;
   if(time-this.lastFootstep>350){this.lastFootstep=time;this.spawnDust();}
  }else this.cloak.rotation=0;
  this.sun.setX(this.canvasW*.74-Math.min(.15,this.actor.x/this.worldLength*.12)*this.canvasW);
  if(Math.abs(this.actor.x-prev)>0.25){
   this.lastSave+=delta;if(this.lastSave>1500){this.lastSave=0;progress.update({position:this.actor.x});}
  }
  const awake=Math.min(.46,this.actor.x/this.worldLength*.52);
  audioDirector.setAwakening(Math.max(awake,progress.data.awake));
 }
 private spawnDust(){if(this.game.loop.actualFps<36)return;const r=this.add.circle(this.actor.x-7*this.facing,this.actor.y+10,2.2,0xc79a77,.55).setDepth(16);
  this.tweens.add({targets:r,alpha:0,x:r.x-17*this.facing,y:r.y-13,duration:500,onComplete:()=>r.destroy()});}
 protected abstract interact():void;
}
