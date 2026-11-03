import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld} from '../world/GrayboxWorld';
import {bitmapText} from '../art/BitmapType';

/**
 * Preview of the Credo transmission. No speech, fabricated narration or
 * mastered audio is included until sample provenance and preview rights clear.
 * Tactile lantern alignment is an original visual interaction, not a claim that
 * the unavailable Credo recording has been integrated.
 */
export class CredoScene extends Phaser.Scene{
  private app!:GameContext;
  private tuned=false;
  private value=.18;
  private readonly target=.67;
  private marker!:Phaser.GameObjects.Graphics;
  private lantern!:Phaser.GameObjects.Rectangle;
  private hint!:Phaser.GameObjects.Text;
  private W=0;private H=0;
  constructor(){super('Credo')}
  create(){
    this.app=this.registry.get('app') as GameContext;
    this.W=this.scale.width;this.H=this.scale.height;
    const W=this.W,H=this.H,portrait=H>W;
    this.cameras.main.setBackgroundColor('#001334');
    const world=buildWorld(this);world.update(0);
    const ground=world.groundY;
    const keeper=this.add.sprite(Math.round(W*.26),ground,'keeper',0).setOrigin(.5,1).setDepth(15);
    keeper.play('keeper-idle');
    bitmapText(this,"CREDO'S WORDS",W/2,Math.round(H*.18),portrait?1:2,0xffd58e).setDepth(31);
    this.add.text(W/2,Math.round(H*.26),'Preview audio pending: recording clearance required',{
      fontFamily:'Arial,sans-serif',fontSize:portrait?'10px':'12px',color:'#f8e6c1',
      align:'center',wordWrap:{width:W-30}
    }).setOrigin(.5).setDepth(31);
    const y=Math.round(H*.68);
    this.add.rectangle(W/2,y,W-46,3,0x776b73).setDepth(30);
    this.marker=this.add.graphics().setDepth(32);
    this.lantern=this.add.rectangle(0,y,8,14,0x83d7cb).setDepth(33).setInteractive({useHandCursor:true});
    this.hint=this.add.text(W/2,Math.round(H*.80),'DRAG THE LIGHT TO THE MARK',{
      fontFamily:'Arial,sans-serif',fontSize:portrait?'10px':'12px',color:'#f9e8d0',align:'center'
    }).setOrigin(.5).setDepth(33);
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(p.y>H*.53&&p.y<H*.80)this.setValue(p.x);
    });
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{
      if(p.isDown&&p.y>H*.52&&p.y<H*.83)this.setValue(p.x);
    });
    this.input.keyboard?.on('keydown-LEFT',()=>this.setValue(this.position(this.value)-9));
    this.input.keyboard?.on('keydown-RIGHT',()=>this.setValue(this.position(this.value)+9));
    this.input.keyboard?.on('keydown-SPACE',()=>this.complete(true));
    this.input.keyboard?.on('keydown-ENTER',()=>this.complete(true));
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    const pause=this.add.text(W-12,12,'II',{fontFamily:'monospace',fontSize:'15px',
      color:'#f7e7c7',backgroundColor:'#42314a',padding:{x:8,y:5}})
      .setOrigin(1,0).setDepth(40).setInteractive({useHandCursor:true});
    pause.on('pointerdown',(_p:Phaser.Input.Pointer,_lx:number,_ly:number,e:Phaser.Types.Input.EventData)=>{
      e.stopPropagation();this.openPause();
    });
    this.drawMarker();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
  }
  private position(v:number){return 23+v*(this.W-46)}
  private setValue(x:number){
    if(this.tuned)return;
    this.value=Phaser.Math.Clamp((x-23)/(this.W-46),0,1);
    this.drawMarker();
    if(Math.abs(this.value-this.target)<.05)this.complete(false);
  }
  private drawMarker(){
    const y=Math.round(this.H*.68);
    const x=this.position(this.target);
    this.marker.clear();
    this.marker.fillStyle(0xffd183).fillRect(x-1,y-11,3,22);
    this.marker.fillStyle(0x8fe0cb).fillRect(x-4,y-15,9,2);
    this.lantern.setPosition(this.position(this.value),y);
  }
  private complete(accessible:boolean){
    if(this.tuned)return;
    if(!accessible && Math.abs(this.value-this.target)>=.05)return;
    this.tuned=true;
    this.value=this.target;this.drawMarker();
    this.hint.setText('SIGNAL ALIGNED  /  CONTINUE');
    this.time.delayedCall(800,()=>{
      this.app.progress.advance('CONTINUE_FROM_CREDO');
      this.scene.start('SliceComplete');
    });
  }
  private openPause(){
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:'Credo'});
    this.scene.pause();
  }
}
