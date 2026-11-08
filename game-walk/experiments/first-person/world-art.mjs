/**
 * Original spatial art study for Arcturian Awakening.
 * Everything traversable is 3D; no screen-facing photo panels or fake parallax.
 * Deliberately NOT considered final: the authored Blender material/scan pass is pending.
 */
import * as THREE from 'three';
import {WORLD,WORLD_OBSTACLES,groundHeight,halfWidth} from './world-logic.mjs';
const seedRand=(initial)=>{let s=initial>>>0;return()=>((s=Math.imul(s,1664525)+1013904223>>>0)/4294967296)};
const rng=seedRand(20261106);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const c=(hex)=>new THREE.Color(hex);
const mat=(color,roughness=1,extra={})=>new THREE.MeshStandardMaterial({color,roughness,metalness:0,...extra});
const mesh=(parent,geometry,material,x=0,y=0,z=0)=>{
 const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=true;parent.add(m);return m;
};
function valueNoise(values,size,x,y){
 const fx=x-Math.floor(x),fy=y-Math.floor(y),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const ix=Math.floor(x),iy=Math.floor(y),read=(a,b)=>values[((b%size+size)%size)*size+(a%size+size)%size];
 return mix(mix(read(ix,iy),read(ix+1,iy),u),mix(read(ix,iy+1),read(ix+1,iy+1),u),v);
}
function materialFamily(kind){
 const size=256,r=seedRand(kind==='basalt'?55403:38071),random=new Float32Array(size*size);
 for(let i=0;i<random.length;i++)random[i]=r();
 const height=new Float32Array(random.length);
 const base=kind==='basalt'?[51,70,98]:[130,93,70];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const n1=valueNoise(random,size,x*.085,y*.085);
   const n2=valueNoise(random,size,x*.022,y*.022);
   const n3=random[y*size+x];
   const bedding=Math.sin(y*.14+Math.sin(x*.027)*3)*.075;
   const fault=(Math.sin(x*.022+y*.055+Math.sin(y*.09)*.28)>.995)?-.13:0;
   height[y*size+x]=clamp(n1*.42+n2*.43+n3*.15+bedding+fault,0,1);
 }
 function mapFromPixels(type){
  const cnv=document.createElement('canvas');cnv.width=cnv.height=size;
  const ctx=cnv.getContext('2d',{willReadFrequently:true}),id=ctx.createImageData(size,size);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const i=y*size+x,k=4*i,v=height[i],dx=height[y*size+(x+1)%size]-height[y*size+(x+size-1)%size],dy=height[((y+1)%size)*size+x]-height[((y+size-1)%size)*size+x];
   if(type==='albedo'){
    const variation=(v-.5)*112+(Math.sin(y*.07)*9);
    for(let j=0;j<3;j++)id.data[k+j]=clamp(base[j]+variation+(j===2?10:0),1,255);
   }else if(type==='normal'){
    // Avoid allocating a Vector3 per texture pixel (131,072 allocations on
    // initial load across two material families).
    const nx=-dx*6,ny=-dy*6,inv=1/Math.hypot(nx,ny,1);
    id.data[k]=(nx*inv*.5+.5)*255;
    id.data[k+1]=(ny*inv*.5+.5)*255;
    id.data[k+2]=(inv*.5+.5)*255;
   }else{
    const rough=clamp((kind==='basalt'?.81:.9)+(v-.5)*.27,.53,.99);
    id.data[k]=id.data[k+1]=id.data[k+2]=rough*255;
   }
   id.data[k+3]=255;
  }
  ctx.putImageData(id,0,0);
  const tex=new THREE.CanvasTexture(cnv);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=4;
  if(type==='albedo')tex.colorSpace=THREE.SRGBColorSpace;
  return tex;
 }
 return {albedo:mapFromPixels('albedo'),normal:mapFromPixels('normal'),roughness:mapFromPixels('roughness')};
}
function terrain(scene,stone,clay){
 const g=new THREE.PlaneGeometry(205,350,140,220);g.rotateX(-Math.PI/2);g.translate(0,0,-112);
 const p=g.attributes.position,colors=new Float32Array(p.count*3),a=c(0x825c4f),b=c(0xb79a76),d=c(0x425773),col=new THREE.Color();
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),z=p.getZ(i);
  p.setY(i,groundHeight(x,z));
  const noise=Math.sin(x*.36+z*.23)*.07+Math.sin(x*.1-z*.06)*.06;
  col.copy(a).lerp(b,clamp(.5+noise,0,1)).lerp(d,clamp((Math.abs(x)-6)/32,0,1)*.5);
  colors[3*i]=col.r;colors[3*i+1]=col.g;colors[3*i+2]=col.b;
 }
 g.setAttribute('color',new THREE.BufferAttribute(colors,3));g.computeVertexNormals();
 // Dedicated textures for terrain preserve 1x1 repeat UVs on architectural
 // and collectible materials. Prior builds accidentally tiled all ochre props.
 const terrainMaps=[clay.albedo.clone(),clay.normal.clone(),clay.roughness.clone()];
 const base=mat(0xffffff,.92,{vertexColors:true,map:terrainMaps[0],normalMap:terrainMaps[1],roughnessMap:terrainMaps[2]});
 for(const m of terrainMaps){m.repeat.set(36,64);m.needsUpdate=true;}
 const ground=mesh(scene,g,base);ground.castShadow=false;
 return {ground,textures:terrainMaps};
}
/**
 * A continuous stone face with coherent geological bedding, transverse
 * fractures and weather-softened pockets. The collider follows halfWidth(z).
 * Static topology: two meshes, not a collection of disconnected rock props.
 */
function cliffWall(scene,side,startZ,endZ,stone){
 const steps=128,rings=14,positions=[],uvs=[],colors=[],indices=[];
 const dark=c(0x283b5e),mid=c(0x536987),rim=c(0x917b71),ochre=c(0xbaa183);
 for(let s=0;s<=steps;s++){
  const z=mix(startZ,endZ,s/steps),fz=s/steps;
  const bedTilt=Math.sin(z*.035+side)*.15;
  const base=halfWidth(z)+1.12+Math.sin(z*.074+side)*.27;
  for(let h=0;h<rings;h++){
   const t=h/(rings-1),layerHeight=h*1.72;
   const sediment=Math.sin(h*2.31+z*.11)*.22+Math.sin(h*.83-z*.029)*.31;
   const shear=Math.sin(fz*70+h*2.13)*.37+Math.cos(fz*132-h*1.3)*.22;
   const fault=Math.sin(z*.056+h*.97)> .88?.55:0;
   const x=side*(base+t*10.9+shear+sediment+fault);
   const y=groundHeight(x,z)+layerHeight+bedTilt+.33*Math.sin(h*.79+fz*25);
   positions.push(x,y,z);
   uvs.push(z*.083,layerHeight*.11);
   const color=dark.clone().lerp(mid,clamp(t*.96+.07,0,1));
   const variegation=.54+.46*Math.sin(z*.067+h*2.49);
   color.lerp(rim,clamp(t*.18+variegation*.09,0,.4));
   color.lerp(ochre,Math.pow(Math.max(0,Math.sin(h*2.02+z*.12)),7)*.19);
   color.multiplyScalar(1+.065*Math.sin(z*.36+h*1.6));
   colors.push(color.r,color.g,color.b);
  }
 }
 for(let j=0;j<steps;j++)for(let h=0;h<rings-1;h++){
  const p=j*rings+h,q=(j+1)*rings+h;
  if(side===1)indices.push(p,q,p+1,q,q+1,p+1);
  else indices.push(p,p+1,q,q,p+1,q+1);
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 geo.setIndex(indices);geo.computeVertexNormals();
 const face=mat(0xffffff,.96,{side:THREE.DoubleSide,vertexColors:true,map:stone.albedo,normalMap:stone.normal,roughnessMap:stone.roughness});
 const m=mesh(scene,geo,face);m.name=side===1?'East cliff bedding':'West cliff bedding';m.castShadow=false;
 return m;
}
/**
 * Small run of ancient paving. Shapes, chipped edges and missing slabs imply
 * an engineered route slowly disappearing into the rock. 4 instanced meshes
 * (rather than hundreds of draw calls). Walk contact uses underlying terrain
 * and a sub-step (<0.1m) paved surface.
 */
function causeway(scene,stone,warm){
 const pavers=new THREE.Group();pavers.name='Buried stone causeway';scene.add(pavers);
 const geoTypes=[];
 for(let type=0;type<4;type++){
  const geometry=new THREE.BoxGeometry(1,.16,1,4,1,4);
  const pos=geometry.attributes.position;
  for(let i=0;i<pos.count;i++){
   const x=pos.getX(i),z=pos.getZ(i);
   const chipped=Math.sin(i*13.8+type*7.71)*.022+Math.cos(i*5.77+type*.9)*.013;
   pos.setX(i,x+(x>=0?1:-1)*chipped);
   pos.setZ(i,z+(z>=0?1:-1)*chipped);
   if(pos.getY(i)>0)pos.setY(i,pos.getY(i)+.018*Math.sin(i*3.61+type*1.87));
  }
  pos.needsUpdate=true;geometry.computeVertexNormals();geoTypes.push(geometry);
 }
 const o=new THREE.Object3D(),counts=[0,0,0,0],placements=[[],[],[],[]];
 const rngLocal=seedRand(74322);
 for(let row=0;row<2;row++)for(let segment=0;segment<94;segment++){
  if((segment*11+row*17)%23===0 || (segment>45&&segment<50&&row===0))continue;
  const type=(segment*7+row*3)%4;
  const z=18-segment*1.36+(rngLocal()-.5)*.11;
  const x=(row===0?-1:1)*(.81+(rngLocal()-.5)*.13);
  const wid=.96+rngLocal()*.26;
  const dep=.94+rngLocal()*.31;
  const y=groundHeight(x,z)-.08;
  o.position.set(x,y,z);o.rotation.set(0,(rngLocal()-.5)*.1,(rngLocal()-.5)*.035);
  o.scale.set(wid,1,dep);o.updateMatrix();
  placements[type].push(o.matrix.clone());counts[type]++;
 }
 const meshes=[];
 for(let i=0;i<4;i++){
  const im=new THREE.InstancedMesh(geoTypes[i],i===2?warm:stone,counts[i]);
  im.name='Causeway stone variation '+i;
  for(let k=0;k<counts[i];k++)im.setMatrixAt(k,placements[i][k]);
  im.instanceMatrix.needsUpdate=true;im.receiveShadow=true;im.castShadow=false;
  im.frustumCulled=false;pavers.add(im);meshes.push(im);
 }
 return pavers;
}
function groundDebris(scene,stone,warm){
 const root=new THREE.Group();root.name='Small geological fragments';scene.add(root);
 const r=seedRand(347817),shape=new THREE.IcosahedronGeometry(1,0),o=new THREE.Object3D();
 for(let materialId=0;materialId<2;materialId++){
  const im=new THREE.InstancedMesh(shape,materialId?warm:stone,materialId?250:380);
  for(let i=0;i<im.count;i++){
   const z=20-r()*136;
   const side=r()<.5?-1:1;
   const x=side*(1.8+r()*5.9);
   const size=.024+Math.pow(r(),2.3)*.23;
   o.position.set(x,groundHeight(x,z)+size*.24,z);
   o.rotation.set(r()*6.2,r()*6.2,r()*6.2);
   o.scale.set(size*(.6+r()*.95),size*(.23+r()*.36),size*(.6+r()*.95));
   o.updateMatrix();im.setMatrixAt(i,o.matrix);
  }
  im.instanceMatrix.needsUpdate=true;im.receiveShadow=true;im.castShadow=false;
  root.add(im);
 }
 return root;
}
function rockScatter(scene,basalt,ochre){
 const geom=new THREE.DodecahedronGeometry(.7,1),o=new THREE.Object3D(),groups=[];
 for(let set=0;set<2;set++){
  const im=new THREE.InstancedMesh(geom,set===0?basalt:ochre,440);
  let filled=0,tries=0;
  while(filled<440&&tries++<6000){
   const z=27-rng()*210,s=rng()<.5?-1:1,x=s*(4.9+rng()*55);
   if(Math.abs(x)<8&&z>-115)continue;
   const size=.19+Math.pow(rng(),2)*4.9;
   o.position.set(x,groundHeight(x,z)+size*.12,z);
   o.rotation.set(rng()*3,rng()*7,rng()*2);
   o.scale.set(size*(.6+rng()*1.2),size*(.15+rng()*.65),size*(.7+rng()*1.3));
   o.updateMatrix();im.setMatrixAt(filled++,o.matrix);
  }
  im.count=filled;im.instanceMatrix.needsUpdate=true;im.castShadow=false;im.receiveShadow=true;scene.add(im);groups.push(im);
 }
 return groups;
}
/**
 * Continuous, fractured ridge meshes instead of repeated conical mountains.
 * 3 depth layers, mesh-backed irregular crests and varying strata. Geometry
 * remains original, fully 3D, and one draw call per ridge.
 */
function mountainMass(scene){
 const root=new THREE.Group();root.name='Distant indigo fold mountains';scene.add(root);
 const layerColors=[0x1c365d,0x2b4568,0x405671,0x53637a];
 const ranges=[{z:-425,span:390,peak:74,base:-9},{z:-312,span:350,peak:62,base:-2},{z:-225,span:260,peak:39,base:0}];
 for(let layer=0;layer<ranges.length;layer++){
  const {z,span,peak,base}=ranges[layer],segments=118,depthSteps=4;
  const points=[],uv=[],colors=[],indices=[];
  const seed=seedRand(15154+layer*133);
  const peaks=Array.from({length:segments+1},(_,i)=>{
   const x=i/segments, octave=(a,b,offset)=>Math.sin(x*a+offset)*b;
   const long=Math.abs(octave(13.1,1,layer*.81)+octave(23.7,.43,1.2)+octave(31.2,.23,2.6));
   const folding=Math.pow(Math.abs(Math.sin(x*32.3+layer*.56)),2.8)*.18;
   const jag=Math.sin(x*177.+layer*4.7)*.045+Math.sin(x*91.)*.052;
   return peak*(.39+.35*long+folding+jag)+seed()*.7;
  });
  for(let j=0;j<=depthSteps;j++){
   const t=j/depthSteps;
   for(let i=0;i<=segments;i++){
    const x=(i/segments-.5)*span,shoulder=Math.max(0,1-Math.pow(Math.abs(2*i/segments-1),3));
    const relief=peaks[i]*shoulder;
    const height=base+relief*(1-.38*t);
    const zz=z-(t-.5)*16+Math.sin(i*.77+layer)*2*t;
    points.push(x,height,zz);
    uv.push(i/segments*8,t*3);
    const color=new THREE.Color(layerColors[layer]).lerp(new THREE.Color(0xa18b85),Math.pow(t,.6)*.065);
    const strata=Math.sin(i*.13+j*3.2+layer)*.034 +Math.sin(i*.5+j*.31)*.02;
    color.multiplyScalar(1+strata);
    colors.push(color.r,color.g,color.b);
   }
  }
  for(let j=0;j<depthSteps;j++)for(let i=0;i<segments;i++){
   const a=j*(segments+1)+i,b=a+1,d=a+(segments+1),c=d+1;
   indices.push(a,d,b,b,d,c);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  g.setIndex(indices);g.computeVertexNormals();
  const m=mat(0xffffff,.98,{side:THREE.DoubleSide,vertexColors:true,flatShading:true});
  const ridgeMesh=mesh(root,g,m);
  ridgeMesh.name='Fossil ridge '+(layer+1);
  ridgeMesh.castShadow=false;
 }
 return root;
}
function finGeometry(width=2.15,height=12,depth=2.9){
 const points=[],idx=[],uv=[];
 const rows=[[0,1.15,.88],[.4,1,.86],[height*.48,.82,.71],[height*.82,.7,.64],[height,.81,.7]];
 for(const [y,w,d] of rows)for(const [sx,sz] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
  points.push(sx*width*.5*w,y,sz*depth*.5*d);uv.push(sx*.5+.5,y/height);
 }
 for(let j=0;j<rows.length-1;j++)for(let k=0;k<4;k++){
  const a=j*4+k,b=j*4+(k+1)%4,c=(j+1)*4+k,d=(j+1)*4+(k+1)%4;
  idx.push(a,b,c,b,d,c);
 }
 idx.push(16,17,18,16,18,19);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
/**
 * Sunward threshold: load-bearing paired pylons, fractured transverse bridge,
 * copper-oxide inlays, and repeated original glyph units. Instancing cuts
 * decorative details to three draw calls instead of dozens.
 */
function gateway(scene,z,stone,oxide,scale=1){
 const root=new THREE.Group();root.name='Sunward threshold '+z;
 root.position.z=z;root.scale.setScalar(scale);scene.add(root);
 const h=groundHeight(0,z),pylon=finGeometry(3.6,12.4,3.8);
 const o=new THREE.Object3D();
 const rib=new THREE.InstancedMesh(new THREE.BoxGeometry(.14,.22,1.5),oxide,10);
 rib.name='Pylon structural inlays';rib.castShadow=false;rib.receiveShadow=true;
 let ri=0;
 for(const side of [-1,1]){
  const fin=mesh(root,pylon,stone,side*8.15,h,0);fin.name='Worn supporting pylon';
  fin.rotation.z=side*.048;fin.castShadow=true;
  const buttress=mesh(root,finGeometry(2.25,7.4,4.5),stone,side*10.4,h,2);
  buttress.rotation.z=side*-.18;buttress.castShadow=true;
  for(let n=0;n<5;n++){
   o.position.set(side*(7.22+n*.052),h+2+n*1.63,2.1);
   o.rotation.set(0,0,side*.13);o.scale.set(1,1,1);o.updateMatrix();
   rib.setMatrixAt(ri++,o.matrix);
  }
  const plinth=mesh(root,new THREE.BoxGeometry(4.8,.44,4.5),stone,side*8.15,h+.21,0);
  plinth.rotation.y=side*.015;plinth.castShadow=false;
 }
 rib.instanceMatrix.needsUpdate=true;root.add(rib);
 const lintel=mesh(root,new THREE.BoxGeometry(19.2,1.82,3.9),stone,0,h+12.45,0);
 lintel.castShadow=true;
 const inset=mesh(root,new THREE.BoxGeometry(15.6,.34,.14),oxide,0,h+12.46,2.04);
 inset.castShadow=false;
 const cap=mesh(root,new THREE.BoxGeometry(12.8,.24,4.5),oxide,0,h+13.58,0);
 cap.rotation.z=.014;
 const glyph=mat(0xc18c5a,.62,{metalness:.21,emissive:0x75391e,emissiveIntensity:.07});
 const marks=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,.2,.1),glyph,23);
 marks.name='Ancient original glyph strokes';
 for(let i=0;i<23;i++){
  o.position.set(-8.25+i*.75,h+12.42,2.17);
  o.rotation.set(0,0,i%2?.31:-.31);
  o.scale.set(1,1+(i%3)*.45,1);o.updateMatrix();marks.setMatrixAt(i,o.matrix);
 }
 marks.instanceMatrix.needsUpdate=true;root.add(marks);
 // Hairline expansion joints support a plausible construction history.
 const joint=new THREE.InstancedMesh(new THREE.BoxGeometry(.055,.78,.06),glyph,8);
 for(let i=0;i<8;i++){
  o.position.set(-6.8+i*1.91,h+12.49,2.01);
  o.rotation.set(0,0,(i%2?-.05:.05));o.scale.set(1,1,1);o.updateMatrix();joint.setMatrixAt(i,o.matrix);
 }
 joint.instanceMatrix.needsUpdate=true;root.add(joint);
 return {root,glyph};
}
function artifact(scene,stone,oxide){
 const root=new THREE.Group();root.position.set(WORLD.artifact.x,groundHeight(WORLD.artifact.x,WORLD.artifact.z),WORLD.artifact.z);scene.add(root);
 const pedestal=mesh(root,new THREE.CylinderGeometry(2.14,2.36,.35,12),stone,0,.18,0);pedestal.castShadow=true;
 mesh(root,new THREE.CylinderGeometry(1.85,2.05,.23,12),oxide,0,.48,0);
 const base=mesh(root,new THREE.CylinderGeometry(1.45,1.75,1.6,10),stone,0,1.38,0);base.castShadow=true;
 base.rotation.y=Math.PI/10;
 const ring=mesh(root,new THREE.TorusGeometry(1.24,.13,9,48),oxide,0,2.3,0);
 ring.rotation.x=Math.PI/2;
 const core=new THREE.Group();core.position.set(0,2.25,0);root.add(core);
 // Original sculpture: stone carapace, enclosed cobalt glass core, four asymmetrical binding fins.
 const shell=mesh(core,new THREE.IcosahedronGeometry(.74,2),mat(0x1c3554,.42,{metalness:.17}),0,.44,0);
 const glass=mesh(core,new THREE.OctahedronGeometry(.42,1),mat(0x8aa5bc,.26,{metalness:.31,emissive:0x23334a,emissiveIntensity:.18}),0,.55,.28);
 for(let i=0;i<4;i++){
  const fin=mesh(core,new THREE.BoxGeometry(.17,1.1,.36),oxide,Math.sin(i*Math.PI/2)*.63,.31,Math.cos(i*Math.PI/2)*.63);
  fin.rotation.set(.14*i,i*Math.PI/2,.14*Math.sin(i));
 }
 const bezel=mesh(core,new THREE.TorusGeometry(.72,.07,8,48),oxide,0,.43,0);bezel.rotation.x=.42;
 const light=new THREE.PointLight(0xf0a16e,1.35,9,2);light.position.set(0,3.0,0);root.add(light);
 return {root,core,light};
}
// Standing stones and fallen architecture share their positions with
// world-logic.mjs collider definitions, keeping visual and physical space aligned.
function spatialObstacles(scene,stone,oxide,warm){
 const group=new THREE.Group();group.name='Physical path landmarks';scene.add(group);
 for(const data of WORLD_OBSTACLES){
  if(data.id==='first-contact-plinth')continue;
  const baseY=groundHeight(data.x,data.z);
  const tower=new THREE.Group();tower.name=data.id;
  tower.position.set(data.x,baseY,data.z);group.add(tower);
  if(data.id==='fallen-spire'){
   const base=mesh(tower,new THREE.CylinderGeometry(1.08,1.28,.42,9),stone,0,.24,0);
   base.castShadow=true;
   const shaft=mesh(tower,finGeometry(1.75,4.8,1.9),stone,-.15,.4,0);
   shaft.rotation.z=-.25;shaft.rotation.x=.1;shaft.castShadow=true;
   const rim=mesh(tower,new THREE.CylinderGeometry(.76,.83,.21,10),oxide,-.1,1.0,.25);
   rim.rotation.z=.85;
  }else{
   const left=data.id==='west-waystone';
   const h=left?6.4:8.6;
   const slab=mesh(tower,finGeometry(1.4,h,1.45),stone,0,0,0);
   slab.rotation.z=left?-.09:.065;slab.castShadow=true;
   const base=mesh(tower,new THREE.CylinderGeometry(data.radius*.86,data.radius*.97,.4,11),warm,0,.16,0);
   base.castShadow=true;
   for(let n=0;n<6;n++){
    const stripe=mesh(tower,new THREE.BoxGeometry(.09,.11,.09),oxide,.1+(n%2)*.22,1.2+n*.55,.78);
    stripe.rotation.z=n%2?.3:-.2;
   }
  }
 }
 return group;
}
// A distant, full-geometry landmark provides a stable scale reference.
// Its irregular, missing spans reveal the structure's age; it cannot be reached
// during this short preview, so no invisible collider is placed nearby.
function horizonArray(scene,stone,oxide,warm){
 const group=new THREE.Group();group.name='Horizon Array / distant monumental landmark';
 group.position.set(0,groundHeight(0,-167),-167);group.rotation.y=.11;scene.add(group);
 const radius=16.6;
 const segments=15;
 for(let i=0;i<segments;i++){
  if(i===3||i===9||i===10)continue; // intentional historical fractures
  const gap=.031+(i%5)*.003;
  const angle=i*Math.PI*2/segments+gap;
  const arc=Math.PI*2/segments-2*gap;
  const section=mesh(group,new THREE.TorusGeometry(radius,1.28,8,14,arc),i%4===0?oxide:stone,0,20,0);
  section.rotation.z=angle;
  section.castShadow=false;
  if(i%4===0){
   const bond=mesh(group,new THREE.BoxGeometry(1.2,3.1,1.55),warm,
     Math.cos(angle+arc*.5)*(radius+1.2),
     20+Math.sin(angle+arc*.5)*(radius+1.2),-.15);
   bond.rotation.z=angle+arc*.5-Math.PI/2;
  }
 }
 for(const side of [-1,1]){
  const pile=mesh(group,finGeometry(4.3,16,5.1),stone,side*17.1,0,.2);
  pile.rotation.z=side*-.11;
  pile.castShadow=false;
  const footing=mesh(group,new THREE.CylinderGeometry(5.2,5.8,1.6,12),oxide,side*17.1,.5,.2);
  footing.castShadow=false;
 }
 const crown=mesh(group,new THREE.BoxGeometry(4.4,1.55,5),oxide,0,39,0);
 crown.rotation.z=.13;
 return group;
}
function sky(scene){
 const geo=new THREE.SphereGeometry(800,48,26);
 const material=new THREE.ShaderMaterial({
  side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{warm:{value:0}},
  vertexShader:`varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`varying vec3 vDir;uniform float warm;
  void main(){vec3 d=normalize(vDir);float horizon=clamp(d.y*.87+.31,0.,1.);
   vec3 blue=vec3(.014,.044,.16),indigo=vec3(.045,.115,.28),dust=vec3(.24,.17,.18);
   vec3 col=mix(dust,indigo,smoothstep(.05,.53,horizon));
   col=mix(col,blue,smoothstep(.46,.96,horizon));
   vec3 sunDir=normalize(vec3(-.32,.16,-1.));
   float cd=dot(d,sunDir);
   float halo=pow(max(cd,0.),32.);
   float disc=smoothstep(.969,.974,cd),core=smoothstep(.983,.988,cd);
   float edge=sin(atan(d.y,d.x)*16.+d.y*36.)*.0014;
   disc=smoothstep(.968+edge,.974+edge,cd);
   col+=vec3(.29,.064,.014)*halo*.7;
   col=mix(col,vec3(.75,.105,.025),disc);
   col=mix(col,vec3(.99,.22,.042),core*.55);
   col+=warm*vec3(.08,.025,.01);
   gl_FragColor=vec4(col,1.);}`
 });
 const sphere=new THREE.Mesh(geo,material);sphere.renderOrder=-100;sphere.frustumCulled=false;scene.add(sphere);
 return {sphere,material};
}
export function createWorldArt(scene){
 const root=new THREE.Group();root.name='The Sunward Causeway / original art study';scene.add(root);
 const basalt=materialFamily('basalt'),ochre=materialFamily('ochre');
 const stone=mat(0xa3b0c4,.94,{map:basalt.albedo,normalMap:basalt.normal,roughnessMap:basalt.roughness});
 const warm=mat(0xdfb39a,.96,{map:ochre.albedo,normalMap:ochre.normal,roughnessMap:ochre.roughness});
 const oxide=mat(0x3c4b60,.76,{metalness:.18});
 const terrainData=terrain(root,basalt,ochre);
 causeway(root,stone,warm);groundDebris(root,stone,warm);
 cliffWall(root,1,40,-190,basalt);cliffWall(root,-1,40,-190,basalt);
 rockScatter(root,stone,warm);mountainMass(root);
 const gateways=[gateway(root,-13,stone,oxide,1),gateway(root,-78,stone,oxide,.78)];
 spatialObstacles(root,stone,oxide,warm);
 horizonArray(root,stone,oxide,warm);
 const relic=artifact(root,stone,oxide);const skies=sky(scene);
 const exitStone=mesh(root,new THREE.CylinderGeometry(5.6,6.1,.32,20),warm,0,groundHeight(0,-110)+.11,-110);exitStone.castShadow=false;
 // Shared iconography becomes a material language across the route.
 const shards=new THREE.InstancedMesh(new THREE.TetrahedronGeometry(.025),mat(0xd3a485,.95),160);
 const dummy=new THREE.Object3D();
 for(let i=0;i<160;i++){
  const x=(rng()-.5)*27,z=26-rng()*160,y=groundHeight(x,z)+.3+rng()*11;
  dummy.position.set(x,y,z);dummy.scale.setScalar(.5+rng()*2.4);dummy.rotation.y=rng()*5;
  dummy.updateMatrix();shards.setMatrixAt(i,dummy.matrix);
 }
 shards.instanceMatrix.needsUpdate=true;shards.frustumCulled=false;shards.castShadow=false;root.add(shards);
 const maps=[basalt.albedo,basalt.normal,basalt.roughness,ochre.albedo,ochre.normal,ochre.roughness,...terrainData.textures];
 return {root,sky:skies,artifact:relic,
  reveal(progress){
   const t=clamp(progress,0,1);
   for(const g of gateways)g.glyph.emissiveIntensity=.07+t*.62;
  },
  dispose(){
  root.traverse(o=>{if(o.geometry)o.geometry.dispose()});
  for(const tex of maps)tex.dispose();skies.sphere.geometry.dispose();skies.material.dispose();
 }};
}
