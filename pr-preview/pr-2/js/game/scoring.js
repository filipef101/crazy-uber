export class ScoreManager {
    constructor() {
        this.totalScore = 0;
        this.currentFare = 0;
        this.deliveredPassengers = 0;
        this.scoreHistory = [];
        this.bonusPoints = 0;
        this.comboMultiplier = 1;
        this.comboTimer = 0;
        this.lastScoreTime = 0;
    }
    
    addFare(amount) {
        // Add fare to total score
        this.currentFare = amount;
        
        // Check for combo (quick successive deliveries)
        const now = performance.now();
        const timeDiff = now - this.lastScoreTime;
        
        if (timeDiff < 30000) { // Less than 30 seconds between deliveries
            this.comboMultiplier = Math.min(this.comboMultiplier + 0.5, 3); // Max 3x multiplier
            this.comboTimer = 30; // 30 seconds to maintain combo
        } else {
            this.comboMultiplier = 1; // Reset multiplier
        }
        
        // Apply multiplier to fare
        const multipliedFare = Math.round(amount * this.comboMultiplier);
        
        // Update tracking
        this.totalScore += multipliedFare;
        this.deliveredPassengers++;
        this.scoreHistory.push({
            amount: multipliedFare,
            time: now,
            multiplier: this.comboMultiplier
        });
        
        this.lastScoreTime = now;
        
        return {
            baseAmount: amount,
            multiplier: this.comboMultiplier,
            totalAmount: multipliedFare
        };
    }
    
    addBonus(amount, reason = 'bonus') {
        this.bonusPoints += amount;
        this.totalScore += amount;
        
        // Record the bonus
        this.scoreHistory.push({
            amount: amount,
            time: performance.now(),
            reason: reason
        });
        
        return amount;
    }
    
    // Apply time bonus based on remaining time
    addTimeBonus(remainingTime) {
        const timeBonus = Math.round(remainingTime * 10); // 10 points per second
        return this.addBonus(timeBonus, 'time_bonus');
    }
    
    // Add drift bonus when drifting
    addDriftBonus(driftTime, driftAngle) {
        // Calculate drift bonus based on time and angle
        const driftBonus = Math.round(driftTime * 5 * Math.abs(driftAngle) / 0.5);
        
        if (driftBonus > 0) {
            return this.addBonus(driftBonus, 'drift_bonus');
        }
        
        return 0;
    }
    
    // Add speed bonus for delivering passengers quickly
    addSpeedBonus(deliveryTime, distance) {
        // Calculate expected delivery time (seconds per unit distance)
        const expectedTime = distance * 0.5;
        
        // If delivered faster than expected
        if (deliveryTime < expectedTime) {
            const speedFactor = expectedTime / deliveryTime;
            const speedBonus = Math.round(distance * 5 * speedFactor);
            return this.addBonus(speedBonus, 'speed_bonus');
        }
        
        return 0;
    }
    
    update(deltaTime) {
        // Update combo timer
        if (this.comboMultiplier > 1) {
            this.comboTimer -= deltaTime;
            
            if (this.comboTimer <= 0) {
                this.comboMultiplier = 1; // Reset multiplier
            }
        }
    }
    
    getScoreStats() {
        return {
            totalScore: this.totalScore,
            deliveredPassengers: this.deliveredPassengers,
            currentFare: this.currentFare,
            comboMultiplier: this.comboMultiplier,
            comboTimer: Math.max(0, Math.round(this.comboTimer)),
            bonusPoints: this.bonusPoints
        };
    }
} 
