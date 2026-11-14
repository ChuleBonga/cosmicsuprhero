import Phaser from 'phaser';
import type { GameContext } from '../main';
import { buildWorld } from '../world/GrayboxWorld';
import type { ResidentId, ResponseTone } from '../story/SettlementEncounter';

/**
 * FIRST INTEGRATION / ART BLOCKOUT ONLY.
 * The caretaker and repairer currently reuse the keeper sprite as an explicit
 * placeholder. Replace with approved, distinct character performances.
 * Proposed dialogue is original scratch copy, NOT album/recording transcription.
 */
export class SettlementScene extends Phaser.Scene {
  private app!: GameContext;
  private player!: Phaser.GameObjects.Sprite;
  private caretaker!: Phaser.GameObjects.Sprite;
  private repairer!: Phaser.GameObjects.Sprite;
  private passerby!: Phaser.GameObjects.Sprite;
  private message!: Phaser.GameObjects.Text;
  private instruction!: Phaser.GameObjects.Text;
  private choices: Phaser.GameObjects.GameObject[] = [];
  private fixture!: Phaser.GameObjects.Graphics;
  private progressLabel!: Phaser.GameObjects.Text;
  private avatarX = 0;
  private hold: -1 | 0 | 1 = 0;
  private elapsed = 0;
  private work = 0;
  private lock = false;
  private readonly positions = { caretaker: 130, repairer: 385, market_resident: 290 };
  private readonly worldWidth = 570;
  private floor = 0;
  private W = 0;
  private H = 0;

  constructor() { super('Settlement'); }

  create() {
    this.app = this.registry.get('app') as GameContext;
    this.W = this.scale.width; this.H = this.scale.height;
    const { W, H } = this;
    const portrait = H > W;
    const world = buildWorld(this);
    this.floor = world.groundY;
    this.cameras.main.setBackgroundColor('#001334');

    // Temporary composition blockout. Inhabited objects need source-approved assets.
    const background = this.add.container(0, 0).setDepth(1);
    for (let i = 0; i < 7; i++) {
      const x = 37 + i * 92;
      const h = 39 + (i * 17) % 25;
      const wall = this.add.rectangle(x, this.floor - h / 2, 70, h,
        i % 2 ? 0x30405d : 0x39445b).setStrokeStyle(2, 0xaa764c);
      const roof = this.add.rectangle(x, this.floor - h - 4, 80, 7, 0x703d4a);
      const door = this.add.rectangle(x + 15, this.floor - 12, 14, 24, 0x16243c);
      background.add([wall, roof, door]);
    }
    this.add.rectangle(this.worldWidth / 2, this.floor + 7, this.worldWidth, 13, 0x674b46).setDepth(2);
    for (const x of [87, 272, 468]) {
      this.add.rectangle(x, this.floor + 4, 26, 5, 0xb58c65).setDepth(3);
    }

    this.fixture = this.add.graphics().setDepth(8);
    this.caretaker = this.makeResident(this.positions.caretaker, 0xc4a1a0);
    this.repairer = this.makeResident(this.positions.repairer, 0x98c5cc);
    this.passerby = this.makeResident(this.positions.market_resident, 0xb7a779);
    this.player = this.add.sprite(34, this.floor, 'alien', 0).setOrigin(.5, 1).setDepth(18);
    this.player.play('alien-idle');
    this.avatarX = 34;

    this.cameras.main.setBounds(0, 0, this.worldWidth, H);
    this.cameras.main.startFollow(this.player, true, .12, .1);

    const overlayY = portrait ? 7 : 9;
    this.add.rectangle(W / 2, overlayY + 12, W - 16, 26, 0x091a32, .92)
      .setScrollFactor(0).setDepth(39);
    this.add.text(W / 2, overlayY + 12, 'ARRIVAL QUARTER  /  ART BLOCKOUT', {
      fontFamily: 'Arial,sans-serif', fontSize: W < 220 ? '9px' : '11px',
      color: '#ecd8b6',
    }).setScrollFactor(0).setDepth(40).setOrigin(.5);

    this.message = this.add.text(10, H - 103, '', {
      fontFamily: 'Arial,sans-serif', fontSize: W < 220 ? '10px' : '12px',
      color: '#fae8d0', backgroundColor: '#101e35',
      padding: { x: 7, y: 6 }, wordWrap: { width: W - 35 }, lineSpacing: 3,
    }).setScrollFactor(0).setDepth(44).setVisible(false);
    this.instruction = this.add.text(W / 2, H - 27, 'WALK: LEFT / RIGHT   INTERACT: E', {
      fontFamily: 'Arial,sans-serif', fontSize: '10px', color: '#fff0d1',
      backgroundColor: '#19233a', padding: { x: 4, y: 3 },
    }).setOrigin(.5).setScrollFactor(0).setDepth(40);
    this.progressLabel = this.add.text(W / 2, H - 49, '', {
      fontFamily: 'Arial,sans-serif', fontSize: '10px', color: '#f7d290',
      backgroundColor: '#17233b', padding: { x: 4, y: 3 },
    }).setOrigin(.5).setScrollFactor(0).setDepth(40);

    const button = (x: number, label: string, dir: -1 | 1) => {
      const zone = this.add.rectangle(x, H - 14, 34, 25, 0x573c51, .96)
        .setScrollFactor(0).setDepth(41).setInteractive({ useHandCursor: true });
      this.add.text(x, H - 14, label, { fontSize: '13px', fontFamily: 'Arial', color: '#fff2d7' })
        .setOrigin(.5).setScrollFactor(0).setDepth(42);
      zone.on('pointerdown', () => { this.hold = dir; });
      zone.on('pointerup', () => { if (this.hold === dir) this.hold = 0; });
      zone.on('pointerout', () => { if (this.hold === dir) this.hold = 0; });
    };
    button(18, '<', -1);
    button(W - 18, '>', 1);
    const interact = this.add.text(W - 14, 43, 'TALK / ACT', {
      fontFamily: 'Arial', fontSize: '10px', color: '#fff0d1',
      backgroundColor: '#583c4e', padding: { x: 8, y: 5 },
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(43).setInteractive({ useHandCursor: true });
    interact.on('pointerdown', () => this.interact());
    this.input.keyboard?.on('keydown-E', () => this.interact());
    this.input.keyboard?.on('keydown-ENTER', () => this.interact());
    this.input.keyboard?.on('keydown-ESC', () => this.openPause());
    this.input.keyboard?.on('keydown-P', () => this.openPause());
    this.input.on('pointerup', () => { this.hold = 0; });
    this.input.on('gameout', () => { this.hold = 0; });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.app.progress.save();
      this.clearChoices();
    });
    this.redrawFixture();
    this.showState();
  }

  private makeResident(x: number, tint: number) {
    // No third-party NPC assets invented or used without approval.
    const actor = this.add.sprite(x, this.floor, 'keeper', 0)
      .setOrigin(.5, 1).setDepth(12).setTint(tint).setScale(.62);
    actor.play('keeper-idle');
    return actor;
  }

  private clearChoices() {
    for (const object of this.choices) object.destroy();
    this.choices = [];
  }

  private say(message: string) {
    this.message.setText(message).setVisible(true);
    const status = document.querySelector('#dom-status');
    if (status) status.textContent = message;
  }

  private choose(lines: { label: string; onSelect: () => void }[]) {
    this.clearChoices();
    this.lock = true;
    const y = this.H - 74;
    const availableW = this.W - 18;
    const bw = (availableW - (lines.length - 1) * 4) / lines.length;
    lines.forEach((entry, i) => {
      const cx = 9 + bw / 2 + i * (bw + 4);
      const rect = this.add.rectangle(cx, y, bw, 23, 0x674354, 1)
        .setScrollFactor(0).setDepth(46).setInteractive({ useHandCursor: true });
      const text = this.add.text(cx, y, entry.label, {
        fontFamily: 'Arial', fontSize: this.W < 260 ? '8px' : '10px',
        color: '#fff6dc', align: 'center', wordWrap: { width: bw - 5 },
      }).setOrigin(.5).setScrollFactor(0).setDepth(47);
      const activate = () => {
        if (!this.lock) return;
        this.clearChoices(); this.lock = false; entry.onSelect();
      };
      rect.on('pointerdown', activate);
      this.choices.push(rect, text);
      this.input.keyboard?.once('keydown-' + (i + 1), activate);
    });
  }

  private nearby(): ResidentId | 'fixture' | null {
    const x = this.avatarX;
    if (Math.abs(x - this.positions.caretaker) < 42) return 'caretaker';
    if (Math.abs(x - this.positions.repairer) < 45) return 'repairer';
    if (Math.abs(x - 467) < 37) return 'fixture';
    if (Math.abs(x - this.positions.market_resident) < 28) return 'market_resident';
    return null;
  }

  private interact() {
    if (this.lock) return;
    const who = this.nearby();
    const state = this.app.progress.settlement;
    if (!who) {
      this.say('Move closer to a resident or the communal listening fixture.');
      return;
    }
    if (who === 'market_resident') {
      this.app.progress.actInSettlement({ type: 'MEET_RESIDENT', resident: 'market_resident' });
      this.say('Market resident: People still work here. The damage has slowed everything down.');
      return;
    }
    if (who === 'caretaker') {
      this.app.progress.actInSettlement({ type: 'MEET_RESIDENT', resident: 'caretaker' });
      if (state.repairCompleted && !state.residentsReacted) {
        this.app.progress.actInSettlement({ type: 'ACKNOWLEDGE_REPAIR' });
        this.say('Caretaker: You stayed to help. Credo is beyond the eastern passage. Find him.');
        this.showState();
        return;
      }
      if (state.credoLeadUnlocked) {
        this.say('Caretaker: Take what you learned with you.');
        this.choose([{ label: 'CONTINUE', onSelect: () => this.leaveForCredo() },
          { label: 'STAY', onSelect: () => this.say('The district carries on around you.') }]);
        return;
      }
      if (state.responseTone === null) {
        this.say('Caretaker: You have been away, Chule. Tell me what brought you back.');
        this.choose([
          { label: 'FAMILY', onSelect: () => this.respond('family') },
          { label: 'THE PEOPLE', onSelect: () => this.respond('community') },
          { label: 'LISTEN', onSelect: () => this.respond('listen') },
        ]);
      } else {
        this.say('Caretaker: The listening fixture is broken. Speak with the repairer.');
      }
      return;
    }
    if (who === 'repairer') {
      this.app.progress.actInSettlement({ type: 'MEET_RESIDENT', resident: 'repairer' });
      if (state.responseTone === null) {
        this.say('Repairer: The caretaker knows you. Talk to her before we begin.');
      } else if (!state.repairStarted) {
        this.say('Repairer: That fixture carries messages between households. Will you help?');
        this.choose([{ label: 'HELP', onSelect: () => {
          this.app.progress.actInSettlement({ type: 'START_REPAIR' });
          this.say('Repairer: Check the fixture. Three careful adjustments.');
          this.showState();
        } }, { label: 'LATER', onSelect: () => this.say('Repairer: I will be here.') }]);
      } else if (!state.repairCompleted) {
        this.say('Repairer: The fixture is just ahead. Work carefully.');
      } else {
        this.say('Repairer: It carries voices again. The caretaker should know.');
      }
      return;
    }
    if (who === 'fixture') {
      if (!state.repairStarted) {
        this.say('A damaged communal listening fixture. Ask the repairer about it.');
        return;
      }
      if (state.repairCompleted) {
        this.say('The listening fixture is working again.');
        return;
      }
      this.work++;
      if (this.work >= 3) {
        this.app.progress.actInSettlement({ type: 'COMPLETE_REPAIR' });
        this.say('The fixture responds. Return to the caretaker.');
        this.redrawFixture(); this.showState();
      } else {
        this.say('A connection holds. Make another careful adjustment. (' + this.work + '/3)');
      }
    }
  }

  private respond(tone: ResponseTone) {
    this.app.progress.actInSettlement({ type: 'RESPOND', tone });
    const replies: Record<ResponseTone, string> = {
      family: 'Caretaker: Then begin by seeing what the people here have carried.',
      community: 'Caretaker: Look around. They have kept this place alive without you.',
      listen: 'Caretaker: Good. There are things you need to hear before you go further.',
    };
    this.say(replies[tone] + ' The repairer needs help.');
    this.showState();
  }

  private showState() {
    const s = this.app.progress.settlement;
    this.progressLabel.setText(s.credoLeadUnlocked ? 'CREDO: ACCESSIBLE'
      : s.repairCompleted ? 'RETURN TO CARETAKER'
      : s.repairStarted ? 'RESTORE THE FIXTURE'
      : s.responseTone !== null ? 'SPEAK TO REPAIRER'
      : 'SPEAK TO CARETAKER');
  }

  private redrawFixture() {
    const restored = this.app.progress.settlement.repairCompleted;
    this.fixture.clear();
    this.fixture.fillStyle(0x443b58).fillRect(458, this.floor - 29, 18, 29);
    this.fixture.fillStyle(restored ? 0x81bcae : 0x9c6549).fillRect(453, this.floor - 32, 28, 6);
    this.fixture.lineStyle(2, restored ? 0xe1c486 : 0x8c5b58).strokeCircle(467, this.floor - 21, 6);
  }

  private leaveForCredo() {
    if (!this.app.progress.settlement.credoLeadUnlocked) return;
    this.app.progress.advance('ARRIVED_AT_CREDO');
    this.scene.start('Credo');
  }

  private openPause() {
    this.hold = 0;
    this.app.audio.pause();
    this.scene.launch('PauseUI', { returnScene: 'Settlement' });
    this.scene.pause();
  }

  update(_time: number, delta: number) {
    const dt = Math.min(.05, delta / 1000);
    this.elapsed += dt;
    const cursors = this.input.keyboard?.createCursorKeys();
    const left = !!cursors?.left.isDown || !!this.input.keyboard?.addKey('A').isDown;
    const right = !!cursors?.right.isDown || !!this.input.keyboard?.addKey('D').isDown;
    const axis = this.lock ? 0 : (right ? 1 : 0) - (left ? 1 : 0) || this.hold;
    this.avatarX = Phaser.Math.Clamp(this.avatarX + axis * 92 * dt, 18, this.worldWidth - 15);
    this.player.x = Math.round(this.avatarX);
    if (axis) this.player.setFlipX(axis < 0);
    const animation = axis ? 'alien-walk' : 'alien-idle';
    if (this.player.anims.currentAnim?.key !== animation) this.player.play(animation);
    // The wandering resident is deliberately not anchored to a quest marker.
    const offset = Math.sin(this.elapsed * .35) * 20;
    this.passerby.x = this.positions.market_resident + offset;
    this.caretaker.x = this.positions.caretaker + Math.sin(this.elapsed * .3) * 7;
    this.repairer.x = this.positions.repairer + Math.sin(this.elapsed * .55) * 5;
  }
}
