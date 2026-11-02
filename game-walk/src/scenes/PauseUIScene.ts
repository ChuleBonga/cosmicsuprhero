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
    const W=this.W,H=this.H,app=this.app,portrait=H>W;
    const overlay=this.add.container(0,0).setDepth(100);
    overlay.add(this.add.rectangle(W/2,H/2,W,H,0xf1eadb));
    overlay.add(this.add.text(W/2,H*.17,'DISCOVERED MUSIC',{
      fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:portrait?'24px':'25px',color:'#582744'
    }).setOrigin(.5));
    const tracks=[
      {id:'first_contact' as const,title:'FIRST CONTACT'},
      {id:'xaba' as const,title:'XABA'}
    ];
    tracks.forEach((t,i)=>{
      const y=H*(portrait?.33:.40)+i*(portrait?62:50);
      const available=app.progress.has(t.id);
      const item=this.add.text(W/2,y,available?t.title+'  /  PLAY':t.title+'  /  NOT FOUND',{
        fontFamily:'monospace',fontSize:portrait?'11px':'12px',color:available?'#fff3e6':'#704f5b',
        backgroundColor:available?'#582744':'#d4c8b6',padding:{x:12,y:13}
      }).setOrigin(.5);
      overlay.add(item);
      if(available)item.setInteractive({useHandCursor:true}).on('pointerdown',()=>{
        void app.audio.playPickup(t.id,()=>{});
      });
    });
    overlay.add(this.add.text(W/2,H*.77,'Preview excerpts only.\nOther tracks arrive in later builds.',{
      fontFamily:'Arial,sans-serif',fontSize:'11px',color:'#704f5b',align:'center'
    }).setOrigin(.5));
    const back=this.add.text(W/2,H*.89,'BACK TO PAUSE',{
      fontFamily:'Arial,sans-serif',fontSize:'13px',color:'#fff7e7',backgroundColor:'#582744',padding:{x:20,y:12}
    }).setOrigin(.5).setInteractive({useHandCursor:true});
    overlay.add(back);
    back.on('pointerdown',()=>overlay.destroy(true));
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
