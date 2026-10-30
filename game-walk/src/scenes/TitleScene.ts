import Phaser from 'phaser';
import type {GameContext} from '../main';

export class TitleScene extends Phaser.Scene{
  private sun?:Phaser.GameObjects.Zone;
  constructor(){super('Title')}
  create(){const app=this.registry.get('app') as GameContext;
    this.cameras.main.setBackgroundColor('#f5f1e7');
    // The actual approved album poster; other world art is gray-box.
    const W=this.scale.width,H=this.scale.height;const posterSize=Math.min(W*.94,H*.84,760);const image=this.add.image(W/2,H/2,'album-poster');image.setDisplaySize(posterSize,posterSize);
    // At 620-px display, poster x=170..790; sun is around normalized (0.517,0.25).
    const sunX=(W-posterSize)/2+posterSize*.516,sunY=(H-posterSize)/2+posterSize*.253;
    this.sun=this.add.zone(sunX,sunY,Math.max(54,posterSize*.14),Math.max(54,posterSize*.14)).setInteractive({useHandCursor:true});
    this.add.text(W/2,H-42,'Touch the sun to begin',{fontFamily:'Georgia,serif',fontSize:W<600?'24px':'29px',fontStyle:'italic',color:'#581a3b'}).setOrigin(.5);
    this.sun.on('pointerdown',()=>this.begin(app));
    this.input.keyboard?.once('keydown-ENTER',()=>this.begin(app));
    this.input.keyboard?.once('keydown-SPACE',()=>this.begin(app));
    // Title has no other hotspots/buttons.
  }
  private started=false;
  private begin(app:GameContext){if(this.started)return;this.started=true;app.audio.start();this.scene.start('Walk')}
}
