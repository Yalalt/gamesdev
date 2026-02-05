import { LANES, GAME_HEIGHT, POWER_UP_TYPES, COLORS } from '../utils/Constants.js';

export default class CollectibleManager {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;

        this.coins = scene.physics.add.group({ maxSize: 30 });
        this.powerUps = scene.physics.add.group({ maxSize: 5 });

        this.coinSpawnTimer = null;
        this.powerUpSpawnTimer = null;
    }

    start() {
        this.scheduleCoinSpawn();
        this.schedulePowerUpSpawn();
    }

    stop() {
        if (this.coinSpawnTimer) this.coinSpawnTimer.remove();
        if (this.powerUpSpawnTimer) this.powerUpSpawnTimer.remove();
    }

    scheduleCoinSpawn() {
        const delay = Phaser.Math.Between(400, 800);
        this.coinSpawnTimer = this.scene.time.delayedCall(delay, () => {
            if (this.gameState.isRunning) {
                this.spawnCoinPattern();
                this.scheduleCoinSpawn();
            }
        });
    }

    schedulePowerUpSpawn() {
        const delay = Phaser.Math.Between(15000, 30000);
        this.powerUpSpawnTimer = this.scene.time.delayedCall(delay, () => {
            if (this.gameState.isRunning) {
                this.spawnPowerUp();
                this.schedulePowerUpSpawn();
            }
        });
    }

    spawnCoinPattern() {
        const pattern = Phaser.Math.Between(0, 2);
        const lane = Phaser.Math.Between(0, 2);

        switch (pattern) {
            case 0: // Line of coins in one lane
                for (let i = 0; i < 5; i++) {
                    this.createCoin(LANES[lane], -50 - i * 40);
                }
                break;
            case 1: // Arc pattern
                for (let i = 0; i < 3; i++) {
                    const arcY = -50 - i * 40;
                    const arcOffset = (i === 1) ? -15 : 0;
                    this.createCoin(LANES[lane], arcY + arcOffset);
                }
                break;
            case 2: // Scattered across lanes
                for (let i = 0; i < 3; i++) {
                    const scatterLane = Phaser.Math.Between(0, 2);
                    this.createCoin(LANES[scatterLane], -50 - i * 50);
                }
                break;
        }
    }

    createCoin(x, y) {
        let coin = this.coins.getFirstDead(false);

        if (!coin) {
            coin = this.scene.physics.add.sprite(x, y, 'coin');
            this.coins.add(coin);
        } else {
            coin.setPosition(x, y);
            coin.setActive(true);
            coin.setVisible(true);
            coin.body.enable = true;
        }

        coin.body.setAllowGravity(false);
        coin.setDepth(6);

        // Coin rotation animation
        this.scene.tweens.add({
            targets: coin,
            scaleX: 0.5,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return coin;
    }

    spawnPowerUp() {
        const types = Object.values(POWER_UP_TYPES);
        const type = Phaser.Utils.Array.GetRandom(types);
        const lane = Phaser.Math.Between(0, 2);
        const textureMap = {
            [POWER_UP_TYPES.MAGNET]: 'powerup_magnet',
            [POWER_UP_TYPES.JETPACK]: 'powerup_jetpack',
            [POWER_UP_TYPES.MULTIPLIER]: 'powerup_multiplier',
            [POWER_UP_TYPES.SHIELD]: 'powerup_shield'
        };

        let powerUp = this.powerUps.getFirstDead(false);

        if (!powerUp) {
            powerUp = this.scene.physics.add.sprite(LANES[lane], -50, textureMap[type]);
            this.powerUps.add(powerUp);
        } else {
            powerUp.setTexture(textureMap[type]);
            powerUp.setPosition(LANES[lane], -50);
            powerUp.setActive(true);
            powerUp.setVisible(true);
            powerUp.body.enable = true;
        }

        powerUp.setData('type', type);
        powerUp.body.setAllowGravity(false);
        powerUp.setDepth(6);

        // Pulsing animation
        this.scene.tweens.add({
            targets: powerUp,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return powerUp;
    }

    update() {
        const speed = this.gameState.currentSpeed;
        const magnetActive = this.gameState.hasMagnet;
        const player = this.scene.player;
        const playerX = (player && player.sprite) ? player.sprite.x : 240;
        const playerY = (player && player.sprite) ? player.sprite.y : 650;

        // Update coins
        this.coins.getChildren().forEach(coin => {
            if (!coin.active) return;

            if (magnetActive) {
                // Attract coins toward player
                const dx = playerX - coin.x;
                const dy = playerY - coin.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    coin.x += (dx / dist) * 8;
                    coin.y += (dy / dist) * 8;
                } else {
                    coin.y += speed;
                }
            } else {
                coin.y += speed;
            }

            if (coin.y > GAME_HEIGHT + 50) {
                this.deactivate(coin);
            }
        });

        // Update power-ups
        this.powerUps.getChildren().forEach(pu => {
            if (!pu.active) return;
            pu.y += speed;
            if (pu.y > GAME_HEIGHT + 50) {
                this.deactivate(pu);
            }
        });
    }

    deactivate(sprite) {
        sprite.setActive(false);
        sprite.setVisible(false);
        if (sprite.body) sprite.body.enable = false;
    }

    checkCoinCollection(playerSprite) {
        let collected = 0;
        const playerBounds = playerSprite.getBounds();

        this.coins.getChildren().forEach(coin => {
            if (!coin.active) return;
            const coinBounds = coin.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, coinBounds)) {
                collected++;
                this.deactivate(coin);
                this.scene.events.emit('coin-collected', coin.x, coin.y);
            }
        });

        return collected;
    }

    checkPowerUpCollection(playerSprite) {
        const playerBounds = playerSprite.getBounds();
        let collectedType = null;

        this.powerUps.getChildren().forEach(pu => {
            if (!pu.active) return;
            const puBounds = pu.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, puBounds)) {
                collectedType = pu.getData('type');
                this.deactivate(pu);
                this.scene.events.emit('powerup-collected', collectedType, pu.x, pu.y);
            }
        });

        return collectedType;
    }

    reset() {
        this.stop();
        [this.coins, this.powerUps].forEach(group => {
            group.getChildren().forEach(sprite => {
                this.deactivate(sprite);
            });
        });
    }
}
