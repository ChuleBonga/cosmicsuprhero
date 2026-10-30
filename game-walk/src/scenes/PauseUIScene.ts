import Phaser from 'phaser';
import type {GameContext} from '../main';
interface PauseData{returnScene:string}
export class PauseUIScene extends Phaser.Scene{
  private parentScene='Prologue';
  constructor(){super('PauseUI')}
  create(data:PauseData){
    this.parentScene=data.returnScene||'Prologue';
    const W=this.scale.width,H=this.scale.height;
    const app=this.registry.get('app') as GameContext;
    this.add.rectangle(W/2,H/2,W,H,0x101833,.89).setDepth(1);
    this.add.text(W/2,H*.32,'PAUSED',{fontFamily:'Georgia,serif',fontSize:Math.min(54,W*.12)+'px',color:'#f7e6ce'}).setOrigin(.5).setDepth(2);
    const resume=this.add.text(W/2,H*.49,'RESUME',{fontFamily:'Arial,sans-serif',fontSize:'19px',color:'#fff7e6',backgroundColor:'#583249',padding:{x:28,y:17}}).setOrigin(.5).setDepth(2).setInteractive({useHandCursor:true});
    const mute=this.add.text(W/2,H*.61,app.progress.muted?'ENABLE SOUND':'MUTE SOUND',{fontFamily:'Arial,sans-serif',fontSize:'15px',color:'#ead8c6',padding:{x:20,y:12}}).setOrigin(.5).setDepth(2).setInteractive({useHandCursor:true});
    this.add.text(W/2,H*.77,'AWAKEN NOW / COSMICSUPRHERO',{fontFamily:'Arial,sans-serif',fontSize:'10px',color:'#baadbd',letterSpacing:2}).setOrigin(.5).setDepth(2);
    resume.on('pointerdown',()=>this.unpause());
    mute.on('pointerdown',()=>{
      app.progress.setMuted(!app.progress.muted);
      app.audio.setMuted(app.progress.muted);
      mute.setText(app.progress.muted?'ENABLE SOUND':'MUTE SOUND');
    });
    this.input.keyboard?.once('keydown-ESC',()=>this.unpause());
    this.input.keyboard?.once('keydown-P',()=>this.unpause());
  }
  private unpause(){
    const app=this.registry.get('app') as GameContext;
    this.scene.resume(this.parentScene);
    app.audio.resume();
    this.scene.stop();
  }
}
