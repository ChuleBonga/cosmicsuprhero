import test from 'node:test';
import assert from 'node:assert/strict';
import {AwakenNowScore,AWAKEN_NOW_PREVIEW_URL,clampAudio,easeGain} from './score.mjs';
class FakeAudio{
 constructor(src){this.src=src;this.volume=0;this.paused=true;this.count=0;this.listeners=new Map();}
 addEventListener(name,fn){this.listeners.set(name,fn)}
 play(){this.count++;this.paused=false;return Promise.resolve()}
 pause(){this.paused=true}
 removeAttribute(){}
 load(){}
}
test('score uses only designated Awaken Now preview loop',()=>{
 let s=new AwakenNowScore(()=>{},src=>new FakeAudio(src));
 assert.equal(s.audio.src,AWAKEN_NOW_PREVIEW_URL);
 assert.equal(s.audio.loop,true);assert.equal(s.audio.preload,'none');
 assert.equal(s.audio.count,0);assert.equal(s.audio.volume,0);
});
test('a deliberate gesture begins looping the score',async()=>{
 const s=new AwakenNowScore(()=>{},src=>new FakeAudio(src));
 assert.equal(await s.play(),true);assert.equal(s.playing,true);assert.equal(s.audio.count,1);
});
test('pause actually stops transport and resume restarts on a gesture',async()=>{
 const s=new AwakenNowScore(()=>{},src=>new FakeAudio(src));
 await s.play();s.pause();assert.equal(s.audio.paused,true);
 await s.play();assert.equal(s.audio.count,2);assert.equal(s.playing,true);
});
test('volume and mute do not change track or require reloading',async()=>{
 const s=new AwakenNowScore(()=>{},src=>new FakeAudio(src));await s.play();
 s.setVolume(.9);s.tick(.5);assert.ok(s.audio.volume>0);
 s.setMuted(true);for(let i=0;i<70;i++)s.tick(.05);
 assert.ok(s.audio.volume<.0001);s.setMuted(false);
 for(let i=0;i<70;i++)s.tick(.05);
 assert.ok(s.audio.volume>.8);assert.equal(s.audio.count,1);
});
test('inspection ducks score and returning restores it',async()=>{
 const s=new AwakenNowScore(()=>{},src=>new FakeAudio(src));await s.play();
 s.setSceneLevel(.35);for(let i=0;i<80;i++)s.tick(.05);
 assert.ok(s.audio.volume>.2&&s.audio.volume<.26);
 s.setSceneLevel(1);for(let i=0;i<80;i++)s.tick(.05);
 assert.ok(s.audio.volume>.65);
});
test('volume normalization and interpolation remain bounded',()=>{
 assert.equal(clampAudio(100),1);assert.equal(clampAudio(-1),0);
 assert.ok(easeGain(.1,.9,.1)>.1);assert.ok(easeGain(.1,.9,.1)<.9);
 assert.equal(easeGain(0,1,0),0);
});
test('a blocked playback promise fails without crashing game',async()=>{
 const s=new AwakenNowScore(()=>{},src=>new FakeAudio(src));
 s.audio.play=()=>Promise.reject(new Error('NotAllowedError'));
 assert.equal(await s.play(),false);assert.equal(s.failed,true);
});
