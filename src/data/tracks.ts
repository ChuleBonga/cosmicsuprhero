export const PRE_SAVE_URL = 'https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening';
export const TRACK_IDS = ['pickup_first_contact','pickup_xaba','pickup_mama_calls_me_chule','pickup_songs_sent_to_god'] as const;
export type PickupId = typeof TRACK_IDS[number];
export type AudioId = PickupId | 'score_awaken_now_loop';
export type SceneKey = 'Boot'|'Title'|'Prologue'|'EncounterName'|'EncounterVoice'|'EncounterFaith'|'Finale'|'FreeRoam';
export const TRACKS: Record<AudioId,{title:string;duration:number;kind:'score'|'pickup';chapter:string}> = {
 score_awaken_now_loop:{title:'Awaken Now',duration:45,kind:'score',chapter:'Throughout'},
 pickup_first_contact:{title:'First Contact',duration:25,kind:'pickup',chapter:'Prologue'},
 pickup_xaba:{title:'Xaba',duration:25,kind:'pickup',chapter:'The Name'},
 pickup_mama_calls_me_chule:{title:'Mama Calls Me Chule',duration:25,kind:'pickup',chapter:'The Voice'},
 pickup_songs_sent_to_god:{title:'Songs Sent to God',duration:25,kind:'pickup',chapter:'The Faith'},
};
export const AUDIO_BASE='/media';
export const SCENE_KEYS: SceneKey[]=['Boot','Title','Prologue','EncounterName','EncounterVoice','EncounterFaith','Finale','FreeRoam'];
