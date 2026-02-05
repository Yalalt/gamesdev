import { OBSTACLE_TYPES } from '../utils/Constants.js';

export default class CollisionHandler {
    constructor(scene, player, obstacleManager, gameState) {
        this.scene = scene;
        this.player = player;
        this.obstacleManager = obstacleManager;
        this.gameState = gameState;
        this.onGameOver = null;
    }

    setup(onGameOver) {
        this.onGameOver = onGameOver;
    }

    update() {
        if (!this.gameState.isRunning) return;

        const playerSprite = this.player.sprite;
        const playerBounds = playerSprite.getBounds();

        // Shrink hitbox slightly for fairness
        const hitbox = {
            x: playerBounds.x + 8,
            y: playerBounds.y + 5,
            width: playerBounds.width - 16,
            height: playerBounds.height - 10,
            right: playerBounds.right - 8,
            bottom: playerBounds.bottom - 5
        };

        const obstacles = this.obstacleManager.getActiveObstacles();

        for (const obstacle of obstacles) {
            if (!obstacle.active) continue;

            const obsBounds = obstacle.getBounds();

            // Check AABB overlap
            if (!this.rectsOverlap(hitbox, obsBounds)) continue;

            const type = obstacle.getData('type');
            const collision = this.checkCollision(type);

            if (collision) {
                if (this.gameState.hasShield) {
                    this.gameState.hasShield = false;
                    obstacle.setActive(false);
                    obstacle.setVisible(false);
                    obstacle.body.enable = false;
                    this.scene.events.emit('shield-break');
                    return;
                }

                if (this.onGameOver) {
                    this.onGameOver();
                }
                return;
            }
        }
    }

    rectsOverlap(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    checkCollision(type) {
        // Jetpack means flying over everything
        if (this.gameState.hasJetpack) return false;

        switch (type) {
            case OBSTACLE_TYPES.TRAIN:
                return true;

            case OBSTACLE_TYPES.BARRIER_LOW:
                // Can jump over
                return !this.player.isJumping;

            case OBSTACLE_TYPES.BARRIER_HIGH:
                // Can slide under
                return !this.player.isSliding;

            case OBSTACLE_TYPES.TUNNEL:
                return true;

            default:
                return true;
        }
    }
}
