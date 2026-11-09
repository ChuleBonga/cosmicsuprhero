import {readdirSync,statSync} from 'node:fs';import {join} from 'node:path';import {gzipSync} from 'node:zlib';import {readFileSync} from 'node:fs';
const root='dist';const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const files=walk(root);const entry=files.filter(f=>/\.(js|css|html|webp)$/.test(f));const bytes=entry.reduce((sum,p)=>sum+(p.endsWith('.webp')?statSync(p).size:gzipSync(readFileSync(p)).length),0);const reservedWalkAtlasBytes=180_000;const limit=3_000_000;
const materialFiles=files.filter(p=>p.includes('first-person-materials/')&&p.endsWith('.png'));
const materialBytes=materialFiles.reduce((sum,p)=>sum+statSync(p).size,0);
const materialLimit=5_000_000;
console.log(JSON.stringify({initialAssetEstimateBytes:bytes,plannedWalkAtlasReserveBytes:reservedWalkAtlasBytes,projectedInitialBytes:bytes+reservedWalkAtlasBytes,thresholdBytes:limit,materialPackBytes:materialBytes,materialPackLimitBytes:materialLimit,materialFiles:materialFiles.length,materialMapsLoadAfterHtml:true,mediaDeferred:true,files:entry.map(p=>({path:p,bytes:statSync(p).size}))},null,2));if(bytes+reservedWalkAtlasBytes>=limit){console.error('Initial build over budget');process.exit(1)}if(materialFiles.length!==12||materialBytes>=materialLimit){console.error('First-person material pack missing or too large');process.exit(1)}
