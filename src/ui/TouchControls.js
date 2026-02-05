import { GAME_WIDTH, GAME_HEIGHT } from '../utils/Constants.js';

export default class TouchControls {
    constructor(scene, inputManager) {
        this.scene = scene;
        this.inputManager = inputManager;
        this.buttons = [];
        this.visible = false;

        // Only show on touch devices
        if (this.scene.sys.game.device.input.touch) {
            this.create();
            this.visible = true;
        }
    }

    create() {
        const btnSize = 56;
        const padding = 12;
        const baseY = GAME_HEIGHT - 80;
        const baseX = GAME_WIDTH / 2;

        // Left button
        this.createButton(baseX - btnSize - padding, baseY, '◀', () => {
            this.inputManager.emit('move-left');
        });

        // Right button
        this.createButton(baseX + btnSize + padding, baseY, '▶', () => {
            this.inputManager.emit('move-right');
        });

        // Up button
        this.createButton(baseX, baseY - btnSize - padding, '▲', () => {
            this.inputManager.emit('jump');
        });

        // Down button
        this.createButton(baseX, baseY + btnSize / 2 + padding, '▼', () => {
            this.inputManager.emit('slide');
        });
    }

    createButton(x, y, label, callback) {
        const bg = this.scene.add.circle(x, y, 26, 0xFFFFFF, 0.15)
            .setDepth(100).setScrollFactor(0).setInteractive();

        const text = this.scene.add.text(x, y, label, {
            font: '20px Arial',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setDepth(101).setScrollFactor(0).setAlpha(0.4);

        bg.on('pointerdown', () => {
            bg.setFillStyle(0xFFFFFF, 0.35);
            callback();
        });

        bg.on('pointerup', () => {
            bg.setFillStyle(0xFFFFFF, 0.15);
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0xFFFFFF, 0.15);
        });

        this.buttons.push({ bg, text });
    }

    destroy() {
        this.buttons.forEach(({ bg, text }) => {
            bg.destroy();
            text.destroy();
        });
        this.buttons = [];
    }
}
