/** Public audio entries remain null until the artist approves a specific excerpt. Never use full masters. */
export type TrackId='first-contact'|'xaba'|'mama'|'songs-to-god';
export interface PublicClip { id:TrackId;title:string;durationSec:number;src:string|null;approved:boolean }
export const pickups:Record<TrackId,PublicClip>={
  'first-contact':{id:'first-contact',title:'First Contact',durationSec:25,src:null,approved:false},
  'xaba':{id:'xaba',title:'Xaba',durationSec:25,src:null,approved:false},
  'mama':{id:'mama',title:'Mama Calls Me Chule',durationSec:25,src:null,approved:false},
  'songs-to-god':{id:'songs-to-god',title:'Songs Sent to God',durationSec:25,src:null,approved:false},
};
/** Local preview-approved excerpt; not a seamless loop. Audio file copied here only if available on owned CDN. */
export const score={title:'Awaken Now',url:'/audio/v1/aa_awaken_now_score_loop_45s.m4a',approvedExcerpt:true,loopPreview:true};
export const PRE_SAVE='https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening?utm_source=game&utm_medium=preview&utm_campaign=arcturian-awakening';
