import Phaser from 'phaser';
import type { GameContext } from '../main';
import { buildWorld, WORLD_WIDTH } from '../world/GrayboxWorld';
import type { WorldPreview } from '../world/GrayboxWorld';

type Phase = 'prologue' | 'name';
interface StartData { resume?: boolean }

class WalkBase extends Phaser.Scene {
  protected app!: GameContext;
  private phase: Phase;
  private world!: WorldPreview;
  private player!: Phaser.GameObjects.Container;
  private figure!: Phaser.GameObjects.Graphics;
  private pause!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private label!: Phaser.GameObjects.Text;
  private pickup!: Phaser.GameObjects.Container;
  private motes: Phaser.GameObjects.Container[] = [];
  private keeper?: Phaser.GameObjects.Container;
  private fire?: Phaser.GameObjects.Container;
  private vx = 0;
  private preciseX = 0;
  private vy = 0;
  private airborne = 0;
  private onGround = true;
  private coyote = 0;
  private jumpBuffer = 0;
  private held: -1|0|1 = 0;
  private pointerId: number | null = null;
  private pressTime = 0;
  private pressX = 0;
  private elapsed = 0;
  private lastSave = 0;
  private keyLeft?: Phaser.Input.Keyboard.Key;
  private keyRight?: Phaser.Input.Keyboard.Key;
  private arrows?: Phaser.Types.Input.Keyboard.CursorKeys;
  private pickupDone = false;
  private waitingForMusic = false;
  private calls = 0;
  private xabaReady = false;
  private xabaRecovered = false;
  private reduceMotion = false;
  private dustClock = 0;

  protected constructor(key: string, phase: Phase) { super(key); this.phase = phase; }
  create(_data: StartData = {}) {
    this.app = this.registry.get('app') as GameContext;
    const W=this.scale.width, H=this.scale.height, portrait=H>W;
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.world = buildWorld(this);
    const ground = this.world.groundY;
    const x = this.phase==='prologue' ? 90 : 450;
    this.player=this.add.container(x,ground).setDepth(20);
    this.preciseX=x;
    this.figure=this.add.graphics().setDepth(0);
    this.player.add(this.figure);
    this.renderFigure(0);
    this.cameras.main.setBounds(0,0,WORLD_WIDTH,H);
    this.cameras.main.startFollow(this.player,true,.085,.10,-Math.floor(W*.20),-Math.floor(H*.05));
    this.arrows=this.input.keyboard?.createCursorKeys();
    this.keyLeft=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyRight=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(p.y<Math.min(H*.14,52))return;
      this.pointerId=p.id;this.held=p.x<W/2?-1:1;this.pressTime=performance.now();this.pressX=p.x;
    });
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{
      if(this.pointerId===p.id&&p.isDown) this.held=p.x<W/2?-1:1;
    });
    const release=(p?:Phaser.Input.Pointer)=>{
      if(p&&this.pointerId!==null&&p.id!==this.pointerId)return;
      const tap=p && this.pointerId!==null && performance.now()-this.pressTime<240 && Math.abs(p.x-this.pressX)<18;
      this.pointerId=null;this.held=0;
      if(tap)this.act();
    };
    this.input.on('pointerup',release);this.input.on('pointerupoutside',release);
    this.input.on('gameout',()=>{this.pointerId=null;this.held=0;});
    this.input.keyboard?.on('keydown-SPACE',(event:KeyboardEvent)=>{event.preventDefault();this.act();});
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    this.label=this.add.text(Math.floor(W/2),portrait?33:17,this.phase==='name'?'I  /  THE NAME':'PROLOGUE  /  FIRST CONTACT',{
      fontFamily:'monospace',fontSize:portrait?'10px':'10px',fontStyle:'bold',color:'#f4d49b',stroke:'#10172c',strokeThickness:2
    }).setOrigin(.5).setScrollFactor(0).setDepth(40);
    this.pause=this.add.text(W-13,13,'II',{
      fontFamily:'monospace',fontSize:'17px',fontStyle:'bold',color:'#fff4d3',backgroundColor:'#31243d',
      padding:{x:9,y:4}
    }).setOrigin(1,0).setScrollFactor(0).setDepth(42).setInteractive({useHandCursor:true});
    this.pause.on('pointerdown',(_p:Phaser.Input.Pointer,_lx:number,_ly:number,event:Phaser.Types.Input.EventData)=>{
      event.stopPropagation();this.openPause();
    });
    this.hint=this.add.text(Math.floor(W/2),portrait?H-45:H-25,
      this.phase==='name'?'FOLLOW THE TEAL LIGHT':'HOLD TO WALK TOWARD THE SUN',{
      fontFamily:'monospace',fontSize:portrait?'10px':'10px',align:'center',color:'#fff0c9',
      stroke:'#10172c',strokeThickness:3,wordWrap:{width:W-30}
    }).setOrigin(.5).setScrollFactor(0).setDepth(40);

    if(this.phase==='prologue'){
      this.pickup=this.drawPlant(8000,ground,'FIRST CONTACT');
      this.pickupDone=this.app.progress.has('first_contact');
      this.pickup.setVisible(!this.pickupDone);
    } else {
      this.app.progress.setStage('name');
      this.calls=this.app.progress.nameCalls;
      this.xabaRecovered=this.app.progress.has('xaba');
      this.keeper=this.makeKeeper(1150,ground);
      for(let i=0;i<3;i++)this.motes.push(this.drawMote(1045+i*105,ground-65));
      this.pickup=this.drawPlant(1390,ground,'XABA');
      this.xabaReady=this.calls>=3 || this.xabaRecovered;
      this.pickup.setVisible(this.xabaReady&&!this.xabaRecovered);
      this.fire=this.makeFire(2110,ground);
    }
    this.app.audio.setMuted(this.app.progress.muted);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
  }
  private drawMote(x:number,y:number){
    const g=this.add.graphics();
    g.fillStyle(0x58d8d1,.18).fillRect(-9,-9,18,18);
    g.fillStyle(0x4ee0d8).fillRect(-3,-3,6,6);
    g.fillStyle(0xeec987).fillRect(-1,-1,2,2);
    return this.add.container(x,y,[g]).setDepth(12);
  }
  private drawPlant(x:number,ground:number,name:string){
    const g=this.add.graphics();
    g.fillStyle(0x235967).fillRect(-3,-30,6,30);
    g.fillStyle(0x43b4ad).fillRect(-10,-34,20,7);
    g.fillStyle(0xebb35f).fillRect(-6,-36,12,4);
    g.fillStyle(0xf2ce8c).fillRect(-3,-36,5,2);
    g.fillStyle(0x4a9f9a).fillRect(-14,-18,10,5);
    g.fillRect(4,-13,9,5);
    const c=this.add.container(x,ground,[g]).setDepth(10);
    this.add.text(x,ground-49,name,{fontFamily:'monospace',fontSize:'9px',color:'#fff0bc',stroke:'#15203f',strokeThickness:3}).setOrigin(.5).setDepth(11);
    return c;
  }
  private makeKeeper(x:number,ground:number){
    // PLACEHOLDER peaceful keeper silhouette; actual pixel sprite pending.
    const g=this.add.graphics();
    g.fillStyle(0x182441).fillRect(-13,-50,26,48);
    g.fillStyle(0x286b73).fillRect(-11,-39,22,37);
    g.fillStyle(0xd2b894).fillRect(-8,-51,16,12);
    g.fillStyle(0x6b3b60).fillRect(-12,-42,24,8);
    g.fillStyle(0xf1c06e).fillRect(16,-42,5,6);
    g.fillStyle(0x7b573f).fillRect(17,-36,3,36);
    g.fillStyle(0xbec0ad).fillRect(-5,-47,3,2);g.fillRect(3,-47,3,2);
    return this.add.container(x,ground,[g]).setDepth(10);
  }
  private makeFire(x:number,ground:number){
    const g=this.add.graphics();
    g.fillStyle(0x513c39).fillRect(-18,-4,36,6);
    g.fillStyle(0xb5673f).fillRect(-13,-16,25,14);
    g.fillStyle(0xefb763).fillRect(-7,-25,14,19);
    g.fillStyle(0xf4d994).fillRect(-3,-14,6,8);
    return this.add.container(x,ground,[g]).setDepth(9);
  }
  private act(){
    if(this.phase==='prologue'){
      this.jumpBuffer=.13;
      return;
    }
    const distance=Math.abs(this.player.x-1150);
    if(distance>240||this.xabaReady){this.jumpBuffer=.13;return;}
    this.calls=Math.min(3,this.calls+1);
    this.app.progress.setNameCalls(this.calls);
    this.hint.setText(this.calls<3?'THE LIGHTS ARE GATHERING':'THE LIGHTS ARE ALIGNED');
    const ring=this.add.circle(this.player.x,this.player.y-32,5).setStrokeStyle(2,0x7ee8d8,.95).setDepth(23);
    this.tweens.add({targets:ring,radius:130,alpha:0,duration:850,onComplete:()=>ring.destroy()});
    if(this.calls>=3){
      this.xabaReady=true;
      this.pickup.setVisible(!this.xabaRecovered);
      this.hint.setText('XABA  /  WALK TOWARD THE LIGHT');
    }
  }
  private openPause(){
    this.held=0;this.vx=0;
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:this.scene.key});
    this.scene.pause();
  }
  private renderFigure(walkFrame:number){
    const g=this.figure;g.clear();
    const f=walkFrame%8,swing=[0,2,3,2,0,-2,-3,-2][f];
    const bob=Math.abs(swing)>2?1:0;
    g.fillStyle(0x191a30).fillRect(-12,-4,24,3);
    // Foot pivot never moves; only inner-leg highlights change.
    g.fillStyle(0x1c2443).fillRect(-8+swing,-17,6,17);
    g.fillRect(3-swing,-17,6,17);
    g.fillStyle(0x4a2c50).fillRect(-14,-36+bob,23,28);
    g.fillStyle(0x642f55).fillRect(-12,-35+bob,17,28);
    g.fillStyle(0x273b65).fillRect(-7,-30+bob,15,18);
    g.fillStyle(0xe5b65f).fillRect(-2,-15+bob,5,3);
    g.fillStyle(0x36789e).fillRect(-13,-25+bob,5,13);
    g.fillRect(9,-25+bob,5,13);
    // Protagonist: PLACEHOLDER art, blue alien in maroon hooded cape.
    g.fillStyle(0x1a2e55).fillRect(-10,-49+bob,20,18);
    g.fillStyle(0x2d87b5).fillRect(-8,-47+bob,16,15);
    g.fillStyle(0x5cc1d8).fillRect(-6,-45+bob,8,5);
    g.fillStyle(0x081829).fillRect(-5,-40+bob,4,3);
    g.fillRect(4,-40+bob,3,3);
  }
  private onFirstContact(){
    if(this.pickupDone)return;
    this.pickupDone=true;this.pickup.setVisible(false);
    this.app.progress.discover('first_contact');
    this.waitingForMusic=true;this.hint.setText('FIRST CONTACT  /  LISTENING');
    void this.app.audio.playPickup('first_contact',()=>{
      this.waitingForMusic=false;
      this.hint.setText('CONTINUE TOWARD THE SUN');
    });
  }
  private onXaba(){
    if(this.xabaRecovered)return;
    this.xabaRecovered=true;this.pickup.setVisible(false);
    this.app.progress.discover('xaba');
    this.waitingForMusic=true;
    this.hint.setText('XABA  /  LISTENING');
    void this.app.audio.playPickup('xaba',()=>{
      this.waitingForMusic=false;this.hint.setText('FOLLOW THE CAMPFIRE LIGHT');
    });
  }
  update(time:number,delta:number){
    const dt=Math.min(.05,delta/1000);
    this.elapsed+=dt;
    const left=Boolean(this.arrows?.left.isDown||this.keyLeft?.isDown);
    const right=Boolean(this.arrows?.right.isDown||this.keyRight?.isDown);
    const axis=(right?1:0)-(left?1:0)||this.held;
    const max=155,accel=340,decel=460;
    const target=axis*max,deltaV=target-this.vx;
    this.vx+=Math.sign(deltaV)*Math.min(Math.abs(deltaV),(axis?accel:decel)*dt);
    const before=this.player.x;
    this.preciseX=Phaser.Math.Clamp(this.preciseX+this.vx*dt,25,WORLD_WIDTH-25);
    this.player.x=Math.round(this.preciseX);
    // Avoid losing sub-pixel movement at low deltas: integrate fractional remainder separately.
    const distance=Math.abs(this.player.x-before);
    this.app.progress.setDistance(this.app.progress.distance+distance);
    this.app.audio.setTravel(Math.min(1,this.app.progress.distance/12000));
    if(Math.abs(this.vx)>4)this.player.scaleX=this.vx<0?-1:1;
    this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
    if(this.onGround)this.coyote=.10;else this.coyote=Math.max(0,this.coyote-dt);
    if(this.jumpBuffer>0&&this.coyote>0){
      this.vy=-205;this.onGround=false;this.coyote=0;this.jumpBuffer=0;
    }
    if(!this.onGround){
      this.vy+=680*dt;this.airborne+=this.vy*dt;
      if(this.airborne>=0){this.airborne=0;this.vy=0;this.onGround=true;}
    }
    this.player.y=Math.round(this.world.groundY+this.airborne);
    this.renderFigure(Math.floor(this.elapsed*12*Math.min(1,Math.abs(this.vx)/65))%8);
    this.world.update(this.cameras.main.scrollX);
    if(!this.reduceMotion && this.onGround && Math.abs(this.vx)>35){
      this.dustClock+=dt;
      if(this.dustClock>.13){
        this.dustClock=0;
        const dust=this.add.rectangle(this.player.x-9,this.world.groundY,3,2,0xc5a17d).setDepth(8);
        this.tweens.add({targets:dust,y:dust.y-8,alpha:0,duration:470,onComplete:()=>dust.destroy()});
      }
    }
    if(this.phase==='prologue'){
      if(!this.pickupDone&&Math.min(before,this.player.x)<=this.pickup.x+19&&Math.max(before,this.player.x)>=this.pickup.x-19)
        this.onFirstContact();
      if(this.pickupDone&&!this.waitingForMusic&&this.player.x>9100){
        this.app.progress.setStage('name');
        this.scene.start('Name');
        return;
      }
    } else {
      const center=1150;
      this.motes.forEach((mote,index)=>{
        const spread=1-this.calls/3;
        const initialX=1045+index*105;
        mote.x=Math.round(center+(initialX-center)*spread);
        mote.y=Math.round(this.world.groundY-72+Math.sin(time*.0025+index)*3);
        mote.setVisible(!this.xabaReady);
      });
      if(this.keeper)this.keeper.y=this.world.groundY;
      if(!this.xabaReady&&Math.abs(this.player.x-center)<215)this.hint.setText('TAP TO CALL THE THREE LIGHTS  /  '+this.calls+' OF 3');
      if(this.xabaReady&&!this.xabaRecovered &&
          Math.min(before,this.player.x)<=this.pickup.x+23 && Math.max(before,this.player.x)>=this.pickup.x-23)
        this.onXaba();
      if(this.fire&&this.xabaRecovered&&!this.waitingForMusic&&this.player.x>2050){
        this.app.progress.setStage('campfire');
        this.app.audio.soften();
        this.scene.start('SliceComplete');
        return;
      }
    }
    if(this.elapsed-this.lastSave>3){this.lastSave=this.elapsed;this.app.progress.save();}
  }
}
export class PrologueScene extends WalkBase { constructor(){super('Prologue','prologue');} }
export class EncounterNameScene extends WalkBase { constructor(){super('Name','name');} }
