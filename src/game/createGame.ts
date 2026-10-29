import Phaser from 'phaser';
import {AudioDirector} from '../core/AudioDirector';
import {ProgressManager} from '../core/ProgressManager';
import {BootScene} from './scenes/BootScene';
import {TitleScene} from './scenes/TitleScene';
import {PrologueScene,EncounterNameScene,EncounterVoiceScene,EncounterFaithScene,FinaleScene,FreeRoamScene} from './scenes/PlannedScenes';
export interface GameServices {audio:AudioDirector;progress:ProgressManager;}
let services:GameServices|null=null;
export function useServices():GameServices{if(!services)throw new Error('Game services were not configured.');return services;}
export function createGame(input:GameServices):Phaser.Game{
 services=input;
 const game=new Phaser.Game({type:Phaser.AUTO,parent:'phaser-root',width:1024,height:640,transparent:true,backgroundColor:'#213c94',
  render:{antialias:true,pixelArt:false,roundPixels:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
  fps:{target:60,forceSetTimeOut:false},scene:[BootScene,TitleScene,PrologueScene,EncounterNameScene,EncounterVoiceScene,EncounterFaithScene,FinaleScene,FreeRoamScene]});
 return game;
}
