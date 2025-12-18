import * as THREE from 'three';
import { Passenger } from '../world/passenger.js';

export class MissionManager {
    constructor(scene, map) {
        this.scene = scene;
        this.map = map;
        this.passengers = [];
        this.currentPassenger = null;
        this.score = 0;
        this.timeRemaining = 90; // 90 seconds starting time
        this.isGameOver = false;
        this.arrowHelper = null;
        
        // Create destination arrow
        this.createDirectionArrow();
    }
    
    createDirectionArrow() {
        // Create a direction arrow to point to destination/passenger
        const arrowDir = new THREE.Vector3(0, 1, 0);
        const arrowOrigin = new THREE.Vector3(0, 0, 0);
        const arrowLength = 2;
        const arrowColor = 0xffff00;
        const headLength = 0.5;
        const headWidth = 0.3;
        
        this.arrowHelper = new THREE.ArrowHelper(
            arrowDir, arrowOrigin, arrowLength, arrowColor, headLength, headWidth
        );
        this.arrowHelper.visible = false;
        this.scene.add(this.arrowHelper);
    }
    
    generatePassenger() {
        // Get a random road position for passenger spawn
        const passengerRoad = this.map.getRandomRoad();
        const passengerPosition = this.getRandomPositionOnRoad(passengerRoad);
        
        // Get a different road for destination
        let destinationRoad;
        do {
            destinationRoad = this.map.getRandomRoad();
        } while (destinationRoad === passengerRoad);
        
        const destinationPosition = this.getRandomPositionOnRoad(destinationRoad);
        
        // Create passenger with random position and destination
        const passenger = new Passenger(
            this.scene,
            passengerPosition,
            destinationPosition
        );
        
        this.passengers.push(passenger);
        return passenger;
    }
    
    getRandomPositionOnRoad(road) {
        // Get random position along the road
        const start = road.start;
        const end = road.end;
        const t = Math.random(); // Random position between start and end
        
        return new THREE.Vector3(
            start.x + (end.x - start.x) * t,
            0.1, // Slightly above ground
            start.z + (end.z - start.z) * t
        );
    }
    
    update(deltaTime, carPosition) {
        // Update game timer
        if (!this.isGameOver) {
            this.timeRemaining -= deltaTime;
            
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.isGameOver = true;
                return;
            }
        }
        
        // Generate a passenger if none available
        if (this.passengers.length === 0 && !this.currentPassenger) {
            this.generatePassenger();
        }
        
        // Update all waiting passengers
        for (const passenger of this.passengers) {
            passenger.update(deltaTime);
            
            // Check if car is close enough to pick up passenger
            if (!passenger.isPickedUp) {
                const distance = new THREE.Vector3()
                    .subVectors(carPosition, passenger.position)
                    .length();
                
                if (distance < 5) { // Within 5 units to pick up
                    this.currentPassenger = passenger;
                    this.passengers = this.passengers.filter(p => p !== passenger);
                    this.currentPassenger.pickUp();
                    
                    // Add some time when picking up a passenger
                    this.timeRemaining += 30;
                }
            }
        }
        
        // Handle current passenger
        if (this.currentPassenger) {
            this.currentPassenger.update(deltaTime);
            
            // Update direction arrow
            this.updateDirectionArrow(carPosition, this.currentPassenger.destination);
            
            // Check if car is at destination
            if (this.currentPassenger.isAtDestination(carPosition)) {
                // Add score
                const reward = this.currentPassenger.dropOff();
                this.score += reward;
                
                // Add time bonus
                this.timeRemaining += 10;
                
                // Show reward popup
                this.showRewardPopup(reward, carPosition);
                
                // Clear current passenger
                this.currentPassenger = null;
                
                // Hide direction arrow
                this.arrowHelper.visible = false;
            }
        } else {
            // Point to nearest passenger if not carrying anyone
            const nearestPassenger = this.findNearestPassenger(carPosition);
            if (nearestPassenger) {
                this.updateDirectionArrow(carPosition, nearestPassenger.position);
            } else {
                this.arrowHelper.visible = false;
            }
        }
    }
    
    updateDirectionArrow(carPosition, targetPosition) {
        // Calculate direction to target
        const direction = new THREE.Vector3()
            .subVectors(targetPosition, carPosition)
            .normalize();
        
        // Position arrow above car
        this.arrowHelper.position.copy(carPosition);
        this.arrowHelper.position.y = 5;
        
        // Flatten y direction for better visibility
        direction.y = 0;
        direction.normalize();
        
        this.arrowHelper.setDirection(direction);
        this.arrowHelper.visible = true;
    }
    
    findNearestPassenger(carPosition) {
        if (this.passengers.length === 0) return null;
        
        let nearestPassenger = this.passengers[0];
        let nearestDistance = Infinity;
        
        for (const passenger of this.passengers) {
            const distance = new THREE.Vector3()
                .subVectors(carPosition, passenger.position)
                .length();
            
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestPassenger = passenger;
            }
        }
        
        return nearestPassenger;
    }
    
    showRewardPopup(amount, position) {
        // Create a text sprite to show reward
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 48px Arial';
        context.fillStyle = 'green';
        context.textAlign = 'center';
        context.fillText('$' + amount, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.copy(position);
        sprite.position.y = 5;
        sprite.scale.set(5, 2.5, 1);
        
        this.scene.add(sprite);
        
        // Animate and remove after a delay
        let age = 0;
        const animate = () => {
            age += 0.02;
            sprite.position.y += 0.05;
            sprite.material.opacity = 1 - age;
            
            if (age < 1) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(sprite);
            }
        };
        
        animate();
    }
    
    getGameStats() {
        return {
            score: this.score,
            timeRemaining: Math.ceil(this.timeRemaining),
            isGameOver: this.isGameOver
        };
    }
} 
