import { GAME_WIDTH, GAME_HEIGHT, LANES, COLORS, STAGES } from '../utils/Constants.js';
import GameState from '../logic/GameState.js';
import PlayerController from '../logic/PlayerController.js';
import ObstacleManager from '../logic/ObstacleManager.js';
import CollectibleManager from '../logic/CollectibleManager.js';
import CollisionHandler from '../logic/CollisionHandler.js';
import StageManager from '../logic/StageManager.js';
import ScoreManager from '../logic/ScoreManager.js';
import PowerUpEffects from '../logic/PowerUpEffects.js';
import InputManager from '../input/InputManager.js';
import HUD from '../ui/HUD.js';
import TouchControls from '../ui/TouchControls.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Core state
        this.gameState = new GameState();
        this.scoreManager = new ScoreManager(this.gameState);

        // Create environment
        this.createBackground();
        this.createTracks();

        // Player
        this.player = new PlayerController(this);
        this.player.createPlayer();

        // Managers
        this.obstacleManager = new ObstacleManager(this, this.gameState);
        this.collectibleManager = new CollectibleManager(this, this.gameState);
        this.stageManager = new StageManager(this, this.gameState);
        this.powerUpEffects = new PowerUpEffects(this, this.gameState);
        this.collisionHandler = new CollisionHandler(this, this.player, this.obstacleManager, this.gameState);

        // Input
        this.inputManager = new InputManager(this);
        this.setupInput();

        // UI
        this.hud = new HUD(this, this.gameState);
        this.touchControls = new TouchControls(this, this.inputManager);

        // Particle emitters
        this.createParticleEmitters();

        // Event listeners
        this.setupEvents();

        // Collision handler
        this.collisionHandler.setup(() => this.handleGameOver());

        // Stage change listener
        this.events.on('stage-change', (stage) => {
            this.obstacleManager.setConfig(stage.spawnInterval, stage.obstacleTypes);
            this.updateBackground(stage);
        });

        // Start the game
        this.gameState.start();
        this.obstacleManager.start();
        this.collectibleManager.start();
        this.inputManager.enable();

        // Apply initial stage config
        const initialStage = this.stageManager.getCurrentStage();
        this.obstacleManager.setConfig(initialStage.spawnInterval, initialStage.obstacleTypes);

        // Jetpack visual effect
        this.jetpackEffect = null;

        // Shield visual effect
        this.shieldGraphic = null;

        // Clean up on scene shutdown
        this.events.on('shutdown', this.shutdown, this);
    }

    createBackground() {
        this.bgColor = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x87CEEB)
            .setDepth(0);

        // Parallax layers
        this.bgLayers = [];

        // Far buildings (slow)
        this.farBuildings = this.add.group();
        for (let i = 0; i < 6; i++) {
            const x = Phaser.Math.Between(20, GAME_WIDTH - 20);
            const h = Phaser.Math.Between(60, 140);
            const w = Phaser.Math.Between(30, 60);
            const building = this.add.rectangle(x, -h / 2 + i * 200 - 100, w, h, 0xC0C0C0, 0.4)
                .setDepth(1);
            building.setData('speed', 0.3);
            building.setData('height', h);
            this.farBuildings.add(building);
        }

        // Near buildings (medium speed)
        this.nearBuildings = this.add.group();
        for (let i = 0; i < 4; i++) {
            const side = i % 2 === 0 ? Phaser.Math.Between(0, 40) : Phaser.Math.Between(GAME_WIDTH - 60, GAME_WIDTH);
            const h = Phaser.Math.Between(80, 200);
            const w = Phaser.Math.Between(40, 70);
            const building = this.add.rectangle(side, -h / 2 + i * 250 - 100, w, h, 0x808080, 0.5)
                .setDepth(1);
            building.setData('speed', 0.6);
            building.setData('height', h);
            this.nearBuildings.add(building);
        }

        // Ground
        this.ground = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 50, GAME_WIDTH, 100, 0x808080)
            .setDepth(2);
    }

    createTracks() {
        // Rail lines
        this.railGroup = this.add.group();

        // Lane divider lines
        for (let lane = 0; lane < 3; lane++) {
            const x = LANES[lane];

            // Left rail
            this.add.rectangle(x - 20, GAME_HEIGHT / 2, 3, GAME_HEIGHT, COLORS.RAIL, 0.6)
                .setDepth(2);
            // Right rail
            this.add.rectangle(x + 20, GAME_HEIGHT / 2, 3, GAME_HEIGHT, COLORS.RAIL, 0.6)
                .setDepth(2);
        }

        // Moving rail ties
        this.railTies = this.add.group();
        for (let i = 0; i < 20; i++) {
            for (let lane = 0; lane < 3; lane++) {
                const tie = this.add.rectangle(LANES[lane], i * 50, 50, 6, COLORS.RAIL_TIE, 0.5)
                    .setDepth(2);
                this.railTies.add(tie);
            }
        }
    }

    createParticleEmitters() {
        // Coin collection sparkle
        this.coinParticles = this.add.particles(0, 0, 'spark', {
            speed: { min: 50, max: 150 },
            scale: { start: 1, end: 0 },
            lifespan: 400,
            quantity: 5,
            emitting: false
        }).setDepth(20);

        // Speed lines
        this.speedParticles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: GAME_WIDTH },
            y: -10,
            speedY: { min: 200, max: 400 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.3, end: 0 },
            lifespan: 1000,
            quantity: 1,
            frequency: 200,
            emitting: false
        }).setDepth(1);
    }

    setupInput() {
        this.inputManager.on('move-left', () => this.player.moveLeft());
        this.inputManager.on('move-right', () => this.player.moveRight());
        this.inputManager.on('jump', () => this.player.jump());
        this.inputManager.on('slide', () => this.player.slide());
    }

    setupEvents() {
        this.events.on('coin-collected', (x, y) => {
            this.scoreManager.addCoinScore();
            // Sparkle effect
            this.coinParticles.emitParticleAt(x, y, 8);
        });

        this.events.on('powerup-collected', (type, x, y) => {
            this.powerUpEffects.activate(type);
        });

        this.events.on('shield-break', () => {
            // Visual feedback
            this.cameras.main.flash(200, 0, 200, 255);
            if (this.shieldGraphic) {
                this.shieldGraphic.destroy();
                this.shieldGraphic = null;
            }
        });

        this.events.on('powerup-activated', (type) => {
            if (type === 'shield' && !this.shieldGraphic) {
                this.shieldGraphic = this.add.circle(0, 0, 40, COLORS.SHIELD, 0.3)
                    .setDepth(11);
            }
            if (type === 'jetpack') {
                this.player.sprite.body.setAllowGravity(false);
                this.player.sprite.body.setVelocityY(0);
                this.tweens.add({
                    targets: this.player.sprite,
                    y: 300,
                    duration: 500,
                    ease: 'Power2'
                });
            }
        });

        this.events.on('powerup-expired', (type) => {
            if (type === 'jetpack') {
                this.player.sprite.body.setAllowGravity(true);
                this.tweens.add({
                    targets: this.player.sprite,
                    y: 650,
                    duration: 500,
                    ease: 'Power2'
                });
            }
        });

        this.events.on('pause-game', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        // Keyboard P or ESC to pause
        this.input.keyboard.on('keydown-P', () => {
            this.events.emit('pause-game');
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.events.emit('pause-game');
        });
    }

    updateBackground(stage) {
        // Change background color with tween
        const color = Phaser.Display.Color.IntegerToColor(stage.bgColor);
        const currentColor = Phaser.Display.Color.IntegerToColor(this.bgColor.fillColor);

        this.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 1000,
            onUpdate: (tween) => {
                const value = tween.getValue() / 100;
                const r = Phaser.Math.Linear(currentColor.red, color.red, value);
                const g = Phaser.Math.Linear(currentColor.green, color.green, value);
                const b = Phaser.Math.Linear(currentColor.blue, color.blue, value);
                this.bgColor.setFillStyle(Phaser.Display.Color.GetColor(r, g, b));
            }
        });

        // Update ground color
        const groundColor = Phaser.Display.Color.IntegerToColor(stage.groundColor);
        this.ground.setFillStyle(stage.groundColor);

        // Enable speed lines at higher stages
        if (stage.id >= 3) {
            this.speedParticles.start();
        }
    }

    update() {
        if (!this.gameState.isRunning) return;

        // Update systems
        this.player.update();
        this.obstacleManager.update();
        this.collectibleManager.update();
        this.stageManager.update();
        this.scoreManager.update();
        this.collisionHandler.update();

        // Check collections
        this.collectibleManager.checkCoinCollection(this.player.sprite);
        const powerUp = this.collectibleManager.checkPowerUpCollection(this.player.sprite);

        // Update UI
        this.hud.update(this.powerUpEffects);

        // Animate rail ties
        const speed = this.gameState.currentSpeed;
        this.railTies.getChildren().forEach(tie => {
            tie.y += speed;
            if (tie.y > GAME_HEIGHT + 25) {
                tie.y = -25;
            }
        });

        // Parallax buildings
        this.farBuildings.getChildren().forEach(b => {
            b.y += speed * b.getData('speed');
            if (b.y > GAME_HEIGHT + b.getData('height')) {
                b.y = -b.getData('height');
                b.x = Phaser.Math.Between(20, GAME_WIDTH - 20);
            }
        });

        this.nearBuildings.getChildren().forEach(b => {
            b.y += speed * b.getData('speed');
            if (b.y > GAME_HEIGHT + b.getData('height')) {
                b.y = -b.getData('height');
                const side = Phaser.Math.Between(0, 1);
                b.x = side === 0 ? Phaser.Math.Between(0, 40) : Phaser.Math.Between(GAME_WIDTH - 60, GAME_WIDTH);
            }
        });

        // Shield visual follows player
        if (this.shieldGraphic && this.gameState.hasShield) {
            this.shieldGraphic.setPosition(this.player.sprite.x, this.player.sprite.y - 35);
        } else if (this.shieldGraphic && !this.gameState.hasShield) {
            this.shieldGraphic.destroy();
            this.shieldGraphic = null;
        }
    }

    handleGameOver() {
        this.gameState.stop();
        this.inputManager.disable();
        this.obstacleManager.stop();
        this.collectibleManager.stop();

        // Screen shake
        this.cameras.main.shake(300, 0.02);

        // Flash red
        this.cameras.main.flash(200, 255, 0, 0);

        // Save score
        const isNewRecord = this.scoreManager.saveScore();
        const finalScore = this.scoreManager.getFinalScore();

        // Delay before game over screen
        this.time.delayedCall(800, () => {
            this.scene.start('GameOverScene', {
                score: finalScore,
                isNewRecord
            });
        });
    }

    shutdown() {
        this.events.removeAllListeners();
        if (this.hud) this.hud.destroy();
        if (this.touchControls) this.touchControls.destroy();
        if (this.powerUpEffects) this.powerUpEffects.reset();
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
            this.shieldGraphic = null;
        }
    }
}
