import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Load a GLTF model
 * @param {string} url - The URL of the model to load
 * @returns {Promise} - Promise that resolves with the loaded model
 */
export function loadModel(url) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            url,
            (gltf) => {
                resolve(gltf.scene);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model:', error);
                reject(error);
            }
        );
    });
}

/**
 * Load a texture
 * @param {string} url - The URL of the texture to load
 * @returns {THREE.Texture} - The loaded texture
 */
export function loadTexture(url) {
    return new THREE.TextureLoader().load(url);
}

/**
 * Create a basic texture material
 * @param {string} textureUrl - URL of the texture
 * @param {object} options - Additional material options
 * @returns {THREE.MeshStandardMaterial} - The created material
 */
export function createTextureMaterial(textureUrl, options = {}) {
    const texture = loadTexture(textureUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    if (options.repeat) {
        texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1);
    }
    
    return new THREE.MeshStandardMaterial({
        map: texture,
        ...options
    });
} 
