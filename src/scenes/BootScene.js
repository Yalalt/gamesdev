import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../utils/Constants.js';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Show loading text
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'Ачааллаж байна...', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }

    create() {
        this.generateAssets();
        this.scene.start('NameInputScene');
    }

    generateAssets() {
        // Player sprite
        this.generateRect('player', 50, 70, COLORS.PLAYER);
        this.generateRect('player_slide', 50, 35, COLORS.PLAYER);

        // Obstacles
        this.generateRect('train', 60, 120, COLORS.TRAIN);
        this.generateRect('barrier_low', 70, 30, COLORS.BARRIER_LOW);
        this.generateRect('barrier_high', 70, 30, COLORS.BARRIER_HIGH);
        this.generateRect('tunnel_wall', 60, 100, COLORS.TUNNEL);

        // Collectibles
        this.generateCircle('coin', 12, COLORS.COIN);
        this.generateCircle('powerup_magnet', 16, COLORS.MAGNET);
        this.generateCircle('powerup_jetpack', 16, COLORS.JETPACK);
        this.generateCircle('powerup_multiplier', 16, COLORS.MULTIPLIER);
        this.generateCircle('powerup_shield', 16, COLORS.SHIELD);

        // Rail tie for track decoration
        this.generateRect('rail_tie', 100, 8, COLORS.RAIL_TIE);

        // Particle
        this.generateCircle('particle', 4, 0xFFFFFF);
        this.generateCircle('spark', 3, COLORS.COIN);
    }

    generateRect(key, width, height, color) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, width, height);

        // Add some detail/shading
        graphics.fillStyle(0xFFFFFF, 0.2);
        graphics.fillRect(2, 2, width - 4, height / 3);

        graphics.fillStyle(0x000000, 0.2);
        graphics.fillRect(2, height * 2 / 3, width - 4, height / 3 - 2);

        graphics.generateTexture(key, width, height);
        graphics.destroy();
    }

    generateCircle(key, radius, color) {
        const size = radius * 2 + 4;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Glow effect
        graphics.fillStyle(color, 0.3);
        graphics.fillCircle(size / 2, size / 2, radius + 2);

        graphics.fillStyle(color, 1);
        graphics.fillCircle(size / 2, size / 2, radius);

        // Highlight
        graphics.fillStyle(0xFFFFFF, 0.4);
        graphics.fillCircle(size / 2 - radius * 0.3, size / 2 - radius * 0.3, radius * 0.4);

        graphics.generateTexture(key, size, size);
        graphics.destroy();
    }
}
