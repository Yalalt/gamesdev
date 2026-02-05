import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants.js';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        // Semi-transparent overlay
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);

        // Pause text
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, '⏸ ТҮР ЗОГССОН', {
            font: 'bold 32px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Resume button
        const resumeBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '▶  ҮРГЭЛЖЛҮҮЛЭХ', {
            font: 'bold 22px Arial',
            fill: '#FFFFFF',
            backgroundColor: '#228B22',
            padding: { x: 24, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        resumeBtn.on('pointerover', () => resumeBtn.setStyle({ fill: '#FFD700' }));
        resumeBtn.on('pointerout', () => resumeBtn.setStyle({ fill: '#FFFFFF' }));
        resumeBtn.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });

        // Quit button
        const quitBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, 'Цэс рүү буцах', {
            font: '18px Arial',
            fill: '#AAAAAA',
            backgroundColor: '#333333',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        quitBtn.on('pointerover', () => quitBtn.setStyle({ fill: '#FFFFFF' }));
        quitBtn.on('pointerout', () => quitBtn.setStyle({ fill: '#AAAAAA' }));
        quitBtn.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });

        // ESC or P to resume
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
        this.input.keyboard.on('keydown-P', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
    }
}
