import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Car } from './js/car.js';
import { Map } from './js/world/map.js';
import { Controls } from './js/controls.js';

// Game class
export class Game {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Game state
        this.isRunning = false;
        this.debugMode = false;
        this.score = 0;
        this.lastTime = 0;
        
        // Set up renderer with maximum performance optimizations
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false,
            powerPreference: "high-performance",
            precision: "lowp" // Use low precision for better performance
        });
        this.renderer.setSize(this.width, this.height);
        // Disabled shadow maps completely
        this.renderer.shadowMap.enabled = false;
        
        // Set lowest possible pixel ratio
        this.renderer.setPixelRatio(1);
        
        this.container.appendChild(this.renderer.domElement);
        
        // Set up scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB);
        
        // Less aggressive fog for better visibility
        this.scene.fog = new THREE.Fog(0x87CEEB, 300, 800);
        
        // Set up camera with reduced far plane
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 800);
        this.camera.position.set(0, 50, 50);
        
        // Debug orbit controls
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enabled = this.debugMode;
        
        // Camera settings - higher position for better road visibility
        this.cameraOffset = new THREE.Vector3(0, 20, -25);  // Higher and further back
        this.cameraLookOffset = new THREE.Vector3(0, 0, 30); // Look further ahead
        this.cameraLerpFactor = 1.0;
        
        // Add lights - simplified for performance
        this.setupLights();
        
        // Create game elements
        this.map = new Map(this.scene);
        this.car = new Car(this.scene);
        this.controls = new Controls(this.car);
        
        // Set up minimap
        this.setupMinimap();
        
        // Performance monitoring
        this.fpsCounter = document.createElement('div');
        this.fpsCounter.style.position = 'absolute';
        this.fpsCounter.style.top = '10px';
        this.fpsCounter.style.right = '10px';
        this.fpsCounter.style.color = 'white';
        this.fpsCounter.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.fpsCounter.style.padding = '5px';
        document.body.appendChild(this.fpsCounter);
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Add debug toggle
        window.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.debugMode = !this.debugMode;
                this.orbitControls.enabled = this.debugMode;
            }
        });
        
        // Display starting message
        this.showMessage("Welcome to Crazy Uber! Use arrow keys to drive. Press 'D' for debug camera view.");
        setTimeout(() => this.hideMessage(), 5000);
        
        console.log("Game initialized");
    }
    
    setupLights() {
        // Simple lighting - no shadows
        // Strong ambient light since we don't have shadows
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        // Simple directional light without shadows
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = false; // No shadows
        
        this.scene.add(sunLight);
    }
    
    setupMinimap() {
        // Create minimap container
        this.minimapContainer = document.createElement('div');
        this.minimapContainer.style.position = 'absolute';
        this.minimapContainer.style.bottom = '20px';
        this.minimapContainer.style.right = '20px';
        this.minimapContainer.style.width = '200px';
        this.minimapContainer.style.height = '200px';
        this.minimapContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.minimapContainer.style.border = '2px solid white';
        this.minimapContainer.style.borderRadius = '5px';
        document.body.appendChild(this.minimapContainer);
        
        // Create minimap renderer
        this.minimapRenderer = new THREE.WebGLRenderer({ alpha: true });
        this.minimapRenderer.setSize(200, 200);
        this.minimapContainer.appendChild(this.minimapRenderer.domElement);
        
        // Create minimap camera (top-down view)
        this.minimapCamera = new THREE.OrthographicCamera(
            -300, 300, 300, -300, 1, 1000
        );
        this.minimapCamera.position.set(0, 100, 0);
        this.minimapCamera.lookAt(0, 0, 0);
        this.minimapCamera.rotation.z = Math.PI; // Adjust orientation
        
        // Create player indicator for minimap - but don't add it to the scene yet
        const indicatorGeometry = new THREE.CircleGeometry(5, 8);
        const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.playerIndicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        this.playerIndicator.rotation.x = -Math.PI / 2; // Make it horizontal
    }
    
    addRoadsToMinimap() {
        // Add simplified representation of roads to minimap
        const roadMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        
        // Get road segments from the map
        if (this.map && this.map.roadSegments) {
            for (const segment of this.map.roadSegments) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(segment.start.x, 1, segment.start.z),
                    new THREE.Vector3(segment.end.x, 1, segment.end.z)
                ]);
                
                const line = new THREE.Line(geometry, roadMaterial);
                this.minimapScene.add(line);
            }
        }
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animate();
        console.log("Game started");
    }
    
    animate() {
        if (!this.isRunning) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        // Get actual time delta for smoother movement
        const currentTime = performance.now();
        const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Clamp to avoid jumps
        this.lastTime = currentTime;
        
        // FPS counter update
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate > 1000) {
            const fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastFpsUpdate));
            this.fpsCounter.textContent = `FPS: ${fps}`;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
        
        // Update game logic
        this.update(delta);
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
        
        // Render minimap
        this.updateMinimap();
    }
    
    update(delta) {
        // Update controls
        this.controls.update();
        
        // Update car physics
        this.car.update(delta);
        
        // Update camera to follow car
        this.updateCamera();
    }
    
    updateMinimap() {
        // Update player indicator position on minimap
        this.playerIndicator.position.x = this.car.position.x;
        this.playerIndicator.position.z = this.car.position.z;
        this.playerIndicator.position.y = 0.5; // Slightly above ground
        this.playerIndicator.rotation.y = this.car.rotation;
        
        // Add indicator right before rendering minimap, remove after rendering
        this.scene.add(this.playerIndicator);
        this.minimapRenderer.render(this.scene, this.minimapCamera);
        this.scene.remove(this.playerIndicator); // Remove it immediately after rendering
    }
    
    updateCamera() {
        if (this.debugMode) return; // Don't move camera in debug mode
        
        const carPosition = this.car.position;
        const carRotation = this.car.rotation;
        
        // Position camera at a moderate distance from the car - not too close, not too far
        this.camera.position.x = carPosition.x - Math.sin(carRotation) * 12;
        this.camera.position.y = carPosition.y + 6;  // Moderately above car
        this.camera.position.z = carPosition.z - Math.cos(carRotation) * 12;
        
        // Look ahead of the car at a comfortable distance
        const lookPosition = new THREE.Vector3(
            carPosition.x + Math.sin(carRotation) * 20, // Look ahead
            carPosition.y - 1, // Slightly below car height to see road better
            carPosition.z + Math.cos(carRotation) * 20  // Look ahead
        );
        
        this.camera.lookAt(lookPosition);
    }
    
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
    }
    
    showMessage(text) {
        // Create or update message element
        let message = document.getElementById('game-message');
        if (!message) {
            message = document.createElement('div');
            message.id = 'game-message';
            message.style.position = 'absolute';
            message.style.top = '50%';
            message.style.left = '50%';
            message.style.transform = 'translate(-50%, -50%)';
            message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            message.style.color = 'white';
            message.style.padding = '20px';
            message.style.borderRadius = '10px';
            message.style.fontSize = '24px';
            message.style.textAlign = 'center';
            message.style.maxWidth = '80%';
            message.style.zIndex = '1000';
            document.body.appendChild(message);
        }
        
        message.textContent = text;
        message.style.display = 'block';
    }
    
    hideMessage() {
        const message = document.getElementById('game-message');
        if (message) {
            message.style.display = 'none';
        }
    }
} 
