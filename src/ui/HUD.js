import { GAME_WIDTH, POWER_UP_TYPES } from '../utils/Constants.js';
import StorageManager from '../utils/StorageManager.js';

export default class HUD {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.elements = {};
        this.create();
    }

    create() {
        const playerName = StorageManager.getPlayerName() || 'Тоглогч';

        // Player name (top center)
        this.elements.name = this.scene.add.text(GAME_WIDTH / 2, 8, playerName, {
            font: '14px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0).setDepth(50).setScrollFactor(0);

        // Score (top left)
        this.elements.score = this.scene.add.text(16, 28, 'Оноо: 0', {
            font: 'bold 18px Arial',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setDepth(50).setScrollFactor(0);

        // Coins (top right)
        this.elements.coins = this.scene.add.text(GAME_WIDTH - 16, 28, '0', {
            font: 'bold 18px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0).setDepth(50).setScrollFactor(0);

        // Coin icon
        this.elements.coinIcon = this.scene.add.image(GAME_WIDTH - 60, 38, 'coin')
            .setDepth(50).setScrollFactor(0);

        // Stage indicator (top left, below score)
        this.elements.stage = this.scene.add.text(16, 54, 'Stage 1', {
            font: '14px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setDepth(50).setScrollFactor(0);

        // Distance
        this.elements.distance = this.scene.add.text(16, 74, '0m', {
            font: '12px Arial',
            fill: '#AAAAAA',
            stroke: '#000000',
            strokeThickness: 2
        }).setDepth(50).setScrollFactor(0);

        // Power-up indicator (center top area)
        this.elements.powerUp = this.scene.add.text(GAME_WIDTH / 2, 54, '', {
            font: 'bold 14px Arial',
            fill: '#00FF00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5, 0).setDepth(50).setScrollFactor(0);

        // Pause button (top right corner)
        this.elements.pauseBtn = this.scene.add.text(GAME_WIDTH - 16, 4, '⏸', {
            font: '24px Arial',
            fill: '#FFFFFF'
        }).setOrigin(1, 0).setDepth(50).setScrollFactor(0)
            .setInteractive({ useHandCursor: true });

        this.elements.pauseBtn.on('pointerdown', () => {
            this.scene.events.emit('pause-game');
        });
    }

    update(powerUpEffects) {
        const state = this.gameState;

        this.elements.score.setText(`Оноо: ${state.score}`);
        this.elements.coins.setText(`${state.coins}`);
        this.elements.stage.setText(`Stage ${state.currentStage}`);
        this.elements.distance.setText(`${Math.floor(state.distance)}m`);

        // Power-up display
        if (powerUpEffects) {
            const effects = powerUpEffects.getActiveEffects();
            if (effects.length > 0) {
                const labels = effects.map(e => {
                    const name = this.getPowerUpName(e.type);
                    if (e.remaining > 0) {
                        return `${name} ${Math.ceil(e.remaining / 1000)}с`;
                    }
                    return name;
                });
                this.elements.powerUp.setText(labels.join(' | '));
                this.elements.powerUp.setVisible(true);
            } else {
                this.elements.powerUp.setVisible(false);
            }
        }
    }

    getPowerUpName(type) {
        switch (type) {
            case POWER_UP_TYPES.MAGNET: return '🧲 Соронз';
            case POWER_UP_TYPES.JETPACK: return '🚀 Jetpack';
            case POWER_UP_TYPES.MULTIPLIER: return '✖️ 2x';
            case POWER_UP_TYPES.SHIELD: return '🛡️ Бамбай';
            default: return '';
        }
    }

    destroy() {
        Object.values(this.elements).forEach(el => {
            if (el && el.destroy) el.destroy();
        });
    }
}
