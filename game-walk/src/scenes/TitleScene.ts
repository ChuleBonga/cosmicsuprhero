import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';

/**
 * The art owns the frame. The editorial title, astrolabe and actions are
 * accessible HTML/SVG overlays anchored to the same frame, not pixel fonts
 * or an opaque rectangle painted over the landscape.
 */
export class TitleScene extends Phaser.Scene {
  private started=false;
  constructor(){super('Title')}
  create(){
    this.started=false;
    const app=this.registry.get('app') as GameContext;
    const world=buildWorld(this);
    world.update(0);
    this.cameras.main.setBackgroundColor('#0b0e1a');

    const traveler=this.add.sprite(74,world.groundY,'alien',0)
      .setOrigin(.5,1).setScale(.34).setDepth(20);
    traveler.play('alien-idle');
    this.add.ellipse(74,world.groundY-1,24,5,0x080807,.55).setDepth(19);

    const begin=()=>this.begin(app);
    window.addEventListener('arcturian:begin',begin);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
      window.removeEventListener('arcturian:begin',begin);
    });
    // The sun is an optional world-space gesture. Native DOM buttons also
    // work with keyboards, switches and assistive input.
    this.add.zone(340,70,105,108).setInteractive({useHandCursor:true})
      .on('pointerdown',begin);
    this.input.keyboard?.once('keydown-ENTER',begin);
    this.input.keyboard?.once('keydown-SPACE',begin);
  }
  private begin(app:GameContext){
    if(this.started)return;
    this.started=true;
    app.audio.start();
    app.audio.setMuted(app.progress.muted);
    window.dispatchEvent(new Event('arcturian:entered'));
    if(app.progress.stage==='campfire')this.scene.start('SliceComplete');
    else if(app.progress.stage==='credo')this.scene.start('Credo');
    else if(app.progress.stage==='first_contact')this.scene.start('Prologue');
    else if(app.progress.stage==='crossing')this.scene.start('Crossing');
    else this.scene.start('Meditate');
  }
}
