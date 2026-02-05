export default class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.callbacks = {
            'move-left': [],
            'move-right': [],
            'jump': [],
            'slide': []
        };
        this.enabled = false;
    }

    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    emit(event) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(cb => cb());
        }
    }

    enable() {
        this.enabled = true;
        this.setupKeyboard();
        this.setupSwipe();
    }

    disable() {
        this.enabled = false;
    }

    setupKeyboard() {
        const keyboard = this.scene.input.keyboard;

        keyboard.on('keydown-LEFT', () => {
            if (this.enabled) this.emit('move-left');
        });
        keyboard.on('keydown-RIGHT', () => {
            if (this.enabled) this.emit('move-right');
        });
        keyboard.on('keydown-UP', () => {
            if (this.enabled) this.emit('jump');
        });
        keyboard.on('keydown-DOWN', () => {
            if (this.enabled) this.emit('slide');
        });

        // WASD alternative
        keyboard.on('keydown-A', () => {
            if (this.enabled) this.emit('move-left');
        });
        keyboard.on('keydown-D', () => {
            if (this.enabled) this.emit('move-right');
        });
        keyboard.on('keydown-W', () => {
            if (this.enabled) this.emit('jump');
        });
        keyboard.on('keydown-S', () => {
            if (this.enabled) this.emit('slide');
        });
    }

    setupSwipe() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        this.scene.input.on('pointerdown', (pointer) => {
            startX = pointer.x;
            startY = pointer.y;
            startTime = pointer.time;
        });

        this.scene.input.on('pointerup', (pointer) => {
            if (!this.enabled) return;

            const dx = pointer.x - startX;
            const dy = pointer.y - startY;
            const dt = pointer.time - startTime;

            // Must be a quick swipe (< 300ms) with enough distance (> 30px)
            if (dt > 300) return;

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            if (absDx < 30 && absDy < 30) return;

            if (absDx > absDy) {
                // Horizontal swipe
                if (dx > 0) {
                    this.emit('move-right');
                } else {
                    this.emit('move-left');
                }
            } else {
                // Vertical swipe
                if (dy < 0) {
                    this.emit('jump');
                } else {
                    this.emit('slide');
                }
            }
        });
    }
}
