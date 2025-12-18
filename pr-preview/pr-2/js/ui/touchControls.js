// Touch Controls class for mobile devices
export class TouchControls {
    constructor(car) {
        this.car = car;
        
        // Control states
        this.isAccelerating = false;
        this.isBraking = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.isDrifting = false;
        
        // Only create controls if on touch device or mobile
        this.isTouchDevice = this.detectTouchDevice();
        
        if (this.isTouchDevice) {
            this.createTouchControls();
        }
    }
    
    detectTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0) ||
               window.matchMedia("(pointer: coarse)").matches;
    }
    
    createTouchControls() {
        // Create container for all touch controls
        this.container = document.createElement('div');
        this.container.id = 'touch-controls';
        this.container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 200px;
            pointer-events: none;
            z-index: 500;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 20px;
            box-sizing: border-box;
        `;
        document.body.appendChild(this.container);
        
        // Create left side controls (steering)
        this.createSteeringControls();
        
        // Create right side controls (gas, brake, drift)
        this.createActionControls();
    }
    
    createSteeringControls() {
        // Left side - steering buttons
        const steeringContainer = document.createElement('div');
        steeringContainer.style.cssText = `
            display: flex;
            gap: 10px;
            pointer-events: auto;
        `;
        
        // Left button
        this.leftButton = this.createControlButton('◀', () => {
            this.isTurningLeft = true;
        }, () => {
            this.isTurningLeft = false;
        });
        
        // Right button
        this.rightButton = this.createControlButton('▶', () => {
            this.isTurningRight = true;
        }, () => {
            this.isTurningRight = false;
        });
        
        steeringContainer.appendChild(this.leftButton);
        steeringContainer.appendChild(this.rightButton);
        this.container.appendChild(steeringContainer);
    }
    
    createActionControls() {
        // Right side - gas, brake, drift
        const actionContainer = document.createElement('div');
        actionContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: auto;
        `;
        
        // Top row - Gas and Brake
        const topRow = document.createElement('div');
        topRow.style.cssText = `
            display: flex;
            gap: 10px;
        `;
        
        // Gas button
        this.gasButton = this.createControlButton('▲', () => {
            this.isAccelerating = true;
        }, () => {
            this.isAccelerating = false;
        }, '#00FF00');
        
        // Brake button
        this.brakeButton = this.createControlButton('▼', () => {
            this.isBraking = true;
        }, () => {
            this.isBraking = false;
        }, '#FF0000');
        
        topRow.appendChild(this.gasButton);
        topRow.appendChild(this.brakeButton);
        
        // Drift button - larger, below the others
        this.driftButton = this.createControlButton('DRIFT', () => {
            this.isDrifting = true;
            this.car.startDrift();
        }, () => {
            this.isDrifting = false;
            this.car.stopDrift();
        }, '#FF6600', true);
        
        actionContainer.appendChild(topRow);
        actionContainer.appendChild(this.driftButton);
        this.container.appendChild(actionContainer);
    }
    
    createControlButton(label, onStart, onEnd, color = '#FFFF00', isWide = false) {
        const button = document.createElement('div');
        button.style.cssText = `
            width: ${isWide ? '140px' : '70px'};
            height: 70px;
            background-color: rgba(0, 0, 0, 0.6);
            border: 3px solid ${color};
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: ${color};
            font-size: ${isWide ? '18px' : '24px'};
            font-weight: bold;
            font-family: Arial, sans-serif;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        `;
        button.textContent = label;
        
        // Handle touch events
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.style.backgroundColor = `${color}40`;
            onStart();
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            onEnd();
        }, { passive: false });
        
        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            onEnd();
        }, { passive: false });
        
        // Also handle mouse events for testing on desktop
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            button.style.backgroundColor = `${color}40`;
            onStart();
        });
        
        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            onEnd();
        });
        
        button.addEventListener('mouseleave', (e) => {
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            onEnd();
        });
        
        return button;
    }
    
    update() {
        // Apply touch control states to the car
        if (this.isAccelerating) {
            this.car.accelerate();
        } else if (this.isBraking) {
            this.car.brake();
        } else {
            this.car.idle();
        }
        
        if (this.isTurningLeft) {
            this.car.turnLeft();
        }
        if (this.isTurningRight) {
            this.car.turnRight();
        }
    }
    
    show() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
    }
    
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    isActive() {
        return this.isTouchDevice;
    }
}
