/** Deterministic tactile, accessible artifact examination camera rig.
 * Pure interpolation logic, independent of the rendering engine.
 */
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const easing=(current,target,dt,rate)=>current+(target-current)*(1-Math.exp(-clamp(dt,0,.1)*rate));
export class InspectionMotion{
 constructor(){
  this.progress=0;this.opened=false;this.yaw=-.27;this.pitch=.14;
  this.yawTarget=-.27;this.pitchTarget=.14;this.zoom=0;this.zoomTarget=0;
 }
 open(){
  this.opened=true;this.progress=0;this.zoomTarget=0;this.zoom=0;
  this.yaw=-.27;this.pitch=.14;this.yawTarget=-.27;this.pitchTarget=.14;
 }
 close(){this.opened=false;}
 drag(dx=0,dy=0){
  if(!this.opened)return;
  this.yawTarget+=clamp(dx,-240,240)*.007;
  this.pitchTarget=clamp(this.pitchTarget+clamp(dy,-240,240)*.004,-.78,.78);
 }
 key(key){
  if(!this.opened)return false;
  const d=18;
  switch(key){
   case 'ArrowLeft':this.drag(-d,0);return true;
   case 'ArrowRight':this.drag(d,0);return true;
   case 'ArrowUp':this.drag(0,-d);return true;
   case 'ArrowDown':this.drag(0,d);return true;
   case 'Equal':case 'NumpadAdd':this.setZoom(this.zoomTarget+.1);return true;
   case 'Minus':case 'NumpadSubtract':this.setZoom(this.zoomTarget-.1);return true;
   default:return false;
  }
 }
 setZoom(value){this.zoomTarget=clamp(value,-.6,.42)}
 wheel(deltaY){if(this.opened)this.setZoom(this.zoomTarget+clamp(deltaY,-200,200)*-.00085)}
 tick(dt){
  const target=this.opened?1:0;
  this.progress=easing(this.progress,target,dt,5.4);
  this.yaw=easing(this.yaw,this.yawTarget,dt,10.5);
  this.pitch=easing(this.pitch,this.pitchTarget,dt,9.5);
  this.zoom=easing(this.zoom,this.zoomTarget,dt,7);
  const p=this.progress;
  const smooth=p*p*(3-2*p);
  return {
   x:.11*smooth,
   y:-.98+.69*smooth,
   z:-3.55+1.45*smooth+this.zoom,
   scale:.48+.44*smooth,
   yaw:this.yaw,pitch:this.pitch,
   progress:p
  };
 }
}
