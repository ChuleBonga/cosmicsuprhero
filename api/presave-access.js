/**
 * Direct access / subscriber registration. Environment variables required:
 * MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX
 *
 * No credential, contact, or email address is written to logs or browser
 * storage. In an unconfigured preview returns 503 without collecting data.
 * Before production enable an external distributed rate limiter / bot check.
 */
const PRESAVE_URL='https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening';
const JSON_HEADERS={'Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};

export default async function handler(req,res){
  Object.entries(JSON_HEADERS).forEach(([key,value])=>res.setHeader(key,value));
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'method_not_allowed'});
  }
  const origin=String(req.headers.origin||'');
  const host=String(req.headers['x-forwarded-host']||req.headers.host||'');
  if(!origin || !host || new URL(origin).host!==host)
    return res.status(403).json({error:'origin_invalid'});
  const {MAILCHIMP_API_KEY:key,MAILCHIMP_LIST_ID:list,MAILCHIMP_SERVER_PREFIX:prefix}=process.env;
  if(!key||!list||!prefix)
    return res.status(503).json({error:'gateway_not_configured',message:'Direct access is not yet accepting registrations.'});
  // A distributed rate limit + bot protection is a release prerequisite.
  const length=Number(req.headers['content-length']||0);
  if(length>3000)return res.status(413).json({error:'request_too_large'});
  const data=typeof req.body==='object'&&req.body!==null?req.body:{};
  if(data.company) return res.status(400).json({error:'invalid_request'});
  const name=String(data.name||'').trim().replace(/\s+/g,' ');
  const email=String(data.email||'').trim().toLowerCase();
  const updates=data.updates===true;
  if(name.length<2||name.length>80||!/^\S+@\S+\.\S+$/.test(email)||email.length>254)
    return res.status(400).json({error:'invalid_contact'});
  // Non-opted-in visitors are recorded as transactional contacts only,
  // not silently subscribed to promotional campaigns.
  const url=`https://${encodeURIComponent(prefix)}.api.mailchimp.com/3.0/lists/${encodeURIComponent(list)}/members`;
  const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),8000);
  try{
    const upstream=await fetch(url,{
      method:'POST',
      headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
      body:JSON.stringify({
        email_address:email,
        status:updates?'pending':'transactional',
        merge_fields:{FNAME:name.split(' ')[0]||name,LNAME:name.split(' ').slice(1).join(' ')},
        tags:['arcturian-awakening','direct-presave']
      }),
      signal:ctl.signal
    });
    const result=await upstream.json().catch(()=>null);
    // Never force-subscribe an existing unsubscribed contact or overwrite consent.
    if(!upstream.ok && upstream.status!==400)
      return res.status(502).json({error:'provider_unavailable'});
    if(!upstream.ok){
      if(result?.title==='Member Exists'){
        // Existing member: don't change their subscription status.
        // No new contact record has been captured.
        return res.status(200).json({access:'granted',destination:PRESAVE_URL,existing:true});
      }
      return res.status(502).json({error:'provider_rejected'});
    }
    return res.status(200).json({access:'granted',destination:PRESAVE_URL,confirmation:updates?'pending':'not_requested'});
  }catch{
    return res.status(502).json({error:'provider_unavailable'});
  }finally{clearTimeout(timer);}
}
