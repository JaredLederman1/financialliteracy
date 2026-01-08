import Phaser from 'phaser';
import { gameEventBus } from './eventBus';
import {
  TOWN_BUILDINGS,
  MAP_WIDTH,
  MAP_HEIGHT,
  PLAYER_SPEED,
  PLAYER_SIZE,
} from './types';
import type { TownBuilding, ReactToPhaserEvent } from './types';
import type { Avatar } from '../onboarding/types';

interface BuildingSprite extends Phaser.GameObjects.Container {
  buildingData: TownBuilding;
  isUnlocked: boolean;
}

export class TownScene extends Phaser.Scene {
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
  private targetPosition: { x: number; y: number } | null = null;
  private completedQuestIds: string[] = [];
  private playerAvatar: Avatar | null = null;
  private nearbyBuilding: BuildingSprite | null = null;
  private interactHint!: Phaser.GameObjects.Text;
  private playerBody!: Phaser.GameObjects.Ellipse;
  private playerHair!: Phaser.GameObjects.Ellipse;
  private playerEyes!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'TownScene' });
  }

  init(data: { completedQuestIds?: string[]; avatar?: Avatar }) {
    this.completedQuestIds = data.completedQuestIds || [];
    this.playerAvatar = data.avatar || null;
  }

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

    // Create background
    this.createBackground();

    // Create buildings
    this.createBuildings();

    // Create player
    this.createPlayer();

    // Setup camera
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.2);

    // Setup input
    this.setupInput();

    // Setup click-to-move
    this.input.on('pointerdown', this.handlePointerDown, this);

    // Listen for React events
    gameEventBus.onReactEvent(this.handleReactEvent.bind(this));

    // Create interaction hint text
    this.interactHint = this.add.text(0, 0, 'Press E or Click to enter', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#1e293b',
      padding: { x: 8, y: 4 },
    });
    this.interactHint.setOrigin(0.5);
    this.interactHint.setVisible(false);
    this.interactHint.setDepth(100);

    // Notify React that scene is ready
    gameEventBus.emitToReact({ type: 'BUILDING_CLICKED', buildingId: '', questId: '' });
  }

  private createBackground() {
    // Sky gradient background
    const sky = this.add.rectangle(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH, MAP_HEIGHT, 0x87CEEB);
    sky.setDepth(-10);

    // Ground
    const ground = this.add.rectangle(MAP_WIDTH / 2, MAP_HEIGHT - 50, MAP_WIDTH, 200, 0x90EE90);
    ground.setDepth(-9);

    // Roads
    this.add.rectangle(MAP_WIDTH / 2, MAP_HEIGHT / 2, 60, MAP_HEIGHT, 0x94A3B8).setDepth(-8);
    this.add.rectangle(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH, 40, 0x94A3B8).setDepth(-8);

    // Some decorative trees/bushes
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(50, MAP_WIDTH - 50);
      const y = Phaser.Math.Between(50, MAP_HEIGHT - 50);
      // Avoid placing on roads or buildings
      if (Math.abs(x - MAP_WIDTH / 2) > 50 && Math.abs(y - MAP_HEIGHT / 2) > 40) {
        const tree = this.add.circle(x, y, 15, 0x22C55E);
        tree.setDepth(-5);
      }
    }

    // Title
    const title = this.add.text(MAP_WIDTH / 2, 30, '🏘️ Maplewood Town', {
      fontSize: '24px',
      color: '#1e293b',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);
    title.setScrollFactor(0);
    title.setDepth(50);
  }

  private createBuildings() {
    TOWN_BUILDINGS.forEach((buildingData, index) => {
      const isUnlocked = this.isBuildingUnlocked(buildingData.questId);
      
      const container = this.add.container(buildingData.x, buildingData.y) as BuildingSprite;
      container.buildingData = { ...buildingData, unlocked: isUnlocked };
      container.isUnlocked = isUnlocked;

      // Building body
      const body = this.add.rectangle(
        0, 0,
        buildingData.width,
        buildingData.height,
        isUnlocked ? buildingData.color : 0x64748B
      );
      body.setStrokeStyle(3, isUnlocked ? 0x1e293b : 0x475569);

      // Roof (triangle effect with rectangle)
      const roof = this.add.rectangle(
        0, -buildingData.height / 2 - 15,
        buildingData.width + 20, 30,
        isUnlocked ? this.darkenColor(buildingData.color, 0.2) : 0x475569
      );

      // Icon
      const icon = this.add.text(0, -10, buildingData.icon, {
        fontSize: '32px',
      });
      icon.setOrigin(0.5);

      // Label
      const label = this.add.text(0, buildingData.height / 2 + 20, 
        isUnlocked ? buildingData.name : '???', {
        fontSize: '14px',
        color: '#1e293b',
        fontStyle: 'bold',
        backgroundColor: '#ffffff',
        padding: { x: 6, y: 3 },
      });
      label.setOrigin(0.5);

      // Lock icon if locked
      if (!isUnlocked) {
        const lock = this.add.text(0, 15, '🔒', { fontSize: '24px' });
        lock.setOrigin(0.5);
        container.add(lock);
      }

      container.add([roof, body, icon, label]);
      container.setSize(buildingData.width, buildingData.height);
      container.setInteractive({ useHandCursor: isUnlocked });
      container.setDepth(index);

      if (isUnlocked) {
        container.on('pointerover', () => {
          body.setScale(1.05);
          this.game.canvas.style.cursor = 'pointer';
        });

        container.on('pointerout', () => {
          body.setScale(1);
          this.game.canvas.style.cursor = 'default';
        });

        container.on('pointerdown', () => {
          this.handleBuildingClick(container);
        });
      }

      this.buildings.push(container);
    });
  }

  private createPlayer() {
    const startX = 400;
    const startY = 300;

    this.player = this.add.container(startX, startY);
    
    // Shadow
    const shadow = this.add.ellipse(0, PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE / 3, 0x000000, 0.3);
    
    // Body (skin tone)
    const skinColor = this.playerAvatar?.skinColor 
      ? parseInt(this.playerAvatar.skinColor.replace('#', ''), 16) 
      : 0xF0C8A0;
    this.playerBody = this.add.ellipse(0, 0, PLAYER_SIZE, PLAYER_SIZE * 1.2, skinColor);
    this.playerBody.setStrokeStyle(2, 0x1e293b);

    // Hair
    const hairColor = this.playerAvatar?.hairColor
      ? parseInt(this.playerAvatar.hairColor.replace('#', ''), 16)
      : 0x4A3728;
    this.playerHair = this.add.ellipse(0, -PLAYER_SIZE / 3, PLAYER_SIZE * 0.9, PLAYER_SIZE * 0.5, hairColor);
    
    // Eyes
    const eyeColor = this.playerAvatar?.eyeColor
      ? parseInt(this.playerAvatar.eyeColor.replace('#', ''), 16)
      : 0x4A3728;
    this.playerEyes = this.add.container(0, -2);
    const leftEye = this.add.circle(-6, 0, 4, 0xffffff);
    const leftPupil = this.add.circle(-6, 0, 2, eyeColor);
    const rightEye = this.add.circle(6, 0, 4, 0xffffff);
    const rightPupil = this.add.circle(6, 0, 2, eyeColor);
    this.playerEyes.add([leftEye, leftPupil, rightEye, rightPupil]);

    // Simple shirt
    const shirt = this.add.rectangle(0, PLAYER_SIZE / 3, PLAYER_SIZE * 0.8, PLAYER_SIZE / 2, 0x6366F1);

    this.player.add([shadow, shirt, this.playerBody, this.playerHair, this.playerEyes]);
    this.player.setSize(PLAYER_SIZE, PLAYER_SIZE * 1.2);
    this.player.setDepth(10);

    // Enable physics
    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(PLAYER_SIZE, PLAYER_SIZE);
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
      if (this.nearbyBuilding && this.nearbyBuilding.isUnlocked) {
        this.handleBuildingClick(this.nearbyBuilding);
      }
    });
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    // Get world position
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    
    // Check if clicking on a building
    const clickedBuilding = this.buildings.find(b => {
      const bounds = b.getBounds();
      return bounds.contains(worldPoint.x, worldPoint.y);
    });

    if (clickedBuilding && clickedBuilding.isUnlocked) {
      // Building click is handled by container event
      return;
    }

    // Otherwise, set target for click-to-move
    this.targetPosition = { x: worldPoint.x, y: worldPoint.y };
  }

  private handleBuildingClick(building: BuildingSprite) {
    gameEventBus.emitToReact({
      type: 'BUILDING_CLICKED',
      buildingId: building.buildingData.id,
      questId: building.buildingData.questId,
    });
  }

  private handleReactEvent(event: ReactToPhaserEvent) {
    switch (event.type) {
      case 'UPDATE_UNLOCKED_QUESTS':
        this.completedQuestIds = event.completedQuestIds;
        this.updateBuildingStates();
        break;
      case 'UPDATE_PLAYER_AVATAR':
        this.playerAvatar = event.avatar;
        this.updatePlayerAppearance();
        break;
      case 'TELEPORT_PLAYER':
        this.player.setPosition(event.x, event.y);
        this.targetPosition = null;
        break;
    }
  }

  private updateBuildingStates() {
    this.buildings.forEach(container => {
      const isNowUnlocked = this.isBuildingUnlocked(container.buildingData.questId);
      if (isNowUnlocked !== container.isUnlocked) {
        container.isUnlocked = isNowUnlocked;
        // Update visuals - would need to recreate container for full update
        // For MVP, we'll handle this via scene restart
      }
    });
  }

  private updatePlayerAppearance() {
    if (!this.playerAvatar) return;

    const skinColor = parseInt(this.playerAvatar.skinColor.replace('#', ''), 16);
    const hairColor = parseInt(this.playerAvatar.hairColor.replace('#', ''), 16);
    const eyeColor = parseInt(this.playerAvatar.eyeColor.replace('#', ''), 16);

    this.playerBody.setFillStyle(skinColor);
    this.playerHair.setFillStyle(hairColor);
    
    // Update eye pupils
    const pupils = this.playerEyes.list.filter((_, i) => i % 2 === 1) as Phaser.GameObjects.Arc[];
    pupils.forEach(p => p.setFillStyle(eyeColor));
  }

  private isBuildingUnlocked(questId: string): boolean {
    // First building is always unlocked
    const buildingIndex = TOWN_BUILDINGS.findIndex(b => b.questId === questId);
    if (buildingIndex === 0) return true;

    // Others unlock when previous quest is completed
    const previousQuest = TOWN_BUILDINGS[buildingIndex - 1];
    return previousQuest ? this.completedQuestIds.includes(previousQuest.questId) : false;
  }

  private darkenColor(color: number, amount: number): number {
    const r = Math.max(0, ((color >> 16) & 0xFF) * (1 - amount));
    const g = Math.max(0, ((color >> 8) & 0xFF) * (1 - amount));
    const b = Math.max(0, (color & 0xFF) * (1 - amount));
    return (r << 16) | (g << 8) | b;
  }

  update() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let velocityX = 0;
    let velocityY = 0;

    // WASD / Arrow key movement
    const leftPressed = this.cursors.left.isDown || this.wasd.A.isDown;
    const rightPressed = this.cursors.right.isDown || this.wasd.D.isDown;
    const upPressed = this.cursors.up.isDown || this.wasd.W.isDown;
    const downPressed = this.cursors.down.isDown || this.wasd.S.isDown;

    if (leftPressed || rightPressed || upPressed || downPressed) {
      // Cancel click-to-move if using keyboard
      this.targetPosition = null;

      if (leftPressed) velocityX = -PLAYER_SPEED;
      if (rightPressed) velocityX = PLAYER_SPEED;
      if (upPressed) velocityY = -PLAYER_SPEED;
      if (downPressed) velocityY = PLAYER_SPEED;
    } else if (this.targetPosition) {
      // Click-to-move
      const dx = this.targetPosition.x - this.player.x;
      const dy = this.targetPosition.y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 10) {
        velocityX = (dx / distance) * PLAYER_SPEED;
        velocityY = (dy / distance) * PLAYER_SPEED;
      } else {
        this.targetPosition = null;
      }
    }

    body.setVelocity(velocityX, velocityY);

    // Update player depth based on Y position
    this.player.setDepth(10 + this.player.y / 100);

    // Check proximity to buildings
    this.checkBuildingProximity();
  }

  private checkBuildingProximity() {
    let closestBuilding: BuildingSprite | null = null;
    let closestDist = 100; // Interaction range

    for (const building of this.buildings) {
      if (!building.isUnlocked) continue;

      const dx = building.x - this.player.x;
      const dy = building.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closestBuilding = building;
        closestDist = dist;
      }
    }

    this.nearbyBuilding = closestBuilding;

    if (closestBuilding) {
      this.interactHint.setPosition(
        closestBuilding.x, 
        closestBuilding.y - closestBuilding.buildingData.height / 2 - 40
      );
      this.interactHint.setVisible(true);
    } else {
      this.interactHint.setVisible(false);
    }
  }
}

