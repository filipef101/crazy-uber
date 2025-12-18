export class HUD {
    constructor() {
        this.hudContainer = document.createElement('div');
        this.scoreDisplay = document.createElement('div');
        this.timerDisplay = document.createElement('div');
        this.fpsDisplay = document.createElement('div');
        this.statusDisplay = document.createElement('div');
        
        this.setupHUD();
    }
    
    setupHUD() {
        // Setup main HUD container
        this.hudContainer.style.position = 'absolute';
        this.hudContainer.style.top = '20px';
        this.hudContainer.style.left = '20px';
        this.hudContainer.style.display = 'flex';
        this.hudContainer.style.flexDirection = 'column';
        this.hudContainer.style.gap = '10px';
        document.body.appendChild(this.hudContainer);
        
        // Score display
        this.scoreDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.scoreDisplay.style.color = '#00FF00';
        this.scoreDisplay.style.padding = '10px 20px';
        this.scoreDisplay.style.borderRadius = '5px';
        this.scoreDisplay.style.fontFamily = 'Arial, sans-serif';
        this.scoreDisplay.style.fontSize = '24px';
        this.scoreDisplay.style.fontWeight = 'bold';
        this.scoreDisplay.innerHTML = 'FARE: $0';
        this.hudContainer.appendChild(this.scoreDisplay);
        
        // Timer display
        this.timerDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.timerDisplay.style.color = '#FFFF00';
        this.timerDisplay.style.padding = '10px 20px';
        this.timerDisplay.style.borderRadius = '5px';
        this.timerDisplay.style.fontFamily = 'Arial, sans-serif';
        this.timerDisplay.style.fontSize = '24px';
        this.timerDisplay.style.fontWeight = 'bold';
        this.timerDisplay.innerHTML = 'TIME: 90s';
        this.hudContainer.appendChild(this.timerDisplay);
        
        // FPS display
        this.fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.fpsDisplay.style.color = '#FFFFFF';
        this.fpsDisplay.style.padding = '5px 10px';
        this.fpsDisplay.style.borderRadius = '5px';
        this.fpsDisplay.style.fontFamily = 'Arial, sans-serif';
        this.fpsDisplay.style.fontSize = '14px';
        this.fpsDisplay.innerHTML = 'FPS: 0';
        this.hudContainer.appendChild(this.fpsDisplay);
        
        // Status message display (for pickup/dropoff instructions)
        this.statusDisplay.style.position = 'absolute';
        this.statusDisplay.style.bottom = '20px';
        this.statusDisplay.style.left = '50%';
        this.statusDisplay.style.transform = 'translateX(-50%)';
        this.statusDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.statusDisplay.style.color = '#FFFFFF';
        this.statusDisplay.style.padding = '10px 20px';
        this.statusDisplay.style.borderRadius = '5px';
        this.statusDisplay.style.fontFamily = 'Arial, sans-serif';
        this.statusDisplay.style.fontSize = '18px';
        this.statusDisplay.style.textAlign = 'center';
        this.statusDisplay.style.minWidth = '300px';
        this.statusDisplay.style.display = 'none';
        document.body.appendChild(this.statusDisplay);
    }
    
    update(gameStats, fps, hasPassenger) {
        // Update score
        this.scoreDisplay.innerHTML = `FARE: $${gameStats.score}`;
        
        // Update timer with color changes for urgency
        const timeRemaining = gameStats.timeRemaining;
        this.timerDisplay.innerHTML = `TIME: ${timeRemaining}s`;
        
        if (timeRemaining < 10) {
            this.timerDisplay.style.color = '#FF0000';
            this.timerDisplay.style.animation = 'blink 0.5s infinite';
        } else if (timeRemaining < 30) {
            this.timerDisplay.style.color = '#FF6600';
            this.timerDisplay.style.animation = '';
        } else {
            this.timerDisplay.style.color = '#FFFF00';
            this.timerDisplay.style.animation = '';
        }
        
        // Update FPS
        this.fpsDisplay.innerHTML = `FPS: ${fps}`;
        
        // Update status message
        if (gameStats.isGameOver) {
            this.showStatus('GAME OVER!', true);
        } else if (hasPassenger) {
            this.showStatus('DROP OFF THE PASSENGER AT THE GREEN MARKER!');
        } else {
            this.showStatus('FIND A PASSENGER!');
        }
    }
    
    showStatus(message, isImportant = false) {
        this.statusDisplay.innerHTML = message;
        this.statusDisplay.style.display = 'block';
        
        if (isImportant) {
            this.statusDisplay.style.color = '#FF0000';
            this.statusDisplay.style.fontSize = '32px';
            this.statusDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        } else {
            this.statusDisplay.style.color = '#FFFFFF';
            this.statusDisplay.style.fontSize = '18px';
            this.statusDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
    }
    
    showGameOver(finalScore) {
        // Create game over screen
        const gameOverContainer = document.createElement('div');
        gameOverContainer.style.position = 'fixed';
        gameOverContainer.style.top = '0';
        gameOverContainer.style.left = '0';
        gameOverContainer.style.width = '100%';
        gameOverContainer.style.height = '100%';
        gameOverContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        gameOverContainer.style.display = 'flex';
        gameOverContainer.style.flexDirection = 'column';
        gameOverContainer.style.justifyContent = 'center';
        gameOverContainer.style.alignItems = 'center';
        gameOverContainer.style.zIndex = '1000';
        
        // Game over text
        const gameOverText = document.createElement('h1');
        gameOverText.textContent = 'GAME OVER!';
        gameOverText.style.color = '#FF0000';
        gameOverText.style.fontSize = '48px';
        gameOverText.style.marginBottom = '20px';
        gameOverContainer.appendChild(gameOverText);
        
        // Final score
        const scoreText = document.createElement('h2');
        scoreText.textContent = `FINAL SCORE: $${finalScore}`;
        scoreText.style.color = '#00FF00';
        scoreText.style.fontSize = '36px';
        scoreText.style.marginBottom = '40px';
        gameOverContainer.appendChild(scoreText);
        
        // Restart button
        const restartButton = document.createElement('button');
        restartButton.textContent = 'PLAY AGAIN';
        restartButton.style.padding = '15px 30px';
        restartButton.style.fontSize = '24px';
        restartButton.style.backgroundColor = '#FFFF00';
        restartButton.style.border = 'none';
        restartButton.style.borderRadius = '5px';
        restartButton.style.cursor = 'pointer';
        restartButton.onclick = () => {
            location.reload();
        };
        gameOverContainer.appendChild(restartButton);
        
        document.body.appendChild(gameOverContainer);
    }
} 
