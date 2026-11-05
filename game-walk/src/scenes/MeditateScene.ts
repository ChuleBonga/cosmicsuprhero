import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';
import {bitmapText} from '../art/BitmapType';

export class MeditateScene extends Phaser.Scene {
  private app!:GameContext;
  private held=false;
  private activePointer:number|null=null;
  private keyboardHeld=false;
  private charge=0;
  private completed=false;
  private lastTick=0;
  private ring!:Phaser.GameObjects.Graphics;
  private pauseControl!:Phaser.GameObjects.Rectangle;
  private sunX=0;private sunY=0;
  constructor(){super('Meditate');}
  create(){
    this.app=this.registry.get('app') as GameContext;
    this.lastTick=performance.now();
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
    this.ring=this.add.graphics().setScrollFactor(0).setDepth(24);
    this.pauseControl=this.add.rectangle(W-17,18,28,28,0x382b48,.91).setDepth(25).setInteractive({useHandCursor:true});
    this.add.text(W-17,18,'II',{fontFamily:'monospace',fontSize:'13px',color:'#f0d5a9'}).setOrigin(.5).setDepth(26);
    this.pauseControl.on('pointerdown',(_p:Phaser.Input.Pointer,_lx:number,_ly:number,event:Phaser.Types.Input.EventData)=>{
      event.stopPropagation();this.openPause();
    });
    // Only touching the visible sun charges the portal. Other screen taps
    // no longer bypass the intended opening interaction.
    const insideSun=(x:number,y:number)=>Math.hypot(x-this.sunX,y-this.sunY)<=47;
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(this.activePointer===null && insideSun(p.x,p.y))this.activePointer=p.id;
    });
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{
      if(this.activePointer===p.id && (!p.isDown || !insideSun(p.x,p.y)))this.activePointer=null;
    });
    const release=(p:Phaser.Input.Pointer)=>{
      if(this.activePointer===p.id)this.activePointer=null;
    };
    this.input.on('pointerup',release);
    this.input.on('pointerupoutside',release);
    this.input.on('gameout',()=>this.activePointer=null);
    this.input.keyboard?.on('keydown-SPACE',()=>this.keyboardHeld=true);
    this.input.keyboard?.on('keyup-SPACE',()=>this.keyboardHeld=false);
    this.input.keyboard?.on('keydown-ENTER',()=>this.keyboardHeld=true);
    this.input.keyboard?.on('keyup-ENTER',()=>this.keyboardHeld=false);
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
  }
  private openPause(){
    this.held=false;
    this.activePointer=null;
    this.keyboardHeld=false;
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:'Meditate'});
    this.scene.pause();
  }
  update(_time:number,_delta:number){
    if(this.completed)return;
    const now=performance.now();
    const dt=Math.min(.25,Math.max(0,(now-this.lastTick)/1000));
    this.lastTick=now;
    this.held=this.keyboardHeld || this.activePointer!==null;
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
