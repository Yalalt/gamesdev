// SwipeDetector is integrated into InputManager.js
// This file exists for modularity if needed in the future.

export default class SwipeDetector {
    constructor(scene, threshold = 30, maxTime = 300) {
        this.scene = scene;
        this.threshold = threshold;
        this.maxTime = maxTime;
        this.callbacks = {};
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;

        this.setup();
    }

    on(direction, callback) {
        if (!this.callbacks[direction]) {
            this.callbacks[direction] = [];
        }
        this.callbacks[direction].push(callback);
    }

    setup() {
        this.scene.input.on('pointerdown', (pointer) => {
            this.startX = pointer.x;
            this.startY = pointer.y;
            this.startTime = pointer.time;
        });

        this.scene.input.on('pointerup', (pointer) => {
            const dx = pointer.x - this.startX;
            const dy = pointer.y - this.startY;
            const dt = pointer.time - this.startTime;

            if (dt > this.maxTime) return;

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx < this.threshold && absDy < this.threshold) return;

            let direction;
            if (absDx > absDy) {
                direction = dx > 0 ? 'right' : 'left';
            } else {
                direction = dy > 0 ? 'down' : 'up';
            }

            if (this.callbacks[direction]) {
                this.callbacks[direction].forEach(cb => cb());
            }
        });
    }
}
