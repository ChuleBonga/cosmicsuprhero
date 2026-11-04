import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld,WORLD_WIDTH,FIRST_CONTACT_X,CREDO_APPROACH_X} from '../world/GrayboxWorld';
import type {WorldPreview} from '../world/GrayboxWorld';

/**
 * Arrival 1: an authored walk, not an 8,450-unit texture repetition.
 *
 * Three distinct silhouettes foreshadow the signal. The visitor must
 * intentionally listen for a moment; brushing a trigger cannot collect it.
 * Xaba remains reserved for the later grief chapter.
 */
export class PrologueScene extends Phaser.Scene {
  private app!:GameContext;
  private world!:WorldPreview;
  private player!:Phaser.GameObjects.Container;
  private hero!:Phaser.GameObjects.Sprite;
  private artifact!:Phaser.GameObjects.Container;
  private artifactHalo!:Phaser.GameObjects.Arc;
  private listeningRing!:Phaser.GameObjects.Graphics;
  private hint!:Phaser.GameObjects.Text;
  private velocity=0;private exactX=0;
  private vy=0;private air=0;private grounded=true;private coyote=0;private jumpBuffer=0;
  private held:-1|0|1=0;private listening=false;private listenCharge=0;
  private pointerId:number|null=null;private downAt=0;private downX=0;
  private arrows?:Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA?:Phaser.Input.Keyboard.Key;private keyD?:Phaser.Input.Keyboard.Key;
  private keyListen?:Phaser.Input.Keyboard.Key;
  private elapsed=0;private lastSave=0;private dustClock=0;
  private beat=0;private captionElapsed=0;
  private waitingForMusic=false;private pickupDone=false;private transitioned=false;
  private reduceMotion=false;

  constructor(){super('Prologue')}
  create(){
    this.app=this.registry.get('app') as GameContext;
    const W=this.scale.width,H=this.scale.height;
    this.reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cameras.main.setBackgroundColor('#07152b');
    this.world=buildWorld(this);
    this.pickupDone=this.app.progress.has('first_contact');
    this.exactX=this.pickupDone?FIRST_CONTACT_X+70:118;
    this.player=this.add.container(this.exactX,this.world.groundY).setDepth(20);
    this.hero=this.add.sprite(0,0,'alien',0).setOrigin(.5,1).setDepth(1);
    this.hero.play('alien-idle');
    this.player.add(this.hero);
    // Soft contact shadow grounds the player's feet even as terrain pans.
    const shadow=this.add.ellipse(0,-1,23,4,0x100e17,.46);
    this.player.addAt(shadow,0);

    this.cameras.main.setBounds(0,0,WORLD_WIDTH,H);
    this.cameras.main.startFollow(this.player,true,.065,.095,-42,-8);
    this.cameras.main.setDeadzone(44,26);
    this.arrows=this.input.keyboard?.createCursorKeys();
    this.keyA=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyListen=this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{
      if(p.y<40)return;
      this.pointerId=p.id;this.downAt=performance.now();this.downX=p.x;
      if(this.canListen()){this.listening=true;this.held=0;return;}
      this.held=p.x<W/2?-1:1;
    });
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{
      if(p.id===this.pointerId && p.isDown && !this.listening)this.held=p.x<W/2?-1:1;
    });
    const release=(p?:Phaser.Input.Pointer)=>{
      if(p&&this.pointerId!==null&&p.id!==this.pointerId)return;
      const tap=p&&this.pointerId!==null&&performance.now()-this.downAt<190&&Math.abs(p.x-this.downX)<14;
      this.pointerId=null;this.held=0;this.listening=false;
      if(tap && !this.canListen())this.jumpBuffer=.14;
    };
    this.input.on('pointerup',release);
    this.input.on('pointerupoutside',release);
    this.input.on('gameout',()=>{this.held=0;this.listening=false;this.pointerId=null;});
    const releaseForRotation=()=>{
      this.held=0;this.listening=false;this.pointerId=null;this.velocity=0;
    };
    window.addEventListener('arcturian:release-controls',releaseForRotation);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
      window.removeEventListener('arcturian:release-controls',releaseForRotation);
    });
    this.input.keyboard?.on('keydown-SPACE',(e:KeyboardEvent)=>{e.preventDefault();if(!this.canListen())this.jumpBuffer=.15;});
    this.input.keyboard?.on('keydown-ESC',()=>this.openPause());
    this.input.keyboard?.on('keydown-P',()=>this.openPause());

    this.artifact=this.makeArtifact(FIRST_CONTACT_X,this.world.groundY);
    this.artifact.setVisible(!this.pickupDone);
    this.artifactHalo=this.add.circle(FIRST_CONTACT_X,this.world.groundY-46,13,0x8dd9c1,.04).setDepth(9);
    this.listeningRing=this.add.graphics().setDepth(25);
    this.hint=this.add.text(W/2,H-27,this.pickupDone?'THE SIGNAL HAS BEEN HEARD':'MOVE TOWARD THE HORIZON',{
      fontFamily:'Georgia,serif',fontStyle:'italic',fontSize:'13px',
      color:'#f4ddaf',align:'center',stroke:'#111328',strokeThickness:3
    }).setOrigin(.5).setScrollFactor(0).setDepth(40).setVisible(false);
    this.caption(this.pickupDone?'THE SIGNAL HAS BEEN HEARD':'MOVE TOWARD THE HORIZON');
    this.app.audio.setMuted(this.app.progress.muted);
    this.world.setArrivalLighting(this.pickupDone?1:0);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.app.progress.save());
  }

  private makeArtifact(x:number,y:number){
    const plant=this.add.sprite(0,0,'arrival-landmark',2).setScale(.75).setOrigin(.5,1);
    const glimmer=this.add.circle(0,-63,6,0xe9aa71,.9);
    const listeningText=this.add.text(0,-103,'',{fontFamily:'Georgia,serif',
      fontStyle:'italic',fontSize:'13px',color:'#f5d7a2',stroke:'#0d182b',strokeThickness:4
    }).setOrigin(.5);
    return this.add.container(x,y,[plant,glimmer,listeningText]).setDepth(13);
  }
  private canListen():boolean{
    return !this.pickupDone && Math.abs(this.player.x-FIRST_CONTACT_X)<84 && this.grounded;
  }
  private openPause(){
    this.held=0;this.listening=false;this.velocity=0;
    this.app.audio.pause();
    this.scene.launch('PauseUI',{returnScene:'Prologue'});
    this.scene.pause();
  }
  private caption(message:string):void {
    const el=document.getElementById('observatory-subtitle');
    if(el)el.textContent=message;
  }
  private showBeat(value:number,message:string){
    if(this.beat>=value)return;
    this.beat=value;
    this.captionElapsed=0;
    this.hint.setText(message).setAlpha(.96);
    this.caption(message);
  }
  private recover(){
    if(this.pickupDone)return;
    this.pickupDone=true;this.listening=false;this.listenCharge=1;
    this.artifact.setVisible(false);
    this.world.setSignalIntensity(1);this.world.setArrivalLighting(1);
    this.app.progress.discover('first_contact');
    this.waitingForMusic=true;
    this.hint.setText('FIRST CONTACT').setAlpha(1);
    this.caption('FIRST CONTACT');
    this.cameras.main.flash(this.reduceMotion?0:350,220,172,101,false);
    void this.app.audio.playPickup('first_contact',()=>{
      this.waitingForMusic=false;
      this.hint.setText('THE WORLD REMEMBERS').setAlpha(1);
      this.caption('THE WORLD REMEMBERS');
    });
  }

  update(_time:number,delta:number){
    if(this.transitioned)return;
    const dt=Math.min(.05,delta/1000);
    this.elapsed+=dt;
    const left=!!(this.arrows?.left.isDown||this.keyA?.isDown);
    const right=!!(this.arrows?.right.isDown||this.keyD?.isDown);
    const inRange=this.canListen();
    const keyListening=!!this.keyListen?.isDown && inRange;
    const wantsListen=inRange&&(this.listening||keyListening);
    const axis=wantsListen?0:((right?1:0)-(left?1:0)||this.held);
    const max=119,acceleration=320,friction=450;
    const target=axis*max,dv=target-this.velocity;
    this.velocity+=Math.sign(dv)*Math.min(Math.abs(dv),(axis?acceleration:friction)*dt);
    const previous=this.player.x;
    this.exactX=Phaser.Math.Clamp(this.exactX+this.velocity*dt,26,WORLD_WIDTH-26);
    this.player.x=Math.round(this.exactX);
    this.app.progress.setDistance(this.app.progress.distance+Math.abs(this.player.x-previous));
    if(Math.abs(this.velocity)>6)this.player.scaleX=this.velocity<0?-1:1;
    this.jumpBuffer=Math.max(0,this.jumpBuffer-dt);
    if(this.grounded)this.coyote=.1;else this.coyote=Math.max(0,this.coyote-dt);
    if(this.jumpBuffer>0&&this.coyote>0){
      this.vy=-198;this.grounded=false;this.coyote=0;this.jumpBuffer=0;
    }
    if(!this.grounded){
      this.vy+=640*dt;this.air+=this.vy*dt;
      if(this.air>=0){this.air=0;this.vy=0;this.grounded=true;}
    }
    this.player.y=Math.round(this.world.groundY+this.air);
    const anim=Math.abs(this.velocity)>10&&this.grounded?'alien-walk':'alien-idle';
    if(this.hero.anims.currentAnim?.key!==anim)this.hero.play(anim);

    if(this.player.x>400)this.showBeat(1,'THE LAND REMEMBERS');
    if(this.player.x>910)this.showBeat(2,'A SIGNAL BEYOND THE RIDGE');
    if(inRange&&!this.pickupDone){
      this.hint.setText('HOLD TO LISTEN').setAlpha(1);
      this.caption('HOLD TO LISTEN');
      this.captionElapsed=0;
      // The artifact becomes more luminous only with deliberate attention.
      this.listenCharge=Phaser.Math.Clamp(this.listenCharge+(wantsListen?dt/.95:-dt*.28),0,1);
      if(this.listenCharge>=1)this.recover();
    }else if(!this.pickupDone){
      this.listenCharge=Math.max(0,this.listenCharge-dt*.2);
    }
    this.world.setSignalIntensity(this.pickupDone?1:Math.max(.1,this.listenCharge*.9));
    this.world.update(this.cameras.main.scrollX,delta);
    this.artifactHalo.setAlpha(this.pickupDone?.22:.05+this.listenCharge*.17);
    this.artifactHalo.setScale(1+Math.sin(this.elapsed*1.1)*.09);
    this.listeningRing.clear();
    if(inRange&&!this.pickupDone){
      this.listeningRing.lineStyle(2,0xd6b887,.8);
      this.listeningRing.arc(FIRST_CONTACT_X,this.world.groundY-64,20,
        -Math.PI/2,-Math.PI/2+Math.PI*2*this.listenCharge,false);
      this.listeningRing.strokePath();
    }
    if(!this.reduceMotion&&this.grounded&&Math.abs(this.velocity)>42){
      this.dustClock+=dt;
      if(this.dustClock>.22){
        this.dustClock=0;
        const dust=this.add.rectangle(this.player.x-7,this.world.groundY-1,3,1,0xc28e6a,.48).setDepth(11);
        this.tweens.add({targets:dust,x:dust.x-8,y:dust.y-8,alpha:0,duration:660,onComplete:()=>dust.destroy()});
      }
    }
    if(!inRange&&!this.waitingForMusic){
      this.captionElapsed+=dt;
      if(this.captionElapsed>3.3)this.hint.setAlpha(Math.max(0,1-(this.captionElapsed-3.3)/1.2));
    }
    if(this.pickupDone&&!this.waitingForMusic&&this.player.x>CREDO_APPROACH_X){
      this.transitioned=true;
      this.app.progress.advance('ARRIVED_AT_CREDO');
      this.scene.start('Credo');return;
    }
    if(this.elapsed-this.lastSave>3){this.lastSave=this.elapsed;this.app.progress.save();}
  }
}
