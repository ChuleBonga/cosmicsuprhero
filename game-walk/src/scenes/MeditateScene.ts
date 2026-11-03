import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';
import {bitmapText} from '../art/BitmapType';

export class MeditateScene extends Phaser.Scene {
  private app!:GameContext;
  private held=false;
  private charge=0;
  private completed=false;
  private ring!:Phaser.GameObjects.Graphics;
  private pauseControl!:Phaser.GameObjects.Rectangle;
  private sunX=0;private sunY=0;
  constructor(){super('Meditate');}
  create(){
    this.app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height,portrait=H>W;
    this.cameras.main.setBackgroundColor('#001334');
    buildWorld(this);
    const groundY=Math.round(H-(portrait?75:57));
    const hero=this.add.sprite(Math.round(W*.24),groundY,'alien',0)
      .setOrigin(.5,1).setDepth(8);
    hero.play('alien-idle');
    this.sunX=Math.round(W*.71);this.sunY=Math.round(H*(portrait?.26:.25));
    bitmapText(this,'MEDITATE',W/2,Math.round(H*.47),portrait?2:3,0xf5c774).setScrollFactor(0).setDepth(22);
    bitmapText(this,'HOLD THE SUN TO ENTER',W/2,Math.round(H*.78),1,0xece1c5).setScrollFactor(0).setDepth(22);
    bitmapText(this,'AUDIO PREVIEW PENDING',W/2,Math.round(H*.85),1,0xc0b4a8).setScrollFactor(0).setDepth(22);
    this.ring=this.add.graphics().setScrollFactor(0).setDepth(24);
    this.pauseControl=this.add.rectangle(W-17,18,28,28,0x382b48,.91).setDepth(25).setInteractive({useHandCursor:true});
    this.add.text(W-17,18,'II',{fontFamily:'monospace',fontSize:'13px',color:'#f0d5a9'}).setOrigin(.5).setDepth(26);
    this.pauseControl.on('pointerdown',(_p,_lx,_ly,event:Phaser.Types.Input.EventData)=>{
      event.stopPropagation();this.openPause();
    });
    const gesture=(p:Phaser.Input.Pointer)=>{
      if(p.x>W-43&&p.y<42)return;
      this.held=true;
    };
    this.input.on('pointerdown',gesture);
    this.input.on('pointerup',()=>this.held=false);
    this.input.on('pointerupoutside',()=>this.held=false);
    this.input.on('gameout',()=>this.held=false);
    this.input.keyboard?.on('keydown-SPACE',()=>this.held=true);
    this.input.keyboard?.on('keyup-SPACE',()=>this.held=false);
    this.input.keyboard?.on('keydown-ENTER',()=>this.held=true);
    this.input.keyboard?.on('keyup-ENTER',()=>this.held=false);
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
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
    if(this.held)this.charge=Math.min(1,this.charge+dt/1.75);
    else this.charge=Math.max(0,this.charge-dt*.19);
    const g=this.ring;g.clear();
    const r=34;
    for(let i=0;i<24;i++){
      const a=(i/24)*Math.PI*2-Math.PI/2;
      const x=Math.round(this.sunX+Math.cos(a)*r);
      const y=Math.round(this.sunY+Math.sin(a)*r);
      g.fillStyle(i<Math.ceil(this.charge*24)?0xf1d38b:0x503c54,i<Math.ceil(this.charge*24)?1:.52);
      g.fillRect(x-1,y-1,3,3);
    }
    if(this.charge>=1){
      this.completed=true;
      this.app.progress.advance('OPEN_PORTAL');
      this.scene.start('Crossing');
    }
  }
}
