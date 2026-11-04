import Phaser from 'phaser';

/**
 * High-fidelity panoramic world. All geographic artwork is from the four
 * approved, intact plates in public/art/plates. We do NOT generate scenery,
 * threshold-cut mountains, repeat skies or draw plant sprites.
 *
 * The 3:1 originals are composited at the browser's native screen resolution,
 * under Phaser's transparent 480x270 logical interaction canvas. That keeps
 * image detail on desktop/retina displays without rescaling game physics.
 */
export const WORLD_WIDTH=480;
export const FIRST_CONTACT_X=416;
export const CREDO_APPROACH_X=450;

export interface WorldPreview {
  readonly groundY:number;
  update(cameraX:number,delta?:number):void;
  setSignalIntensity(value:number):void;
  setArrivalLighting(value:number):void;
}

const clamp=(value:number)=>Math.min(1,Math.max(0,value));

/** Never display two complete sunsets at once: dim the old plate to zero,
 * then bring the next one up during a deliberate, brief scene transition.
 * The unused later scenes are staged art, not implemented narrative chapters.
 */
export function plateOpacities(cameraX:number):readonly [number,number,number] {
  if(cameraX<=1810)return [1,0,0];
  if(cameraX<1850)return [1-clamp((cameraX-1810)/40),0,0];
  if(cameraX<1890)return [0,clamp((cameraX-1850)/40),0];
  if(cameraX<=2560)return [0,1,0];
  if(cameraX<2600)return [0,1-clamp((cameraX-2560)/40),0];
  if(cameraX<2640)return [0,0,clamp((cameraX-2600)/40)];
  return [0,0,1];
}

export function buildWorld(scene:Phaser.Scene):WorldPreview {
  const groundY=scene.scale.height-52;
  const still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frame=document.getElementById('cinema-frame');
  const plates=['a','b','c'].map(name=>
    document.querySelector<HTMLImageElement>(`[data-arrival-plate="${name}"]`)
  );
  scene.cameras.main.setBackgroundColor('rgba(0,0,0,0)');

  // Small, intentionally authored interaction lighting; the sun,
  // monolith, rocks and dunes are already painted in the original plates.
  const signalHalo=scene.add.circle(FIRST_CONTACT_X,groundY-53,18,0xeab86d,0)
    .setDepth(11);
  let signal=0,arrival=0,overflow=0;
  const resize=()=>{
    if(!frame)return;
    // Every panorama is 3:1. Rendering height fills the 16:9 frame.
    // Excess width is revealed gradually with the camera's movement.
    overflow=Math.max(0,frame.clientHeight*3-frame.clientWidth);
  };
  resize();
  const observer=typeof ResizeObserver!=='undefined'&&frame?
    new ResizeObserver(resize):null;
  if(observer&&frame)observer.observe(frame);

  const onStop=()=>{
    observer?.disconnect();
    // Clear gameplay-only visual effects on scene transition. A remains
    // available for the next authored scene without visible sun repetition.
    signalHalo.destroy();
  };
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN,onStop);

  const setSignalIntensity=(v:number)=>{
    signal=clamp(v);
    signalHalo.setAlpha(.04+signal*.19);
    signalHalo.setScale(.8+signal*.45);
  };
  const setArrivalLighting=(v:number)=>{arrival=clamp(v)};

  const update=(cameraX:number,_delta=16)=>{
    const x=Math.max(0,cameraX);
    const alpha=plateOpacities(x);
    const phaseStart=[0,1890,2640];
    const phaseEnd=[1810,2560,WORLD_WIDTH];
    plates.forEach((plate,i)=>{
      if(!plate)return;
      const t=clamp((x-phaseStart[i])/Math.max(1,phaseEnd[i]-phaseStart[i]));
      const drift=still?0:overflow*t*.92;
      // A single coherent painting in each act. No stitched/repeated suns.
      plate.style.opacity=String(alpha[i]);
      plate.style.transform=`translate3d(${(-drift).toFixed(2)}px,0,0)`;
    });
    signalHalo.setAlpha(Math.min(.27,.04+signal*.12+arrival*.07));
  };
  update(0);
  return {groundY,update,setSignalIntensity,setArrivalLighting};
}
