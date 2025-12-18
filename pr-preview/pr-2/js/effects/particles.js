import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particleSystems = [];
    }
    
    createSkidMarks(position, direction, carSpeed) {
        if (carSpeed < 10) return; // Only create skid marks when going fast enough
        
        // Create skid mark particles
        const particleCount = 10;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        // Create positions slightly behind the car in the direction of travel
        const perpendicularDir = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
        const skidWidth = 1.5; // Width of car tires
        
        for (let i = 0; i < particleCount; i++) {
            const side = i % 2 === 0 ? -1 : 1; // Alternate sides for left and right tires
            const offset = (Math.random() * 0.5) - 0.25; // Small random offset
            
            const posIndex = i * 3;
            positions[posIndex] = position.x + (perpendicularDir.x * side * skidWidth/2) + offset;
            positions[posIndex + 1] = 0.05; // Slightly above ground
            positions[posIndex + 2] = position.z + (perpendicularDir.z * side * skidWidth/2) + offset;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Create material
        const material = new THREE.PointsMaterial({
            color: 0x333333,
            size: 0.5,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.7
        });
        
        // Create and add particle system
        const skidMarks = new THREE.Points(geometry, material);
        this.scene.add(skidMarks);
        
        // Add to tracking array with lifetime
        this.particleSystems.push({
            mesh: skidMarks,
            lifetime: 3 + Math.random() * 2, // 3-5 seconds lifetime
            age: 0
        });
    }
    
    createDriftSmoke(position, intensity = 1.0) {
        // Skip if intensity is too low
        if (intensity < 0.2) return;
        
        // Number of particles based on intensity
        const particleCount = Math.floor(20 * intensity);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        
        // Create random particle positions around car
        for (let i = 0; i < particleCount; i++) {
            const posIndex = i * 3;
            const spread = 1.5;
            
            // Position
            positions[posIndex] = position.x + (Math.random() * spread * 2 - spread);
            positions[posIndex + 1] = 0.1; // Start slightly above ground
            positions[posIndex + 2] = position.z + (Math.random() * spread * 2 - spread);
            
            // Velocity (mostly upward with some random spread)
            velocities[posIndex] = (Math.random() - 0.5) * 0.5;
            velocities[posIndex + 1] = 0.5 + Math.random() * 0.5; // Upward
            velocities[posIndex + 2] = (Math.random() - 0.5) * 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        // Create material
        const material = new THREE.PointsMaterial({
            color: 0xDDDDDD,
            size: 0.8,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.6
        });
        
        // Create and add particle system
        const smoke = new THREE.Points(geometry, material);
        this.scene.add(smoke);
        
        // Add to tracking array with lifetime
        this.particleSystems.push({
            mesh: smoke,
            lifetime: 1.5, // 1.5 seconds lifetime
            age: 0,
            velocities: velocities,
            type: 'smoke'
        });
    }
    
    createCollisionParticles(position, normal, intensity = 1.0) {
        // Number of particles based on intensity
        const particleCount = Math.floor(30 * intensity);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Create random particle positions near collision point
        for (let i = 0; i < particleCount; i++) {
            const posIndex = i * 3;
            const spread = 0.5;
            
            // Position (slightly random around collision point)
            positions[posIndex] = position.x + (Math.random() * spread * 2 - spread);
            positions[posIndex + 1] = position.y + (Math.random() * spread);
            positions[posIndex + 2] = position.z + (Math.random() * spread * 2 - spread);
            
            // Velocity (mostly in normal direction with random spread)
            const randomAngle = Math.random() * Math.PI * 2;
            const randomSpeed = 2 + Math.random() * 5;
            
            velocities[posIndex] = normal.x * randomSpeed + Math.cos(randomAngle) * 2;
            velocities[posIndex + 1] = 1 + Math.random() * 3; // Up
            velocities[posIndex + 2] = normal.z * randomSpeed + Math.sin(randomAngle) * 2;
            
            // Random sizes
            sizes[i] = 0.2 + Math.random() * 0.8;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material
        const material = new THREE.PointsMaterial({
            color: 0xCCCCCC,
            size: 0.5,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.8
        });
        
        // Create and add particle system
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Add to tracking array with lifetime
        this.particleSystems.push({
            mesh: particles,
            lifetime: 1.0,
            age: 0,
            velocities: velocities,
            type: 'collision'
        });
    }
    
    createTreeDestructionParticles(position) {
        // Create leaf particles
        const leafCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(leafCount * 3);
        const velocities = new Float32Array(leafCount * 3);
        const sizes = new Float32Array(leafCount);
        const colors = new Float32Array(leafCount * 3);
        
        // Different green shades for leaves
        const leafColors = [
            [0.1, 0.6, 0.1], // Dark green
            [0.2, 0.8, 0.2], // Medium green
            [0.4, 0.9, 0.4]  // Light green
        ];
        
        // Create random particles
        for (let i = 0; i < leafCount; i++) {
            const posIndex = i * 3;
            const colorIndex = i * 3;
            const spread = 1.5;
            
            // Position
            positions[posIndex] = position.x + (Math.random() * spread * 2 - spread);
            positions[posIndex + 1] = position.y + 2 + Math.random() * 2; // Start above ground
            positions[posIndex + 2] = position.z + (Math.random() * spread * 2 - spread);
            
            // Velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            
            velocities[posIndex] = Math.cos(angle) * speed;
            velocities[posIndex + 1] = 2 + Math.random() * 3; // Initial upward velocity
            velocities[posIndex + 2] = Math.sin(angle) * speed;
            
            // Size
            sizes[i] = 0.5 + Math.random() * 0.5;
            
            // Random green color
            const colorSet = leafColors[Math.floor(Math.random() * leafColors.length)];
            colors[colorIndex] = colorSet[0];
            colors[colorIndex + 1] = colorSet[1];
            colors[colorIndex + 2] = colorSet[2];
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create material for leaves
        const material = new THREE.PointsMaterial({
            vertexColors: true,
            size: 0.8,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.9
        });
        
        // Create and add particle system
        const leaves = new THREE.Points(geometry, material);
        this.scene.add(leaves);
        
        // Add to tracking array with lifetime
        this.particleSystems.push({
            mesh: leaves,
            lifetime: 2.0, // 2 seconds lifetime
            age: 0,
            velocities: velocities,
            gravity: 5.0, // Apply gravity to the leaves
            type: 'leaves'
        });
        
        // Also add wood splinter particles
        this.createWoodSplinters(position);
    }
    
    createWoodSplinters(position) {
        const splinterCount = 15;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(splinterCount * 3);
        const velocities = new Float32Array(splinterCount * 3);
        
        // Create random splinters
        for (let i = 0; i < splinterCount; i++) {
            const posIndex = i * 3;
            const spread = 0.5;
            
            // Position
            positions[posIndex] = position.x + (Math.random() * spread * 2 - spread);
            positions[posIndex + 1] = position.y + 0.5 + Math.random(); // Above ground
            positions[posIndex + 2] = position.z + (Math.random() * spread * 2 - spread);
            
            // Velocity
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 5;
            
            velocities[posIndex] = Math.cos(angle) * speed;
            velocities[posIndex + 1] = 2 + Math.random() * 4; // Upward
            velocities[posIndex + 2] = Math.sin(angle) * speed;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        // Create material for wood splinters
        const material = new THREE.PointsMaterial({
            color: 0x8B4513, // Brown
            size: 0.3,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.9
        });
        
        // Create and add particle system
        const splinters = new THREE.Points(geometry, material);
        this.scene.add(splinters);
        
        // Add to tracking array with lifetime
        this.particleSystems.push({
            mesh: splinters,
            lifetime: 1.5, // 1.5 seconds lifetime
            age: 0,
            velocities: velocities,
            gravity: 9.8, // Apply gravity
            type: 'splinters'
        });
    }
    
    createSmokeParticles(position, intensity = 1.0) {
        // Skip if intensity is too low
        if (intensity < 0.1) return;
        
        // Number of particles based on intensity
        const particleCount = Math.floor(10 * intensity);
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        // Create random smoke particles
        for (let i = 0; i < particleCount; i++) {
            const posIndex = i * 3;
            const spread = 0.5;
            
            // Position (slightly random around smoke source)
            positions[posIndex] = position.x + (Math.random() * spread * 2 - spread);
            positions[posIndex + 1] = position.y + 0.5; // Start above car
            positions[posIndex + 2] = position.z + (Math.random() * spread * 2 - spread);
            
            // Velocity (mostly upward with some spread)
            velocities[posIndex] = (Math.random() - 0.5) * 0.3;
            velocities[posIndex + 1] = 0.5 + Math.random() * 0.5; // Upward
            velocities[posIndex + 2] = (Math.random() - 0.5) * 0.3;
            
            // Random sizes for varied smoke
            sizes[i] = 1.0 + Math.random() * 1.0;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create material for dark smoke
        const material = new THREE.PointsMaterial({
            color: 0x444444, // Dark gray smoke
            size: 1.0,
            sizeAttenuation: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.5
        });
        
        // Create and add particle system
        const smoke = new THREE.Points(geometry, material);
        this.scene.add(smoke);
        
        // Add to tracking array with lifetime
        this.particleSystems.push({
            mesh: smoke,
            lifetime: 2.0,
            age: 0,
            velocities: velocities,
            type: 'smoke',
            grows: true // Smoke grows larger over time
        });
    }
    
    update(deltaTime) {
        // Update all particle systems
        for (let i = this.particleSystems.length - 1; i >= 0; i--) {
            const ps = this.particleSystems[i];
            ps.age += deltaTime;
            
            // Remove expired particles
            if (ps.age >= ps.lifetime) {
                this.scene.remove(ps.mesh);
                this.particleSystems.splice(i, 1);
                continue;
            }
            
            // Update particles based on type
            switch (ps.type) {
                case 'smoke':
                case 'collision':
                    this.updateParticlesWithVelocity(ps, deltaTime);
                    break;
                case 'leaves':
                case 'splinters':
                    this.updateFallingParticles(ps, deltaTime);
                    break;
            }
            
            // Fade out based on age
            const fadeRatio = ps.age / ps.lifetime;
            ps.mesh.material.opacity = 1.0 - fadeRatio;
            
            // Grow particles if specified
            if (ps.grows) {
                const growthFactor = 1.0 + fadeRatio;
                
                if (ps.mesh.material.size) {
                    ps.mesh.material.size = ps.mesh.material.size * growthFactor;
                } else {
                    // Handle case where size is in attributes
                    if (ps.mesh.geometry.attributes.size) {
                        const sizes = ps.mesh.geometry.attributes.size.array;
                        for (let j = 0; j < sizes.length; j++) {
                            sizes[j] *= 1.01; // Slight growth each frame
                        }
                        ps.mesh.geometry.attributes.size.needsUpdate = true;
                    }
                }
            }
        }
    }
    
    updateParticlesWithVelocity(particleSystem, deltaTime) {
        const positions = particleSystem.mesh.geometry.attributes.position.array;
        const velocities = particleSystem.velocities;
        
        // Update each particle position based on its velocity
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * deltaTime;
            positions[i + 1] += velocities[i + 1] * deltaTime;
            positions[i + 2] += velocities[i + 2] * deltaTime;
            
            // Slow down particles over time
            velocities[i] *= 0.98;
            velocities[i + 1] *= 0.98;
            velocities[i + 2] *= 0.98;
        }
        
        particleSystem.mesh.geometry.attributes.position.needsUpdate = true;
    }
    
    updateFallingParticles(particleSystem, deltaTime) {
        const positions = particleSystem.mesh.geometry.attributes.position.array;
        const velocities = particleSystem.velocities;
        const gravity = particleSystem.gravity || 9.8;
        
        // Update each particle position with gravity and air resistance
        for (let i = 0; i < positions.length; i += 3) {
            // Update position
            positions[i] += velocities[i] * deltaTime;
            positions[i + 1] += velocities[i + 1] * deltaTime;
            positions[i + 2] += velocities[i + 2] * deltaTime;
            
            // Apply gravity to y velocity
            velocities[i + 1] -= gravity * deltaTime;
            
            // Apply air resistance
            velocities[i] *= 0.98;
            velocities[i + 2] *= 0.98;
            
            // Bounce off ground
            if (positions[i + 1] < 0.1) {
                positions[i + 1] = 0.1;
                velocities[i + 1] = -velocities[i + 1] * 0.3; // Bounce with energy loss
                
                // Also reduce horizontal velocity on bounce
                velocities[i] *= 0.7;
                velocities[i + 2] *= 0.7;
            }
        }
        
        particleSystem.mesh.geometry.attributes.position.needsUpdate = true;
    }
} 
