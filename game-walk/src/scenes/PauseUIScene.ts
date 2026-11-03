import Phaser from 'phaser';
import type {GameContext} from '../main';

interface PauseData {returnScene:string}

/** Album-sleeve controls, composed on the fixed 480x270 cinematic grid. */
export class PauseUIScene extends Phaser.Scene {
  private parentScene='Prologue';
  private app!:GameContext;
  private overlay:Phaser.GameObjects.Container|null=null;
  constructor(){super('PauseUI')}
  create(data:PauseData){
    this.parentScene=data.returnScene||'Prologue';
    this.app=this.registry.get('app') as GameContext;
    this.cameras.main.setBackgroundColor('#f1eadb');
    this.add.rectangle(240,135,480,270,0xf1eadb);
    this.add.rectangle(240,13,428,1,0xc7b69c);
    this.add.text(240,39,'THE ARCHIVE',{
      fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'33px',color:'#582744'
    }).setOrigin(.5);
    this.add.text(240,67,'ARCTURIAN AWAKENING  /  CHAPTER I',{
      fontFamily:'Arial,sans-serif',fontSize:'10px',color:'#806273',letterSpacing:1
    }).setOrigin(.5);
    this.add.rectangle(240,82,428,1,0xc7b69c);

    // Two columns with larger targets, not five generic full-width bars.
    this.action('RESUME',135,112,200,44,()=>this.unpause(),true);
    this.action(this.app.progress.muted?'ENABLE SOUND':'MUTE SOUND',345,112,200,44,()=>{
      this.app.progress.setMuted(!this.app.progress.muted);
      this.app.audio.setMuted(this.app.progress.muted);
      this.scene.restart({returnScene:this.parentScene});
    });
    this.action('DISCOVERED MUSIC',135,166,200,44,()=>this.showJukebox());
    this.action('ACCESSIBILITY',345,166,200,44,()=>this.showAccessibility());
    this.action('DIRECT ALBUM ACCESS',240,223,410,42,()=>{
      this.app.progress.save();
      window.dispatchEvent(new Event('arcturian:open-access'));
    });
    this.input.keyboard?.once('keydown-ESC',()=>this.unpause());
    this.input.keyboard?.once('keydown-P',()=>this.unpause());
  }
  private action(label:string,x:number,y:number,w:number,h:number,callback:()=>void,filled=false,container?:Phaser.GameObjects.Container){
    const rect=this.add.rectangle(x,y,w,h,filled?0x582744:0xf1eadb)
      .setStrokeStyle(1,filled?0x582744:0x927486,.9);
    const txt=this.add.text(x,y,label,{
      fontFamily:'Arial,sans-serif',fontSize:'14px',fontStyle:'bold',
      color:filled?'#fff5e8':'#582744'
    }).setOrigin(.5);
    // Invisible 52px-high pointer target, overlapping neither row.
    const hit=this.add.zone(x,y,w,Math.min(52,h+7)).setInteractive({useHandCursor:true});
    hit.on('pointerdown',callback);
    if(container)container.add([rect,txt,hit]);
    return {rect,txt,hit};
  }
  private baseOverlay(title:string){
    this.overlay?.destroy(true);
    const layer=this.add.container(0,0).setDepth(100);
    layer.add(this.add.rectangle(240,135,480,270,0xf1eadb));
    layer.add(this.add.rectangle(240,18,424,1,0xc7b69c));
    layer.add(this.add.text(240,48,title,{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'31px',color:'#582744'}).setOrigin(.5));
    const back=this.add.text(240,236,'BACK TO PAUSE',{
      fontFamily:'Arial,sans-serif',fontSize:'14px',color:'#fff4e5',
      backgroundColor:'#582744',padding:{x:24,y:12}
    }).setOrigin(.5).setInteractive({useHandCursor:true});
    layer.add(back);
    back.on('pointerdown',()=>{layer.destroy(true);this.overlay=null;});
    this.overlay=layer;
    return layer;
  }
  private showJukebox(){
    const layer=this.baseOverlay('Discovered music');
    const available=this.app.progress.has('first_contact');
    layer.add(this.add.text(240,123,
      available?'FIRST CONTACT  /  PREVIEW UNAVAILABLE':'FIRST CONTACT  /  NOT DISCOVERED',{
      fontFamily:'Arial,sans-serif',fontSize:'14px',color:'#582744',align:'center'
    }).setOrigin(.5));
    layer.add(this.add.text(240,172,'The artist-approved excerpt is pending publication clearance.',{
      fontFamily:'Arial,sans-serif',fontSize:'12px',color:'#755665',
      align:'center',wordWrap:{width:390}
    }).setOrigin(.5));
  }
  private showAccessibility(){
    const layer=this.baseOverlay('How to play');
    layer.add(this.add.text(240,142,
      'Hold the sun to enter.\nHold the right or left side to walk.\nRelease to stop. Tap to jump.\nKeyboard: A / D, arrows, Space.\nMotion follows your device preference.',{
      fontFamily:'Arial,sans-serif',fontSize:'14px',lineSpacing:7,
      color:'#582744',align:'center',wordWrap:{width:400}
    }).setOrigin(.5));
  }
  private unpause(){
    this.overlay?.destroy(true);
    this.overlay=null;
    this.scene.resume(this.parentScene);
    this.app.audio.resume();
    this.scene.stop();
  }
}
