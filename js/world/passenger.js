import * as THREE from 'three';

export class Passenger {
    constructor(scene, position, destination) {
        this.scene = scene;
        this.position = position;
        this.destination = destination;
        this.isPickedUp = false;
        this.mesh = null;
        this.destinationMarker = null;
        this.reward = this.calculateReward();
        
        this.createPassengerMesh();
        this.createDestinationMarker();
    }
    
    createPassengerMesh() {
        // Create a simple human-like mesh for the passenger
        const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
        const headGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0xFFAAAA });
        
        // Create body and head
        const body = new THREE.Mesh(bodyGeometry, material);
        body.position.y = 1.0;
        
        const head = new THREE.Mesh(headGeometry, material);
        head.position.y = 2.25;
        
        // Create passenger group
        this.mesh = new THREE.Group();
        this.mesh.add(body);
        this.mesh.add(head);
        
        // Position passenger
        this.mesh.position.copy(this.position);
        this.mesh.position.y = 0; // Place on ground
        
        this.scene.add(this.mesh);
        
        // Add animation
        this.animatePassenger();
    }
    
    createDestinationMarker() {
        // Create destination marker (arrow pointing down)
        const arrowGeometry = new THREE.ConeGeometry(2, 4, 8);
        const arrowMaterial = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
        
        this.destinationMarker = new THREE.Mesh(arrowGeometry, arrowMaterial);
        this.destinationMarker.position.copy(this.destination);
        this.destinationMarker.position.y = 10; // Position above ground
        this.destinationMarker.rotation.x = Math.PI; // Point downward
        
        this.destinationMarker.visible = false; // Only visible after pickup
        
        this.scene.add(this.destinationMarker);
    }
    
    animatePassenger() {
        // Bounce animation for waiting passenger
        this.animationTime = 0;
    }
    
    update(deltaTime) {
        if (!this.isPickedUp) {
            // Animate waiting passenger (bounce/wave)
            this.animationTime += deltaTime;
            this.mesh.position.y = Math.sin(this.animationTime * 2) * 0.2;
        } else {
            // Hide passenger mesh when picked up
            this.mesh.visible = false;
            
            // Show destination marker when picked up
            this.destinationMarker.visible = true;
            
            // Animate destination marker
            this.destinationMarker.position.y = 10 + Math.sin(this.animationTime * 3) * 1;
            this.animationTime += deltaTime;
        }
    }
    
    pickUp() {
        this.isPickedUp = true;
        return this.destination;
    }
    
    dropOff() {
        // Remove passenger and destination marker from scene
        this.scene.remove(this.mesh);
        this.scene.remove(this.destinationMarker);
        return this.reward;
    }
    
    calculateReward() {
        // Calculate reward based on distance
        const distance = new THREE.Vector3()
            .subVectors(this.position, this.destination)
            .length();
        
        return Math.round(distance * 2); // $2 per unit of distance
    }
    
    getDistanceToDestination(position) {
        return new THREE.Vector3()
            .subVectors(position, this.destination)
            .length();
    }
    
    isAtDestination(position, threshold = 10) {
        return this.getDistanceToDestination(position) < threshold;
    }
} 
