import { LANES, LANE_SWITCH_DURATION, PLAYER_Y, JUMP_VELOCITY, PLAYER_HEIGHT, PLAYER_SLIDE_HEIGHT } from '../utils/Constants.js';

export default class PlayerController {
    constructor(scene) {
        this.scene = scene;
        this.currentLane = 1;
        this.isJumping = false;
        this.isSliding = false;
        this.isMoving = false;
        this.sprite = null;
        this.slideTimer = null;
    }

    createPlayer() {
        const x = LANES[this.currentLane];
        this.sprite = this.scene.physics.add.sprite(x, PLAYER_Y, 'player');
        this.sprite.setOrigin(0.5, 1);
        this.sprite.body.setGravityY(1200);
        this.sprite.setDepth(10);

        // Ground level - manually managed in update()
        this.groundY = PLAYER_Y;

        return this.sprite;
    }

    moveLeft() {
        if (this.isMoving || this.currentLane <= 0) return;
        this.currentLane--;
        this.animateMove();
    }

    moveRight() {
        if (this.isMoving || this.currentLane >= 2) return;
        this.currentLane++;
        this.animateMove();
    }

    animateMove() {
        this.isMoving = true;
        const targetX = LANES[this.currentLane];

        this.scene.tweens.add({
            targets: this.sprite,
            x: targetX,
            duration: LANE_SWITCH_DURATION,
            ease: 'Power2',
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }

    jump() {
        if (this.isJumping || this.isSliding) return;
        this.isJumping = true;
        this.sprite.body.setVelocityY(JUMP_VELOCITY);
    }

    slide() {
        if (this.isSliding || this.isJumping) return;
        this.isSliding = true;

        // Shrink player vertically
        this.sprite.setTexture('player_slide');
        this.sprite.body.setSize(50, PLAYER_SLIDE_HEIGHT);

        // Auto-end slide after 600ms
        if (this.slideTimer) this.slideTimer.remove();
        this.slideTimer = this.scene.time.delayedCall(600, () => {
            this.endSlide();
        });
    }

    endSlide() {
        if (!this.isSliding) return;
        this.isSliding = false;
        this.sprite.setTexture('player');
        this.sprite.body.setSize(50, PLAYER_HEIGHT);
    }

    update() {
        // Manual ground collision (since we use origin bottom)
        if (this.sprite.y >= this.groundY) {
            this.sprite.y = this.groundY;
            this.sprite.body.setVelocityY(0);
            if (this.isJumping) {
                this.isJumping = false;
            }
        }

        // Keep player at correct X when not tweening
        if (!this.isMoving) {
            this.sprite.x = LANES[this.currentLane];
        }
    }

    getHitbox() {
        return this.sprite.getBounds();
    }
}
