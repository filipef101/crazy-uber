import * as THREE from 'three';

// Car class - Yellow Taxi
export class Car {
    constructor(scene) {
        this.scene = scene;
        
        // Car properties
        this.position = new THREE.Vector3(0, 2.4, 0); // Adjusted for the new lower road height
        this.rotation = 0; // Rotation around Y axis in radians
        this.speed = 0;
        this.acceleration = 0;
        this.maxSpeed = 50;
        this.brakingForce = 20;
        this.accelerationForce = 20;
        this.turnSpeed = 2.0;
        this.drag = 2;
        this.naturalDeceleration = 5; // Natural deceleration when not accelerating
        
        // Drift properties
        this.isDrifting = false;
        this.driftFactor = 0; // 0 to 1, how much drift is applied
        this.maxDriftFactor = 0.85; // Maximum drift intensity
        this.driftDirection = 0; // Direction of drift (positive or negative)
        this.driftRecoveryRate = 2.0; // How quickly drift stabilizes when not drifting
        this.driftBuildupRate = 3.0; // How quickly drift intensifies
        this.lateralVelocity = new THREE.Vector2(0, 0); // Side velocity for drift
        this.maxLateralVelocity = 20; // Maximum side velocity during drift
        this.lastTurnDirection = 0; // Track last turn direction for drift
        
        // Create a taxi cab mesh
        this.createTaxiMesh();
    }
    
    createTaxiMesh() {
        // Create a group to hold all car parts
        this.carMesh = new THREE.Group();
        this.carMesh.position.copy(this.position);
        
        // Colors
        const taxiYellow = 0xFFD230;
        const darkGlass = 0x222222;
        const blackColor = 0x111111;
        const lightsColor = 0xFFFFFF;
        const interiorColor = 0x444444;
        
        // Car body - main body of the taxi
        const carBodyGeometry = new THREE.BoxGeometry(2, 0.8, 4.5);
        const carBodyMaterial = new THREE.MeshLambertMaterial({ color: taxiYellow });
        const carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        carBody.position.set(0, 0.2, 0);
        this.carMesh.add(carBody);
        
        // Taxi cabin/roof
        const cabinGeometry = new THREE.BoxGeometry(1.8, 0.7, 2.6);
        const cabinMaterial = new THREE.MeshLambertMaterial({ color: taxiYellow });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0, 0.85, -0.1);
        this.carMesh.add(cabin);
        
        // Front windshield
        const frontWindowGeometry = new THREE.PlaneGeometry(1.7, 0.7);
        const windowMaterial = new THREE.MeshLambertMaterial({ 
            color: darkGlass, 
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide 
        });
        const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
        frontWindow.position.set(0, 0.85, 1.15);
        frontWindow.rotation.x = Math.PI / 2.2; // Angled windshield
        this.carMesh.add(frontWindow);
        
        // Rear windshield
        const rearWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
        rearWindow.position.set(0, 0.85, -1.35);
        rearWindow.rotation.x = -Math.PI / 2.2; // Angled rear windshield
        this.carMesh.add(rearWindow);
        
        // Side windows (left)
        const sideWindowGeometry = new THREE.PlaneGeometry(2.4, 0.6);
        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(-0.92, 0.85, -0.1);
        leftWindow.rotation.y = Math.PI / 2;
        this.carMesh.add(leftWindow);
        
        // Side windows (right)
        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(0.92, 0.85, -0.1);
        rightWindow.rotation.y = -Math.PI / 2;
        this.carMesh.add(rightWindow);
        
        // Taxi light on top
        const taxiLightGeometry = new THREE.BoxGeometry(0.7, 0.3, 0.3);
        const taxiLightMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const taxiLight = new THREE.Mesh(taxiLightGeometry, taxiLightMaterial);
        taxiLight.position.set(0, 1.35, -0.1);
        this.carMesh.add(taxiLight);
        
        // Front bumper
        const bumperGeometry = new THREE.BoxGeometry(2, 0.4, 0.3);
        const bumperMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
        const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        frontBumper.position.set(0, 0.2, 2.2);
        this.carMesh.add(frontBumper);
        
        // Rear bumper
        const rearBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        rearBumper.position.set(0, 0.2, -2.2);
        this.carMesh.add(rearBumper);
        
        // Headlights
        const headlightGeometry = new THREE.CircleGeometry(0.2, 8);
        const headlightMaterial = new THREE.MeshBasicMaterial({ color: lightsColor });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(-0.6, 0.4, 2.26);
        leftHeadlight.rotation.y = Math.PI;
        this.carMesh.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(0.6, 0.4, 2.26);
        rightHeadlight.rotation.y = Math.PI;
        this.carMesh.add(rightHeadlight);
        
        // Tail lights
        const taillightMaterial = new THREE.MeshBasicMaterial({ color: 0xCC0000 });
        
        const leftTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
        leftTaillight.position.set(-0.6, 0.4, -2.26);
        this.carMesh.add(leftTaillight);
        
        const rightTaillight = new THREE.Mesh(headlightGeometry, taillightMaterial);
        rightTaillight.position.set(0.6, 0.4, -2.26);
        this.carMesh.add(rightTaillight);
        
        // Taxi checkerboard pattern (simplified)
        this.addTaxiCheckerPattern();
        
        // Wheels - improved design
        this.addWheel(0.85, 0, 1.5);   // Front right
        this.addWheel(-0.85, 0, 1.5);  // Front left
        this.addWheel(0.85, 0, -1.5);  // Back right
        this.addWheel(-0.85, 0, -1.5); // Back left
        
        this.scene.add(this.carMesh);
    }
    
    addTaxiCheckerPattern() {
        // Add checker pattern along the sides using actual geometry instead of a plane
        const checkerWidth = 0.4;
        const checkerHeight = 0.4;
        const checkerDepth = 0.02; // Very thin
        
        // Left side checker pattern
        const leftCheckerGroup = new THREE.Group();
        leftCheckerGroup.position.set(-1.01, 0.4, 0);
        
        // Create a row of checker squares along the left side
        for (let i = -2; i <= 2; i++) {
            // Only add checkers at alternating positions (checkerboard pattern)
            if (i % 2 === 0) {
                const checkerGeometry = new THREE.BoxGeometry(checkerDepth, checkerHeight, checkerWidth);
                const checkerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const checker = new THREE.Mesh(checkerGeometry, checkerMaterial);
                checker.position.z = i * checkerWidth;
                leftCheckerGroup.add(checker);
            }
        }
        
        // Right side checker pattern
        const rightCheckerGroup = new THREE.Group();
        rightCheckerGroup.position.set(1.01, 0.4, 0);
        
        for (let i = -2; i <= 2; i++) {
            // Only add checkers at alternating positions (checkerboard pattern)
            if (i % 2 === 0) {
                const checkerGeometry = new THREE.BoxGeometry(checkerDepth, checkerHeight, checkerWidth);
                const checkerMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
                const checker = new THREE.Mesh(checkerGeometry, checkerMaterial);
                checker.position.z = i * checkerWidth;
                rightCheckerGroup.add(checker);
            }
        }
        
        this.carMesh.add(leftCheckerGroup);
        this.carMesh.add(rightCheckerGroup);
    }
    
    addWheel(x, y, z) {
        // Wheel rim
        const rimGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8);
        rimGeometry.rotateZ(Math.PI / 2);
        const rimMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCCCC });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.set(x, y, z);
        this.carMesh.add(rim);
        
        // Tire
        const tireGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 8);
        tireGeometry.rotateZ(Math.PI / 2);
        const tireMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.position.set(x, y, z);
        this.carMesh.add(tire);
    }
    
    accelerate() {
        this.acceleration = this.accelerationForce;
    }
    
    brake() {
        this.acceleration = -this.brakingForce;
    }
    
    idle() {
        // Instead of setting acceleration to 0, apply natural deceleration
        this.acceleration = 0;
    }
    
    startDrift() {
        this.isDrifting = true;
        
        // Set drift direction based on current turning direction
        // If we're turning, drift in that direction. If not, drift based on last turn
        if (this.driftDirection === 0) {
            // Initialize drift direction if not set yet
            this.driftDirection = this.lastTurnDirection || 1;
        }
    }
    
    stopDrift() {
        this.isDrifting = false;
        // Don't zero out drift factor immediately - will be handled gradually in update
    }
    
    turnLeft() {
        // Store turning direction for drift
        this.lastTurnDirection = 1;
        
        // Turning based on speed - more effective at medium speeds
        const speedFactor = Math.abs(this.speed) / this.maxSpeed;
        // Turn faster at medium speeds, slower at very low or very high speeds
        let turnMultiplier = speedFactor * (1 - speedFactor * 0.5);
        
        // When drifting, apply much sharper turning
        if (this.isDrifting) {
            turnMultiplier *= (1 + this.driftFactor * 2.5);
        }
        
        this.rotation += this.turnSpeed * turnMultiplier * 0.05;
    }
    
    turnRight() {
        // Store turning direction for drift
        this.lastTurnDirection = -1;
        
        // Turning based on speed - more effective at medium speeds
        const speedFactor = Math.abs(this.speed) / this.maxSpeed;
        // Turn faster at medium speeds, slower at very low or very high speeds
        let turnMultiplier = speedFactor * (1 - speedFactor * 0.5);
        
        // When drifting, apply much sharper turning
        if (this.isDrifting) {
            turnMultiplier *= (1 + this.driftFactor * 2.5);
        }
        
        this.rotation -= this.turnSpeed * turnMultiplier * 0.05;
    }
    
    update(deltaTime) {
        // Apply acceleration
        this.speed += this.acceleration * deltaTime;
        
        // Apply natural deceleration when not actively accelerating
        if (this.acceleration === 0 && Math.abs(this.speed) > 0) {
            const decelerationForce = this.naturalDeceleration * deltaTime;
            if (this.speed > 0) {
                this.speed = Math.max(0, this.speed - decelerationForce);
            } else {
                this.speed = Math.min(0, this.speed + decelerationForce);
            }
        }
        
        // Apply drag (air resistance, etc.)
        if (Math.abs(this.speed) > 0) {
            const dragForce = this.drag * deltaTime;
            if (this.speed > 0) {
                this.speed = Math.max(0, this.speed - dragForce);
            } else {
                this.speed = Math.min(0, this.speed + dragForce);
            }
        }
        
        // Clamp speed
        this.speed = Math.max(-this.maxSpeed / 2, Math.min(this.maxSpeed, this.speed));
        
        // Update drift factor
        this.updateDrift(deltaTime);
        
        // Calculate movement with drift applied
        this.calculateMovement(deltaTime);
        
        // Update car mesh
        this.carMesh.position.copy(this.position);
        this.carMesh.rotation.y = this.rotation;
        
        // Tilt car when drifting for visual effect
        if (this.driftFactor > 0.1) {
            // Calculate tilt based on drift factor and direction
            const tiltAngle = this.driftFactor * 0.1 * this.driftDirection;
            this.carMesh.rotation.z = tiltAngle;
        } else {
            // Reset tilt when not drifting
            this.carMesh.rotation.z = 0;
        }
    }
    
    updateDrift(deltaTime) {
        // Adjust drift factor based on whether we're drifting
        if (this.isDrifting && Math.abs(this.speed) > 5) {
            // Build up drift gradually
            this.driftFactor = Math.min(this.maxDriftFactor, 
                this.driftFactor + this.driftBuildupRate * deltaTime);
            
            // Apply drift direction based on turning
            if (this.lastTurnDirection) {
                this.driftDirection = this.lastTurnDirection;
            }
            
            // Calculate lateral velocity for drift
            const directionVector = new THREE.Vector2(
                Math.sin(this.rotation),
                Math.cos(this.rotation)
            );
            
            // Perpendicular vector (for side movement)
            const perpVector = new THREE.Vector2(-directionVector.y, directionVector.x);
            
            // Apply lateral force based on drift direction and factor
            const lateralForce = this.driftFactor * this.speed * this.driftDirection;
            
            // Update lateral velocity with some decay
            this.lateralVelocity.x = perpVector.x * lateralForce;
            this.lateralVelocity.y = perpVector.y * lateralForce;
        } else {
            // Gradually decrease drift factor when not drifting
            this.driftFactor = Math.max(0, this.driftFactor - this.driftRecoveryRate * deltaTime);
            
            // Decay lateral velocity when not drifting
            this.lateralVelocity.x *= 0.9;
            this.lateralVelocity.y *= 0.9;
            
            // If drift factor is very small, zero it out completely
            if (this.driftFactor < 0.01) {
                this.driftFactor = 0;
                this.lateralVelocity.set(0, 0);
            }
        }
        
        // Limit lateral velocity
        const lateralSpeed = this.lateralVelocity.length();
        if (lateralSpeed > this.maxLateralVelocity) {
            this.lateralVelocity.multiplyScalar(this.maxLateralVelocity / lateralSpeed);
        }
    }
    
    calculateMovement(deltaTime) {
        // Calculate forward movement
        const moveDistance = this.speed * deltaTime * 1.5;
        
        // Direction vector based on car rotation
        const dirX = Math.sin(this.rotation);
        const dirZ = Math.cos(this.rotation);
        
        // Update position based on rotation and speed (forward movement)
        this.position.x += dirX * moveDistance;
        this.position.z += dirZ * moveDistance;
        
        // Apply lateral velocity (drift)
        if (this.lateralVelocity.length() > 0.1) {
            this.position.x += this.lateralVelocity.x * deltaTime;
            this.position.z += this.lateralVelocity.y * deltaTime;
        }
    }
} 
