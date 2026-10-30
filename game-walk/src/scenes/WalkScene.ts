import Phaser from 'phaser';
import type {GameContext} from '../main';
import {buildWorld,WORLD_WIDTH} from '../world/GrayboxWorld';
export class WalkScene extends Phaser.Scene{
  private app!:GameContext;private player!:Phaser.GameObjects.Container;private legs!:Phaser.GameObjects.Graphics;private body!:Phaser.GameObjects.Graphics;private speed=0;private walkDistance=0;private held: -1|0|1=0;private pointerId:number|null=null;private arrows?:Phaser.Types.Input.Keyboard.CursorKeys;private keys?:Record<string,Phaser.Input.Keyboard.Key>;
  private pickup!:Phaser.GameObjects.Container;private status!:Phaser.GameObjects.Text;private tip!:Phaser.GameObjects.Text;private hud!:Phaser.GameObjects.Text;private pickupTriggered=false;private elapsed=0;private fpsSlow=0;private groundY=0;private lastSave=0;
  constructor(){super('Walk')}
  create(){this.app=this.registry.get('app') as GameContext;
    this.groundY=buildWorld(this).groundY;this.cameras.main.setZoom(1);
    const worldX=220;this.player=this.add.container(worldX,this.groundY-4).setDepth(4);this.body=this.add.graphics();this.legs=this.add.graphics();this.player.add([this.legs,this.body]);this.drawPlayer(0);
    this.cameras.main.startFollow(this.player,true,.075,.075,-Math.min(85,this.scale.width*.2),-this.scale.height*.11);this.cameras.main.setBounds(0,0,WORLD_WIDTH,this.scale.height);
    this.arrows=this.input.keyboard?.createCursorKeys();this.keys=this.input.keyboard?.addKeys('A,D,M,R') as Record<string,Phaser.Input.Keyboard.Key>|undefined;
    this.input.on('pointerdown',(p:Phaser.Input.Pointer)=>{this.pointerId=p.id;this.held=p.x<this.scale.width/2?-1:1});
    this.input.on('pointermove',(p:Phaser.Input.Pointer)=>{if(this.pointerId===p.id&&p.isDown)this.held=p.x<this.scale.width/2?-1:1});
    for(const name of ['pointerup','pointerupoutside','gameout'])this.input.on(name,()=>{this.pointerId=null;this.held=0});
    this.input.keyboard?.on('keydown-M',()=>{this.app.progress.setMuted(!this.app.progress.muted);this.app.audio.setMuted(this.app.progress.muted);this.status.setText(this.app.progress.muted?'Sound muted':'Sound enabled')});
    this.input.keyboard?.on('keydown-R',()=>{this.app.progress.reset();this.status.setText('Progress reset. Walk to recover the memory.')});
    const star=this.add.graphics();star.fillStyle(0xf9d491,.13).fillCircle(0,0,49);star.lineStyle(2,0xf9d491,.9).strokeCircle(0,0,23);star.lineBetween(-15,0,15,0);star.lineBetween(0,-15,0,15);
    this.pickup=this.add.container(1160,this.groundY-73,[star]).setDepth(3);
    this.add.text(1160,this.groundY-145,'FIRST CONTACT',{fontFamily:'Arial,sans-serif',fontSize:'18px',color:'#ffe5bd',letterSpacing:2}).setOrigin(.5).setDepth(3);
    this.hud=this.add.text(25,22,'0 m  /  THE SOUND IS ASLEEP',{fontFamily:'Arial,sans-serif',fontSize:this.scale.width<520?'12px':'16px',color:'#fff2dc',stroke:'#171c40',strokeThickness:3}).setScrollFactor(0).setDepth(40);
    this.tip=this.add.text(this.scale.width/2,this.scale.height-32,'HOLD LEFT / RIGHT TO WALK   ·   RELEASE TO STOP',{fontFamily:'Arial,sans-serif',fontSize:this.scale.width<520?'12px':'16px',color:'#fff3e3',stroke:'#181d45',strokeThickness:4}).setOrigin(.5).setScrollFactor(0).setDepth(40);
    this.status=this.add.text(this.scale.width/2,72,'A PLACE TO BEGIN — GRAY-BOX ART / NOT FINAL',{fontFamily:'Arial,sans-serif',fontSize:this.scale.width<520?'10px':'13px',color:'#f5dcaf',stroke:'#101735',strokeThickness:3}).setOrigin(.5).setScrollFactor(0).setDepth(40);
    this.app.audio.setMuted(this.app.progress.muted);
    this.game.events.on(Phaser.Core.Events.HIDDEN,this.onHidden,this);
    this.game.events.on(Phaser.Core.Events.VISIBLE,this.onVisible,this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.game.events.off(Phaser.Core.Events.HIDDEN,this.onHidden,this);this.game.events.off(Phaser.Core.Events.VISIBLE,this.onVisible,this)});
  }
  private onHidden(){this.app.audio.pause();this.game.loop.sleep()}
  private onVisible(){this.game.loop.wake();this.app.audio.resume()}
  private drawPlayer(stride:number){this.legs.clear();this.body.clear();const swing=Math.sin(stride)*9;
    this.legs.lineStyle(9,0x242954,1);this.legs.lineBetween(-6,-25,-8+swing,0);this.legs.lineBetween(7,-25,7-swing,0);
    this.body.fillStyle(0x38235b,1);this.body.fillRoundedRect(-19,-74,38,50,11);
    this.body.fillStyle(0x225d88,1);this.body.fillCircle(0,-87,15);this.body.fillStyle(0x68315b,.9);this.body.fillTriangle(-18,-62,-28,-22,17,-22);
  }
  update(time:number,dt:number){const delta=Math.min(dt/1000,.04);this.elapsed+=delta;
    const k=this.keys;const keyboardLeft=Boolean(this.arrows?.left.isDown||k?.A?.isDown),keyboardRight=Boolean(this.arrows?.right.isDown||k?.D?.isDown);
    const axis=(keyboardRight?1:0)-(keyboardLeft?1:0)||this.held;
    const accel=590,brake=950,maxSpeed=210;
    const target=axis*maxSpeed;const change=Math.min(Math.abs(target-this.speed),(axis?accel:brake)*delta);this.speed+=Math.sign(target-this.speed)*change;
    const before=this.player.x;this.player.x=Phaser.Math.Clamp(this.player.x+this.speed*delta,100,WORLD_WIDTH-100);
    this.walkDistance+=Math.abs(this.player.x-before);
    this.drawPlayer(this.elapsed*12*(Math.abs(this.speed)/maxSpeed));this.player.scaleX=this.speed<-.5?-1:1;
    const travel=Math.min(this.walkDistance/1900,1);this.app.audio.setTravel(travel);this.app.progress.setDistance(this.walkDistance);
    if(!this.pickupTriggered&&Math.abs(this.player.x-this.pickup.x)<46){this.pickupTriggered=true;this.pickup.setVisible(false);this.app.progress.discover('first_contact');this.status.setText('FIRST CONTACT FOUND — AWAKEN NOW DUCKS');void this.app.audio.playPickup(()=>this.status.setText('The memory has passed. Keep walking.'));}
    const bright=Math.round(travel*100);this.hud.setText(`${Math.round(this.walkDistance)} m   /   AWAKENING ${bright}%${this.pickupTriggered?'   /   FIRST CONTACT RECOVERED':''}`);
    this.pickup.y=this.groundY-73+Math.sin(time*.0026)*8;
    if(this.elapsed>4){this.tip.setText('HOLD TO WALK   ·   MUSIC OPENS WITH DISTANCE   ·   M = MUTE')}
    // Device heat guard. We measure frame duration and aim 60; if sustained poor, fall back to 30.
    if(dt>30)this.fpsSlow+=delta;else this.fpsSlow=Math.max(0,this.fpsSlow-delta*.5);
    if(this.fpsSlow>3&&this.game.loop.targetFps!==30){this.game.loop.targetFps=30;this.status.setText('Reduced motion for performance');}
    if(time-this.lastSave>1200&&Math.abs(this.speed)>1){this.lastSave=time;this.app.progress.save()}
  }
}
