import Phaser from 'phaser';
import {useServices} from '../createGame';
export class TitleScene extends Phaser.Scene{
 private lines:Phaser.GameObjects.Graphics[]=[];
 constructor(){super({key:'Title'});}
 create(){
  const {progress,audio}=useServices();
  audio.setAwakening(progress.snapshot.awakening);
  const w=this.scale.width,h=this.scale.height;
  // Intentionally transparent line work over the genuine album image. Final animation assets are not fabricated here.
  for(let i=0;i<6;i++){
   const g=this.add.graphics();g.lineStyle(.9,0xe3c79c,.22);
   const y=h*(.72+i*.041);g.beginPath();g.moveTo(0,y);g.lineTo(w,y-20-i*5);g.strokePath();this.lines.push(g);
  }
  this.add.text(w-24,23,'PHASER / SCAFFOLD',{fontFamily:'Arial, sans-serif',fontSize:'13px',color:'#f7e9d6'}).setOrigin(1,0).setAlpha(.9);
  this.scale.on('resize',(size:Phaser.Structs.Size)=>{this.cameras.main.setViewport(0,0,size.width,size.height);});
  this.events.once('shutdown',()=>{this.scale.off('resize');});
 }
 update(_:number,delta:number){
  if(document.documentElement.classList.contains('reduce-motion'))return;
  const wave=Math.sin(this.time.now*.0004)*.015;
  this.lines.forEach((g,i)=>g.setAlpha(.7+wave*(i+1)));
  void delta;
 }
}
