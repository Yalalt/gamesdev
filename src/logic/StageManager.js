import { STAGES, GAME_WIDTH } from '../utils/Constants.js';

export default class StageManager {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.currentStageIndex = 0;
        this.stageAnnounced = [true, false, false, false, false];
    }

    getCurrentStage() {
        return STAGES[this.currentStageIndex];
    }

    update() {
        const distance = this.gameState.distance;

        // Check if we should advance to next stage
        for (let i = STAGES.length - 1; i >= 0; i--) {
            if (distance >= STAGES[i].distanceThreshold) {
                if (i !== this.currentStageIndex) {
                    this.currentStageIndex = i;
                    this.gameState.setStage(i + 1);
                    this.applyStage(STAGES[i]);

                    if (!this.stageAnnounced[i]) {
                        this.stageAnnounced[i] = true;
                        this.announceStage(STAGES[i]);
                    }
                }
                break;
            }
        }
    }

    applyStage(stage) {
        this.gameState.setSpeed(stage.speed);
        this.scene.events.emit('stage-change', stage);
    }

    announceStage(stage) {
        const text = this.scene.add.text(GAME_WIDTH / 2, 200, `STAGE ${stage.id}\n${stage.nameLocal}`, {
            font: 'bold 28px Arial',
            fill: '#FFD700',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            y: 180,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0,
                    y: 160,
                    duration: 500,
                    delay: 1500,
                    onComplete: () => text.destroy()
                });
            }
        });
    }

    reset() {
        this.currentStageIndex = 0;
        this.stageAnnounced = [true, false, false, false, false];
    }
}
