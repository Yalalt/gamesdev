import StorageManager from '../utils/StorageManager.js';

export default class NameInputScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NameInputScene' });
    }

    create() {
        const existingName = StorageManager.getPlayerName();
        if (existingName && existingName.length > 0) {
            this.scene.start('MenuScene');
            return;
        }
        this.showNameInput();
    }

    showNameInput() {
        // Remove any existing overlay
        const existing = document.getElementById('name-input-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'name-input-overlay';

        overlay.innerHTML = `
            <h2>Subway Surfers-д тавтай морил!</h2>
            <h2>Нэрээ оруулна уу</h2>
            <input type="text" id="player-name-input" maxlength="20" placeholder="Таны нэр..." autocomplete="off">
            <button id="name-submit-btn">Эхлэх</button>
        `;

        document.body.appendChild(overlay);

        const input = document.getElementById('player-name-input');
        const btn = document.getElementById('name-submit-btn');

        input.focus();

        const submit = () => {
            const name = input.value.trim();
            if (name.length === 0) {
                input.style.borderColor = '#FF4444';
                input.placeholder = 'Нэрээ оруулна уу!';
                return;
            }
            StorageManager.setPlayerName(name);
            overlay.remove();
            this.scene.start('MenuScene');
        };

        btn.addEventListener('click', submit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submit();
        });
    }
}
