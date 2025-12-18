import { TouchControls } from './ui/touchControls.js';

// Controls class
export class Controls {
    constructor(car) {
        this.car = car;
        this.isAccelerating = false;
        this.isBraking = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.isDriftKeyPressed = false;
        
        // Initialize touch controls for mobile devices
        this.touchControls = new TouchControls(car);
        
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    
    handleKeyDown(event) {
        switch(event.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.isAccelerating = true;
                break;
            case 's':
            case 'arrowdown':
                this.isBraking = true;
                break;
            case 'a':
            case 'arrowleft':
                this.isTurningLeft = true;
                break;
            case 'd':
            case 'arrowright':
                this.isTurningRight = true;
                break;
            case ' ': // Space bar for drift
                this.isDriftKeyPressed = true;
                this.car.startDrift();
                break;
        }
    }
    
    handleKeyUp(event) {
        switch(event.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.isAccelerating = false;
                break;
            case 's':
            case 'arrowdown':
                this.isBraking = false;
                break;
            case 'a':
            case 'arrowleft':
                this.isTurningLeft = false;
                break;
            case 'd':
            case 'arrowright':
                this.isTurningRight = false;
                break;
            case ' ': // Space bar for drift
                this.isDriftKeyPressed = false;
                this.car.stopDrift();
                break;
        }
    }
    
    update() {
        // If touch controls are active, let them handle all input
        // This prevents conflicting inputs between touch and keyboard
        if (this.touchControls && this.touchControls.isActive()) {
            this.touchControls.update();
            return; // Don't process keyboard input when touch is active
        }
        
        // Process keyboard input only when touch is not active
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
} 
