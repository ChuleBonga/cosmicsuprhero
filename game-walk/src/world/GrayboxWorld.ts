import Phaser from 'phaser';

export const WORLD_WIDTH = 120000;
export const TILE_WIDTH = 960;
export const PARALLAX_SPEEDS = [0.03, 0.09, 0.22, 0.48, 0.78] as const;
export interface WorldPreview {
  groundY: number;
  update(cameraX: number): void;
}
/** BUILD 1 PLACEHOLDER world. Pixel-grid, pre-rendered, tiling dunes. */
export function buildWorld(scene: Phaser.Scene): WorldPreview {
  const W = scene.scale.width, H = scene.scale.height;
  const groundY = Math.floor(H * (H > W ? .82 : .78));
  const colors = [0x122047,0x24325a,0x433858,0x765037,0x302441];
  const planes: Phaser.GameObjects.TileSprite[] = [];
  const repeatH = Math.ceil(H);
  for (let layer = 0; layer < 5; layer++) {
    const key = 'build1-plane-' + layer + '-' + H;
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      if (layer === 0) {
        g.fillStyle(0x101c3c).fillRect(0,0,TILE_WIDTH,repeatH);
        for (let i=0;i<64;i++) {
          const x=(i*197+47)%TILE_WIDTH, y=(i*53+13)%Math.max(30,Math.floor(H*.46));
          g.fillStyle(i%6===0?0xd8a05c:0x93a4c1).fillRect(x,y,i%11===0?2:1,1);
          if(i%17===0){g.fillRect(x-2,y,5,1);g.fillRect(x,y-2,1,5);}
        }
      } else {
        const base=groundY-(4-layer)*Math.max(8,Math.floor(H*.07));
        g.fillStyle(colors[layer]);
        g.beginPath();g.moveTo(0,H);
        for(let x=0;x<=TILE_WIDTH;x+=2){
          const t=x/TILE_WIDTH*Math.PI*2;
          const a=Math.floor(8+layer*3);
          const y=Math.floor(base + Math.sin(t*(layer+1))*a + Math.cos(t*2)*a*.36);
          g.lineTo(x,y);
        }
        g.lineTo(TILE_WIDTH,H);g.closePath();g.fillPath();
        const dot=layer===4?0xc39254:0x6c6386;
        g.fillStyle(dot,(layer===4 ? .42 : .15));
        for(let x=0;x<TILE_WIDTH;x+=8)for(let y=Math.floor(base+22);y<H;y+=8) {
          if(((x/8)*3+(y/8)*7)%5===0)g.fillRect(x,y,2,2);
        }
      }
      g.generateTexture(key,TILE_WIDTH,repeatH);g.destroy();
    }
    const plane=scene.add.tileSprite(0,0,W,H,key).setOrigin(0).setScrollFactor(0).setDepth(-20+layer);
    planes.push(plane);
  }
  // Sun is fixed in the sky and assembled from hard-edged pixel squares, not a blur.
  const sun=scene.add.graphics().setScrollFactor(0).setDepth(-18.5);
  const sx=Math.floor(W*.70),sy=Math.floor(H*(H>W?.23:.24)),radius=H>W?27:21;
  for(let y=-radius;y<=radius;y+=2)for(let x=-radius;x<=radius;x+=2){
    if(x*x+y*y<=radius*radius){
      const tint=y<0?0xe84a24:y<radius*.6?0xd03c27:0xb83129;
      sun.fillStyle(tint).fillRect(sx+x,sy+y,2,2);
    }
  }
  const update=(cameraX:number)=>{
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    planes.forEach((plane,i)=>{plane.tilePositionX=reduce?0:Math.floor(cameraX*PARALLAX_SPEEDS[i]);});
  };
  update(0);
  return {groundY,update};
}
