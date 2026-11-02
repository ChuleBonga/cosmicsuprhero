import Phaser from 'phaser';
import type { GameContext } from '../main';
export class TitleScene extends Phaser.Scene {
  private started = false;
  constructor(){ super('Title'); }
  create(){
    const app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height,portrait=H>W;
    const g=this.add.graphics();
    g.fillStyle(0x101c3c).fillRect(0,0,W,H);
    for(let i=0;i<55;i++){
      const x=(i*71+9)%W,y=12+(i*31)%Math.floor(H*.39);
      g.fillStyle(i%8?0xd8c69c:0xf9edca).fillRect(x,y,i%11===0?2:1,1);
    }
    const sunX=Math.floor(W*.57),sunY=Math.floor(H*(portrait?.25:.30)),r=portrait?41:36;
    for(let y=-r;y<=r;y+=2)for(let x=-r;x<=r;x+=2){
      if(x*x+y*y<=r*r){g.fillStyle(y<0?0xea4a22:0xca3124).fillRect(sunX+x,sunY+y,2,2);}
    }
    const ridge=Math.floor(H*(portrait?.69:.77));
    g.fillStyle(0x70502d);
    g.beginPath();g.moveTo(0,H);
    for(let x=0;x<=W;x+=4){g.lineTo(x,ridge-10-Math.floor(21*Math.sin(x/W*Math.PI*2))); }
    g.lineTo(W,H);g.closePath();g.fillPath();
    g.fillStyle(0x312641).fillRect(0,ridge+24,W,H-ridge-24);
    const bandY=Math.floor(H*(portrait?.45:.42)),bandH=portrait?92:75;
    g.fillStyle(0xc1af8c,.92).fillRect(0,bandY,W,bandH);
    g.fillStyle(0x998967,.53).fillRect(0,bandY+5,W,bandH-10);
    const text=(label:string,y:number,size:number,color:string)=>{
      return this.add.text(W/2,y,label,{
        fontFamily:'monospace',fontSize:size+'px',fontStyle:'bold',color,align:'center',stroke:'#261827',strokeThickness:1
      }).setOrigin(.5).setResolution(1);
    };
    text('CHAPTER I',bandY-21,portrait?12:14,'#f8c46a');
    text('ARCTURIAN',bandY+bandH*.35,portrait?20:27,'#ffe07e');
    text('AWAKENING',bandY+bandH*.69,portrait?19:26,'#ffe07e');
    text('TOUCH THE SUN TO BEGIN',Math.min(H-30,bandY+bandH+32),portrait?10:12,'#fff0d5');
    if(!portrait)this.add.text(W/2,H-14,'A / D TO WALK  ·  SPACE TO INTERACT',{fontFamily:'monospace',fontSize:'8px',color:'#d9c6b0'}).setOrigin(.5);
    const zone=this.add.zone(sunX,sunY,Math.max(70,r*2),Math.max(70,r*2))
      .setInteractive({useHandCursor:true});
    zone.on('pointerdown',()=>this.begin(app));
    this.input.keyboard?.once('keydown',()=>this.begin(app));
  }
  private begin(app:GameContext){
    if(this.started)return;
    this.started=true;
    app.audio.start();
    app.audio.setMuted(app.progress.muted);
    if(app.progress.stage==='campfire')this.scene.start('SliceComplete');
    else if(app.progress.stage==='name')this.scene.start('Name',{resume:true});
    else this.scene.start('Prologue');
  }
}
