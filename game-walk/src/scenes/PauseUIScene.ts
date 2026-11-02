import Phaser from 'phaser';
import type {GameContext} from '../main';
interface PauseData{returnScene:string}
const PRESAVE='https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening';
const link=(source:'pause'|'preview')=>PRESAVE+'?utm_source=game&utm_medium='+source+'&utm_campaign=arcturian-awakening';
export class PauseUIScene extends Phaser.Scene {
  private parentScene='Prologue';
  private app!:GameContext;
  private W=0;
  private H=0;
  private body!:Phaser.GameObjects.Text;
  constructor(){super('PauseUI')}
  create(data:PauseData){
    this.parentScene=data.returnScene||'Prologue';
    this.app=this.registry.get('app') as GameContext;
    this.W=this.scale.width;this.H=this.scale.height;
    this.cameras.main.setBackgroundColor('#eee5d6');
    this.add.rectangle(this.W/2,this.H/2,this.W,this.H,0xf1eadb);
    const portrait=this.H>this.W;
    this.add.text(this.W/2,portrait?43:26,'THE ARCHIVE',{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:portrait?'29px':'29px',color:'#582744'}).setOrigin(.5);
    this.add.text(this.W/2,portrait?73:51,'ARCTURIAN AWAKENING',{fontFamily:'monospace',fontSize:'10px',color:'#715363'}).setOrigin(.5);
    const start=portrait?117:78,gap=portrait?55:35;
    const button=(label:string,index:number,callback:()=>void)=>{
      const y=start+index*gap;
      const rect=this.add.rectangle(this.W/2,y,this.W-36,portrait?40:29,0x582744).setInteractive({useHandCursor:true});
      const txt=this.add.text(this.W/2,y,label,{fontFamily:'Arial,sans-serif',fontSize:portrait?'14px':'12px',color:'#f9edda'}).setOrigin(.5);
      rect.on('pointerdown',callback);txt.setInteractive({useHandCursor:true}).on('pointerdown',callback);
    };
    button('RESUME',0,()=>this.unpause());
    button(this.app.progress.muted?'ENABLE SOUND':'MUTE SOUND',1,()=>{
      this.app.progress.setMuted(!this.app.progress.muted);
      this.app.audio.setMuted(this.app.progress.muted);
      this.scene.restart({returnScene:this.parentScene});
    });
    button('DISCOVERED MUSIC',2,()=>this.showJukebox());
    button('ACCESSIBILITY',3,()=>this.showAccessibility());
    button('PRE-SAVE ALBUM',4,()=>{
      this.app.progress.save();
      window.open(link('pause'),'_blank','noopener,noreferrer');
    });
    this.body=this.add.text(this.W/2,portrait?407:247,'',{
      fontFamily:'Arial,sans-serif',fontSize:portrait?'11px':'9px',color:'#582744',align:'center',wordWrap:{width:this.W-32}
    }).setOrigin(.5);
    this.input.keyboard?.once('keydown-ESC',()=>this.unpause());
    this.input.keyboard?.once('keydown-P',()=>this.unpause());
  }
  private showJukebox(){
    const first=this.app.progress.has('first_contact');
    const xaba=this.app.progress.has('xaba');
    this.body.setText('RECOVERED:\n'+(first?'First Contact':'First Contact — not found')+'\n'+(xaba?'Xaba':'Xaba — not found')+'\nMore music arrives in later chapters.');
  }
  private showAccessibility(){
    this.body.setText('Hold either side to walk. Tap while near the lights to call.\nKeyboard: A / D or arrows; Space interacts.\nMotion follows your system preference. All encounters are retryable.');
  }
  private unpause(){
    this.scene.resume(this.parentScene);
    this.app.audio.resume();
    this.scene.stop();
  }
}
