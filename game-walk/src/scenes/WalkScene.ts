import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld,WORLD_WIDTH} from '../world/GrayboxWorld';
import type {WorldPreview} from '../world/GrayboxWorld';
type Phase='prologue'|'name';
interface StartData{x?:number}
class WalkBase extends Phaser.Scene {
  protected app!:GameContext;
  private player!:Phaser.GameObjects.Container;
  private legs!:Phaser.GameObjects.Graphics;
  private body!:Phaser.GameObjects.Graphics;
  private world!:WorldPreview;
  private phase:Phase;
  private groundY=0;
  private speed=0;
  private elapsed=0;
  private held:-1|0|1=0;
  private pointerId:number|null=null;
  private arrows?:Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?:Record<string,Phaser.Input.Keyboard.Key>;
  private travelled=0;
  private lastSave=0;
  private pickupDone=false;
  private motes:Phaser.GameObjects.Container[]=[];
  private motesFound=0;
  private pickup!:Phaser.GameObjects.Container;
  private labels!:Phaser.GameObjects.Text;
  private hud!:Phaser.GameObjects.Text;
  private guidance!:Phaser.GameObjects.Text;
  private pauseLabel!:Phaser.GameObjects.Text;
  private waitingForVoice=false;
  protected constructor(key:string,phase:Phase){super(key);this.phase=phase}
  create(data:StartData={}){
    this.app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height;
    this.world=buildWorld(this);this.groundY=this.world.groundY;
    this.cameras.main.setBounds(0,0,WORLD_WIDTH,H);
    const startX=data.x??(this.phase==='name'?1190:140);
    this.player=this.add.container(startX,this.groundY-5).setDepth(6);
    this.legs=this.add.graphics();this.body=this.add.graphics();
    this.player.add([this.legs,this.body]);this.renderFigure(0);
    this.cameras.main.startFollow(this.player,true,.10,.09,-Math.min(84,W*.19),-H*.11);
    this.arrows=this.input.keyboard?.createCursorKeys();
    this.keys=this.input.keyboard?.addKeys('A,D') as Record<string,Phaser.Input.Keyboard.Key>|undefined;
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(p.y<H*.17)return;
      this.pointerId=p.id;this.held=p.x<W/2?-1:1;
    });
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{
      if(p.id===this.pointerId && p.isDown)this.held=p.x<W/2?-1:1;
    });
    for(const evt of ['pointerup','pointerupoutside','gameout'])this.input.on(evt,()=>{this.pointerId=null;this.held=0});
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    this.input.keyboard?.on('keydown-M',()=>this.toggleMute());
    this.hud=this.add.text(21,19,'',{fontFamily:'Arial,sans-serif',fontSize:W<520?'12px':'15px',color:'#fff2dc',stroke:'#18234f',strokeThickness:4}).setScrollFactor(0).setDepth(30);
    this.guidance=this.add.text(W/2,H-31,'HOLD LEFT / RIGHT TO WALK',{fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:W<520?'19px':'23px',color:'#fff0d7',stroke:'#1c2452',strokeThickness:4}).setOrigin(.5).setScrollFactor(0).setDepth(30);
    this.pauseLabel=this.add.text(W-20,23,'PAUSE',{fontFamily:'Arial,sans-serif',fontSize:W<520?'13px':'16px',color:'#fff2dc',backgroundColor:'#241d49a8',padding:{x:13,y:10}}).setOrigin(1,0).setScrollFactor(0).setDepth(32).setInteractive({useHandCursor:true});
    this.pauseLabel.on('pointerdown',(_p:Phaser.Input.Pointer,_lx:number,_ly:number,e:Phaser.Types.Input.EventData)=>{e.stopPropagation();this.openPause()});
    this.labels=this.add.text(W/2,68,'',{fontFamily:'Arial,sans-serif',fontSize:W<520?'10px':'13px',color:'#ffe0aa',stroke:'#1e2240',strokeThickness:4}).setOrigin(.5).setScrollFactor(0).setDepth(32);
    if(this.phase==='prologue'){
      this.labels.setText('PROLOGUE / FIRST CONTACT');
      this.pickup=this.makePickup(760,this.groundY-89,'FIRST CONTACT',false);
      this.guidance.setText('Hold to walk toward the light');
    } else {
      this.labels.setText('THE NAME / XABA');
      for(const x of [1500,1760,2020]){
        const mote=this.makePickup(x,this.groundY-75,'',true);
        this.motes.push(mote);
      }
      this.guidance.setText('Gather the three lights');
    }
    this.app.audio.setMuted(this.app.progress.muted);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
  }
  private makePickup(x:number,y:number,label:string,mote:boolean){
    const g=this.add.graphics();
    g.fillStyle(0xf7bb5e,.17).fillCircle(0,0,mote?35:48);
    g.lineStyle(2,0xf6d59a,.94).strokeCircle(0,0,mote?12:24);
    g.lineBetween(-10,0,10,0);g.lineBetween(0,-10,0,10);
    const c=this.add.container(x,y,[g]).setDepth(4);
    if(label)this.add.text(x,y-59,label,{fontFamily:'Arial,sans-serif',fontSize:'15px',color:'#ffdfaa',letterSpacing:1}).setOrigin(.5).setDepth(5);
    return c;
  }
  private renderFigure(frame:number){
    this.legs.clear();this.body.clear();
    const frames=[0,6,11,6,0,-6,-11,-6],swing=frames[(Math.floor(frame)%8+8)%8];
    this.legs.lineStyle(9,0x2b305d).lineBetween(-5,-26,-9+swing,0);
    this.legs.lineBetween(7,-26,8-swing,0);
    this.body.fillStyle(0x512960).fillRoundedRect(-19,-70,38,44,10);
    this.body.fillStyle(0x20638a).fillCircle(0,-84,15);
    this.body.fillStyle(0x672e5b,.93).fillTriangle(-18,-62,-25,-25,18,-25);
  }
  private toggleMute(){
    this.app.progress.setMuted(!this.app.progress.muted);
    this.app.audio.setMuted(this.app.progress.muted);
    this.guidance.setText(this.app.progress.muted?'Sound muted':'Sound resumed');
  }
  private openPause(){
    this.held=0;this.speed=0;
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:this.scene.key});
    this.scene.pause();
  }
  update(time:number,deltaMs:number){
    const dt=Math.min(deltaMs/1000,.034);
    this.elapsed+=dt;
    const k=this.keys;
    const kbL=Boolean(this.arrows?.left.isDown||k?.A?.isDown);
    const kbR=Boolean(this.arrows?.right.isDown||k?.D?.isDown);
    const axis=(kbR?1:0)-(kbL?1:0)||this.held;
    const acceleration=660,friction=1050,maxSpeed=220;
    const desired=axis*maxSpeed,diff=desired-this.speed;
    this.speed+=Math.sign(diff)*Math.min(Math.abs(diff),(axis?acceleration:friction)*dt);
    const previous=this.player.x;
    this.player.x=Phaser.Math.Clamp(previous+this.speed*dt,75,WORLD_WIDTH-100);
    this.travelled+=Math.abs(this.player.x-previous);
    this.player.scaleX=this.speed<-.5?-1:1;
    this.renderFigure(Math.floor(this.elapsed*11*Math.abs(this.speed)/maxSpeed)%8);
    // Continuous awakening: score keeps its most-open state across scene changes.
    this.app.progress.setDistance(this.app.progress.distance+Math.abs(this.player.x-previous));
    this.app.audio.setTravel(Math.min(1,this.app.progress.distance/1850));
    this.world.update(this.cameras.main.scrollX);
    this.hud.setText('AWAKENING  '+Math.round(Math.min(100,this.app.progress.distance/1850*100))+'%');
    if(this.phase==='prologue'){
      if(!this.pickupDone && Math.abs(this.player.x-this.pickup.x)<52){
        this.pickupDone=true;this.pickup.setVisible(false);
        this.app.progress.discover('first_contact');
        this.guidance.setText('First Contact · listening');
        this.waitingForVoice=true;
        void this.app.audio.playPickup('first_contact',()=>{
          this.waitingForVoice=false;
          this.guidance.setText('The next memory is beyond the ridge');
        });
      }
      if(this.pickupDone && !this.waitingForVoice && this.player.x>1140){
        this.scene.start('Name',{x:this.player.x+80});
        return;
      }
    }else{
      this.motes.forEach((mote,index)=>{
        if(mote.visible && Math.abs(this.player.x-mote.x)<43){
          mote.setVisible(false);this.motesFound++;
          this.guidance.setText(this.motesFound<3?'Light '+this.motesFound+' / 3 recovered':'Xaba. The name is remembered.');
          if(this.motesFound===3){
            this.app.progress.discover('xaba');
            void this.app.audio.playPickup('xaba',()=>this.guidance.setText('Xaba recovered · vertical slice complete'));
          }
        }
        if(mote.visible)mote.y=this.groundY-75+Math.sin(time*.0028+index)*7;
      });
    }
    if(this.elapsed-this.lastSave>3){this.lastSave=this.elapsed;this.app.progress.save()}
  }
}
export class PrologueScene extends WalkBase{constructor(){super('Prologue','prologue')}}
export class EncounterNameScene extends WalkBase{constructor(){super('Name','name')}}
