import StorageManager from '../utils/StorageManager.js';

export default class ScoreManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.distanceScore = 0;
        this.coinScore = 0;
    }

    update() {
        if (!this.gameState.isRunning) return;

        // Distance score: speed-based accumulation
        const distPoints = this.gameState.currentSpeed * 0.1 * this.gameState.scoreMultiplier;
        this.distanceScore += distPoints;
        this.gameState.score = Math.floor(this.distanceScore + this.coinScore);
        this.gameState.addDistance(this.gameState.currentSpeed * 0.1);
    }

    addCoinScore() {
        this.coinScore += 10 * this.gameState.scoreMultiplier;
        this.gameState.coins++;
    }

    getFinalScore() {
        return {
            total: this.gameState.score,
            distance: Math.floor(this.distanceScore),
            coins: this.gameState.coins,
            coinScore: Math.floor(this.coinScore),
            stage: this.gameState.currentStage
        };
    }

    saveScore() {
        const name = StorageManager.getPlayerName() || 'Тоглогч';
        const score = this.gameState.score;
        const isNewRecord = score > StorageManager.getHighScore();
        StorageManager.saveScore(name, score);
        return isNewRecord;
    }

    reset() {
        this.distanceScore = 0;
        this.coinScore = 0;
    }
}
