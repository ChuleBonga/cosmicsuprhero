import Phaser from 'phaser';
import type { GameContext } from '../main';
export class SliceCompleteScene extends Phaser.Scene {
  constructor(){super('SliceComplete')}
  create(){
    const app=this.registry.get('app') as GameContext;
    app.progress.save();app.audio.soften();
    const W=this.scale.width,H=this.scale.height,portrait=H>W;
    this.cameras.main.setBackgroundColor('#f1eadb');
    this.add.rectangle(W/2,H/2,W,H,0xf1eadb);
    this.add.rectangle(W/2,H*.16,W*.76,2,0xb7a783);
    this.add.text(W/2,H*.25,'CHAPTER I',{fontFamily:'monospace',fontSize:'13px',color:'#8b594a'}).setOrigin(.5);
    this.add.text(W/2,H*.40,'A MOMENT TO REST',{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:portrait?'28px':'32px',color:'#57243f',align:'center'}).setOrigin(.5);
    this.add.text(W/2,H*.52,'The first arrival is complete.\nThe full journey and earned reveal are still in development.',{
      fontFamily:'Arial,sans-serif',fontSize:portrait?'12px':'12px',color:'#634b54',align:'center',lineSpacing:7
    }).setOrigin(.5);
    const action=(label:string,y:number,cb:()=>void)=>{
      const r=this.add.rectangle(W/2,y,W*.82,portrait?45:31,0x57243f).setInteractive({useHandCursor:true});
      this.add.text(W/2,y,label,{fontFamily:'Arial,sans-serif',fontSize:'13px',color:'#fff6e8'}).setOrigin(.5);
      r.on('pointerdown',cb);
    };
    action('DIRECT ALBUM ACCESS',H*.72,()=>{
      app.progress.save();
      window.dispatchEvent(new Event('arcturian:open-access'));
    });
    action('REVISIT THE ENTRANCE',H*.84,()=>{
      app.progress.reset();app.audio.setTravel(0);this.scene.start('Meditate');
    });
  }
}
