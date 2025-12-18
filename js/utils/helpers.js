/**
 * Converts degrees to radians
 */
export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Converts radians to degrees
 */
export function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

/**
 * Clamps a value between min and max
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
