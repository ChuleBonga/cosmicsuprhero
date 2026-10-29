import Phaser from 'phaser';
import {WorldBase} from './WorldBase';
import {progress} from '../systems/ProgressManager';
import {audioDirector} from '../systems/AudioDirector';
import {announce} from '../ui/events';
export class PrologueScene extends WorldBase {
 private memory!:Phaser.GameObjects.Container;
 private withinReach=false;
 private collected=false;
 private lastHint='';
 constructor(){super('Prologue')}
 create(){
  this.setUpWorld('prologue',1550,Math.max(90,Math.min(progress.data.position,850)));
  this.collected=progress.data.found.includes('first-contact');
  const ring=this.add.circle(0,0,26,0xffdd98,.1).setStrokeStyle(1,0xffd38d,.85);
  const disk=this.add.ellipse(0,0,25,25,0xd6a265).setStrokeStyle(2,0x5b315a);
  const indent=this.add.circle(0,0,4,0x492b60);
  this.memory=this.add.container(825,this.groundAt(825)-57,[ring,disk,indent]).setDepth(15).setVisible(!this.collected);
  this.tweens.add({targets:ring,scale:1.4,alpha:.2,duration:1700,yoyo:true,repeat:-1});
  this.input.keyboard?.on('keydown-SPACE',()=>this.interact());this.input.keyboard?.on('keydown-E',()=>this.interact());
  announce({phase:'I / FIRST CONTACT',instruction:'Hold to walk. A small record is waiting on the ridge.',action:null});
 }
 protected interact(){if(!this.withinReach||this.collected)return;
  this.collected=true;this.memory.setVisible(false);progress.add('first-contact');
  audioDirector.setAwakening(.27);progress.update({awake:.27,position:930,encounter:'prologue'});
  void audioDirector.playPickup('first-contact').then(outcome=>announce({journal:outcome==='pending'?'FIRST CONTACT / Found. The approved music excerpt is not yet hosted.':'FIRST CONTACT / Listen.',action:null}));
  this.cameras.main.flash(360,235,175,108,true);this.withinReach=false;
 }
 update(time:number,delta:number){if(this.paused)return;this.updateWalking(time,delta);
  this.withinReach=!this.collected&&Math.abs(this.actor.x-825)<104;
  const hint=this.withinReach?'found':this.collected?'collected':'walking';
  if(hint!==this.lastHint){this.lastHint=hint;
   announce(hint==='found'?{instruction:'A memory lies at your feet.',action:'interact',actionLabel:'Recover First Contact'}:
    hint==='collected'?{instruction:'Continue walking toward the next valley.',action:null}:{instruction:'Hold to walk toward the sun.',action:null});
  }
  if(this.actor.x>1300){progress.update({position:160,encounter:'name',awake:Math.max(progress.data.awake,.29)});
   this.scene.start('EncounterName');}
 }
}
