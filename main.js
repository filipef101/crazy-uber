console.log('adding event listener');
// import * as THREE from 'three'; // Removed unused import
import { Game } from './game.js';

// Initialize the game when the window loads
// console.log('adding event listener'); // Original console.log was here
window.addEventListener('load', () => {
    console.log('Starting game...');
    try {
        const game = new Game('game-container');
        game.start();
    } catch (error) {
        console.error('Error starting game:', error);
    }
});
