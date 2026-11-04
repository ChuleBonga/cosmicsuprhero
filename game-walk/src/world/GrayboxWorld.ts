import Phaser from 'phaser';

/**
 * Authored First Contact environment.
 *
 * Painterly terrain is extracted from the artist-supplied source layers,
 * retaining thousands of colors instead of the former 10-18-color atlases.
 * Interactive landmarks have fixed world coordinates. No random spawning.
 */
export const WORLD_WIDTH = 3200;
export const FIRST_CONTACT_X = 1450;
export const CREDO_APPROACH_X = 1800;
export const PARALLAX_SPEEDS = [0.016, 0.065, 0.17, 0.38, 0.72] as const;

type Terrain = Phaser.GameObjects.TileSprite;
export interface WorldPreview {
  readonly groundY:number;
  update(cameraX:number,delta?:number):void;
  setSignalIntensity(value:number):void;
  setArrivalLighting(value:number):void;
}

export function buildWorld(scene:Phaser.Scene):WorldPreview {
  const W=scene.scale.width,H=scene.scale.height;
  const groundY=H-52;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Deep sky is painted with several color frequencies and a textured horizon.
  // Artwork never reflows with screen size: the 480×270 camera is the authoring grid.
  const sky=scene.add.tileSprite(0,0,W,H,'arrival-sky')
    .setOrigin(0).setScrollFactor(0).setDepth(-15);

  // A deterministic field of tiny points supplements, rather than replaces,
  // the high-color cosmic-vault artwork. Frame-to-frame shimmer is gentle.
  const stars=Array.from({length:58},(_,i)=>({
    x:(i*173+43)%W,y:4+(i*97)%151,
    phase:i*2.137,opacity:(i%5)*.05+.12
  }));
  const starField=scene.add.graphics().setScrollFactor(0).setDepth(-14);
  const sunX=Math.round(W*.708),sunY=Math.round(H*.345);
  const warmAtmosphere=scene.add.image(sunX,sunY,'arrival-atmosphere')
    .setOrigin(.5).setScrollFactor(0).setDisplaySize(246,246)
    .setDepth(-13.5).setAlpha(.76);
  const sun=scene.add.image(sunX,sunY,'arrival-sun')
    .setOrigin(.5).setScrollFactor(0).setDisplaySize(170,170).setDepth(-13);
  const layers:Terrain[]=[
    scene.add.tileSprite(0,0,W,H,'arrival-far').setOrigin(0).setScrollFactor(0).setDepth(-11),
    scene.add.tileSprite(0,0,W,H,'arrival-mid').setOrigin(0).setScrollFactor(0).setDepth(-9),
    scene.add.tileSprite(0,0,W,H,'arrival-near').setOrigin(0).setScrollFactor(0).setDepth(-6)
  ];
  // The grounding plane is an independent translucent rocky surface.
  const ground=scene.add.tileSprite(0,groundY-7,W,70,'arrival-ground')
    .setOrigin(0).setScrollFactor(0).setDepth(-3);
  // Real source-painted corner silhouettes sit in front of the traveler.
  // Unlike decoration on a fixed HUD, these advance slightly faster than
  // the player, strengthening the spatial read of the camera movement.
  const occluders=scene.add.tileSprite(0,0,W,H,'arrival-occluders')
    .setOrigin(0).setScrollFactor(0).setDepth(24).setAlpha(.92);

  // Original drawn detail anchors, not procedural scattering; the placements
  // are designed around the narrative stages of this vertical slice.
  const place=(frame:number,x:number,scale:number,depth:number)=>{
    return scene.add.sprite(x,groundY+6,'arrival-landmark',frame)
      .setOrigin(.5,1).setScale(scale).setDepth(depth);
  };
  place(0,335,.61,6);
  place(3,555,.45,7);
  place(2,755,.48,7);
  place(0,1060,.81,6);
  place(2,1220,.67,7);
  const monolith=place(1,1395,1.0,9);
  place(3,1660,.55,8);
  place(2,1900,.63,8);

  // Sparse, authored motes move independently and react to the discovered signal.
  // Keep them subtle: atmosphere, not a screen full of arbitrary particles.
  const motes=Array.from({length:18},(_,i)=>{
    const g=scene.add.rectangle(0,0,i%6===0?2:1,1,
      i%3===0?0xd9a979:0x6eb2aa,.2)
      .setScrollFactor(0).setDepth(5);
    return {g,x:(i*137+43)%W,y:65+(i*47)%155,speed:3.5+(i%5),phase:i*1.7};
  });
  const glyph=scene.add.graphics().setDepth(10);
  const signalGlow=scene.add.circle(FIRST_CONTACT_X,groundY-38,19,0x6dd6c0,.0).setDepth(8);
  let signal=0,arrival=0,elapsed=0;

  const setSignalIntensity=(value:number)=>{
    signal=Phaser.Math.Clamp(value,0,1);
    monolith.setTint(Phaser.Display.Color.GetColor(
      205+Math.round(50*signal),205+Math.round(37*signal),205+Math.round(25*signal)));
    signalGlow.setAlpha(signal*.19);
  };
  const setArrivalLighting=(value:number)=>{arrival=Phaser.Math.Clamp(value,0,1)};

  const update=(cameraX:number,delta=16)=>{
    const scroll=Math.max(0,cameraX);
    sky.tilePositionX=reducedMotion?0:Math.round(scroll*PARALLAX_SPEEDS[0]);
    layers.forEach((layer,i)=>{
      layer.tilePositionX=Math.round(scroll*PARALLAX_SPEEDS[i+1]+[37,174,463][i]);
    });
    ground.tilePositionX=Math.round(scroll*.96);
    occluders.tilePositionX=Math.round(scroll*1.25);
    sun.x=Math.round(sunX-(reducedMotion?0:scroll*.011));
    warmAtmosphere.x=sun.x;
    elapsed+=reducedMotion?0:Math.min(.05,delta/1000);
    sun.setAlpha(.92+arrival*.08);
    warmAtmosphere.setAlpha(.65+arrival*.21);
    starField.clear();
    for(const star of stars){
      // Low-amplitude sine wave, no random per-frame flicker or strobe.
      const shimmer=reducedMotion?.6:(.58+.28*Math.sin(elapsed*.8+star.phase));
      starField.fillStyle(0xd6d6d9,star.opacity*shimmer);
      const x=(star.x-scroll*.015%W+W)%W;
      starField.fillRect(Math.round(x),star.y,1,1);
    }
    // Once the player nears the signal, the stone begins to respond,
    // but a full reveal requires the explicit listening action.
    const nearSignal=Math.max(0,1-Math.abs(FIRST_CONTACT_X-scroll-W*.53)/320);
    const brightness=signal*Math.max(.45,nearSignal);
    glyph.clear();
    if(brightness>0.01){
      const ax=FIRST_CONTACT_X,by=groundY-80;
      glyph.lineStyle(1,0x8bd8bd,brightness*.84);
      glyph.strokeCircle(ax,by,10+signal*8);
      glyph.lineBetween(ax-13,by,ax-4,by-9);
      glyph.lineBetween(ax+5,by+8,ax+12,by+2);
    }
    signalGlow.setAlpha(Math.max(signal*.08,signal*.19));
    for(const [i,m] of motes.entries()){
      const xx=m.x+(reducedMotion?0:Math.sin(elapsed*.12+m.phase)*5);
      const yy=m.y+(reducedMotion?0:Math.sin(elapsed*.45+m.phase)*3);
      m.g.setPosition(xx,yy);
      m.g.setAlpha(.14+(i%5)*.065+(nearSignal*signal*.08));
    }
  };
  update(0);
  return {groundY,update,setSignalIntensity,setArrivalLighting};
}
