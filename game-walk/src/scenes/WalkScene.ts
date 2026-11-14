import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld,WORLD_WIDTH} from '../world/GrayboxWorld';
import type {WorldPreview} from '../world/GrayboxWorld';

/** Prologue: real walking + first musical discovery. Later Xaba/grief encounter
 * is intentionally removed from this opening and must be rebuilt in its proper
 * album sequence. No fabricated dialogue or synthetic music.
 */
export class PrologueScene extends Phaser.Scene{
  private app!:GameContext;
  private world!:WorldPreview;
  private player!:Phaser.GameObjects.Container;
  private hero!:Phaser.GameObjects.Sprite;
  private pickup!:Phaser.GameObjects.Container;
  private hint!:Phaser.GameObjects.Text;
  private velocity=0;private preciseX=0;
  private vy=0;private air=0;
  private grounded=true;private coyote=0;private jumpBuffer=0;
  private held:-1|0|1=0;
  private pointerId:number|null=null;private downAt=0;private downX=0;
  private arrows?:Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA?:Phaser.Input.Keyboard.Key;
  private keyD?:Phaser.Input.Keyboard.Key;
  private duration=0;private lastSave=0;private dustClock=0;
  private waitingForMusic=false;
  private pickupDone=false;
  private transitioned=false;
  private reduceMotion=false;
  constructor(){super('Prologue')}
  create(){
    this.app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height,portrait=H>W;
    this.reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cameras.main.setBackgroundColor('#001334');
    this.world=buildWorld(this);
    this.pickupDone=this.app.progress.has('first_contact');
    const startX=this.pickupDone?7380:140;
    this.preciseX=startX;
    this.player=this.add.container(startX,this.world.groundY).setDepth(20);
    this.hero=this.add.sprite(0,0,'alien',0).setOrigin(.5,1);
    this.hero.play('alien-idle');
    this.player.add(this.hero);
    this.cameras.main.setBounds(0,0,WORLD_WIDTH,H);
    this.cameras.main.startFollow(this.player,true,.10,.10,-Math.min(58,W*.19),-Math.min(26,H*.055));
    this.arrows=this.input.keyboard?.createCursorKeys();
    this.keyA=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(p.y<45)return;
      this.pointerId=p.id;this.held=p.x<W/2?-1:1;
      this.downAt=performance.now();this.downX=p.x;
    });
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{
      if(p.id===this.pointerId && p.isDown)this.held=p.x<W/2?-1:1;
    });
    const release=(p?:Phaser.Input.Pointer)=>{
      if(p && this.pointerId!==null && p.id!==this.pointerId)return;
      const shortTap=p&&this.pointerId!==null&&performance.now()-this.downAt<210&&Math.abs(p.x-this.downX)<17;
      this.pointerId=null;this.held=0;
      if(shortTap)this.jumpBuffer=.14;
    };
    this.input.on('pointerup',release);
    this.input.on('pointerupoutside',release);
    this.input.on('gameout',()=>{this.held=0;this.pointerId=null;});
    this.input.keyboard?.on('keydown-SPACE',(e:KeyboardEvent)=>{e.preventDefault();this.jumpBuffer=.14;});
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());
    const pause=this.add.text(W-12,12,'II',{
      fontFamily:'monospace',fontSize:'15px',color:'#f5e8c4',backgroundColor:'#3b304b',
      padding:{x:8,y:5}
    }).setOrigin(1,0).setScrollFactor(0).setDepth(41).setInteractive({useHandCursor:true});
    pause.on('pointerdown',(_p:Phaser.Input.Pointer,_lx:number,_ly:number,e:Phaser.Types.Input.EventData)=>{
      e.stopPropagation();this.openPause();
    });
    this.hint=this.add.text(W/2,H-34,this.pickupDone?'CONTINUE TOWARD THE LIGHT':'HOLD RIGHT TO WALK',{
      fontFamily:'Arial,sans-serif',fontSize:portrait?'11px':'12px',color:'#f2e7d6',
      align:'center',stroke:'#111a34',strokeThickness:3,wordWrap:{width:W-30}
    }).setOrigin(.5).setScrollFactor(0).setDepth(40);
    // The plant is temporary native pixel art until its final authored pulse
    // sprite is approved. Its label belongs to the same container.
    this.pickup=this.makePickup(8450,this.world.groundY);
    this.pickup.setVisible(!this.pickupDone);
    this.app.audio.setMuted(this.app.progress.muted);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
  }
  private makePickup(x:number,y:number){
    const g=this.add.graphics();
    g.fillStyle(0x1b4c5c).fillRect(-3,-25,6,25);
    g.fillStyle(0x2d8b91).fillRect(-10,-31,20,8);
    g.fillStyle(0x7fc8b2).fillRect(-8,-34,16,4);
    g.fillStyle(0xedae65).fillRect(-4,-37,9,5);
    g.fillStyle(0xc6a05e).fillRect(4,-13,9,3);
    g.fillStyle(0x347a7f).fillRect(-13,-19,10,4);
    const label=this.add.text(0,-52,'FIRST CONTACT',{
      fontFamily:'monospace',fontSize:'10px',color:'#fae6bc',stroke:'#14213a',strokeThickness:3
    }).setOrigin(.5);
    return this.add.container(x,y,[g,label]).setDepth(13);
  }
  private openPause(){
    this.held=0;this.velocity=0;
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:'Prologue'});
    this.scene.pause();
  }
  private recover(){
    if(this.pickupDone)return;
    this.pickupDone=true;this.pickup.setVisible(false);
    this.app.progress.discover('first_contact');
    this.waitingForMusic=true;
    this.hint.setText('FIRST CONTACT  /  LISTENING').setAlpha(1);
    void this.app.audio.playPickup('first_contact',()=>{
      this.waitingForMusic=false;
      this.hint.setText('KEEP WALKING TOWARD THE LIGHT').setAlpha(1);
    });
  }
  update(_time:number,delta:number){
    if(this.transitioned)return;
    const dt=Math.min(.05,delta/1000);
    this.duration+=dt;
    const left=!!(this.arrows?.left.isDown||this.keyA?.isDown);
    const right=!!(this.arrows?.right.isDown||this.keyD?.isDown);
    const axis=(right?1:0)-(left?1:0)||this.held;
    const max=155,acceleration=330,friction=440;
    const vTarget=axis*max,vDelta=vTarget-this.velocity;
    this.velocity+=Math.sign(vDelta)*Math.min(Math.abs(vDelta),(axis?acceleration:friction)*dt);
    const previous=this.player.x;
    this.preciseX=Phaser.Math.Clamp(this.preciseX+this.velocity*dt,25,WORLD_WIDTH-25);
    this.player.x=Math.round(this.preciseX);
    this.app.progress.setDistance(this.app.progress.distance+Math.abs(this.player.x-previous));
    if(Math.abs(this.velocity)>7)this.player.scaleX=this.velocity<0?-1:1;
    this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
    if(this.grounded)this.coyote=.1;else this.coyote=Math.max(0,this.coyote-dt);
    if(this.jumpBuffer>0&&this.coyote>0){
      this.vy=-202;this.grounded=false;this.coyote=0;this.jumpBuffer=0;
    }
    if(!this.grounded){
      this.vy+=650*dt;this.air+=this.vy*dt;
      if(this.air>=0){this.air=0;this.vy=0;this.grounded=true;}
    }
    this.player.y=Math.round(this.world.groundY+this.air);
    const anim=Math.abs(this.velocity)>10&&this.grounded?'alien-walk':'alien-idle';
    if(this.hero.anims.currentAnim?.key!==anim)this.hero.play(anim);
    this.world.update(this.cameras.main.scrollX);
    if(!this.reduceMotion&&this.grounded&&Math.abs(this.velocity)>40){
      this.dustClock+=dt;
      if(this.dustClock>.16){
        this.dustClock=0;
        const dust=this.add.rectangle(this.player.x-8,this.world.groundY,3,2,0xc59a68).setDepth(10);
        this.tweens.add({targets:dust,y:dust.y-7,alpha:0,duration:500,onComplete:()=>dust.destroy()});
      }
    }
    const passed=previous<=this.pickup.x+24&&this.player.x>=this.pickup.x-24 ||
      previous>=this.pickup.x-24&&this.player.x<=this.pickup.x+24;
    if(!this.pickupDone&&passed)this.recover();
    if(this.duration>5&&!this.waitingForMusic&&this.hint.text==='HOLD RIGHT TO WALK')
      this.hint.setAlpha(Math.max(0,1-(this.duration-5)/3));
    if(this.pickupDone&&!this.waitingForMusic&&this.player.x>9500){
      this.transitioned=true;
      this.scene.start('Settlement');
      return;
    }
    if(this.duration-this.lastSave>3){this.lastSave=this.duration;this.app.progress.save();}
  }
}
