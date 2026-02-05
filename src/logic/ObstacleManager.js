import { LANES, GAME_HEIGHT, OBSTACLE_TYPES, COLORS } from '../utils/Constants.js';

export default class ObstacleManager {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.obstacles = scene.physics.add.group({
            maxSize: 20,
            runChildUpdate: false
        });
        this.spawnTimer = null;
        this.spawnInterval = 1500;
        this.allowedTypes = [OBSTACLE_TYPES.TRAIN];
    }

    start() {
        this.scheduleSpawn();
    }

    stop() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
    }

    setConfig(interval, types) {
        this.spawnInterval = interval;
        this.allowedTypes = types;
    }

    scheduleSpawn() {
        this.spawnTimer = this.scene.time.delayedCall(this.spawnInterval, () => {
            if (this.gameState.isRunning) {
                this.spawnObstacle();
                this.scheduleSpawn();
            }
        });
    }

    spawnObstacle() {
        const type = Phaser.Utils.Array.GetRandom(this.allowedTypes);

        switch (type) {
            case OBSTACLE_TYPES.TRAIN:
                this.spawnTrain();
                break;
            case OBSTACLE_TYPES.BARRIER_LOW:
                this.spawnBarrierLow();
                break;
            case OBSTACLE_TYPES.BARRIER_HIGH:
                this.spawnBarrierHigh();
                break;
            case OBSTACLE_TYPES.TUNNEL:
                this.spawnTunnel();
                break;
        }
    }

    spawnTrain() {
        const lane = Phaser.Math.Between(0, 2);
        this.createObstacle(LANES[lane], -120, 'train', OBSTACLE_TYPES.TRAIN);
    }

    spawnBarrierLow() {
        const lane = Phaser.Math.Between(0, 2);
        this.createObstacle(LANES[lane], -30, 'barrier_low', OBSTACLE_TYPES.BARRIER_LOW);
    }

    spawnBarrierHigh() {
        const lane = Phaser.Math.Between(0, 2);
        this.createObstacle(LANES[lane], -30, 'barrier_high', OBSTACLE_TYPES.BARRIER_HIGH);
    }

    spawnTunnel() {
        // Block 2 lanes, leave 1 open
        const openLane = Phaser.Math.Between(0, 2);
        for (let i = 0; i < 3; i++) {
            if (i !== openLane) {
                this.createObstacle(LANES[i], -100, 'tunnel_wall', OBSTACLE_TYPES.TUNNEL);
            }
        }
    }

    createObstacle(x, y, texture, type) {
        let obstacle = this.obstacles.getFirstDead(false);

        if (!obstacle) {
            obstacle = this.scene.physics.add.sprite(x, y, texture);
            obstacle.setOrigin(0.5, 1);
            this.obstacles.add(obstacle);
        } else {
            obstacle.setTexture(texture);
            obstacle.setPosition(x, y);
            obstacle.setActive(true);
            obstacle.setVisible(true);
            obstacle.body.enable = true;
        }

        obstacle.setData('type', type);
        obstacle.body.setAllowGravity(false);
        obstacle.body.setImmovable(true);
        obstacle.setDepth(5);

        return obstacle;
    }

    update() {
        const speed = this.gameState.currentSpeed;

        this.obstacles.getChildren().forEach(obstacle => {
            if (!obstacle.active) return;

            obstacle.y += speed;

            // Remove if off screen
            if (obstacle.y > GAME_HEIGHT + 150) {
                obstacle.setActive(false);
                obstacle.setVisible(false);
                obstacle.body.enable = false;
            }
        });
    }

    getActiveObstacles() {
        return this.obstacles.getChildren().filter(o => o.active);
    }

    reset() {
        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.setActive(false);
            obstacle.setVisible(false);
            if (obstacle.body) obstacle.body.enable = false;
        });
        this.stop();
    }
}
