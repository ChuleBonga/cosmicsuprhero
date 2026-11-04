import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';

/** Arrival I. The artwork is the interface, not a box behind pixel text. */
export class MeditateScene extends Phaser.Scene {
  private app!:GameContext;
  private held=false;
  private charge=0;
  private completed=false;
  private ring!:Phaser.GameObjects.Graphics;
  private sunX=0;
  private sunY=0;
  constructor(){super('Meditate');}

  create(){
    this.app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height;
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');
    const world=buildWorld(this);
    world.update(0);
    const hero=this.add.sprite(Math.round(W*.24),world.groundY,'alien',0)
      .setOrigin(.5,1).setScale(.34).setDepth(8);
    hero.play('alien-idle');

    // This is an interaction ring, not a drawn substitute for the sun.
    this.sunX=Math.round(W*.775);
    this.sunY=Math.round(H*.32);
    this.ring=this.add.graphics().setScrollFactor(0).setDepth(24);
    const chapter=document.getElementById('scene-chapter');
    const subtitle=document.getElementById('observatory-subtitle');
    if(chapter)chapter.textContent='PROLOGUE / MEDITATE';
    if(subtitle)subtitle.textContent='HOLD TO BREATHE WITH THE LIGHT';

    const release=()=>{this.held=false};
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(p.y<38 && p.x>W-44)return;
      this.held=true;
    });
    this.input.on('pointerup',release);
    this.input.on('pointerupoutside',release);
    this.input.on('gameout',release);
    const releaseForRotation=()=>release();
    window.addEventListener('arcturian:release-controls',releaseForRotation);

    this.input.keyboard?.on('keydown-SPACE',()=>{this.held=true});
    this.input.keyboard?.on('keyup-SPACE',release);
    this.input.keyboard?.on('keydown-ENTER',()=>{this.held=true});
    this.input.keyboard?.on('keyup-ENTER',release);
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
      window.removeEventListener('arcturian:release-controls',releaseForRotation);
      this.app.progress.save();
    });
  }
  private openPause(){
    this.held=false;
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:'Meditate'});
    this.scene.pause();
  }
  update(_time:number,delta:number){
    if(this.completed)return;
    const dt=Math.min(.05,delta/1000);
    this.charge=Phaser.Math.Clamp(this.charge+(this.held?dt/1.75:-dt*.2),0,1);
    const g=this.ring;
    g.clear();
    // Smooth, minimal vector progress, matched to the sun's painted warmth.
    g.lineStyle(1,0xefce9e,.28);
    g.strokeCircle(this.sunX,this.sunY,39);
    if(this.charge>0){
      g.lineStyle(2,0xf0c27c,.72);
      g.beginPath();
      g.arc(this.sunX,this.sunY,39,-Math.PI/2,-Math.PI/2+this.charge*Math.PI*2,false);
      g.strokePath();
    }
    if(this.charge>=1){
      this.completed=true;
      const subtitle=document.getElementById('observatory-subtitle');
      if(subtitle)subtitle.textContent='THE GATEWAY OPENS';
      this.app.progress.advance('OPEN_PORTAL');
      this.scene.start('Crossing');
    }
  }
}
