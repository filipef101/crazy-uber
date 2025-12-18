// Add this method back to the Map class

getRandomRoad() {
    // Get a random road segment from the map
    if (this.roadSegments.length === 0) {
        console.error("No road segments available");
        return null;
    }
    
    // Filter to only include straight road segments (not intersections or curves)
    const straightRoads = this.roadSegments.filter(
        road => road.type === 'straight' && 
        // Get a minimum length road for passenger placement
        this.getDistance(road.start.x, road.start.z, road.end.x, road.end.z) > 20
    );
    
    if (straightRoads.length === 0) {
        // Fallback to any road segment if no straight ones are available
        return this.roadSegments[Math.floor(Math.random() * this.roadSegments.length)];
    }
    
    // Return a random straight road
    return straightRoads[Math.floor(Math.random() * straightRoads.length)];
} 
