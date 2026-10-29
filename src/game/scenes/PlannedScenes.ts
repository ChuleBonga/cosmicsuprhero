import Phaser from 'phaser';
/** Explicit registration stubs. Step 2 is the scaffold; gameplay is the following delivery. */
abstract class PlannedScene extends Phaser.Scene{
 constructor(key:string){super({key});}
 create(){this.add.text(24,24,'SCENE UNDER DEVELOPMENT',{fontFamily:'Arial',fontSize:'14px',color:'#f8e9d5'});}
}
export class PrologueScene extends PlannedScene{constructor(){super('Prologue');}}
export class EncounterNameScene extends PlannedScene{constructor(){super('EncounterName');}}
export class EncounterVoiceScene extends PlannedScene{constructor(){super('EncounterVoice');}}
export class EncounterFaithScene extends PlannedScene{constructor(){super('EncounterFaith');}}
export class FinaleScene extends PlannedScene{constructor(){super('Finale');}}
export class FreeRoamScene extends PlannedScene{constructor(){super('FreeRoam');}}
