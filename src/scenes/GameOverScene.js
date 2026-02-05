import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants.js';
import StorageManager from '../utils/StorageManager.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || { total: 0, distance: 0, coins: 0, coinScore: 0, stage: 1 };
        this.isNewRecord = data.isNewRecord || false;
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1a1a2e);

        // Dark overlay
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);

        // Game Over text
        const gameOverText = this.add.text(GAME_WIDTH / 2, 80, 'ТОГЛООМ\nДУУСЛАА', {
            font: 'bold 40px Arial',
            fill: '#FF4444',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // New record
        if (this.isNewRecord) {
            const recordText = this.add.text(GAME_WIDTH / 2, 155, '🎉 ШИНЭ РЕКОРД! 🎉', {
                font: 'bold 24px Arial',
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);

            this.tweens.add({
                targets: recordText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }

        // Score breakdown
        const startY = this.isNewRecord ? 200 : 170;

        this.add.text(GAME_WIDTH / 2, startY, `Нийт оноо: ${this.finalScore.total}`, {
            font: 'bold 28px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, startY + 45, `Зай: ${Math.floor(this.finalScore.distance)}m`, {
            font: '18px Arial',
            fill: '#CCCCCC'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, startY + 75, `Зоос: ${this.finalScore.coins} (${Math.floor(this.finalScore.coinScore)} оноо)`, {
            font: '18px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH / 2, startY + 105, `Шат: ${this.finalScore.stage}`, {
            font: '18px Arial',
            fill: '#00BFFF'
        }).setOrigin(0.5);

        // Leaderboard
        this.add.text(GAME_WIDTH / 2, startY + 160, '🏆 ШИЛДЭГ ОНОО', {
            font: 'bold 18px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5);

        const topScores = StorageManager.getTopScores(5);
        topScores.forEach((entry, i) => {
            const y = startY + 190 + i * 26;
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            const color = i < 3 ? '#FFD700' : '#CCCCCC';
            const isCurrentScore = entry.score === this.finalScore.total;

            this.add.text(80, y, `${medal} ${entry.name}`, {
                font: `${isCurrentScore ? 'bold ' : ''}14px Arial`,
                fill: isCurrentScore ? '#00FF00' : '#FFFFFF'
            });
            this.add.text(GAME_WIDTH - 80, y, `${entry.score}`, {
                font: `${isCurrentScore ? 'bold ' : ''}14px Arial`,
                fill: color
            }).setOrigin(1, 0);
        });

        // Retry button
        const retryY = startY + 340;
        const retryBtn = this.add.text(GAME_WIDTH / 2, retryY, '🔄  ДАХИН ТОГЛОХ', {
            font: 'bold 24px Arial',
            fill: '#FFFFFF',
            backgroundColor: '#228B22',
            padding: { x: 30, y: 14 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        retryBtn.on('pointerover', () => retryBtn.setStyle({ fill: '#FFD700' }));
        retryBtn.on('pointerout', () => retryBtn.setStyle({ fill: '#FFFFFF' }));
        retryBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Menu button
        const menuBtn = this.add.text(GAME_WIDTH / 2, retryY + 60, 'Цэс рүү буцах', {
            font: '18px Arial',
            fill: '#AAAAAA',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerover', () => menuBtn.setStyle({ fill: '#FFFFFF' }));
        menuBtn.on('pointerout', () => menuBtn.setStyle({ fill: '#AAAAAA' }));
        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Keyboard shortcuts
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
        this.input.keyboard.once('keydown-ENTER', () => this.scene.start('GameScene'));
        this.input.keyboard.once('keydown-ESC', () => this.scene.start('MenuScene'));
    }
}
