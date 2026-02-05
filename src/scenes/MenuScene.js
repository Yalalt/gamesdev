import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants.js';
import StorageManager from '../utils/StorageManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x1a1a2e);

        const playerName = StorageManager.getPlayerName() || 'Тоглогч';
        const highScore = StorageManager.getHighScore();

        // Title
        const title = this.add.text(GAME_WIDTH / 2, 80, 'SUBWAY\nSURFERS', {
            font: 'bold 48px Arial',
            fill: '#FFD700',
            align: 'center',
            stroke: '#B8860B',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Title animation
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Player name
        this.add.text(GAME_WIDTH / 2, 180, `Сайн уу, ${playerName}!`, {
            font: '20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // High score
        this.add.text(GAME_WIDTH / 2, 210, `Рекорд: ${highScore}`, {
            font: '16px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5);

        // Play button
        const playBtn = this.add.text(GAME_WIDTH / 2, 300, '▶  ТОГЛОХ', {
            font: 'bold 32px Arial',
            fill: '#FFFFFF',
            backgroundColor: '#228B22',
            padding: { x: 40, y: 16 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        playBtn.on('pointerover', () => playBtn.setStyle({ fill: '#FFD700' }));
        playBtn.on('pointerout', () => playBtn.setStyle({ fill: '#FFFFFF' }));
        playBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Leaderboard
        this.add.text(GAME_WIDTH / 2, 390, '🏆 ШИЛДЭГ ОНОО', {
            font: 'bold 20px Arial',
            fill: '#FFD700'
        }).setOrigin(0.5);

        const topScores = StorageManager.getTopScores(10);
        if (topScores.length === 0) {
            this.add.text(GAME_WIDTH / 2, 430, 'Одоогоор оноо байхгүй', {
                font: '14px Arial',
                fill: '#888888'
            }).setOrigin(0.5);
        } else {
            topScores.forEach((entry, i) => {
                const y = 420 + i * 28;
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                const color = i < 3 ? '#FFD700' : '#CCCCCC';
                this.add.text(80, y, `${medal}`, {
                    font: '14px Arial',
                    fill: color
                });
                this.add.text(120, y, entry.name, {
                    font: '14px Arial',
                    fill: '#FFFFFF'
                });
                this.add.text(GAME_WIDTH - 80, y, `${entry.score}`, {
                    font: 'bold 14px Arial',
                    fill: color
                }).setOrigin(1, 0);
            });
        }

        // Change name button
        const changeNameBtn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 80, 'Нэр солих', {
            font: '16px Arial',
            fill: '#AAAAAA',
            backgroundColor: '#333333',
            padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        changeNameBtn.on('pointerover', () => changeNameBtn.setStyle({ fill: '#FFFFFF' }));
        changeNameBtn.on('pointerout', () => changeNameBtn.setStyle({ fill: '#AAAAAA' }));
        changeNameBtn.on('pointerdown', () => {
            StorageManager.setPlayerName('');
            this.scene.start('NameInputScene');
        });

        // Sound toggle
        const settings = StorageManager.getSettings();
        const soundBtn = this.add.text(GAME_WIDTH - 20, 20, settings.soundEnabled ? '🔊' : '🔇', {
            font: '24px Arial',
            fill: '#FFFFFF'
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        soundBtn.on('pointerdown', () => {
            settings.soundEnabled = !settings.soundEnabled;
            StorageManager.saveSettings(settings);
            soundBtn.setText(settings.soundEnabled ? '🔊' : '🔇');
        });

        // Keyboard shortcut to start
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }
}
