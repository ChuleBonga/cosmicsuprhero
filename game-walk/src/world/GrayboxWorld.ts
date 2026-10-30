import Phaser from 'phaser';

// A six-minute walk at 210 px/s covers ~75,600 world units. The gray-box ground
// is physically flat and deterministic, while all visual tiles repeat without seams.
export const WORLD_WIDTH = 120_000;
export const TILE_WIDTH = 1024;
export const PARALLAX_SPEEDS = [0.025, 0.09, 0.22, 0.48, 0.78] as const;

export interface WorldPreview {
  groundY: number;
  planes: Phaser.GameObjects.TileSprite[];
  ground: Phaser.GameObjects.TileSprite;
  update(cameraX: number): void;
}

/** Five continuous, tiled visual planes plus a repeating collision-ground texture.
 * All shapes and figure are intentionally procedural gray-box placeholders.
 * Periodic waves use integer harmonics, so their left/right edges align exactly.
 */
export function buildWorld(scene: Phaser.Scene): WorldPreview {
  const height = Math.ceil(scene.scale.height);
  const width = Math.ceil(scene.scale.width);
  const groundY = Math.round(height * 0.79);
  const baseline = [0, 0, height * 0.48, height * 0.60, height * 0.72];
  const palette = [0x233f86, 0x253f86, 0x455292, 0x33366e, 0x252b5f];
  const keys: string[] = [];
  const tileH = Math.max(512, height);

  for (let layer = 0; layer < 5; layer++) {
    const key = `aa-preview-layer-${layer}-${tileH}`;
    keys.push(key);
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ x: 0, y: 0 });
      g.clear();
      if (layer === 0) {
        g.fillGradientStyle(0x1c3475, 0x243c85, 0x3e5093, 0x394b88);
        g.fillRect(0, 0, TILE_WIDTH, tileH);
        // Repeatable star placement; no sparkle animation or fake magical pickups.
        for (let i = 0; i < 48; i++) {
          const x = (i * 173 + 29) % TILE_WIDTH;
          const y = 18 + (i * 67) % Math.max(160, Math.floor(tileH * 0.36));
          g.fillStyle(0xffddb0, 0.15 + (i % 4) * 0.06);
          g.fillCircle(x, y, 0.6 + (i % 3) * 0.34);
        }
      } else if (layer === 1) {
        // Repeating sun/sky-bearing plane: no exposed edges even after six minutes.
        g.fillStyle(0xf5bc72, 0.03).fillRect(0, tileH * 0.25, TILE_WIDTH, tileH * .43);
      } else {
        g.fillStyle(palette[layer], 1);
        g.beginPath();
        g.moveTo(0, tileH);
        for (let x = 0; x <= TILE_WIDTH; x += 8) {
          const phase = (Math.PI * 2 * x) / TILE_WIDTH;
          const amplitude = layer === 2 ? 36 : layer === 3 ? 28 : 16;
          const wave = Math.sin(phase * (layer + 1)) * amplitude + Math.cos(phase * 2) * (amplitude * 0.38);
          g.lineTo(x, baseline[layer] + wave);
        }
        g.lineTo(TILE_WIDTH, tileH);
        g.closePath();
        g.fillPath();
        // Sparse hand-etched contours. Their drawing also wraps at tile edges.
        if (layer >= 3) {
          g.lineStyle(1, 0xc5a268, layer === 3 ? .16 : .21);
          for (let x = 0; x < TILE_WIDTH; x += 29) {
            const phase = (Math.PI * 2 * x) / TILE_WIDTH;
            const y = baseline[layer] + Math.sin(phase * (layer + 1)) * (layer === 3 ? 28 : 16) + Math.cos(phase * 2) * (layer === 3 ? 10.64 : 6.08);
            g.lineBetween(x, y + 10, x + 13, y + 23);
          }
        }
      }
      g.generateTexture(key, TILE_WIDTH, tileH);
      g.destroy();
    }
  }

  const planes = keys.map((key, index) => scene.add.tileSprite(0, 0, width, height, index===0 && scene.textures.exists('mountain-repeat') ? 'mountain-repeat' : key)
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-10 + index));

  const groundKey = `aa-ground-${tileH}`;
  if (!scene.textures.exists(groundKey)) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x282d57).fillRect(0, groundY, TILE_WIDTH, tileH - groundY);
    g.lineStyle(3, 0xd4a25c, 0.95).lineBetween(0, groundY, TILE_WIDTH, groundY);
    g.lineStyle(1, 0xbe965d, 0.17);
    for (let x = 0; x < TILE_WIDTH; x += 32) {
      const z = Math.sin(Math.PI * 2 * x / TILE_WIDTH * 3) * 5;
      g.lineBetween(x, groundY + 9 + z, x + 10, groundY + 13 + z);
    }
    g.generateTexture(groundKey, TILE_WIDTH, tileH);
    g.destroy();
  }
  const ground = scene.add.tileSprite(0, 0, width, height, groundKey)
    .setOrigin(0, 0).setScrollFactor(0).setDepth(-3);
  const update = (cameraX: number): void => {
    // No fixed-length graphics: texture repetition and visual origin are continuous.
    planes.forEach((plane, index) => { plane.tilePositionX = cameraX * PARALLAX_SPEEDS[index] + (index === 0 ? 225 : 0); });
    ground.tilePositionX = cameraX;
  };
  update(0);
  scene.cameras.main.setBounds(0, 0, WORLD_WIDTH, height);
  return { groundY, planes, ground, update };
}
