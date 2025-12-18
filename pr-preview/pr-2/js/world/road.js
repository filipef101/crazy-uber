import * as THREE from 'three';

export class Road {
    constructor(scene, start, end, width = 10) {
        this.scene = scene;
        this.start = start || new THREE.Vector3(-50, 0, 0);
        this.end = end || new THREE.Vector3(50, 0, 0);
        this.width = width;
        
        this.createRoad();
    }
    
    createRoad() {
        // Calculate road length and direction
        const direction = new THREE.Vector3().subVectors(this.end, this.start);
        const length = direction.length();
        
        // Create the road geometry
        const geometry = new THREE.PlaneGeometry(this.width, length);
        
        // Road material - asphalt color
        const material = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0
        });
        
        // Create the road mesh
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Position and rotate the road
        const midpoint = new THREE.Vector3().addVectors(this.start, this.end).multiplyScalar(0.5);
        this.mesh.position.copy(midpoint);
        this.mesh.position.y = 0.01; // Slightly above ground to avoid z-fighting
        
        // Calculate the rotation to point from start to end
        this.mesh.rotation.x = -Math.PI / 2; // Make horizontal
        
        // Rotate the road to align with the direction
        const angle = Math.atan2(direction.x, direction.z);
        this.mesh.rotation.z = angle;
        
        this.mesh.receiveShadow = true;
        
        this.scene.add(this.mesh);
        
        // Add road markings
        this.addRoadMarkings(length);
    }
    
    addRoadMarkings(length) {
        // Center line - dashed white line
        const centerLineGeometry = new THREE.PlaneGeometry(0.25, length);
        const centerLineMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        
        const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
        centerLine.position.y = 0.02; // Slightly above the road
        
        this.mesh.add(centerLine);
    }
} 
