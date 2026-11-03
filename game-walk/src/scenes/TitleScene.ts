import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';
import {bitmapText} from '../art/BitmapType';

export class TitleScene extends Phaser.Scene{
  private started=false;
  constructor(){super('Title')}
  create(){
    const app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height,portrait=H>W;
    this.cameras.main.setBackgroundColor('#001334');
    const scene=buildWorld(this);
    scene.update(0);
    // The real artist-source sprite and dunes replace graybox title geometry.
    const hero=this.add.sprite(Math.round(W*.20),scene.groundY,'alien',0)
      .setOrigin(.5,1).setDepth(8);
    hero.play('alien-idle');
    const bandY=Math.round(H*(portrait?.50:.55));
    const bandH=portrait?96:88;
    this.add.rectangle(Math.round(W/2),bandY,W,bandH,0xcdbd8f,.92).setDepth(12);
    const top=bitmapText(this,'CHAPTER I',W/2,bandY-bandH/2-19,portrait?2:2,0xffcc2e);
    top.setDepth(13);
    const letterPixel=portrait?(W<190?2:3):(W>620?5:4);
    const first=bitmapText(this,'ARCTURIAN',W/2,bandY-17,letterPixel,0xffd459);
    const second=bitmapText(this,'AWAKENING',W/2,bandY+21,letterPixel,0xffd459);
    first.setDepth(13);second.setDepth(13);
    const touch=matchMedia('(pointer: coarse)').matches;
    const label=touch?'TOUCH THE SUN TO BEGIN':'PRESS ANY KEY';
    const caption=bitmapText(this,label,W/2,bandY+bandH/2+18,1,0xf4d9b8,0x111d3d);
    caption.setDepth(13);
    const sunX=Math.round(W*.71),sunY=Math.round(H*(portrait?.26:.25));
    this.add.zone(sunX,sunY,96,96).setInteractive({useHandCursor:true})
      .on('pointerdown',()=>this.begin(app));
    this.input.keyboard?.once('keydown',()=>this.begin(app));
  }
  private begin(app:GameContext){
    if(this.started)return;
    this.started=true;
    app.audio.start();
    app.audio.setMuted(app.progress.muted);
    if(app.progress.stage==='campfire')this.scene.start('SliceComplete');
    else if(app.progress.stage==='name')this.scene.start('Name',{resume:true});
    else this.scene.start('Prologue');
  }
}
