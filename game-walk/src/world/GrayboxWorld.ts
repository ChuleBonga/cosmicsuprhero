import Phaser from 'phaser';

// Artist-supplied source drawings, manually keyed, palette-reduced and tiled.
// This replaces the mathematical-sine-wave graybox. The reflective joins are
// still ART REVIEW candidates and must be visually checked before approval.
export const WORLD_WIDTH = 120_000;
export const PARALLAX_SPEEDS = [0.018, 0.075, 0.21, 0.49, 0.78] as const;
export interface WorldPreview { groundY: number; update(cameraX: number): void; }

export function buildWorld(scene: Phaser.Scene): WorldPreview {
  const W=scene.scale.width,H=scene.scale.height;
  const groundY=Math.round(H - (H>W ? 75 : 57));
  const offsetY=H-270;
  const starsKey='art-stars-' + H;
  if(!scene.textures.exists(starsKey)){
    const g=scene.make.graphics({x:0,y:0});
    for(let i=0;i<86;i++){
      const x=(i*239+41)%960,y=(i*59+13)%Math.min(H,250);
      g.fillStyle(i%9===0?0xd2a776:0x859bbc, i%7===0?.73:.35);
      g.fillRect(x,y,i%23===0?2:1,1);
      if(i%19===0){g.fillRect(x-2,y,5,1);g.fillRect(x,y-2,1,5);}
    }
    g.generateTexture(starsKey,960,Math.max(270,H));g.destroy();
  }
  const starLayer=scene.add.tileSprite(0,0,W,H,starsKey)
    .setOrigin(0).setScrollFactor(0).setDepth(-12);
  const mountainKeys=['far-tile','middle-tile','near-tile'] as const;
  const landscape=mountainKeys.map((key,index)=>
    scene.add.tileSprite(0,offsetY,W,270,key)
      .setOrigin(0).setScrollFactor(0).setDepth(-10+index*2)
  );
  // The sun's stepped pixels are intentional. No smooth gradient, blur, or shader.
  const sun=scene.add.graphics().setScrollFactor(0).setDepth(-11);
  const cx=Math.round(W*.71),cy=Math.round((H>W?H*.26:H*.25)),r=H>W?25:30;
  for(let y=-r-8;y<r+8;y+=2)for(let x=-r-8;x<r+8;x+=2){
    const d=x*x+y*y;
    if(d<r*r) {sun.fillStyle(y>r*.5?0x9f2d1d:0xcf2f00);sun.fillRect(cx+x,cy+y,2,2);}
    else if(d<(r+8)*(r+8) && (x+y)%9===0){sun.fillStyle(0xc76b2b,.36);sun.fillRect(cx+x,cy+y,2,2);}
  }
  const dustKey='art-ground-dust-'+W;
  if(!scene.textures.exists(dustKey)){
    const g=scene.make.graphics({x:0,y:0});
    for(let i=0;i<165;i++){
      const x=(i*61+13)%960,y=(i*19+7)%17;
      g.fillStyle(i%4===0?0xd38a48:0x815132, i%3===0?.45:.22);
      g.fillRect(x,y,i%11===0?3:2,1);
    }
    g.generateTexture(dustKey,960,18);g.destroy();
  }
  const lowDust=scene.add.tileSprite(0,H-19,W,18,dustKey)
    .setOrigin(0).setScrollFactor(0).setDepth(-2);
  const update=(cameraX:number)=>{
    const stationary=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scroll=stationary?0:Math.max(0,cameraX);
    starLayer.tilePositionX=Math.floor(scroll*PARALLAX_SPEEDS[0]);
    landscape.forEach((plane,i)=>{plane.tilePositionX=Math.floor(scroll*PARALLAX_SPEEDS[i+1]+[0,137,59][i]);});
    lowDust.tilePositionX=Math.floor(scroll*PARALLAX_SPEEDS[4]);
  };
  update(0);
  return {groundY,update};
}
