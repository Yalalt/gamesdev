import { GAME_WIDTH, GAME_HEIGHT } from './utils/Constants.js';
import BootScene from './scenes/BootScene.js';
import NameInputScene from './scenes/NameInputScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import PauseScene from './scenes/PauseScene.js';

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 960,
            height: 1600
        }
    },
    scene: [BootScene, NameInputScene, MenuScene, GameScene, GameOverScene, PauseScene],
    render: {
        pixelArt: false,
        antialias: true
    },
    input: {
        activePointers: 3
    }
};

const game = new Phaser.Game(config);
