import Phaser from 'phaser';
/** The five registered visual layers are procedural gray-box art, NOT final album illustrations. */
export const WORLD_WIDTH=3400;



const seed=(x:number)=>Math.sin(x*.012)*.5+.5;
export function buildWorld(scene:Phaser.Scene){
  const VIEW_HEIGHT=scene.scale.height; const GROUND_Y=VIEW_HEIGHT*.78;
  const rng=(index:number,x:number)=>Math.sin(x*.009+index*3)*Math.cos(x*.0027+index)*.5;
  const layer=(depth:number,scroll:number)=>scene.add.graphics().setDepth(depth).setScrollFactor(scroll,1);
  // L1 sky: always fills. Scroll factor 0.02.
  const sky=layer(-10,.02);sky.fillGradientStyle(0x1f3b89,0x253d90,0x384c9e,0x2b448d,1);sky.fillRect(-500,0,WORLD_WIDTH+2500,VIEW_HEIGHT);for(let i=0;i<85;i++){const x=(i*191+63)%4800,y=26+(i*37)%270;sky.fillStyle(0xffdb9c,.11+(i%4)*.05);sky.fillCircle(x,y,.5+(i%3)*.5)}
  // L2 glowing orange sun (procedural circle for geometry-test only).
  const sun=layer(-9,.1);sun.fillStyle(0xef741f,.07);sun.fillCircle(700,VIEW_HEIGHT*.25,92);sun.fillStyle(0xf08c26,.9);sun.fillCircle(700,VIEW_HEIGHT*.25,46);
  // L3 distant mountains / scroll 0.24.
  const far=layer(-8,.24);far.fillStyle(0x35468d,1);far.beginPath();far.moveTo(-500,VIEW_HEIGHT);for(let x=-500;x<5500;x+=36){const y=VIEW_HEIGHT*.49+Math.sin(x*.005)*48+Math.sin(x*.012)*21+rng(2,x)*18;far.lineTo(x,y)}far.lineTo(5500,VIEW_HEIGHT);far.closePath();far.fillPath();
  // L4 mid-ground / scroll 0.52.
  const mid=layer(-7,.52);mid.fillStyle(0x30326a,1);mid.beginPath();mid.moveTo(-500,VIEW_HEIGHT);for(let x=-500;x<5500;x+=30){const y=VIEW_HEIGHT*.61+Math.sin(x*.006+1)*44+Math.cos(x*.018)*14;mid.lineTo(x,y)}mid.lineTo(5500,VIEW_HEIGHT);mid.closePath();mid.fillPath();
  for(let x=-300;x<5300;x+=37){const y=VIEW_HEIGHT*.635+Math.sin(x*.006+1)*44+Math.cos(x*.018)*14;mid.lineStyle(1,0xc6a05a,.14);mid.lineBetween(x,y+6,x-26,y+26)}
  // L5 near ridge scroll .78 and actual physical ground scroll 1.0.
  const near=layer(-4,.78);near.fillStyle(0x23275e,1);near.beginPath();near.moveTo(-500,VIEW_HEIGHT);for(let x=-500;x<5500;x+=23){near.lineTo(x,VIEW_HEIGHT*.71+Math.sin(x*.009)*22+rng(4,x)*10)}near.lineTo(5500,VIEW_HEIGHT);near.closePath();near.fillPath();
  const ground=scene.add.graphics().setScrollFactor(1).setDepth(-2);
  ground.fillStyle(0x29315a);ground.fillRect(-500,GROUND_Y,5000,VIEW_HEIGHT-GROUND_Y);
  ground.lineStyle(3,0xd6a44e,.9);ground.lineBetween(-500,GROUND_Y,WORLD_WIDTH+500,GROUND_Y);
  ground.lineStyle(1,0xb88e4b,.2);for(let x=0;x<WORLD_WIDTH;x+=41){const r=seed(x);ground.lineBetween(x,GROUND_Y+11+r*8,x+11,GROUND_Y+12+r*11)}
  scene.cameras.main.setBounds(0,0,WORLD_WIDTH,VIEW_HEIGHT);
  return {sky,sun,far,mid,near,ground,groundY:GROUND_Y};
}
