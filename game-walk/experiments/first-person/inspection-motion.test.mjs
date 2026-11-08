import test from 'node:test';
import assert from 'node:assert/strict';
import {InspectionMotion} from './inspection-motion.mjs';
test('closed rig does not accept accidental input',()=>{
 const m=new InspectionMotion(),a=m.yawTarget;m.drag(300,300);
 assert.equal(a,m.yawTarget);
 assert.equal(m.key('ArrowRight'),false);
});
test('opening starts object at safe distance and moves smoothly toward viewer',()=>{
 const m=new InspectionMotion();m.open();
 let a=m.tick(0),last=a.z;
 assert.ok(a.z<-3);assert.ok(a.scale<.5);
 for(let i=0;i<90;i++){
  a=m.tick(1/60);
  assert.ok(a.z>=last-.000001);
  last=a.z;
 }
 assert.ok(a.progress>.99);
 assert.ok(a.z>-2.3);
 assert.ok(a.scale>.88);
});
test('drag and arrow controls are bounded and physically damped',()=>{
 const m=new InspectionMotion();m.open();
 const a=m.tick(.016);
 m.drag(100,1000);
 let s=m.tick(.016);
 assert.ok(s.yaw>a.yaw&&s.yaw<m.yawTarget);
 assert.ok(m.pitchTarget<=.78);
 assert.equal(m.key('ArrowLeft'),true);
 assert.equal(m.key('ArrowDown'),true);
 assert.equal(m.key('Space'),false);
});
test('zoom is clamped and display distance never becomes extreme',()=>{
 const m=new InspectionMotion();m.open();
 m.setZoom(100);assert.equal(m.zoomTarget,.42);
 m.setZoom(-100);assert.equal(m.zoomTarget,-.6);
 m.wheel(-1000);assert.ok(m.zoomTarget<=.42);
 for(let i=0;i<90;i++)m.tick(1/60);
 assert.ok(m.tick(1/60).z< -1.4);
});
test('closing and re-opening reset inspection presentation deterministically',()=>{
 const m=new InspectionMotion();m.open();m.drag(200,70);
 for(let i=0;i<90;i++)m.tick(1/60);
 m.close();for(let i=0;i<90;i++)m.tick(1/60);
 assert.ok(m.progress<.02);
 m.open();
 assert.equal(m.yaw,-.27);assert.equal(m.pitch,.14);
 assert.equal(m.zoom,0);
});
