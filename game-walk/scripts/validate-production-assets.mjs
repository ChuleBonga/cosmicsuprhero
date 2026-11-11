// Asset-production inventory checks. No runtime assets or paid dependencies.
import {readFileSync} from 'node:fs';
const file=new URL('../production/ASSET_REGISTER.csv',import.meta.url);
const content=readFileSync(file,'utf8').replace(/\r\n/g,'\n');
function parseCSV(s){
 const records=[];let row=[],field='',quoted=false;
 for(let i=0;i<s.length;i++){
  const ch=s[i];
  if(ch==='"'){
   if(quoted&&s[i+1]==='"'){field+='"';i++;}
   else quoted=!quoted;
  }else if(ch===','&&!quoted){row.push(field);field='';}
  else if(ch==='\n'&&!quoted){row.push(field);records.push(row);row=[];field='';}
  else field+=ch;
 }
 if(quoted)throw Error('Asset register has an unterminated quoted field');
 if(field||row.length){row.push(field);records.push(row);}
 return records.filter(row=>row.some(Boolean));
}
const records=parseCSV(content);
const fields=['id','group','priority','asset_name','quantity','deliverable','reference','dependency','acceptance','status','rights'];
const header=records.shift();
if(JSON.stringify(header)!==JSON.stringify(fields))throw Error('Asset register columns changed: '+JSON.stringify(header));
const knownStates=new Set(['planned','concept-only','artist-approved','built','engine-integrated','tested','released','rejected','blocked-by-rights','existing-prototype/rework']);
const seen=new Set(),groups=new Set();let count=0;
for(const row of records){
 count++;
 if(row.length!==fields.length)throw Error('Row '+count+' has '+row.length+' fields, expected '+fields.length);
 const a=Object.fromEntries(fields.map((v,i)=>[v,row[i]]));
 if(!/^[A-Z]+-\d{3}$/.test(a.id))throw Error('Invalid asset ID: '+a.id);
 if(seen.has(a.id))throw Error('Duplicate asset ID: '+a.id);
 seen.add(a.id);groups.add(a.group);
 if(!['P0','P1','P2'].includes(a.priority))throw Error(a.id+' invalid priority');
 if(!knownStates.has(a.status))throw Error(a.id+' invalid status '+a.status);
 if(!Number.isInteger(Number(a.quantity))||Number(a.quantity)<=0)throw Error(a.id+' invalid quantity');
 for(const key of ['asset_name','deliverable','reference','dependency','acceptance','rights'])if(!a[key].trim())throw Error(a.id+' missing '+key);
 if(a.status==='released'&&!a.rights.match(/approved|licensed|CC0/i))throw Error(a.id+' cannot be released with unknown rights');
}
if(count<100)throw Error('Registry unexpectedly short: '+count);
console.log('Asset register valid: '+count+' unique deliverables across '+groups.size+' workstreams.');
