/**
 * BriarbrookScene - Immersive Town with House & Town Square
 * 
 * Layout:
 * - LEFT: Player's cozy home with yard and garden
 * - CENTER: Winding path through countryside
 * - RIGHT: Town square with buildings arranged around a fountain
 * 
 * Features multi-layer parallax scrolling
 */

import Phaser from 'phaser';
import { gameEventBus } from './eventBus';
import {
  BRIARBROOK_BUILDINGS,
  BRIARBROOK_MAP_WIDTH,
  BRIARBROOK_MAP_HEIGHT,
  PLAYER_SPEED,
  PLAYER_SIZE,
  INTERACTION_RANGE,
  GROUND_LEVEL,
  PLAYER_HOME,
  TOWN_CENTER,
  AREAS,
} from '../game/briarbrook/buildings';
import { LAYERS, lightenColor } from '../styles/tokens';
import type { BriarbrookBuilding } from '../game/briarbrook/types';

interface BuildingSprite extends Phaser.GameObjects.Container {
  buildingData: BriarbrookBuilding;
  glowRing: Phaser.GameObjects.Graphics;
  isGlowing: boolean;
}

interface NPCSprite extends Phaser.GameObjects.Container {
  buildingId: string;
  bobOffset: number;
  baseY: number;
}

export class BriarbrookScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private playerShadow!: Phaser.GameObjects.Ellipse;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key; E: Phaser.Input.Keyboard.Key };
  private buildings: BuildingSprite[] = [];
  private npcs: NPCSprite[] = [];
  private nearbyBuilding: BuildingSprite | null = null;
  private interactPrompt!: Phaser.GameObjects.Container;
  private isMovementPaused: boolean = false;

  // Parallax layers
  private farMountains!: Phaser.GameObjects.TileSprite;
  private midHills!: Phaser.GameObjects.TileSprite;
  private cloudsLayer!: Phaser.GameObjects.Container;

  // Animation state
  private glowAlpha: number = 0.5;
  private gameTime: number = 0;

  constructor() {
    super({ key: 'BriarbrookScene' });
  }

  create() {
    // Set extended world bounds
    this.physics.world.setBounds(0, 0, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT);

    // Create parallax background layers
    this.createSkyGradient();
    this.createParallaxMountains();
    this.createParallaxHills();
    this.createClouds();
    
    // Create ground and areas
    this.createGroundPlane();
    this.createPlayerHome();
    this.createCountrysidePath();
    this.createTownSquare();
    
    // Create interactive elements
    this.createBuildings();
    this.createNPCs();
    this.createDecorations();
    
    // Create player
    this.createPlayer();
    this.createInteractPrompt();
    this.createUI();

    // Camera setup - follows player with bounds
    this.cameras.main.setBounds(0, 0, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    this.cameras.main.setDeadzone(200, 100);

    this.setupInput();
    this.setupAnimations();

    // React events
    gameEventBus.onReactEvent((event) => {
      if (event.type === 'PAUSE_MOVEMENT') this.isMovementPaused = true;
      else if (event.type === 'RESUME_MOVEMENT') this.isMovementPaused = false;
    });

    gameEventBus.emitToReact({ type: 'SCENE_READY' });
  }

  // ========================
  // SKY GRADIENT
  // ========================
  private createSkyGradient() {
    const graphics = this.add.graphics();
    const steps = 80;
    
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      // Morning sky gradient - light blue to soft peach near horizon
      const r = Math.floor(200 + (255 - 200) * t * 0.3);
      const g = Math.floor(220 + (245 - 220) * t * 0.5);
      const b = Math.floor(250 + (230 - 250) * t);
      const color = (r << 16) | (g << 8) | b;
      
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, (i / steps) * BRIARBROOK_MAP_HEIGHT * 0.7, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT / steps + 2);
    }
    
    graphics.setDepth(-200);
    graphics.setScrollFactor(0); // Fixed background
  }

  // ========================
  // PARALLAX MOUNTAINS (Far)
  // ========================
  private createParallaxMountains() {
    // Create mountain texture procedurally
    const mountainGraphics = this.make.graphics({ x: 0, y: 0 });
    const mWidth = 800;
    const mHeight = 300;
    
    // Draw mountain silhouettes
    mountainGraphics.fillStyle(0xB8C9D4, 0.5);
    this.drawMountainRange(mountainGraphics, 0, mHeight, mWidth, [
      { x: 0, h: 80 }, { x: 150, h: 200 }, { x: 300, h: 120 }, { x: 500, h: 250 }, { x: 700, h: 100 }, { x: 800, h: 150 }
    ]);
    
    mountainGraphics.generateTexture('mountains', mWidth, mHeight);
    mountainGraphics.destroy();

    this.farMountains = this.add.tileSprite(
      BRIARBROOK_MAP_WIDTH / 2, 350,
      BRIARBROOK_MAP_WIDTH * 2, mHeight,
      'mountains'
    );
    this.farMountains.setDepth(-150);
    this.farMountains.setScrollFactor(0);
  }

  private drawMountainRange(g: Phaser.GameObjects.Graphics, startX: number, baseY: number, _width: number, peaks: {x: number, h: number}[]) {
    g.beginPath();
    g.moveTo(startX, baseY);
    
    peaks.forEach((peak, i) => {
      if (i === 0) {
        g.lineTo(peak.x, baseY - peak.h);
      } else {
        // Smooth curve between peaks
        const prev = peaks[i - 1];
        const cpX = (prev.x + peak.x) / 2;
        g.lineTo(cpX, baseY - (prev.h + peak.h) / 2 - 20);
        g.lineTo(peak.x, baseY - peak.h);
      }
    });
    
    g.lineTo(peaks[peaks.length - 1].x, baseY);
    g.closePath();
    g.fill();
  }

  // ========================
  // PARALLAX HILLS (Mid)
  // ========================
  private createParallaxHills() {
    const hillGraphics = this.make.graphics({ x: 0, y: 0 });
    const hWidth = 600;
    const hHeight = 200;
    
    // Rolling green hills
    hillGraphics.fillStyle(0x8FBF7F, 0.7);
    this.drawHills(hillGraphics, hWidth, hHeight);
    
    hillGraphics.generateTexture('hills', hWidth, hHeight);
    hillGraphics.destroy();

    this.midHills = this.add.tileSprite(
      BRIARBROOK_MAP_WIDTH / 2, 480,
      BRIARBROOK_MAP_WIDTH * 2, hHeight,
      'hills'
    );
    this.midHills.setDepth(-100);
    this.midHills.setScrollFactor(0);
  }

  private drawHills(g: Phaser.GameObjects.Graphics, width: number, height: number) {
    g.beginPath();
    g.moveTo(0, height);
    
    // Gentle rolling curves
    for (let x = 0; x <= width; x += 10) {
      const y = height - 80 - Math.sin(x / 80) * 40 - Math.sin(x / 40) * 20;
      g.lineTo(x, y);
    }
    
    g.lineTo(width, height);
    g.closePath();
    g.fill();
  }

  // ========================
  // CLOUDS
  // ========================
  private createClouds() {
    this.cloudsLayer = this.add.container(0, 0);
    this.cloudsLayer.setDepth(-80);
    
    const cloudPositions = [
      { x: 200, y: 100, scale: 1.8 },
      { x: 600, y: 60, scale: 2.2 },
      { x: 1100, y: 90, scale: 1.5 },
      { x: 1600, y: 70, scale: 2.0 },
      { x: 2100, y: 110, scale: 1.7 },
      { x: 2600, y: 50, scale: 2.3 },
    ];

    cloudPositions.forEach(pos => {
      const cloud = this.createCloud(pos.x, pos.y, pos.scale);
      this.cloudsLayer.add(cloud);
      
      // Slow drift
      this.tweens.add({
        targets: cloud,
        x: cloud.x + 150,
        duration: 60000 + Math.random() * 30000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createCloud(x: number, y: number, scale: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const g = this.add.graphics();
    
    g.fillStyle(0xFFFFFF, 0.85);
    g.fillEllipse(0, 0, 100 * scale, 50 * scale);
    g.fillEllipse(-40 * scale, 15 * scale, 70 * scale, 40 * scale);
    g.fillEllipse(45 * scale, 10 * scale, 80 * scale, 45 * scale);
    g.fillEllipse(15 * scale, -15 * scale, 60 * scale, 35 * scale);
    
    container.add(g);
    return container;
  }

  // ========================
  // GROUND PLANE
  // ========================
  private createGroundPlane() {
    const g = this.add.graphics();
    
    // Main grass
    g.fillStyle(0x7CB668, 1);
    g.fillRect(0, GROUND_LEVEL - 150, BRIARBROOK_MAP_WIDTH, BRIARBROOK_MAP_HEIGHT - GROUND_LEVEL + 250);
    
    // Grass variations
    for (let i = 0; i < 1500; i++) {
      const x = Phaser.Math.Between(0, BRIARBROOK_MAP_WIDTH);
      const y = Phaser.Math.Between(GROUND_LEVEL - 120, BRIARBROOK_MAP_HEIGHT);
      const shade = Math.random() > 0.5 ? 0x8CC678 : 0x6CA658;
      g.fillStyle(shade, 0.4);
      g.fillCircle(x, y, Phaser.Math.Between(2, 6));
    }
    
    g.setDepth(-50);
  }

  // ========================
  // PLAYER'S HOME AREA
  // ========================
  private createPlayerHome() {
    const homeX = PLAYER_HOME.x;
    const homeY = PLAYER_HOME.y;
    
    // ---- Yard fence ----
    const fenceG = this.add.graphics();
    fenceG.fillStyle(0xDEB887, 1);
    
    // Fence posts and rails
    for (let i = 0; i < 8; i++) {
      const fx = homeX - 200 + i * 80;
      // Posts
      fenceG.fillRoundedRect(fx - 6, homeY + 180, 12, 60, 3);
      // Rails
      if (i < 7) {
        fenceG.fillRoundedRect(fx + 6, homeY + 195, 68, 8, 2);
        fenceG.fillRoundedRect(fx + 6, homeY + 220, 68, 8, 2);
      }
    }
    fenceG.setDepth(-20);

    // ---- Garden plots ----
    const gardenG = this.add.graphics();
    // Soil
    gardenG.fillStyle(0x8B6914, 1);
    gardenG.fillRoundedRect(homeX + 150, homeY + 100, 150, 80, 8);
    
    // Plants
    const plantColors = [0x228B22, 0x32CD32, 0x2E8B57];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        gardenG.fillStyle(plantColors[(row + col) % 3], 1);
        gardenG.fillCircle(homeX + 170 + col * 28, homeY + 120 + row * 25, 10);
        // Stems
        gardenG.fillStyle(0x228B22, 1);
        gardenG.fillRect(homeX + 168 + col * 28, homeY + 125 + row * 25, 4, 15);
      }
    }
    gardenG.setDepth(-15);

    // ---- The House ----
    this.createPlayerHouse(homeX, homeY);
    
    // ---- Mailbox ----
    const mailG = this.add.graphics();
    mailG.fillStyle(0x4A4A4A, 1);
    mailG.fillRoundedRect(homeX + 280, homeY + 150, 8, 80, 2);
    mailG.fillStyle(0xE74C3C, 1);
    mailG.fillRoundedRect(homeX + 260, homeY + 140, 50, 35, 6);
    mailG.fillStyle(0xC0392B, 1);
    mailG.fillRoundedRect(homeX + 262, homeY + 165, 46, 8, 3);
    // Flag
    mailG.fillStyle(0xE74C3C, 1);
    mailG.fillRect(homeX + 308, homeY + 145, 4, 25);
    mailG.setDepth(5);

    // ---- Welcome mat ----
    const matG = this.add.graphics();
    matG.fillStyle(0x8B4513, 1);
    matG.fillRoundedRect(homeX - 30, homeY + PLAYER_HOME.height / 2 + 10, 60, 25, 4);
    matG.setDepth(-5);

    // ---- Area label ----
    const homeLabel = this.add.text(homeX, homeY - PLAYER_HOME.height / 2 - 80, '🏠 Your Home', {
      fontSize: '24px',
      color: '#1E293B',
      fontStyle: 'bold',
      fontFamily: 'Nunito, sans-serif',
      backgroundColor: '#FFFFFF',
      padding: { x: 16, y: 8 },
    });
    homeLabel.setOrigin(0.5);
    homeLabel.setDepth(100);
  }

  private createPlayerHouse(x: number, y: number) {
    const g = this.add.graphics();
    const w = PLAYER_HOME.width;
    const h = PLAYER_HOME.height;

    // Shadow
    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(x + 10, y + h / 2 + 20, w + 60, 40);

    // Main house body
    g.fillStyle(0xFFF8E7, 1);
    g.fillRoundedRect(x - w / 2, y - h / 2 + 80, w, h - 80, 10);

    // Stone foundation
    g.fillStyle(0x9CA3AF, 1);
    g.fillRoundedRect(x - w / 2 - 5, y + h / 2 - 30, w + 10, 35, { tl: 0, tr: 0, bl: 8, br: 8 });

    // Wooden beams
    g.fillStyle(0x8B6914, 0.6);
    g.fillRect(x - w / 2 + 10, y - h / 2 + 85, 8, h - 90);
    g.fillRect(x + w / 2 - 18, y - h / 2 + 85, 8, h - 90);
    g.fillRect(x - w / 2 + 10, y, w - 20, 6);

    // Roof
    g.fillStyle(0xB45B3E, 1);
    g.beginPath();
    g.moveTo(x - w / 2 - 25, y - h / 2 + 80);
    g.lineTo(x, y - h / 2);
    g.lineTo(x + w / 2 + 25, y - h / 2 + 80);
    g.closePath();
    g.fill();

    // Roof highlight
    g.fillStyle(0xC96B4E, 1);
    g.beginPath();
    g.moveTo(x - w / 2 - 20, y - h / 2 + 78);
    g.lineTo(x, y - h / 2 + 10);
    g.lineTo(x, y - h / 2 + 80);
    g.closePath();
    g.fill();

    // Chimney
    g.fillStyle(0x7C533E, 1);
    g.fillRoundedRect(x + 50, y - h / 2 - 30, 35, 60, 4);
    g.fillStyle(0x8B6914, 1);
    g.fillRoundedRect(x + 47, y - h / 2 - 35, 41, 12, 4);
    // Smoke
    g.fillStyle(0xD1D5DB, 0.5);
    g.fillCircle(x + 67, y - h / 2 - 50, 12);
    g.fillCircle(x + 72, y - h / 2 - 70, 10);
    g.fillCircle(x + 65, y - h / 2 - 85, 8);

    // Door
    g.fillStyle(0x6B4423, 1);
    g.fillRoundedRect(x - 25, y + 30, 50, 90, { tl: 25, tr: 25, bl: 4, br: 4 });
    g.fillStyle(0x8B5A2B, 1);
    g.fillRect(x - 20, y + 60, 40, 3);
    g.fillRect(x - 20, y + 90, 40, 3);
    // Doorknob
    g.fillStyle(0xFCD34D, 1);
    g.fillCircle(x + 15, y + 80, 6);

    // Windows
    const windowPositions = [
      { wx: x - 70, wy: y - 30 },
      { wx: x + 70, wy: y - 30 },
    ];
    windowPositions.forEach(win => {
      // Window frame
      g.fillStyle(0x8B6914, 1);
      g.fillRoundedRect(win.wx - 28, win.wy - 35, 56, 70, 6);
      // Glass
      g.fillStyle(0x87CEEB, 0.8);
      g.fillRoundedRect(win.wx - 22, win.wy - 29, 44, 58, 4);
      // Panes
      g.fillStyle(0x8B6914, 1);
      g.fillRect(win.wx - 2, win.wy - 29, 4, 58);
      g.fillRect(win.wx - 22, win.wy - 2, 44, 4);
      // Curtains
      g.fillStyle(0xFFB6C1, 0.6);
      g.fillRect(win.wx - 20, win.wy - 27, 15, 54);
      g.fillRect(win.wx + 5, win.wy - 27, 15, 54);
    });

    // Flower box under window
    g.fillStyle(0x8B4513, 1);
    g.fillRoundedRect(x - 95, y + 5, 50, 20, 4);
    g.fillStyle(0xFF69B4, 1);
    g.fillCircle(x - 85, y, 8);
    g.fillCircle(x - 70, y - 2, 7);
    g.fillCircle(x - 55, y + 1, 8);

    g.setDepth(0);
  }

  // ========================
  // COUNTRYSIDE PATH
  // ========================
  private createCountrysidePath() {
    const g = this.add.graphics();
    
    // Winding dirt path
    g.fillStyle(0xD4C4A8, 1);
    
    // Path from home
    g.fillRoundedRect(PLAYER_HOME.x + 150, GROUND_LEVEL + 40, 200, 80, 20);
    
    // Curved path section (using simple rectangles with overlap)
    g.fillRoundedRect(PLAYER_HOME.x + 330, GROUND_LEVEL + 40, 150, 80, 20);
    g.fillRoundedRect(PLAYER_HOME.x + 450, GROUND_LEVEL + 50, 180, 70, 20);
    g.fillRoundedRect(PLAYER_HOME.x + 600, GROUND_LEVEL + 45, 200, 75, 20);
    
    // Path continuing to town
    g.fillRoundedRect(PLAYER_HOME.x + 750, GROUND_LEVEL + 40, 700, 80, 20);
    
    // Path stones texture
    g.fillStyle(0xE4D4B8, 0.6);
    for (let i = 0; i < 100; i++) {
      const px = Phaser.Math.Between(PLAYER_HOME.x + 150, AREAS.TOWN_SQUARE.startX);
      const py = Phaser.Math.Between(GROUND_LEVEL + 50, GROUND_LEVEL + 110);
      g.fillCircle(px, py, Phaser.Math.Between(3, 8));
    }

    g.setDepth(-25);

    // Signpost pointing to town
    const signG = this.add.graphics();
    signG.fillStyle(0x6B4423, 1);
    signG.fillRoundedRect(AREAS.PATH.startX + 300, GROUND_LEVEL - 20, 12, 150, 3);
    signG.fillStyle(0x8B6914, 1);
    signG.fillRoundedRect(AREAS.PATH.startX + 280, GROUND_LEVEL - 10, 100, 40, 8);
    signG.setDepth(5);

    const signText = this.add.text(AREAS.PATH.startX + 330, GROUND_LEVEL + 10, '→ Town', {
      fontSize: '18px',
      color: '#FFF8E7',
      fontStyle: 'bold',
      fontFamily: 'Nunito, sans-serif',
    });
    signText.setOrigin(0.5);
    signText.setDepth(6);
  }

  // ========================
  // TOWN SQUARE
  // ========================
  private createTownSquare() {
    const cx = TOWN_CENTER.x;
    const cy = GROUND_LEVEL;

    // ---- Town square paving ----
    const paveG = this.add.graphics();
    
    // Large circular plaza
    paveG.fillStyle(0xC9B896, 1);
    paveG.fillCircle(cx, cy + 50, 350);
    
    // Inner decorative ring
    paveG.fillStyle(0xB8A886, 1);
    paveG.fillCircle(cx, cy + 50, 280);
    
    // Center area
    paveG.fillStyle(0xC9B896, 1);
    paveG.fillCircle(cx, cy + 50, 200);
    
    // Paving pattern
    paveG.fillStyle(0xD9C8A6, 0.5);
    for (let ring = 0; ring < 5; ring++) {
      const radius = 80 + ring * 60;
      const stones = 12 + ring * 4;
      for (let i = 0; i < stones; i++) {
        const angle = (i / stones) * Math.PI * 2;
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + 50 + Math.sin(angle) * radius * 0.6;
        paveG.fillCircle(sx, sy, 8);
      }
    }
    
    paveG.setDepth(-30);

    // ---- Fountain ----
    this.createFountain(cx, cy + 30);

    // ---- Town entrance arch ----
    const archG = this.add.graphics();
    archG.fillStyle(0x9CA3AF, 1);
    // Pillars
    archG.fillRoundedRect(cx - 420, cy - 150, 40, 280, 6);
    archG.fillRoundedRect(cx + 380, cy - 150, 40, 280, 6);
    // Arch top bar
    archG.fillStyle(0xA8B0BA, 1);
    archG.fillRoundedRect(cx - 420, cy - 185, 840, 40, 8);
    // Decorative arch curve (semi-circle approximation)
    archG.fillStyle(0xB8C5D0, 1);
    archG.fillEllipse(cx, cy - 205, 400, 60);
    archG.setDepth(-10);

    // Welcome sign on arch
    const welcomeText = this.add.text(cx, cy - 220, '✨ Welcome to Briarbrook ✨', {
      fontSize: '28px',
      color: '#1E293B',
      fontStyle: 'bold',
      fontFamily: 'Nunito, sans-serif',
    });
    welcomeText.setOrigin(0.5);
    welcomeText.setDepth(-9);

    // ---- Benches around square ----
    const benchPositions = [
      { x: cx - 280, y: cy + 180 },
      { x: cx + 280, y: cy + 180 },
    ];
    benchPositions.forEach(pos => {
      this.createBench(pos.x, pos.y);
    });

    // ---- Lamp posts ----
    const lampPositions = [
      { x: cx - 350, y: cy - 50 },
      { x: cx + 350, y: cy - 50 },
      { x: cx - 200, y: cy + 200 },
      { x: cx + 200, y: cy + 200 },
    ];
    lampPositions.forEach(pos => {
      this.createLampPost(pos.x, pos.y);
    });
  }

  private createFountain(x: number, y: number) {
    const g = this.add.graphics();
    
    // Base pool
    g.fillStyle(0x6B7280, 1);
    g.fillEllipse(x, y + 60, 180, 60);
    g.fillStyle(0x60A5FA, 0.7);
    g.fillEllipse(x, y + 55, 160, 45);
    
    // Center pedestal
    g.fillStyle(0x9CA3AF, 1);
    g.fillRoundedRect(x - 25, y - 40, 50, 100, 8);
    
    // Top bowl
    g.fillStyle(0xA8B0BA, 1);
    g.fillEllipse(x, y - 50, 80, 30);
    g.fillStyle(0x60A5FA, 0.6);
    g.fillEllipse(x, y - 55, 60, 20);
    
    // Water spout
    g.fillStyle(0x93C5FD, 0.8);
    g.fillRect(x - 3, y - 90, 6, 40);
    
    // Water droplets
    g.fillStyle(0x93C5FD, 0.6);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dropX = x + Math.cos(angle) * 30;
      const dropY = y - 30 + Math.sin(angle) * 15;
      g.fillCircle(dropX, dropY, 4);
    }
    
    g.setDepth(10);
  }

  private createBench(x: number, y: number) {
    const g = this.add.graphics();
    g.fillStyle(0x8B6914, 1);
    // Seat
    g.fillRoundedRect(x - 50, y, 100, 15, 4);
    // Back
    g.fillRoundedRect(x - 45, y - 35, 90, 12, 4);
    // Legs
    g.fillRoundedRect(x - 40, y + 12, 10, 25, 2);
    g.fillRoundedRect(x + 30, y + 12, 10, 25, 2);
    // Arm rests
    g.fillRoundedRect(x - 50, y - 20, 12, 25, 3);
    g.fillRoundedRect(x + 38, y - 20, 12, 25, 3);
    g.setDepth(5);
  }

  private createLampPost(x: number, y: number) {
    const g = this.add.graphics();
    // Pole
    g.fillStyle(0x374151, 1);
    g.fillRoundedRect(x - 5, y, 10, 120, 3);
    // Base
    g.fillStyle(0x4B5563, 1);
    g.fillRoundedRect(x - 15, y + 110, 30, 20, 4);
    // Lamp housing
    g.fillStyle(0x374151, 1);
    g.fillRoundedRect(x - 20, y - 25, 40, 30, 6);
    // Light glow
    g.fillStyle(0xFCD34D, 0.3);
    g.fillCircle(x, y + 20, 40);
    g.fillStyle(0xFEF3C7, 0.8);
    g.fillRoundedRect(x - 15, y - 20, 30, 20, 4);
    g.setDepth(5);
  }

  // ========================
  // BUILDINGS
  // ========================
  private createBuildings() {
    BRIARBROOK_BUILDINGS.forEach((data) => {
      let building: BuildingSprite;
      
      switch (data.id) {
        case 'job-board': building = this.createJobBoard(data); break;
        case 'market-row': building = this.createMarketStall(data); break;
        case 'town-vault': building = this.createVault(data); break;
        case 'guild-hall': building = this.createGuildHall(data); break;
        default: building = this.createGenericBuilding(data);
      }
      
      this.buildings.push(building);
    });
  }

  private createJobBoard(data: BriarbrookBuilding): BuildingSprite {
    const container = this.add.container(data.x, data.y) as BuildingSprite;
    container.buildingData = data;
    const g = this.add.graphics();

    // Shadow
    g.fillStyle(0x000000, 0.12);
    g.fillEllipse(0, data.height / 2 + 15, data.width + 30, 25);

    // Small shelter structure
    g.fillStyle(0x8B6914, 1);
    // Posts
    g.fillRoundedRect(-data.width / 2 + 15, 20, 15, data.height / 2, 4);
    g.fillRoundedRect(data.width / 2 - 30, 20, 15, data.height / 2, 4);
    
    // Roof
    g.fillStyle(0xB45B3E, 1);
    g.beginPath();
    g.moveTo(-data.width / 2 - 10, 20);
    g.lineTo(0, -20);
    g.lineTo(data.width / 2 + 10, 20);
    g.closePath();
    g.fill();

    // Cork board
    g.fillStyle(0xC9A86C, 1);
    g.fillRoundedRect(-data.width / 2 + 25, -data.height / 2 + 60, data.width - 50, data.height / 2 + 10, 8);
    
    // Frame
    g.fillStyle(0x5D4037, 1);
    g.fillRoundedRect(-data.width / 2 + 20, -data.height / 2 + 55, data.width - 40, 10, 3);
    g.fillRoundedRect(-data.width / 2 + 20, 65, data.width - 40, 10, 3);

    // Papers
    const papers = [
      { px: -40, py: -20, pw: 45, ph: 55 },
      { px: 10, py: -30, pw: 50, ph: 60 },
      { px: -20, py: 30, pw: 40, ph: 50 },
      { px: 30, py: 20, pw: 48, ph: 52 },
    ];
    papers.forEach((p, i) => {
      g.fillStyle([0xFFFAF0, 0xFFF8DC, 0xF0FFF0][i % 3], 1);
      g.fillRect(p.px - p.pw / 2, p.py - p.ph / 2, p.pw, p.ph);
      // Pin
      g.fillStyle(0xE74C3C, 1);
      g.fillCircle(p.px, p.py - p.ph / 2 + 8, 5);
    });

    container.add(g);
    this.setupBuildingInteraction(container, data);
    return container;
  }

  private createMarketStall(data: BriarbrookBuilding): BuildingSprite {
    const container = this.add.container(data.x, data.y) as BuildingSprite;
    container.buildingData = data;
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.12);
    g.fillEllipse(0, data.height / 2 + 15, data.width + 50, 30);

    // Back wall
    g.fillStyle(0xDEB887, 1);
    g.fillRoundedRect(-data.width / 2, -data.height / 2 + 50, data.width, data.height - 50, 8);

    // Counter
    g.fillStyle(0x8B6914, 1);
    g.fillRoundedRect(-data.width / 2 - 30, data.height / 2 - 60, data.width + 60, 40, 8);
    g.fillStyle(0xA07B1E, 1);
    g.fillRoundedRect(-data.width / 2 - 25, data.height / 2 - 58, data.width + 50, 10, 4);

    // Awning
    const stripeW = 30;
    for (let i = 0; i < 10; i++) {
      g.fillStyle(i % 2 === 0 ? 0xE74C3C : 0xFFFFFF, 1);
      g.fillRect(-data.width / 2 - 30 + i * stripeW, -data.height / 2, stripeW, 55);
    }
    g.fillStyle(0xC0392B, 1);
    g.fillRoundedRect(-data.width / 2 - 30, -data.height / 2 + 50, data.width + 60, 15, { tl: 0, tr: 0, bl: 8, br: 8 });

    // Poles
    g.fillStyle(0x6B4423, 1);
    g.fillRoundedRect(-data.width / 2 - 20, -data.height / 2 + 20, 12, data.height, 4);
    g.fillRoundedRect(data.width / 2 + 8, -data.height / 2 + 20, 12, data.height, 4);

    // Products
    g.fillStyle(0xFF6B6B, 1);
    [-80, -55, -30].forEach(px => g.fillCircle(px, data.height / 2 - 75, 14));
    g.fillStyle(0x27AE60, 1);
    [10, 40].forEach(px => g.fillEllipse(px, data.height / 2 - 73, 30, 15));
    g.fillStyle(0xD4A84B, 1);
    [80, 100].forEach(px => g.fillEllipse(px, data.height / 2 - 70, 20, 12));

    container.add(g);
    this.setupBuildingInteraction(container, data);
    return container;
  }

  private createVault(data: BriarbrookBuilding): BuildingSprite {
    const container = this.add.container(data.x, data.y) as BuildingSprite;
    container.buildingData = data;
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, data.height / 2 + 20, data.width + 40, 35);

    // Main building
    g.fillStyle(0x9CA3AF, 1);
    g.fillRoundedRect(-data.width / 2, -data.height / 2 + 60, data.width, data.height - 60, 6);

    // Stone texture
    g.fillStyle(0x8B929B, 0.4);
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        const ox = row % 2 === 0 ? 0 : 18;
        g.fillRoundedRect(-data.width / 2 + 8 + col * 38 + ox, -data.height / 2 + 70 + row * 32, 32, 28, 2);
      }
    }

    // Columns
    g.fillStyle(0xD1D5DB, 1);
    g.fillRoundedRect(-data.width / 2 + 12, -data.height / 2 + 70, 22, data.height - 90, 4);
    g.fillRoundedRect(data.width / 2 - 34, -data.height / 2 + 70, 22, data.height - 90, 4);

    // Pediment
    g.fillStyle(0xB8BFC7, 1);
    g.beginPath();
    g.moveTo(-data.width / 2 - 15, -data.height / 2 + 60);
    g.lineTo(0, -data.height / 2);
    g.lineTo(data.width / 2 + 15, -data.height / 2 + 60);
    g.closePath();
    g.fill();

    // Vault door
    g.fillStyle(0x4B5563, 1);
    g.fillRoundedRect(-35, 30, 70, 100, { tl: 35, tr: 35, bl: 4, br: 4 });
    g.fillStyle(0xFCD34D, 1);
    g.fillCircle(0, 75, 20);
    g.fillStyle(0xEAB308, 1);
    g.fillCircle(0, 75, 14);
    // Spokes
    g.lineStyle(3, 0xFCD34D, 1);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.lineBetween(Math.cos(a) * 6, 75 + Math.sin(a) * 6, Math.cos(a) * 17, 75 + Math.sin(a) * 17);
    }

    // "VAULT" plaque
    g.fillStyle(0xFCD34D, 1);
    g.fillRoundedRect(-35, -data.height / 2 + 25, 70, 24, 6);

    container.add(g);
    this.setupBuildingInteraction(container, data);
    return container;
  }

  private createGuildHall(data: BriarbrookBuilding): BuildingSprite {
    const container = this.add.container(data.x, data.y) as BuildingSprite;
    container.buildingData = data;
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.15);
    g.fillEllipse(0, data.height / 2 + 25, data.width + 60, 45);

    // Main building
    g.fillStyle(0xE8DCC8, 1);
    g.fillRoundedRect(-data.width / 2, -data.height / 2 + 100, data.width, data.height - 100, 10);

    // Decorative lines
    g.fillStyle(0xD4C8B4, 0.5);
    for (let i = 0; i < 6; i++) {
      g.fillRect(-data.width / 2 + 20, -data.height / 2 + 120 + i * 40, data.width - 40, 3);
    }

    // Columns
    g.fillStyle(0xF5EFE6, 1);
    [-data.width / 2 + 25, -40, 10, data.width / 2 - 55].forEach(cx => {
      g.fillRoundedRect(cx, -data.height / 2 + 105, 28, data.height - 120, 6);
      // Capital
      g.fillStyle(0xE8DCC8, 1);
      g.fillRoundedRect(cx - 5, -data.height / 2 + 95, 38, 15, 4);
      g.fillStyle(0xF5EFE6, 1);
    });

    // Roof
    g.fillStyle(0x8B5CF6, 0.9);
    g.beginPath();
    g.moveTo(-data.width / 2 - 20, -data.height / 2 + 100);
    g.lineTo(0, -data.height / 2 + 20);
    g.lineTo(data.width / 2 + 20, -data.height / 2 + 100);
    g.closePath();
    g.fill();

    // Emblem
    g.fillStyle(0xFCD34D, 1);
    g.fillCircle(0, -data.height / 2 + 60, 28);
    g.fillStyle(0x8B5CF6, 1);
    g.fillCircle(0, -data.height / 2 + 60, 20);
    // Star
    g.fillStyle(0xFCD34D, 1);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      g.fillCircle(Math.cos(a) * 12, -data.height / 2 + 60 + Math.sin(a) * 12, 5);
    }

    // Doors
    g.fillStyle(0x5D4037, 1);
    g.fillRoundedRect(-50, 50, 45, 100, { tl: 22, tr: 22, bl: 4, br: 4 });
    g.fillRoundedRect(5, 50, 45, 100, { tl: 22, tr: 22, bl: 4, br: 4 });
    g.fillStyle(0xFCD34D, 1);
    g.fillCircle(-20, 100, 6);
    g.fillCircle(32, 100, 6);

    // Flags
    g.fillStyle(0x8B5CF6, 1);
    g.fillRect(-data.width / 2 - 8, -data.height / 2 + 30, 8, 90);
    g.fillRect(data.width / 2, -data.height / 2 + 30, 8, 90);
    g.fillStyle(0x9D6FE8, 1);
    g.beginPath();
    g.moveTo(-data.width / 2 - 8, -data.height / 2 + 35);
    g.lineTo(-data.width / 2 - 45, -data.height / 2 + 60);
    g.lineTo(-data.width / 2 - 8, -data.height / 2 + 85);
    g.fill();
    g.beginPath();
    g.moveTo(data.width / 2 + 8, -data.height / 2 + 35);
    g.lineTo(data.width / 2 + 45, -data.height / 2 + 60);
    g.lineTo(data.width / 2 + 8, -data.height / 2 + 85);
    g.fill();

    container.add(g);
    this.setupBuildingInteraction(container, data);
    return container;
  }

  private createGenericBuilding(data: BriarbrookBuilding): BuildingSprite {
    const container = this.add.container(data.x, data.y) as BuildingSprite;
    container.buildingData = data;
    const g = this.add.graphics();
    g.fillStyle(data.color, 1);
    g.fillRoundedRect(-data.width / 2, -data.height / 2, data.width, data.height, 12);
    container.add(g);
    this.setupBuildingInteraction(container, data);
    return container;
  }

  private setupBuildingInteraction(container: BuildingSprite, data: BriarbrookBuilding) {
    const glowRing = this.add.graphics();
    glowRing.setAlpha(0);
    container.glowRing = glowRing;
    container.isGlowing = false;

    // Label
    const labelBg = this.add.graphics();
    labelBg.fillStyle(0xFFFFFF, 0.95);
    const labelW = data.name.length * 11 + 30;
    labelBg.fillRoundedRect(-labelW / 2, data.height / 2 + 30, labelW, 36, 18);
    container.add(labelBg);

    const label = this.add.text(0, data.height / 2 + 47, data.name, {
      fontSize: '18px',
      color: '#1E293B',
      fontStyle: 'bold',
      fontFamily: 'Nunito, sans-serif',
    });
    label.setOrigin(0.5);
    container.add(label);

    container.setSize(data.width, data.height);
    container.setInteractive({ useHandCursor: true });
    container.setDepth(LAYERS.buildings + data.y / 100);

    container.on('pointerdown', () => {
      if (!this.isMovementPaused) {
        gameEventBus.emitToReact({ type: 'BUILDING_CLICKED', buildingId: data.id, questId: '' });
      }
    });

    container.on('pointerover', () => {
      if (!this.isMovementPaused) {
        this.tweens.add({ targets: container, scaleX: 1.02, scaleY: 1.02, duration: 120, ease: 'Back.easeOut' });
      }
    });

    container.on('pointerout', () => {
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 120 });
    });
  }

  // ========================
  // NPCs
  // ========================
  private createNPCs() {
    const npcConfigs = [
      { bid: 'job-board', ox: 120, hair: 0x8B4513, clothes: 0x2563EB },
      { bid: 'market-row', ox: 160, hair: 0x4A3728, clothes: 0xDC2626 },
      { bid: 'town-vault', ox: 130, hair: 0x1F2937, clothes: 0x374151 },
      { bid: 'guild-hall', ox: 170, hair: 0x92400E, clothes: 0x7C3AED },
    ];

    npcConfigs.forEach(cfg => {
      const bld = BRIARBROOK_BUILDINGS.find(b => b.id === cfg.bid);
      if (bld) {
        const npc = this.createNPC(bld.x + cfg.ox, bld.y + bld.height / 2 - 20, cfg.hair, cfg.clothes) as NPCSprite;
        npc.buildingId = cfg.bid;
        npc.bobOffset = Math.random() * Math.PI * 2;
        npc.baseY = bld.y + bld.height / 2 - 20;
        this.npcs.push(npc);
      }
    });
  }

  private createNPC(x: number, y: number, hair: number, clothes: number): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.12);
    g.fillEllipse(0, 40, 45, 15);

    g.fillStyle(clothes, 1);
    g.fillRoundedRect(-20, 8, 40, 50, 10);
    g.fillStyle(lightenColor(clothes, 0.2), 1);
    g.fillRoundedRect(-17, 12, 16, 42, 8);

    g.fillStyle(0xFFDBB4, 1);
    g.fillCircle(0, -12, 24);

    g.fillStyle(hair, 1);
    g.fillEllipse(0, -30, 44, 22);
    g.fillRoundedRect(-22, -40, 44, 18, 10);

    g.fillStyle(0x1F2937, 1);
    g.fillCircle(-8, -15, 4);
    g.fillCircle(8, -15, 4);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(-7, -16, 1.5);
    g.fillCircle(9, -16, 1.5);

    g.fillStyle(0xFFB4B4, 0.4);
    g.fillCircle(-14, -6, 6);
    g.fillCircle(14, -6, 6);

    g.lineStyle(2, 0x8B6914, 1);
    g.beginPath();
    g.arc(0, -4, 7, 0.2, Math.PI - 0.2);
    g.stroke();

    c.add(g);
    c.setDepth(LAYERS.characters + y / 100);
    return c;
  }

  // ========================
  // DECORATIONS
  // ========================
  private createDecorations() {
    // Trees throughout
    const treePos = [
      { x: 100, y: GROUND_LEVEL - 30, s: 1.5 },
      { x: PLAYER_HOME.x + 400, y: GROUND_LEVEL - 20, s: 1.3 },
      { x: AREAS.PATH.startX + 150, y: GROUND_LEVEL - 40, s: 1.4 },
      { x: AREAS.PATH.startX + 450, y: GROUND_LEVEL - 25, s: 1.2 },
      { x: TOWN_CENTER.x - 500, y: GROUND_LEVEL - 35, s: 1.3 },
      { x: TOWN_CENTER.x + 600, y: GROUND_LEVEL - 30, s: 1.4 },
      { x: 3100, y: GROUND_LEVEL - 40, s: 1.5 },
    ];
    treePos.forEach(t => this.createTree(t.x, t.y, t.s));

    // Flowers
    const flowerPos = [
      { x: PLAYER_HOME.x - 150, y: GROUND_LEVEL + 30 },
      { x: PLAYER_HOME.x + 100, y: GROUND_LEVEL + 60 },
      { x: AREAS.PATH.startX + 200, y: GROUND_LEVEL + 50 },
      { x: TOWN_CENTER.x - 300, y: GROUND_LEVEL + 250 },
      { x: TOWN_CENTER.x + 300, y: GROUND_LEVEL + 260 },
    ];
    flowerPos.forEach(f => this.createFlowers(f.x, f.y));
  }

  private createTree(x: number, y: number, scale: number) {
    const c = this.add.container(x, y);
    const g = this.add.graphics();

    g.fillStyle(0x000000, 0.1);
    g.fillEllipse(5, 70 * scale, 55 * scale, 20 * scale);

    g.fillStyle(0x8B6914, 1);
    g.fillRoundedRect(-12 * scale, 10 * scale, 24 * scale, 60 * scale, 6);
    g.fillStyle(0xA07B1E, 1);
    g.fillRoundedRect(-9 * scale, 15 * scale, 10 * scale, 50 * scale, 4);

    g.fillStyle(0x4CAF50, 1);
    g.fillCircle(0, -40 * scale, 50 * scale);
    g.fillCircle(-30 * scale, -15 * scale, 40 * scale);
    g.fillCircle(30 * scale, -15 * scale, 40 * scale);
    g.fillCircle(-18 * scale, 10 * scale, 35 * scale);
    g.fillCircle(18 * scale, 10 * scale, 35 * scale);

    g.fillStyle(0x66BB6A, 0.6);
    g.fillCircle(-12 * scale, -55 * scale, 25 * scale);
    g.fillCircle(18 * scale, -40 * scale, 22 * scale);

    c.add(g);
    c.setDepth(LAYERS.decorations + y / 100);
  }

  private createFlowers(x: number, y: number) {
    const g = this.add.graphics();
    const colors = [0xFF6B6B, 0xFFE66D, 0xC56CF0, 0xFF9FF3, 0x74B9FF];

    for (let i = 0; i < 10; i++) {
      const fx = x + Phaser.Math.Between(-40, 40);
      const fy = y + Phaser.Math.Between(-20, 20);
      const col = colors[i % colors.length];

      g.fillStyle(0x27AE60, 1);
      g.fillRect(fx - 1, fy, 2, 15);

      g.fillStyle(col, 1);
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        g.fillCircle(fx + Math.cos(a) * 6, fy - 6 + Math.sin(a) * 6, 5);
      }
      g.fillStyle(0xFFD700, 1);
      g.fillCircle(fx, fy - 6, 4);
    }
    g.setDepth(LAYERS.decorations);
  }

  // ========================
  // PLAYER
  // ========================
  private createPlayer() {
    const startX = PLAYER_HOME.x + 200;
    const startY = GROUND_LEVEL + 80;

    this.player = this.add.container(startX, startY);

    this.playerShadow = this.add.ellipse(startX, startY + 35, 55, 20, 0x000000, 0.18);
    this.playerShadow.setDepth(LAYERS.characters - 1);

    const g = this.add.graphics();

    g.fillStyle(0x3B82F6, 1);
    g.fillRoundedRect(-24, 10, 48, 55, 12);
    g.fillStyle(0x60A5FA, 1);
    g.fillRoundedRect(-20, 14, 20, 46, 10);

    g.fillStyle(0xFFDBB4, 1);
    g.fillCircle(0, -14, 30);

    g.fillStyle(0x5D4037, 1);
    g.fillEllipse(0, -38, 55, 28);
    g.fillRoundedRect(-28, -50, 56, 22, 12);

    g.fillStyle(0x1F2937, 1);
    g.fillCircle(-10, -18, 5);
    g.fillCircle(10, -18, 5);
    g.fillStyle(0xFFFFFF, 1);
    g.fillCircle(-8, -19, 2);
    g.fillCircle(12, -19, 2);

    g.fillStyle(0xFFB4B4, 0.5);
    g.fillCircle(-17, -6, 7);
    g.fillCircle(17, -6, 7);

    g.lineStyle(3, 0x8B6914, 1);
    g.beginPath();
    g.arc(0, -3, 9, 0.2, Math.PI - 0.2);
    g.stroke();

    this.player.add(g);
    this.player.setSize(PLAYER_SIZE, PLAYER_SIZE);
    this.player.setDepth(LAYERS.characters);

    this.physics.add.existing(this.player);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(PLAYER_SIZE * 0.8, PLAYER_SIZE * 0.8);
  }

  // ========================
  // UI
  // ========================
  private createInteractPrompt() {
    this.interactPrompt = this.add.container(0, 0);

    const bg = this.add.graphics();
    bg.fillStyle(0xFFFFFF, 0.95);
    bg.fillRoundedRect(-110, -22, 220, 44, 22);

    const text = this.add.text(0, 0, '✨ Press E or Click', {
      fontSize: '20px',
      color: '#1E293B',
      fontStyle: 'bold',
      fontFamily: 'Nunito, sans-serif',
    });
    text.setOrigin(0.5);

    this.interactPrompt.add([bg, text]);
    this.interactPrompt.setVisible(false);
    this.interactPrompt.setDepth(LAYERS.prompts);
  }

  private createUI() {
    // Title follows camera
    const title = this.add.container(0, 0);
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0xFFFFFF, 0.9);
    titleBg.fillRoundedRect(-130, -25, 260, 50, 25);
    const titleText = this.add.text(0, 0, '🌿 Briarbrook', {
      fontSize: '26px',
      color: '#1E293B',
      fontStyle: 'bold',
      fontFamily: 'Nunito, sans-serif',
    });
    titleText.setOrigin(0.5);
    title.add([titleBg, titleText]);
    title.setScrollFactor(0);
    title.setPosition(this.scale.width / 2, 40);
    title.setDepth(LAYERS.ui);

    // Resize handler
    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      title.setPosition(gameSize.width / 2, 40);
    });
  }

  // ========================
  // INPUT
  // ========================
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

    this.wasd.E.on('down', () => {
      if (this.nearbyBuilding && !this.isMovementPaused) {
        gameEventBus.emitToReact({ type: 'BUILDING_CLICKED', buildingId: this.nearbyBuilding.buildingData.id, questId: '' });
      }
    });
  }

  private setupAnimations() {
    this.tweens.add({
      targets: this,
      glowAlpha: { from: 0.3, to: 0.7 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // ========================
  // UPDATE
  // ========================
  update(_time: number, delta: number) {
    this.gameTime += delta;

    if (this.isMovementPaused) {
      (this.player.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      this.interactPrompt.setVisible(false);
      return;
    }

    this.handleMovement();
    this.updateParallax();
    this.updateNPCs();
    this.updatePlayer();
    this.checkProximity();
  }

  private handleMovement() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -PLAYER_SPEED;
    if (this.cursors.right.isDown || this.wasd.D.isDown) vx = PLAYER_SPEED;
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -PLAYER_SPEED;
    if (this.cursors.down.isDown || this.wasd.S.isDown) vy = PLAYER_SPEED;

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }
    body.setVelocity(vx, vy);
  }

  private updateParallax() {
    const camX = this.cameras.main.scrollX;
    
    // Far mountains move slowest
    this.farMountains.tilePositionX = camX * 0.1;
    
    // Mid hills move faster
    this.midHills.tilePositionX = camX * 0.25;
    
    // Clouds have their own drift + slight parallax
    this.cloudsLayer.x = -camX * 0.15;
  }

  private updateNPCs() {
    this.npcs.forEach(npc => {
      const bob = Math.sin(this.gameTime / 600 + npc.bobOffset) * 3;
      npc.y = npc.baseY + bob;
    });
  }

  private updatePlayer() {
    this.player.setDepth(LAYERS.characters + this.player.y / 100);
    this.playerShadow.setPosition(this.player.x, this.player.y + 35);
  }

  private checkProximity() {
    let closest: BuildingSprite | null = null;
    let closestDist = INTERACTION_RANGE;

    for (const b of this.buildings) {
      const dx = b.x - this.player.x;
      const dy = b.y - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist) {
        closest = b;
        closestDist = dist;
      }

      if (dist < INTERACTION_RANGE && !b.isGlowing) {
        b.isGlowing = true;
      } else if (dist >= INTERACTION_RANGE && b.isGlowing) {
        b.isGlowing = false;
        b.glowRing.clear();
        b.glowRing.setAlpha(0);
      }

      if (b.isGlowing) this.drawGlow(b);
    }

    this.nearbyBuilding = closest;

    if (closest) {
      this.interactPrompt.setPosition(closest.x, closest.y - closest.buildingData.height / 2 - 70);
      this.interactPrompt.setVisible(true);
    } else {
      this.interactPrompt.setVisible(false);
    }
  }

  private drawGlow(b: BuildingSprite) {
    const d = b.buildingData;
    b.glowRing.clear();
    b.glowRing.lineStyle(10, d.color, this.glowAlpha * 0.4);
    b.glowRing.strokeRoundedRect(b.x - d.width / 2 - 18, b.y - d.height / 2 - 18, d.width + 36, d.height + 36, 16);
    b.glowRing.lineStyle(5, d.color, this.glowAlpha);
    b.glowRing.strokeRoundedRect(b.x - d.width / 2 - 10, b.y - d.height / 2 - 10, d.width + 20, d.height + 20, 14);
    b.glowRing.setAlpha(1);
    b.glowRing.setDepth(b.depth - 1);
  }
}
