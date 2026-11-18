import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const path=resolve('public/models/PRP-001-civic-receiver-v04.glb');
const file=readFileSync(path);
const dv=new DataView(file.buffer,file.byteOffset,file.byteLength);
assert.equal(file.toString('ascii',0,4),'glTF');
assert.equal(dv.getUint32(4,true),2);
assert.equal(dv.getUint32(8,true),file.length);
const jsonSize=dv.getUint32(12,true);
const gltf=JSON.parse(file.toString('utf8',20,20+jsonSize));
const binOffset=28+jsonSize;
assert.equal(dv.getUint32(16,true),0x4e4f534a);
assert.equal(dv.getUint32(24+jsonSize,true),0x004e4942);
assert.equal(gltf.asset.version,'2.0');
assert.equal(gltf.images.length,3);
assert.equal(gltf.materials.length,5);
assert.ok(gltf.meshes.length>=36);

function accessor(index){
  const acc=gltf.accessors[index], view=gltf.bufferViews[acc.bufferView];
  const typeSize={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[acc.type];
  const valueBytes={5123:2,5126:4}[acc.componentType];
  assert.ok(valueBytes,'unsupported accessor type');
  const stride=view.byteStride??typeSize*valueBytes;
  const start=binOffset+view.byteOffset+(acc.byteOffset??0);
  const read=(i,j)=>{
    const pos=start+i*stride+j*valueBytes;
    return acc.componentType===5123?dv.getUint16(pos,true):dv.getFloat32(pos,true);
  };
  return Array.from({length:acc.count},(_,i)=>
    Array.from({length:typeSize},(_,j)=>read(i,j)));
}
function score(name){
  const target=gltf.meshes.find(x=>x.name===name);
  assert.ok(target,'Required physical part missing: '+name);
  const primitive=target.primitives[0];
  const P=accessor(primitive.attributes.POSITION);
  const N=accessor(primitive.attributes.NORMAL);
  const indices=accessor(primitive.indices).map(x=>x[0]);
  let good=0,bad=0,skipped=0;
  for(let i=0;i<indices.length;i+=3){
    const [ia,ib,ic]=indices.slice(i,i+3);
    const a=P[ia],b=P[ib],c=P[ic];
    const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
    const v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
    const face=[
      u[1]*v[2]-u[2]*v[1],
      u[2]*v[0]-u[0]*v[2],
      u[0]*v[1]-u[1]*v[0]
    ];
    const normal=N[ia].map((_,k)=>(N[ia][k]+N[ib][k]+N[ic][k])/3);
    const magnitude=Math.hypot(...face);
    if(magnitude<1e-10){skipped++;continue;}
    const dot=face.reduce((acc,z,k)=>acc+z*normal[k],0);
    if(dot>0)good++;else bad++;
  }
  const ratio=good/(good+bad);
  assert.ok(ratio>.90, `${name}: inside-out triangles; outward-facing ratio ${ratio.toFixed(3)}`);
  return {name,triangles:indices.length/3,outwardRatio:Number(ratio.toFixed(4)),degenerate:skipped};
}
const results=[
  score('foundation mineral foot'),
  score('fired indigo ceramic shaft'),
  score('acoustic bell chamber'),
  score('ochre head retaining ring'),
  score('crank axle')
];
for(const image of gltf.images){
  assert.equal(image.mimeType,'image/png');
  const buffer=gltf.bufferViews[image.bufferView];
  assert.equal(file.toString('hex',binOffset+buffer.byteOffset,binOffset+buffer.byteOffset+8),
    '89504e470d0a1a0a','Embedded texture PNG should be valid');
}
console.log(JSON.stringify({geometryCheck:'passed',meshes:gltf.meshes.length,materials:gltf.materials.length,textures:gltf.images.length,results},null,2));
