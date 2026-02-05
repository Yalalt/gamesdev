import { BASE_SPEED } from '../utils/Constants.js';

export default class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.isRunning = false;
        this.score = 0;
        this.distance = 0;
        this.coins = 0;
        this.currentSpeed = BASE_SPEED;
        this.currentStage = 1;
        this.scoreMultiplier = 1;
        this.hasShield = false;
        this.hasJetpack = false;
        this.hasMagnet = false;
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    addDistance(amount) {
        this.distance += amount;
    }

    addScore(amount) {
        this.score += Math.floor(amount * this.scoreMultiplier);
    }

    addCoin() {
        this.coins++;
    }

    setSpeed(speed) {
        this.currentSpeed = speed;
    }

    setStage(stage) {
        this.currentStage = stage;
    }
}
