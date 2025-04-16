import * as THREE from 'three';

// Car class - Yellow Taxi
export class Car {
    constructor(scene, particleSystem = null) {
        this.scene = scene;
        this.carMesh = null;
        this.position = new THREE.Vector3(0, 2.4, 0); // Adjusted for the new lower road height
        this.rotation = 0; // Rotation around Y axis in radians
        this.speed = 0;
        this.acceleration = 0;
        this.maxSpeed = 60;
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
        
        // Collision properties
        this.collisionRadius = 1.5; // Collision detection radius
        this.isCrashed = false;
        this.crashRecoveryTime = 0;
        this.maxCrashRecoveryTime = 1.0; // Time to recover from crash in seconds
        this.crashDamageLevel = 0; // Accumulate damage from crashes
        this.maxDamageLevel = 5; // Maximum damage level before car is severely damaged
        this.hasCollided = false; // Flag to track collision in current frame
        
        // Add particle system
        this.particleSystem = particleSystem;
        this.driftEffectTimer = 0;
        
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
    
    update(deltaTime, map) {
        // Handle crash recovery
        if (this.isCrashed) {
            this.crashRecoveryTime -= deltaTime;
            
            if (this.crashRecoveryTime <= 0) {
                this.isCrashed = false;
                this.carMesh.rotation.x = 0; // Reset tilt
            } else {
                // If crashed, limit control
                this.speed *= 0.95; // Slow down
                return; // Skip regular physics update
            }
        }
        
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
        
        // Store previous position for collision detection
        const prevPosition = this.position.clone();
        
        // Calculate movement with drift applied
        this.calculateMovement(deltaTime);
        
        // Check for collisions if map is provided
        this.hasCollided = false;
        if (map) {
            const collisions = map.checkCollisions(this.position, this.collisionRadius);
            
            // Handle building collisions
            if (collisions.buildings.length > 0) {
                this.handleBuildingCollision(collisions.buildings[0], prevPosition);
            }
            
            // Handle tree collisions
            if (collisions.trees.length > 0) {
                for (const treeCollision of collisions.trees) {
                    this.handleTreeCollision(treeCollision, map, prevPosition);
                }
            }
        }
        
        // Update car mesh
        this.carMesh.position.copy(this.position);
        this.carMesh.rotation.y = this.rotation;
        
        // Tilt car when drifting for visual effect
        if (this.driftFactor > 0.1 && !this.isCrashed) {
            // Calculate tilt based on drift factor and direction
            const tiltAngle = this.driftFactor * 0.1 * this.driftDirection;
            this.carMesh.rotation.z = tiltAngle;
        } else if (!this.isCrashed) {
            // Reset tilt when not drifting
            this.carMesh.rotation.z = 0;
        }
        
        // Apply damage effects
        if (this.crashDamageLevel > 0) {
            this.applyDamageEffects();
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
            
            // Apply lateral force based on drift direction and factor
            const lateralForce = this.driftFactor * this.speed * this.driftDirection;
            
            // Update lateral velocity with some decay
            this.lateralVelocity.x += lateralForce * deltaTime * 0.2;
            this.lateralVelocity.y += lateralForce * deltaTime * 0.2;
            
            // Reduce speed during drift for better handling
            // More pronounced speed reduction with higher drift factor
            const speedReductionFactor = 0.6 + (this.driftFactor * 0.3); // 0.6-0.9 range
            
            // Apply speed reduction based on drift intensity
            this.speed *= Math.pow(speedReductionFactor, deltaTime * 2);
            
            // Apply additional drag when drifting
            this.speed -= (this.speed * this.driftFactor * 0.5) * deltaTime;
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
        
        // Create drift effects if drifting
        if (this.driftFactor > 0.1 && this.speed > 10 && this.particleSystem) {
            // Create drift smoke based on drift factor and speed
            this.driftEffectTimer += deltaTime;
            
            // Only create effects at certain intervals
            if (this.driftEffectTimer > 0.1) { // Every 0.1 seconds
                this.driftEffectTimer = 0;
                
                // Create smoke particles
                const driftIntensity = Math.min(this.driftFactor * (this.speed / this.maxSpeed), 1.0);
                this.particleSystem.createDriftSmoke(this.position, driftIntensity);
                
                // Create skid marks
                const directionVector = new THREE.Vector3(
                    Math.sin(this.rotation),
                    0,
                    Math.cos(this.rotation)
                );
                this.particleSystem.createSkidMarks(this.position, directionVector, this.speed);
            }
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
    
    handleBuildingCollision(collision, prevPosition) {
        // Set collision flag
        this.hasCollided = true;
        
        // Increase damage level
        this.crashDamageLevel = Math.min(this.maxDamageLevel, this.crashDamageLevel + Math.abs(this.speed) * 0.05);
        
        // If hitting at high speed, trigger a crash 
        if (Math.abs(this.speed) > 20) {
            this.triggerCrash();
            
            // Create collision particles
            if (this.particleSystem) {
                this.particleSystem.createCollisionParticles(this.position, collision.normal);
            }
        }
        
        // Bounce effect - reflect some of the velocity
        this.speed *= -0.3; // Reverse and reduce speed
        
        // Reset position to just outside collision
        const pushBackDistance = collision.penetration + 0.1;
        this.position.x = prevPosition.x + collision.normal.x * pushBackDistance;
        this.position.z = prevPosition.z + collision.normal.z * pushBackDistance;
        
        // Add velocity in normal direction to bounce away
        this.lateralVelocity.x += collision.normal.x * 5;
        this.lateralVelocity.y += collision.normal.z * 5;
    }
    
    handleTreeCollision(collision, map, prevPosition) {
        // Set collision flag
        this.hasCollided = true;
        
        // Get tree from collision
        const tree = collision.object;
        
        // Check speed to determine if tree should be destroyed
        if (Math.abs(this.speed) > 15) {
            // Tree destruction
            map.destroyTree(tree);
            
            // Slightly slow down the car
            this.speed *= 0.8;
            
            // Play tree destruction effect
            if (this.particleSystem) {
                this.particleSystem.createTreeDestructionParticles(tree.position);
            }
        } else {
            // Bounce off the tree
            this.speed *= -0.2; // Reverse and reduce speed
            
            // Push back position
            const pushBackDistance = collision.penetration + 0.1;
            this.position.x = prevPosition.x + collision.normal.x * pushBackDistance;
            this.position.z = prevPosition.z + collision.normal.z * pushBackDistance;
            
            // Create small collision particles
            if (this.particleSystem) {
                this.particleSystem.createCollisionParticles(tree.position, collision.normal, 0.5);
            }
        }
    }
    
    triggerCrash() {
        if (this.isCrashed) return; // Already crashed
        
        this.isCrashed = true;
        this.crashRecoveryTime = this.maxCrashRecoveryTime;
        
        // Tilt car forward to show crash
        this.carMesh.rotation.x = 0.1;
        
        // Stop drifting
        this.isDrifting = false;
        this.driftFactor = 0;
        
        // Play crash sound (implemented in sound system)
        // if (this.soundSystem) this.soundSystem.playCrashSound();
    }
    
    applyDamageEffects() {
        // Apply visual damage effects based on crashDamageLevel
        // These effects become more pronounced as damage increases
        
        // Damage level normalized to 0-1
        const damageNorm = this.crashDamageLevel / this.maxDamageLevel;
        
        // Reduce max speed based on damage
        const speedReduction = 20 * damageNorm;
        this.maxSpeed = 60 - speedReduction;
        
        // Visual damage effects (can be expanded later)
        if (damageNorm > 0.7) {
            // Severe damage - could add smoke particles
            if (this.particleSystem && Math.random() < damageNorm * 0.1) {
                this.particleSystem.createSmokeParticles(this.position, 0.2);
            }
        }
    }
} 
