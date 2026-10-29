import Phaser from 'phaser';
import {PrologueScene} from './scenes/PrologueScene';
import {EncounterNameScene} from './scenes/EncounterNameScene';
import {progress} from './systems/ProgressManager';
let instance:Phaser.Game|undefined;
export function startGame():Phaser.Game{
 if(instance)return instance;
 instance=new Phaser.Game({
  type:Phaser.AUTO,parent:'game-root',transparent:false,
  width:960,height:540,pixelArt:false,antialias:true,roundPixels:false,
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH,width:960,height:540},
  render:{antialias:true,antialiasGL:true,pixelArt:false,powerPreference:'low-power',batchSize:512},
  fps:{target:60,forceSetTimeOut:false,smoothStep:true},
  input:{activePointers:2},
  scene:[PrologueScene,EncounterNameScene],
 });
 const scene=progress.data.encounter==='name'||progress.data.encounter==='complete'?'EncounterName':'Prologue';
 instance.events.once(Phaser.Core.Events.READY,()=>{instance?.scene.start(scene);window.dispatchEvent(new Event('aa:game-ready'));});
 return instance;
}
