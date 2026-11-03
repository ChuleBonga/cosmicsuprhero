import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';
import {bitmapText} from '../art/BitmapType';

/** Fixed 480x270 title composition; only the outer frame scales. */
export class TitleScene extends Phaser.Scene {
  private started=false;
  constructor(){super('Title')}
  create(){
    const app=this.registry.get('app') as GameContext;
    const W=this.scale.width;
    this.cameras.main.setBackgroundColor('#06132d');
    const world=buildWorld(this);
    world.update(0);

    // The red sun owns the open sky; the title never intersects its silhouette.
    const bandY=146,bandH=80;
    this.add.rectangle(W/2,bandY,W,bandH,0xd2bd96,.91).setDepth(12);
    this.add.rectangle(W/2,bandY-bandH/2,W,1,0xe3d3ad,.75).setDepth(13);
    this.add.rectangle(W/2,bandY+bandH/2,W,1,0x836347,.7).setDepth(13);

    bitmapText(this,'CHAPTER I',98,85,2,0xefc778,0x142443).setDepth(18);
    bitmapText(this,'ARCTURIAN',W/2,132,4,0x6d314d,0xf2d69f).setDepth(20);
    bitmapText(this,'AWAKENING',W/2,161,4,0x6d314d,0xf2d69f).setDepth(20);

    // Player is visible to the left of the wordmark, not behind the title.
    const hero=this.add.sprite(75,world.groundY,'alien',0).setOrigin(.5,1).setDepth(23);
    hero.play('alien-idle');

    const touch=matchMedia('(pointer:coarse)').matches;
    bitmapText(this,touch?'TOUCH THE SUN TO BEGIN':'PRESS ENTER OR TOUCH SUN',304,239,2,0xf8d69c,0x09152f).setDepth(25);
    this.add.zone(341,68,102,102).setInteractive({useHandCursor:true})
      .on('pointerdown',()=>this.begin(app));
    this.input.keyboard?.once('keydown-ENTER',()=>this.begin(app));
    this.input.keyboard?.once('keydown-SPACE',()=>this.begin(app));
  }
  private begin(app:GameContext){
    if(this.started)return;
    this.started=true;
    app.audio.start();
    app.audio.setMuted(app.progress.muted);
    if(app.progress.stage==='campfire')this.scene.start('SliceComplete');
    else if(app.progress.stage==='credo')this.scene.start('Credo');
    else if(app.progress.stage==='first_contact')this.scene.start('Prologue');
    else if(app.progress.stage==='crossing')this.scene.start('Crossing');
    else this.scene.start('Meditate');
  }
}
