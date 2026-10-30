import Phaser from 'phaser';
import type {GameContext} from '../main';

export class TitleScene extends Phaser.Scene {
  private started=false;
  constructor(){super('Title')}
  create(){
    const app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height;
    this.cameras.main.setBackgroundColor('#f5f1e7');
    // Source: the artist-supplied portrait composition. No other title hotspots.
    const h=Math.min(H*.83,1152),w=h*(2/3);
    const x=W/2,y=(H-h)/2;
    const image=this.add.image(x,y+h/2,'cover-figure').setOrigin(.5);
    image.setDisplaySize(w,h);
    // Sun center measured against supplied 1024x1536 painting.
    const sunX=x-w/2+w*.56;
    const sunY=y+h*.12;
    const hit=this.add.zone(sunX,sunY,Math.max(62,w*.24),Math.max(62,w*.24))
      .setInteractive({useHandCursor:true});
    hit.on('pointerdown',()=>this.begin(app));
    const label=this.add.text(W/2,Math.min(H-27,y+h+27),'Touch the sun to begin',
      {fontFamily:'Georgia,serif',fontSize:W<620?'22px':'30px',color:'#581a3b',fontStyle:'italic'}).setOrigin(.5);
    label.setDepth(2);
    this.input.keyboard?.once('keydown-ENTER',()=>this.begin(app));
    this.input.keyboard?.once('keydown-SPACE',()=>this.begin(app));
  }
  private begin(app:GameContext){
    if(this.started)return;
    this.started=true;
    app.audio.start(); // Called synchronously within the tap for mobile audio unlock.
    this.scene.start('Prologue');
  }
}
