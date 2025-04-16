import * as THREE from 'three';
import { randomInt } from '../utils/helpers.js';

export class Building {
    constructor(scene, position, options = {}) {
        this.scene = scene;
        this.position = position || new THREE.Vector3(0, 0, 0);
        
        // Set default options
        this.options = {
            width: options.width || randomInt(5, 20),
            height: options.height || randomInt(10, 50),
            depth: options.depth || randomInt(5, 20),
            color: options.color || this.getRandomBuildingColor()
        };
        
        this.createMesh();
    }
    
    getRandomBuildingColor() {
        const colors = [
            0x555555, // Dark gray
            0x666666, // Medium gray
            0x777777, // Light gray
            0x888888, // Very light gray
            0x999999, // Almost white
            0x444444, // Very dark gray
            0x333333, // Almost black
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    createMesh() {
        // Create building
        const geometry = new THREE.BoxGeometry(
            this.options.width,
            this.options.height,
            this.options.depth
        );
        
        const material = new THREE.MeshStandardMaterial({
            color: this.options.color,
            roughness: 0.7,
            metalness: 0.2
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        
        // Position the bottom of the building on the ground
        this.mesh.position.y = this.options.height / 2;
        
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        this.scene.add(this.mesh);
    }
} 
