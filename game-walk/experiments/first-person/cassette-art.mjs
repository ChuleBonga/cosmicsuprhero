/**
 * First Contact / archival compact cassette.
 * Original physical music media, not a generic crystal or rotating loot token.
 * Art model in convenient local coordinates, scaled to 0.095 at rest (~15cm wide).
 * Inspector magnifies the exact same asset, preserving its visible details.
 */
import * as THREE from 'three';
export const CASSETTE_SCALE=.095;
const pbr=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const charcoal=pbr(0x202c39,.72),edge=pbr(0x111a27,.63),oxide=pbr(0x9b826d,.48,.55);
const reelMaterial=pbr(0x465465,.55,.2),tapeMaterial=pbr(0x171718,.96),amber=pbr(0xba8c5d,.56,.3);
const rounded=(width,height,r)=>{
 const x=-width/2,y=-height/2;
 const s=new THREE.Shape();
 s.moveTo(x+r,y);s.lineTo(x+width-r,y);s.quadraticCurveTo(x+width,y,x+width,y+r);
 s.lineTo(x+width,y+height-r);s.quadraticCurveTo(x+width,y+height,x+width-r,y+height);
 s.lineTo(x+r,y+height);s.quadraticCurveTo(x,y+height,x,y+height-r);
 s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 return s;
};
function makeLabel(){
 // Only a small legible media label is rendered to Canvas2D at startup.
 // This is not a procedural terrain surface or a downloaded recording.
 if(typeof document==='undefined'){
  return new THREE.MeshBasicMaterial({color:0xcab79d,side:THREE.DoubleSide});
 }
 const c=document.createElement('canvas');c.width=768;c.height=256;
 const ctx=c.getContext('2d');
 ctx.fillStyle='#dac9aa';ctx.fillRect(0,0,768,256);
 ctx.fillStyle='#b8553e';ctx.fillRect(0,0,768,16);ctx.fillRect(0,240,768,16);
 ctx.fillStyle='#2b3549';ctx.font='700 43px Arial';ctx.fillText('FIRST CONTACT',42,84);
 ctx.font='700 21px Arial';ctx.letterSpacing='2px';
 ctx.fillText('COSMICSUPRHERO',42,126);
 ctx.font='17px Arial';ctx.fillText('ARCTURIAN AWAKENING  /  ARCHIVE 01',42,159);
 ctx.fillStyle='#794637';ctx.fillRect(42,183,650,3);
 ctx.font='bold 20px Arial';ctx.fillText('A  /  RECOVERED SIGNAL',42,218);
 ctx.fillStyle='#192943';ctx.fillRect(665,43,65,65);
 ctx.fillStyle='#f2d9ba';ctx.font='bold 36px Arial';ctx.fillText('A',685,90);
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
 t.anisotropy=4;
 return new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide,toneMapped:false});
}
export function createCassetteArt(){
 const root=new THREE.Group();root.name='FIRST CONTACT / physical cassette';
 // 1.56x.93x.15 author units: world cassette displayed at scale 0.095.
 const shell=new THREE.ExtrudeGeometry(rounded(1.56,.94,.08),
  {depth:.14,bevelEnabled:true,bevelSize:.018,bevelThickness:.012,bevelSegments:2,curveSegments:5});
 shell.translate(0,0,-.07);
 const housing=new THREE.Mesh(shell,charcoal);housing.name='Opaque cassette shell';
 housing.castShadow=true;housing.receiveShadow=true;root.add(housing);
 const underside=new THREE.Mesh(new THREE.BoxGeometry(1.36,.11,.18),edge);
 underside.position.set(0,-.405,0);root.add(underside);
 // Transparent dark tape window, real circular spool apertures and spokes.
 const window=new THREE.Mesh(new THREE.BoxGeometry(1.11,.31,.016),
  new THREE.MeshPhysicalMaterial({color:0x314156,metalness:.12,roughness:.18,
    transparent:true,opacity:.82,depthWrite:false,clearcoat:.46}));
 window.position.set(0,-.147,.10);window.name='Spool viewing window';
 root.add(window);
 for(const side of [-1,1]){
  const x=side*.32;
  const dark=new THREE.Mesh(new THREE.CircleGeometry(.164,36),tapeMaterial);
  dark.position.set(x,-.15,.121);root.add(dark);
  const spool=new THREE.Mesh(new THREE.TorusGeometry(.112,.022,9,32),oxide);
  spool.position.set(x,-.15,.132);root.add(spool);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,.016,10),reelMaterial);
  hub.rotation.x=Math.PI/2;hub.position.set(x,-.15,.144);root.add(hub);
  for(let i=0;i<6;i++){
   const spoke=new THREE.Mesh(new THREE.BoxGeometry(.081,.016,.012),oxide);
   spoke.position.set(x+Math.cos(i*Math.PI/3)*.059,-.15+Math.sin(i*Math.PI/3)*.059,.149);
   spoke.rotation.z=i*Math.PI/3;root.add(spoke);
  }
 }
 // Label sits above the window and must remain legible during close inspection.
 const label=new THREE.Mesh(new THREE.PlaneGeometry(1.34,.43),makeLabel());
 label.position.set(0,.212,.112);label.name='FIRST CONTACT / COSMICSUPRHERO label';
 root.add(label);
 const lower=new THREE.Mesh(new THREE.BoxGeometry(.74,.06,.016),amber);
 lower.position.set(0,-.355,.11);root.add(lower);
 for(const x of [-.665,.665])for(const y of [-.365,.365]){
  const fastener=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.009,8),oxide);
  fastener.rotation.x=Math.PI/2;fastener.position.set(x,y,.105);root.add(fastener);
 }
 root.userData={media:'cassette',track:'First Contact',album:'Arcturian Awakening',
  playsAudio:false,physicalWidthMeters:1.56*CASSETTE_SCALE};
 return root;
}
/** A separate in-world receiving dock for the collected cassette. */
export function createRelayArt(parent,x,z,height){
 const root=new THREE.Group();root.name='Sunward receiving deck / analogue signal relay';
 root.position.set(x,height,z);parent.add(root);
 const rock=pbr(0x344868,.92),copper=pbr(0x80563e,.54,.36);
 const plinth=new THREE.Mesh(new THREE.CylinderGeometry(.63,.82,.62,12),rock);
 plinth.position.y=.32;plinth.castShadow=true;plinth.receiveShadow=true;root.add(plinth);
 const panel=new THREE.Mesh(new THREE.BoxGeometry(.51,.075,.27),copper);
 panel.position.set(0,.7,.05);panel.name='Physical cassette port';root.add(panel);
 const throat=new THREE.Mesh(new THREE.BoxGeometry(.24,.012,.065),edge);
 throat.position.set(0,.743,.05);root.add(throat);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.45,.03,7,24),copper);
 ring.position.set(0,.62,0);ring.rotation.x=Math.PI/2;root.add(ring);
 const inserted=createCassetteArt();
 inserted.name='First Contact cassette installed in relay';
 inserted.scale.setScalar(CASSETTE_SCALE);
 inserted.rotation.x=-.18;
 inserted.position.set(0,.78,.045);inserted.visible=false;root.add(inserted);
 const light=new THREE.PointLight(0xe7b47f,0,5,2);
 light.position.set(0,1.06,.1);root.add(light);
 return {root,inserted,light};
}
