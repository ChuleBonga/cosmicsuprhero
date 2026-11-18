import{writeFileSync,mkdirSync}from'node:fs';import{dirname,join}from'node:path';import{fileURLToPath}from'node:url';
function buildAsset(){
  const textEncode=s=>Uint8Array.from(Array.from(s).map(ch=>ch.charCodeAt(0)));
  const nrm=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;return[x/l,y/l,z/l]};
  const materials=[
   {name:"PBR_indigo_ceramic",pbrMetallicRoughness:{baseColorTexture:{index:0},roughnessFactor:.84,metallicFactor:.03}},
   {name:"PBR_ochre_stone",pbrMetallicRoughness:{baseColorTexture:{index:1},roughnessFactor:.9,metallicFactor:0}},
   {name:"PBR_burgundy_wrapping",pbrMetallicRoughness:{baseColorTexture:{index:2},roughnessFactor:.94,metallicFactor:0}},
   {name:"PBR_weathered_bronze",pbrMetallicRoughness:{baseColorFactor:[.16,.08,.047,1],metallicFactor:.68,roughnessFactor:.54}},
   {name:"PBR_dark_diaphragm",pbrMetallicRoughness:{baseColorFactor:[.017,.022,.035,1],metallicFactor:0,roughnessFactor:.95}}
  ];
  const bin=[],views=[],accessors=[],meshes=[],nodes=[],images=[];
  const pack=(data,t)=>{while(bin.length%4)bin.push(0);const i=views.push({buffer:0,byteOffset:bin.length,byteLength:data.length,...(t?{target:t}:{})})-1;for(let k=0;k<data.length;k++)bin.push(data[k]);return i};
  const floats=a=>{const x=new Uint8Array(a.length*4),d=new DataView(x.buffer);for(let i=0;i<a.length;i++)d.setFloat32(4*i,a[i],true);return x};
  const ints=a=>{const x=new Uint8Array(a.length*2),d=new DataView(x.buffer);for(let i=0;i<a.length;i++)d.setUint16(2*i,a[i],true);return x};
  const acc=(a,type)=>{const n=type==="VEC3"?a.length/3:a.length/2;const e={bufferView:pack(floats(a),34962),componentType:5126,type,count:n};if(type==="VEC3"){e.min=[1e20,1e20,1e20];e.max=[-1e20,-1e20,-1e20];for(let i=0;i<n;i++)for(let j=0;j<3;j++){e.min[j]=Math.min(e.min[j],a[i*3+j]);e.max[j]=Math.max(e.max[j],a[i*3+j])}}return accessors.push(e)-1};
  const mesh=(name,P,N,U,I,material)=>{const attrs={POSITION:acc(P,"VEC3"),NORMAL:acc(N,"VEC3"),TEXCOORD_0:acc(U,"VEC2")};const indexAcc=accessors.push({bufferView:pack(ints(I),34963),componentType:5123,type:"SCALAR",count:I.length})-1;const m=meshes.push({name,primitives:[{attributes:attrs,indices:indexAcc,material}]})-1;nodes.push({name,mesh:m})};
  const lathe=(name,profile,material)=>{const P=[],N=[],U=[],I=[],n=48;for(let j=0;j<profile.length;j++){const [r,y]=profile[j],a=profile[Math.max(j-1,0)],b=profile[Math.min(j+1,profile.length-1)];for(let i=0;i<=n;i++){const th=i*2*Math.PI/n,c=Math.cos(th),s=Math.sin(th);P.push(r*c,y,r*s);N.push(...nrm((b[1]-a[1])*c,-(b[0]-a[0]),(b[1]-a[1])*s));U.push(i/n,j/(profile.length-1))}}for(let j=0;j<profile.length-1;j++)for(let i=0;i<n;i++){const a=j*(n+1)+i,b=a+1,c=a+n+1,d=c+1;I.push(a,b,c,b,d,c)}mesh(name,P,N,U,I,material)};
  const torus=(name,R,r,y,material)=>{const P=[],N=[],U=[],I=[],s=48,t=8;for(let i=0;i<=s;i++)for(let j=0;j<=t;j++){const u=i*2*Math.PI/s,v=j*2*Math.PI/t,cu=Math.cos(u),su=Math.sin(u),cv=Math.cos(v),sv=Math.sin(v);P.push((R+r*cv)*cu,y+r*sv,(R+r*cv)*su);N.push(cv*cu,sv,cv*su);U.push(i/s,j/t)}for(let i=0;i<s;i++)for(let j=0;j<t;j++){const a=i*(t+1)+j,b=a+1,c=a+t+1,d=c+1;I.push(a,c,b,b,c,d)}mesh(name,P,N,U,I,material)};
  const rod=(name,A,B,r,material)=>{const dir=nrm(B[0]-A[0],B[1]-A[1],B[2]-A[2]),axis=nrm(-dir[2],0,dir[0]);let e=axis;if(Math.hypot(e[0],e[1],e[2])<.1)e=[1,0,0];const f=[dir[1]*e[2]-dir[2]*e[1],dir[2]*e[0]-dir[0]*e[2],dir[0]*e[1]-dir[1]*e[0]];const P=[],N=[],U=[],I=[],s=10;for(let k=0;k<2;k++)for(let i=0;i<=s;i++){const a=i*2*Math.PI/s,c=Math.cos(a),q=Math.sin(a),n=nrm(c*e[0]+q*f[0],c*e[1]+q*f[1],c*e[2]+q*f[2]),p=k?B:A;P.push(p[0]+r*n[0],p[1]+r*n[1],p[2]+r*n[2]);N.push(...n);U.push(i/s,k)}for(let i=0;i<s;i++){const a=i,b=a+1,c=s+1+i,d=c+1;I.push(a,b,c,b,d,c)}mesh(name,P,N,U,I,material)};
  lathe("foundation mineral foot",[[.59,.0],[.63,.08],[.60,.17],[.51,.23]],1);
  lathe("fired indigo ceramic shaft",[[.34,.22],[.29,.38],[.28,.68],[.29,.90],[.35,1.15],[.36,1.40],[.32,1.51]],0);
  torus("lower bronze cuff",.32,.018,.4,3);torus("upper bronze cuff",.35,.023,1.18,3);
  lathe("acoustic bell chamber",[[.30,1.5],[.41,1.62],[.46,1.77],[.42,1.84]],3);
  torus("ochre head retaining ring",.43,.028,1.845,1);
  lathe("dark acoustic diaphragm",[[.397,1.852],[.397,1.87]],4);
  for(let i=0;i<12;i++){const a=i*2*Math.PI/12,c=Math.cos(a),s=Math.sin(a);rod("radial acoustic grille "+i,[.07*c,1.885,.07*s],[.37*c,1.885,.37*s],.012,3)}
  torus("speaker hub",.08,.018,1.9,1);
  for(let i=0;i<8;i++){const a=i*2*Math.PI/8,c=Math.cos(a),s=Math.sin(a);rod("head support rib "+i,[.30*c,1.05,.30*s],[.39*c,1.53,.39*s],.023,3)}
  rod("crank axle",[.3,.80,-.02],[.50,.80,-.02],.038,3);
  rod("crank rise",[.50,.80,-.02],[.50,1.02,-.02],.026,1);
  rod("fabric-wrapped manual handle",[.46,1.02,-.02],[.64,1.02,-.02],.043,2);
  for(let i=0;i<5;i++){const y=.54+i*.1;rod("air slot "+i,[-.15,y,-.295],[.15,y,-.295],.011,4)}
  function png(rgb,seed){
    const w=32,h=32,raw=[];for(let y=0;y<h;y++){raw.push(0);for(let x=0;x<w;x++){const n=Math.sin((x*17+y*37+seed)*78.233)*43758.5453;const v=1+((n-Math.floor(n))-.5)*.1;for(const p of rgb)raw.push(Math.max(0,Math.min(255,Math.round(p*v))));raw.push(255)}}
    const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];
    const table=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[i]=c>>>0}
    const crc=a=>{let c=0xffffffff;for(const z of a)c=table[(c^z)&255]^(c>>>8);return(c^0xffffffff)>>>0};
    const chunk=(tag,a)=>{const b=[...textEncode(tag),...a];return [...be(a.length),...b,...be(crc(b))]};
    let a=1,b=0;for(const z of raw){a=(a+z)%65521;b=(b+a)%65521}
    const def=[0x78,0x01];let off=0;while(off<raw.length){const n=Math.min(65535,raw.length-off);def.push(off+n===raw.length?1:0,n&255,n>>>8,~n&255,(~n>>>8)&255);for(let k=off;k<off+n;k++)def.push(raw[k]);off+=n}def.push(...be((b*65536+a)>>>0));
    return Uint8Array.from([137,80,78,71,13,10,26,10,...chunk("IHDR",[...be(w),...be(h),8,6,0,0,0]),...chunk("IDAT",def),...chunk("IEND",[])])
  }
  const palettes=[[38,59,107],[106,73,41],[70,31,70]];
  for(let i=0;i<3;i++)images.push({mimeType:"image/png",bufferView:pack(png(palettes[i],i*10+7)),name:["indigo art anchor","ochre art anchor","burgundy art anchor"][i]});
  const gltf={asset:{version:"2.0",generator:"Cosmicsuprhero authored civic receiver v04, QA only"},scene:0,scenes:[{nodes:nodes.map((_,i)=>i)}],nodes,meshes,materials,textures:[{source:0},{source:1},{source:2}],images,accessors,bufferViews:views,buffers:[{byteLength:bin.length}]};
  const json=textEncode(JSON.stringify(gltf)),paddedJson=new Uint8Array((json.length+3)&~3);paddedJson.fill(32);paddedJson.set(json);
  const paddedBin=new Uint8Array((bin.length+3)&~3);paddedBin.set(bin);
  const out=new Uint8Array(12+8+paddedJson.length+8+paddedBin.length),d=new DataView(out.buffer);
  out.set([103,108,84,70]);d.setUint32(4,2,true);d.setUint32(8,out.length,true);
  d.setUint32(12,paddedJson.length,true);d.setUint32(16,0x4e4f534a,true);out.set(paddedJson,20);
  d.setUint32(20+paddedJson.length,paddedBin.length,true);d.setUint32(24+paddedJson.length,0x004e4942,true);out.set(paddedBin,28+paddedJson.length);
  return {out,meta:{modelMeshes:meshes.length,textures:images.length,materials:materials.length,size:out.length}};
}
const p=join(dirname(fileURLToPath(import.meta.url)),'../public/models/PRP-001-civic-receiver-v04.glb');mkdirSync(dirname(p),{recursive:true});const {out,meta}=buildAsset();writeFileSync(p,Buffer.from(out));console.log(JSON.stringify({path:p,...meta}));
