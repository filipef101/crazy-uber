console.log('adding event listener');
// import * as THREE from 'three'; // Removed unused import
import { Game } from './game.js';

// Create game instance in global scope for debugging
let game;

// Global starter function for debugging
window.startGame = function() {
    console.log("Manual game start triggered");
    const gameTitle = document.getElementById('game-title');
    if (gameTitle) gameTitle.style.display = 'none';
    
    if (game) {
        game.start();
    } else {
        console.error("Game instance not available");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Initialize game but don't start yet
    game = new Game('game-container');
    
    // Add event listener to start button
    const startButton = document.getElementById('start-game');
    const gameTitle = document.getElementById('game-title');
    
    console.log('Start button element:', startButton);
    
    if (startButton) {
        console.log('Adding click listener to start button');
        
        // Add multiple event listeners to ensure it works
        startButton.addEventListener('click', gameStarter);
        startButton.addEventListener('mousedown', gameStarter);
        startButton.addEventListener('touchstart', gameStarter);
        
        // Make the button more obvious for debugging
        startButton.style.border = '3px solid red';
    } else {
        console.error('Start button not found in the DOM');
    }
    
    // Function to start the game
    function gameStarter(e) {
        console.log('Start button clicked', e.type);
        e.preventDefault();
        
        // Hide the title screen
        if (gameTitle) gameTitle.style.display = 'none';
        
        // Start the game
        game.start();
        
        // Focus on the game container for keyboard input
        const container = document.getElementById('game-container');
        if (container) container.focus();
    }
    
    // Add debug key listener (D key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd') {
            game.debugMode = !game.debugMode;
            console.log('Debug mode:', game.debugMode);
        } else if (e.key === 's') {
            // Alternative way to start the game with 'S' key
            console.log('Starting game with S key');
            if (gameTitle) gameTitle.style.display = 'none';
            game.start();
        }
    });
    
    // Auto-start after 5 seconds if nothing happens
    console.log('Setting auto-start timeout');
    setTimeout(() => {
        if (!game.isRunning) {
            console.log('Auto-starting game after timeout');
            window.startGame();
        }
    }, 5000);
});
