export class GameTimer {
    constructor(initialTime = 90) {
        this.initialTime = initialTime;
        this.timeRemaining = initialTime;
        this.isGameOver = false;
        this.isPaused = false;
        this.callbacks = {
            onTimeUpdate: null,
            onGameOver: null,
            onTimeWarning: null
        };
    }
    
    update(deltaTime) {
        if (this.isPaused || this.isGameOver) return;
        
        this.timeRemaining -= deltaTime;
        
        // Check for time warnings
        if (this.callbacks.onTimeWarning) {
            if (this.timeRemaining <= 10 && this.timeRemaining > 9.9) {
                this.callbacks.onTimeWarning(10);
            } else if (this.timeRemaining <= 30 && this.timeRemaining > 29.9) {
                this.callbacks.onTimeWarning(30);
            }
        }
        
        // Notify about time update
        if (this.callbacks.onTimeUpdate) {
            this.callbacks.onTimeUpdate(this.timeRemaining);
        }
        
        // Check for game over
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.isGameOver = true;
            
            if (this.callbacks.onGameOver) {
                this.callbacks.onGameOver();
            }
        }
    }
    
    addTime(seconds) {
        this.timeRemaining += seconds;
        return this.timeRemaining;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    reset() {
        this.timeRemaining = this.initialTime;
        this.isGameOver = false;
        this.isPaused = false;
    }
    
    setCallback(event, callback) {
        if (this.callbacks.hasOwnProperty(event)) {
            this.callbacks[event] = callback;
        }
    }
    
    getTimeStats() {
        return {
            initialTime: this.initialTime,
            timeRemaining: Math.max(0, Math.ceil(this.timeRemaining)),
            isGameOver: this.isGameOver,
            isPaused: this.isPaused,
            timePercent: (this.timeRemaining / this.initialTime) * 100
        };
    }
} 
