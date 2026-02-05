import { POWER_UP_TYPES, POWER_UP_DURATIONS } from '../utils/Constants.js';

export default class PowerUpEffects {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.activeTimers = {};
        this.indicators = {};
    }

    activate(type) {
        // Clear existing timer for this type
        if (this.activeTimers[type]) {
            this.activeTimers[type].remove();
        }

        switch (type) {
            case POWER_UP_TYPES.MAGNET:
                this.gameState.hasMagnet = true;
                this.startTimer(type, POWER_UP_DURATIONS.magnet, () => {
                    this.gameState.hasMagnet = false;
                });
                break;

            case POWER_UP_TYPES.JETPACK:
                this.gameState.hasJetpack = true;
                this.startTimer(type, POWER_UP_DURATIONS.jetpack, () => {
                    this.gameState.hasJetpack = false;
                });
                break;

            case POWER_UP_TYPES.MULTIPLIER:
                this.gameState.scoreMultiplier = 2;
                this.startTimer(type, POWER_UP_DURATIONS.multiplier, () => {
                    this.gameState.scoreMultiplier = 1;
                });
                break;

            case POWER_UP_TYPES.SHIELD:
                this.gameState.hasShield = true;
                // Shield doesn't expire by time, only by use
                break;
        }

        this.scene.events.emit('powerup-activated', type);
    }

    startTimer(type, duration, onComplete) {
        this.activeTimers[type] = this.scene.time.delayedCall(duration, () => {
            onComplete();
            delete this.activeTimers[type];
            this.scene.events.emit('powerup-expired', type);
        });
    }

    getActiveEffects() {
        const effects = [];

        if (this.gameState.hasMagnet) {
            effects.push({ type: POWER_UP_TYPES.MAGNET, remaining: this.getRemaining(POWER_UP_TYPES.MAGNET) });
        }
        if (this.gameState.hasJetpack) {
            effects.push({ type: POWER_UP_TYPES.JETPACK, remaining: this.getRemaining(POWER_UP_TYPES.JETPACK) });
        }
        if (this.gameState.scoreMultiplier > 1) {
            effects.push({ type: POWER_UP_TYPES.MULTIPLIER, remaining: this.getRemaining(POWER_UP_TYPES.MULTIPLIER) });
        }
        if (this.gameState.hasShield) {
            effects.push({ type: POWER_UP_TYPES.SHIELD, remaining: -1 });
        }

        return effects;
    }

    getRemaining(type) {
        const timer = this.activeTimers[type];
        if (!timer) return 0;
        return Math.max(0, timer.getRemaining());
    }

    reset() {
        Object.values(this.activeTimers).forEach(timer => timer.remove());
        this.activeTimers = {};
        this.gameState.hasMagnet = false;
        this.gameState.hasJetpack = false;
        this.gameState.hasShield = false;
        this.gameState.scoreMultiplier = 1;
    }
}
