import Phaser from 'phaser';
import { gameEventBus } from './eventBus';
import {
  BRIARBROOK_BUILDINGS,
  BRIARBROOK_MAP_WIDTH,
  BRIARBROOK_MAP_HEIGHT,
  PLAYER_SPEED,
  PLAYER_SIZE,
  INTERACTION_RANGE,
} from '../game/briarbrook/buildings';
import type { BriarbrookBuilding } from '../game/briarbrook/types';

interface BuildingSprite extends Phaser.GameObjects.Container {
  buildingData: BriarbrookBuilding;
  glowGraphics: Phaser.GameObjects.Graphics;
  isGlowing: boolean;
}

export class BriarbrookScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
  };
  private buildings: BuildingSprite[] = [];
  private nearbyBuilding: BuildingSprite | null = null;
  private interactHint!: Phaser.GameObjects.Container;
  private isMovementPaused: boolean = false;
  private glowAlpha: number = 0;

  constructor() {
    super({ key: 'BriarbrookScene' });
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT);

    // Create background
    this.createBackground();

    // Create buildings
    this.createBuildings();

    // Create player
    this.createPlayer();

    // Setup camera (static, no follow for small map)
    this.cameras.main.setBounds(0, 0, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT);
    this.cameras.main.centerOn(BRIARBROOK_MAP_WIDTH / 2, BRIARBROOK_MAP_HEIGHT / 2);

    // Setup input
    this.setupInput();

    // Create interaction hint
    this.createInteractHint();

    // Setup glow animation
    this.setupGlowAnimation();

    // Listen for React events
    gameEventBus.onReactEvent((event) => {
      if (event.type === 'PAUSE_MOVEMENT') {
        this.isMovementPaused = true;
      } else if (event.type === 'RESUME_MOVEMENT') {
        this.isMovementPaused = false;
      }
    });

    // Emit ready
    gameEventBus.emitToReact({ type: 'SCENE_READY' });
  }

  private createBackground() {
    // Cozy gradient background - forest floor
    const bgGradient = this.add.graphics();
    bgGradient.fillGradientStyle(0x2D5016, 0x2D5016, 0x1A3409, 0x1A3409, 1);
    bgGradient.fillRect(0, 0, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT);
    bgGradient.setDepth(-10);

    // Grass texture (dots pattern)
    for (let i = 0; i < 200; i++) {
      const x = Phaser.Math.Between(0, BRIARBROOK_MAP_WIDTH);
      const y = Phaser.Math.Between(0, BRIARBROOK_MAP_HEIGHT);
      const grass = this.add.circle(x, y, Phaser.Math.Between(2, 4), 0x4A7C23, 0.3);
      grass.setDepth(-9);
    }

    // Cobblestone paths
    const pathGraphics = this.add.graphics();
    pathGraphics.fillStyle(0x8B7355, 1);
    // Main vertical path
    pathGraphics.fillRect(340, 0, 80, BRIARBROOK_MAP_HEIGHT);
    // Horizontal path
    pathGraphics.fillRect(0, 280, BRIARBROOK_MAP_WIDTH, 60);
    pathGraphics.setDepth(-8);

    // Path stones detail
    pathGraphics.fillStyle(0x9C8B6E, 1);
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(350, 410);
      const y = Phaser.Math.Between(0, BRIARBROOK_MAP_HEIGHT);
      pathGraphics.fillCircle(x, y, Phaser.Math.Between(3, 6));
    }
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, BRIARBROOK_MAP_WIDTH);
      const y = Phaser.Math.Between(285, 335);
      pathGraphics.fillCircle(x, y, Phaser.Math.Between(3, 6));
    }

    // Decorative trees
    const treePositions = [
      { x: 50, y: 50 }, { x: 720, y: 70 }, { x: 80, y: 280 },
      { x: 700, y: 200 }, { x: 280, y: 500 }, { x: 550, y: 530 },
      { x: 30, y: 500 }, { x: 750, y: 520 },
    ];
    treePositions.forEach(pos => {
      // Tree shadow
      this.add.ellipse(pos.x + 5, pos.y + 25, 30, 15, 0x000000, 0.2).setDepth(-6);
      // Tree trunk
      this.add.rectangle(pos.x, pos.y + 15, 8, 20, 0x5D4037).setDepth(-5);
      // Tree foliage
      this.add.circle(pos.x, pos.y, 20, 0x228B22).setDepth(-4);
      this.add.circle(pos.x - 8, pos.y + 5, 15, 0x2E8B2E).setDepth(-4);
      this.add.circle(pos.x + 8, pos.y + 5, 15, 0x2E8B2E).setDepth(-4);
    });

    // Town title
    const titleBg = this.add.rectangle(BRIARBROOK_MAP_WIDTH / 2, 22, 200, 30, 0x1e293b, 0.8);
    titleBg.setScrollFactor(0).setDepth(100);
    const title = this.add.text(BRIARBROOK_MAP_WIDTH / 2, 22, '🌿 Briarbrook', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5).setScrollFactor(0).setDepth(101);

    // Decorative flowers
    const flowerColors = [0xFF69B4, 0xFFD700, 0xFF6347, 0x9370DB];
    for (let i = 0; i < 25; i++) {
      const x = Phaser.Math.Between(20, BRIARBROOK_MAP_WIDTH - 20);
      const y = Phaser.Math.Between(20, BRIARBROOK_MAP_HEIGHT - 20);
      // Avoid paths
      if ((x > 330 && x < 430) || (y > 270 && y < 350)) continue;
      const color = flowerColors[Phaser.Math.Between(0, flowerColors.length - 1)];
      this.add.circle(x, y, 4, color).setDepth(-3);
    }
  }

  private createBuildings() {
    BRIARBROOK_BUILDINGS.forEach((buildingData, index) => {
      const container = this.add.container(buildingData.x, buildingData.y) as BuildingSprite;
      container.buildingData = buildingData;

      // Glow graphics (for when player is near)
      const glowGraphics = this.add.graphics();
      glowGraphics.setAlpha(0);
      container.glowGraphics = glowGraphics;
      container.isGlowing = false;

      // Building shadow
      const shadow = this.add.ellipse(5, buildingData.height / 2, buildingData.width + 10, 20, 0x000000, 0.3);
      
      // Building base
      const base = this.add.rectangle(0, 0, buildingData.width, buildingData.height, buildingData.color);
      base.setStrokeStyle(3, this.darkenColor(buildingData.color, 0.3));

      // Roof
      const roofHeight = 25;
      const roof = this.add.triangle(
        0, -buildingData.height / 2 - roofHeight / 2,
        -buildingData.width / 2 - 10, roofHeight / 2,
        buildingData.width / 2 + 10, roofHeight / 2,
        0, -roofHeight / 2,
        this.darkenColor(buildingData.color, 0.2)
      );

      // Door
      const door = this.add.rectangle(0, buildingData.height / 2 - 15, 20, 30, 0x5D4037);
      door.setStrokeStyle(2, 0x3E2723);

      // Icon
      const icon = this.add.text(0, -15, buildingData.icon, { fontSize: '28px' });
      icon.setOrigin(0.5);

      // Label background
      const labelBg = this.add.rectangle(0, buildingData.height / 2 + 22, buildingData.name.length * 8 + 16, 20, 0x1e293b, 0.9);
      labelBg.setStrokeStyle(1, 0x475569);

      // Label
      const label = this.add.text(0, buildingData.height / 2 + 22, buildingData.name, {
        fontSize: '11px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      label.setOrigin(0.5);

      container.add([shadow, base, roof, door, icon, labelBg, label]);
      container.setSize(buildingData.width, buildingData.height);
      container.setInteractive({ useHandCursor: true });
      container.setDepth(index + 5);

      // Click handler
      container.on('pointerdown', () => {
        if (!this.isMovementPaused) {
          this.handleBuildingClick(container);
        }
      });

      // Hover effects
      container.on('pointerover', () => {
        if (!this.isMovementPaused) {
          base.setScale(1.03);
          this.game.canvas.style.cursor = 'pointer';
        }
      });

      container.on('pointerout', () => {
        base.setScale(1);
        this.game.canvas.style.cursor = 'default';
      });

      this.buildings.push(container);
    });
  }

  private createPlayer() {
    const startX = BRIARBROOK_MAP_WIDTH / 2;
    const startY = BRIARBROOK_MAP_HEIGHT / 2 + 30;

    this.player = this.add.container(startX, startY);

    // Shadow
    const shadow = this.add.ellipse(0, PLAYER_SIZE / 2, PLAYER_SIZE * 1.2, PLAYER_SIZE / 2, 0x000000, 0.3);

    // Body
    const body = this.add.circle(0, 0, PLAYER_SIZE / 2, 0xFFE4B5);
    body.setStrokeStyle(2, 0x8B7355);

    // Hair
    const hair = this.add.ellipse(0, -PLAYER_SIZE / 3, PLAYER_SIZE * 0.7, PLAYER_SIZE * 0.35, 0x4A3728);

    // Eyes
    const leftEye = this.add.circle(-5, -2, 3, 0x000000);
    const rightEye = this.add.circle(5, -2, 3, 0x000000);

    // Smile
    const smile = this.add.arc(0, 4, 6, 0, 180, false, 0x000000);
    smile.setClosePath(false);
    smile.setStrokeStyle(2, 0x000000);

    // Adventure cloak
    const cloak = this.add.rectangle(0, PLAYER_SIZE / 3 + 2, PLAYER_SIZE * 0.8, PLAYER_SIZE / 2, 0x2E7D32);
    cloak.setStrokeStyle(1, 0x1B5E20);

    this.player.add([shadow, cloak, body, hair, leftEye, rightEye, smile]);
    this.player.setSize(PLAYER_SIZE, PLAYER_SIZE);
    this.player.setDepth(50);

    // Enable physics
    this.physics.add.existing(this.player);
    const physicsBody = this.player.body as Phaser.Physics.Arcade.Body;
    physicsBody.setCollideWorldBounds(true);
    physicsBody.setSize(PLAYER_SIZE, PLAYER_SIZE);
  }

  private setupInput() {
    if (!this.input.keyboard) return;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    };

    // E key for interaction
    this.wasd.E.on('down', () => {
      if (this.nearbyBuilding && !this.isMovementPaused) {
        this.handleBuildingClick(this.nearbyBuilding);
      }
    });
  }

  private createInteractHint() {
    this.interactHint = this.add.container(0, 0);

    // Background
    const bg = this.add.rectangle(0, 0, 140, 28, 0x1e293b, 0.95);
    bg.setStrokeStyle(2, 0x6366f1);

    // Text
    const text = this.add.text(0, 0, '🎮 Press E or Click', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);

    this.interactHint.add([bg, text]);
    this.interactHint.setVisible(false);
    this.interactHint.setDepth(200);
  }

  private setupGlowAnimation() {
    // Pulsing glow effect
    this.tweens.add({
      targets: this,
      glowAlpha: 0.6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private handleBuildingClick(building: BuildingSprite) {
    gameEventBus.emitToReact({
      type: 'BUILDING_CLICKED',
      buildingId: building.buildingData.id,
      questId: '', // Not used in new system
    });
  }

  private darkenColor(color: number, amount: number): number {
    const r = Math.max(0, ((color >> 16) & 0xFF) * (1 - amount));
    const g = Math.max(0, ((color >> 8) & 0xFF) * (1 - amount));
    const b = Math.max(0, (color & 0xFF) * (1 - amount));
    return (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
  }

  update() {
    if (this.isMovementPaused) {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0, 0);
      this.interactHint.setVisible(false);
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let velocityX = 0;
    let velocityY = 0;

    // WASD / Arrow key movement
    const leftPressed = this.cursors.left.isDown || this.wasd.A.isDown;
    const rightPressed = this.cursors.right.isDown || this.wasd.D.isDown;
    const upPressed = this.cursors.up.isDown || this.wasd.W.isDown;
    const downPressed = this.cursors.down.isDown || this.wasd.S.isDown;

    if (leftPressed) velocityX = -PLAYER_SPEED;
    if (rightPressed) velocityX = PLAYER_SPEED;
    if (upPressed) velocityY = -PLAYER_SPEED;
    if (downPressed) velocityY = PLAYER_SPEED;

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      const factor = 0.707; // 1/sqrt(2)
      velocityX *= factor;
      velocityY *= factor;
    }

    body.setVelocity(velocityX, velocityY);

    // Update player depth based on Y position
    this.player.setDepth(50 + this.player.y / 10);

    // Check proximity to buildings
    this.checkBuildingProximity();
  }

  private checkBuildingProximity() {
    let closestBuilding: BuildingSprite | null = null;
    let closestDist = INTERACTION_RANGE;

    for (const building of this.buildings) {
      const dx = building.x - this.player.x;
      const dy = building.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestBuilding = building;
        closestDist = dist;
      }

      // Update glow state
      if (dist < INTERACTION_RANGE && !building.isGlowing) {
        building.isGlowing = true;
        this.updateBuildingGlow(building, true);
      } else if (dist >= INTERACTION_RANGE && building.isGlowing) {
        building.isGlowing = false;
        this.updateBuildingGlow(building, false);
      }
    }

    this.nearbyBuilding = closestBuilding;

    if (closestBuilding) {
      this.interactHint.setPosition(
        closestBuilding.x,
        closestBuilding.y - closestBuilding.buildingData.height / 2 - 45
      );
      this.interactHint.setVisible(true);
    } else {
      this.interactHint.setVisible(false);
    }
  }

  private updateBuildingGlow(building: BuildingSprite, glow: boolean) {
    building.glowGraphics.clear();
    
    if (glow) {
      const color = building.buildingData.color;
      building.glowGraphics.lineStyle(4, color, this.glowAlpha);
      building.glowGraphics.strokeRect(
        building.x - building.buildingData.width / 2 - 5,
        building.y - building.buildingData.height / 2 - 5,
        building.buildingData.width + 10,
        building.buildingData.height + 10
      );
      building.glowGraphics.setAlpha(1);
      building.glowGraphics.setDepth(building.depth - 1);
    } else {
      building.glowGraphics.setAlpha(0);
    }
  }

  // Called each frame to update glowing buildings
  preUpdate() {
    for (const building of this.buildings) {
      if (building.isGlowing) {
        this.updateBuildingGlow(building, true);
      }
    }
  }
}

