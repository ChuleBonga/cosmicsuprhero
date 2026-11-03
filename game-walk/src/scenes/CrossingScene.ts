import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';
import {bitmapText} from '../art/BitmapType';

export class CrossingScene extends Phaser.Scene{
  private app!:GameContext;
  private startedAt=0;
  private finished=false;
  private ring!:Phaser.GameObjects.Graphics;
  private reduce=false;
  private cx=0;private cy=0;
  constructor(){super('Crossing')}
  create(){
    this.app=this.registry.get('app') as GameContext;
    this.startedAt=performance.now();
    const W=this.scale.width,H=this.scale.height;
    this.reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cameras.main.setBackgroundColor('#001334');
    const world=buildWorld(this);
    world.update(0);
    this.cx=Math.round(W*.71);this.cy=Math.round(H*(H>W?.26:.25));
    this.ring=this.add.graphics().setScrollFactor(0).setDepth(25);
    bitmapText(this,'FIRST CONTACT',W/2,Math.round(H*.72),W<230?1:2,0xf1cd8e)
      .setDepth(26);
    this.input.on('pointerdown',()=>this.finish());
    this.input.keyboard?.once('keydown-SPACE',()=>this.finish());
    this.input.keyboard?.once('keydown-ENTER',()=>this.finish());
  }
  update(_time:number,_delta:number){
    if(this.finished)return;
    const elapsed=(performance.now()-this.startedAt)/1000;
    const duration=this.reduce?0.65:2.65,p=Math.min(1,elapsed/duration);
    this.ring.clear();
    for(let i=0;i<5;i++){
      const radius=Math.floor(22+(i*11)+p*p*70);
      this.ring.lineStyle(2,i%2?0xd7a367:0xf1d59b,Math.max(.07,(1-p)*(1-i*.14)));
      this.ring.strokeCircle(this.cx,this.cy,radius);
    }
    if(p>=1)this.finish();
  }
  private finish(){
    if(this.finished)return;
    this.finished=true;
    this.app.progress.advance('CROSSING_COMPLETE');
    this.scene.start('Prologue');
  }
}
