import Phaser from 'phaser';
export class BootScene extends Phaser.Scene {
 constructor(){super({key:'Boot'});}
 preload(){/* Keep the first interaction tiny. Heavy scenery and pickup audio are loaded by later scenes, on demand. */}
 create(){this.scene.start('Title');}
}
