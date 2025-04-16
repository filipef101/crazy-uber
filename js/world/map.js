import * as THREE from 'three';
import { Building } from './building.js';
import { Road } from './road.js';
import { randomInt } from '../utils/helpers.js';

export class Map {
    constructor(scene) {
        this.scene = scene;
        this.roadSegments = []; // Store detailed road segment data
        this.buildings = []; // Store placed building data for collision checks
        this.roads = [];
        this.roundabouts = [];
        this.trees = []; // Store tree data for collision detection
        
        // Create ground
        this.createGround();
        
        // Create natural road network
        this.createNaturalRoads();
        
        // Create simple buildings
        this.createSimpleBuildings();
    }
    
    createGround() {
        // Create a large ground plane
        const groundGeometry = new THREE.PlaneGeometry(800, 800);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x0a4a0a // Darker green for better contrast with roads
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        ground.position.y = 0;
        
        this.scene.add(ground);
    }
    
    createNaturalRoads() {
        // Simple road material
        const roadMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Create center line material
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });
        
        // Sidewalk material
        const sidewalkMaterial = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            roughness: 0.9
        });
        
        // Road layout - defined as start and end points with width, and optional control points for curves
        const roads = [
            // Main east-west road with subtle curve
            { 
                start: [-300, 0], 
                end: [300, 0], 
                width: 30, 
                type: "major",
                controlPoints: [
                    { x: -150, z: 30 },
                    { x: 0, z: -15 },
                    { x: 150, z: 10 }
                ],
                isCurved: true
            },
            
            // Main north-south road with curves
            { 
                start: [0, -300], 
                end: [0, 300], 
                width: 30, 
                type: "major",
                controlPoints: [
                    { x: 30, z: -200 },
                    { x: -20, z: -80 },
                    { x: 15, z: 50 },
                    { x: -25, z: 200 }
                ],
                isCurved: true
            },
            
            // Diagonal roads with gentle curves
            { 
                start: [-250, -250], 
                end: [250, 250], 
                width: 25, 
                type: "major",
                controlPoints: [
                    { x: -125, z: -100 },
                    { x: 0, z: 0 },
                    { x: 125, z: 100 }
                ],
                isCurved: true
            },
            { 
                start: [-250, 250], 
                end: [250, -250], 
                width: 25, 
                type: "major",
                controlPoints: [
                    { x: -125, z: 100 },
                    { x: 0, z: 0 },
                    { x: 125, z: -100 }
                ],
                isCurved: true
            },
            
            // Horizontal cross streets
            { 
                start: [-300, -200], 
                end: [300, -200], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: -150, z: -210 },
                    { x: 0, z: -190 },
                    { x: 150, z: -205 }
                ],
                isCurved: true
            },
            { 
                start: [-300, -100], 
                end: [300, -100], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: -200, z: -90 },
                    { x: -50, z: -105 },
                    { x: 100, z: -100 },
                    { x: 250, z: -110 }
                ],
                isCurved: true
            },
            { 
                start: [-300, 100], 
                end: [300, 100], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: -200, z: 90 },
                    { x: -50, z: 105 },
                    { x: 100, z: 100 },
                    { x: 250, z: 90 }
                ],
                isCurved: true
            },
            { 
                start: [-300, 200], 
                end: [300, 200], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: -150, z: 190 },
                    { x: 0, z: 210 },
                    { x: 150, z: 195 }
                ],
                isCurved: true
            },
            
            // Vertical cross streets
            { 
                start: [-200, -300], 
                end: [-200, 300], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: -210, z: -200 },
                    { x: -190, z: -50 },
                    { x: -195, z: 100 },
                    { x: -205, z: 250 }
                ],
                isCurved: true
            },
            { 
                start: [-100, -300], 
                end: [-100, 300], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: -90, z: -150 },
                    { x: -110, z: 0 },
                    { x: -95, z: 150 }
                ],
                isCurved: true
            },
            { 
                start: [100, -300], 
                end: [100, 300], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: 90, z: -150 },
                    { x: 110, z: 0 },
                    { x: 95, z: 150 }
                ],
                isCurved: true
            },
            { 
                start: [200, -300], 
                end: [200, 300], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: 210, z: -200 },
                    { x: 190, z: -50 },
                    { x: 205, z: 100 },
                    { x: 195, z: 250 }
                ],
                isCurved: true
            },
            
            // Secondary roads - east district 
            { 
                start: [50, -150], 
                end: [250, -50], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: 100, z: -170 },
                    { x: 180, z: -110 },
                    { x: 220, z: -80 }
                ],
                isCurved: true
            },
            { 
                start: [50, 150], 
                end: [250, 50], 
                width: 20, 
                type: "secondary",
                controlPoints: [
                    { x: 100, z: 170 },
                    { x: 180, z: 110 },
                    { x: 220, z: 80 }
                ],
                isCurved: true
            },
            
            // Secondary roads - west district 
            { 
                start: [-50, -150], 
                end: [-250, -50], 
                width: 25, 
                type: "secondary",
                controlPoints: [
                    { x: -100, z: -170 },
                    { x: -180, z: -110 },
                    { x: -220, z: -80 }
                ],
                isCurved: true
            },
            { 
                start: [-50, 150], 
                end: [-250, 50], 
                width: 25, 
                type: "secondary",
                controlPoints: [
                    { x: -100, z: 170 },
                    { x: -180, z: 110 },
                    { x: -220, z: 80 }
                ],
                isCurved: true
            },
            
            // Straight roads for building placement
            // East-West straight roads
            { start: [-300, -150], end: [300, -150], width: 15, type: "secondary" },
            { start: [-300, 150], end: [300, 150], width: 15, type: "secondary" },
            // North-South straight roads
            { start: [-150, -300], end: [-150, 300], width: 15, type: "secondary" },
            { start: [150, -300], end: [150, 300], width: 15, type: "secondary" }
        ];
        
        // Create a network of intersections to track (based on straight lines between start and end)
        const intersections = this.calculateIntersections(roads);
        
        // Create each road 
        for (const roadData of roads) {
            this.createRoad(roadData, roadMaterial, lineMaterial, sidewalkMaterial, intersections);
        }
        
        // Create intersection boxes at each intersection point
        this.createIntersectionBoxes(intersections, roadMaterial, lineMaterial, sidewalkMaterial);
        
        // Create a circle road for downtown with larger width to ensure adequate exclusion zone
        this.createCircleRoad(0, 0, 80, 32, 30, roadMaterial, lineMaterial, sidewalkMaterial);
    }
    
    calculateIntersections(roads) {
        const intersections = [];
        const threshold = 5; // Distance threshold to consider as same intersection
        
        // Check every pair of roads for intersections
        for (let i = 0; i < roads.length; i++) {
            for (let j = i + 1; j < roads.length; j++) {
                const roadA = roads[i];
                const roadB = roads[j];
                
                // Get the intersection point (if any)
                const intersectionPoint = this.getIntersectionPoint(
                    roadA.start[0], roadA.start[1], roadA.end[0], roadA.end[1],
                    roadB.start[0], roadB.start[1], roadB.end[0], roadB.end[1]
                );
                
                if (intersectionPoint) {
                    // Check if this intersection is already tracked (within threshold)
                    let found = false;
                    for (const existing of intersections) {
                        const dx = existing.point.x - intersectionPoint.x;
                        const dz = existing.point.z - intersectionPoint.z;
                        const dist = Math.sqrt(dx * dx + dz * dz);
                        
                        if (dist < threshold) {
                            // Add this road pair to existing intersection
                            existing.roads.push({
                                roadA: { index: i, width: roadA.width },
                                roadB: { index: j, width: roadB.width }
                            });
                            found = true;
                            break;
                        }
                    }
                    
                    if (!found) {
                        // Create new intersection
                        intersections.push({
                            point: intersectionPoint,
                            roads: [{
                                roadA: { index: i, width: roadA.width },
                                roadB: { index: j, width: roadB.width }
                            }]
                        });
                    }
                }
            }
        }
        
        return intersections;
    }
    
    getIntersectionPoint(x1, z1, x2, z2, x3, z3, x4, z4) {
        // Calculate intersection of line segments using determinants
        const det = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4);
        
        if (det === 0) {
            return null; // Lines are parallel
        }
        
        const t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / det;
        const u = -((x1 - x2) * (z1 - z3) - (z1 - z2) * (x1 - x3)) / det;
        
        // Check if intersection is within both line segments
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                z: z1 + t * (z2 - z1)
            };
        }
        
        return null;
    }
    
    createIntersectionBoxes(intersections, roadMaterial, lineMaterial, sidewalkMaterial) {
        const roadHeight = 0.3; // Match road height
        
        for (const intersection of intersections) {
            // Determine the size of the intersection box based on intersecting road widths
            let maxWidth = 0;
            let majorRoadCount = 0;
            
            for (const roadPair of intersection.roads) {
                maxWidth = Math.max(maxWidth, roadPair.roadA.width, roadPair.roadB.width);
                
                // Count how many major roads meet at this intersection
                if (roadPair.roadA.width >= 25 || roadPair.roadB.width >= 25) {
                    majorRoadCount++;
                }
            }
            
            // Create different types of intersections based on the road types
            if (majorRoadCount >= 2 && intersection.roads.length >= 2) {
                // Create a roundabout for major road intersections
                this.createRoundabout(intersection.point.x, intersection.point.z, 
                                    maxWidth * 0.7, roadMaterial, lineMaterial);
            } else {
                // For minor intersections, create a simple box
                const boxSize = maxWidth * 1.1;
                
                // Create main intersection box
                const boxGeometry = new THREE.BoxGeometry(boxSize, roadHeight, boxSize);
                const box = new THREE.Mesh(boxGeometry, roadMaterial);
                box.position.set(intersection.point.x, roadHeight / 2, intersection.point.z);
                this.scene.add(box);
                
                // Add road markings on the intersection
                this.addIntersectionMarkings(intersection.point.x, intersection.point.z, 
                                           boxSize, roadHeight, intersection.roads.length);
            }
        }
    }
    
    createRoundabout(centerX, centerZ, radius, roadMaterial, lineMaterial) {
        const roadHeight = 0.3;
        const ringWidth = 12; // Width of the roundabout ring
        
        // Create the roundabout road ring
        const outerRadius = radius;
        const innerRadius = radius - ringWidth;
        
        // Roundabout road surface
        const roadGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2; // Horizontal
        road.position.set(centerX, roadHeight, centerZ);
        this.scene.add(road);
        
        // Create inner circle (grass area)
        const innerCircleGeometry = new THREE.CircleGeometry(innerRadius - 1, 32);
        const innerCircleMaterial = new THREE.MeshLambertMaterial({ color: 0x2A7E19 }); // Darker green
        const innerCircle = new THREE.Mesh(innerCircleGeometry, innerCircleMaterial);
        innerCircle.rotation.x = -Math.PI / 2;
        innerCircle.position.set(centerX, roadHeight - 0.05, centerZ);
        this.scene.add(innerCircle);
        
        // Add dashed line on the outer edge of the roundabout
        const outerLineGeometry = new THREE.RingGeometry(outerRadius - 1, outerRadius - 0.5, 32);
        const outerLine = new THREE.Mesh(outerLineGeometry, lineMaterial);
        outerLine.rotation.x = -Math.PI / 2;
        outerLine.position.set(centerX, roadHeight + 0.03, centerZ);
        this.scene.add(outerLine);
        
        // Add dashed line on the inner edge of the roundabout
        const innerLineGeometry = new THREE.RingGeometry(innerRadius, innerRadius + 0.5, 32);
        const innerLine = new THREE.Mesh(innerLineGeometry, lineMaterial);
        innerLine.rotation.x = -Math.PI / 2;
        innerLine.position.set(centerX, roadHeight + 0.03, centerZ);
        this.scene.add(innerLine);
        
        // Add a central marker or mini-island for larger roundabouts
        if (radius > 25) {
            const centerMarkerGeometry = new THREE.CylinderGeometry(3, 3, 2, 16);
            const centerMarkerMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
            const centerMarker = new THREE.Mesh(centerMarkerGeometry, centerMarkerMaterial);
            centerMarker.position.set(centerX, 1, centerZ);
            this.scene.add(centerMarker);
        }
        
        // Store roundabout data for collision detection
        if (!this.roundabouts) {
            this.roundabouts = [];
        }
        
        // Store with a slightly larger radius to create a building exclusion zone
        const exclusionRadius = outerRadius * 1.5; // Make exclusion zone 50% larger than the roundabout
        this.roundabouts.push({
            center: { x: centerX, z: centerZ },
            radius: exclusionRadius
        });
    }
    
    addIntersectionMarkings(centerX, centerZ, boxSize, roadHeight, connectionCount) {
        // Create road markings for standard intersections
        const lineWidth = 0.5;
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        // Add stop lines on all four sides of the intersection
        const stopLineLength = boxSize * 0.4;
        const stopLinePositions = [
            { x: 0, z: boxSize / 2 - 1, rotation: 0 },
            { x: boxSize / 2 - 1, z: 0, rotation: Math.PI / 2 },
            { x: 0, z: -(boxSize / 2 - 1), rotation: 0 },
            { x: -(boxSize / 2 - 1), z: 0, rotation: Math.PI / 2 }
        ];
        
        // Only add markings for intersections with 3 or more connections
        if (connectionCount >= 3) {
            for (const pos of stopLinePositions) {
                const stopLineGeometry = new THREE.BoxGeometry(stopLineLength, roadHeight + 0.05, lineWidth);
                const stopLine = new THREE.Mesh(stopLineGeometry, lineMaterial);
                stopLine.position.set(
                    centerX + pos.x,
                    roadHeight + 0.03,
                    centerZ + pos.z
                );
                stopLine.rotation.y = pos.rotation;
                this.scene.add(stopLine);
            }
            
            // Add crosswalk markings for pedestrian crossings on bigger intersections
            if (boxSize > 30) {
                this.addCrosswalkMarkings(centerX, centerZ, boxSize, roadHeight);
            }
        }
    }
    
    addCrosswalkMarkings(centerX, centerZ, boxSize, roadHeight) {
        const stripWidth = 0.7;
        const stripLength = 4;
        const stripGap = 0.7;
        const stripMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        
        // Add crosswalk stripes on all four sides
        const crosswalkPositions = [
            { startX: -boxSize/2 + 3, startZ: boxSize/2 - 2.5, dirX: 1, dirZ: 0 },
            { startX: boxSize/2 - 2.5, startZ: boxSize/2 - 3, dirX: 0, dirZ: -1 },
            { startX: boxSize/2 - 3, startZ: -boxSize/2 + 2.5, dirX: -1, dirZ: 0 },
            { startX: -boxSize/2 + 2.5, startZ: -boxSize/2 + 3, dirX: 0, dirZ: 1 }
        ];
        
        for (const pos of crosswalkPositions) {
            // Calculate direction and rotation
            const rotation = pos.dirX !== 0 ? 0 : Math.PI / 2;
            
            // Add multiple stripes for each crosswalk
            for (let i = 0; i < 8; i++) {
                const stripeGeometry = new THREE.BoxGeometry(stripLength, roadHeight + 0.05, stripWidth);
                const stripe = new THREE.Mesh(stripeGeometry, stripMaterial);
                
                stripe.position.set(
                    centerX + pos.startX + pos.dirX * i * (stripWidth + stripGap),
                    roadHeight + 0.03,
                    centerZ + pos.startZ + pos.dirZ * i * (stripWidth + stripGap)
                );
                
                stripe.rotation.y = rotation;
                this.scene.add(stripe);
            }
        }
    }
    
    createRoad(roadData, roadMaterial, lineMaterial, sidewalkMaterial, intersections) {
        const { start, end, width, type, controlPoints } = roadData;
        const x1 = start[0];
        const z1 = start[1];
        const x2 = end[0];
        const z2 = end[1];
        
        // Road height (slightly above ground to avoid z-fighting)
        const roadHeight = 0.1;
        
        // Get road segments based on straight line for intersection calculations
        const roadSegments = this.getRoadSegments(x1, z1, x2, z2, width, intersections);
        
        // Store road segment data for building placement (straight lines based on segments)
        for (const segment of roadSegments) {
            const segDx = segment.end.x - segment.start.x;
            const segDz = segment.end.z - segment.start.z;
            const segLength = Math.sqrt(segDx * segDx + segDz * segDz);
            const segAngle = Math.atan2(segDx, segDz);
            
            // Determine if this segment is part of a curved road
            const isOriginalRoad = 
                this.pointsAreClose(new THREE.Vector3(segment.start.x, 0, segment.start.z), new THREE.Vector3(x1, 0, z1)) &&
                this.pointsAreClose(new THREE.Vector3(segment.end.x, 0, segment.end.z), new THREE.Vector3(x2, 0, z2));
            const isCurved = controlPoints && isOriginalRoad;
            
            this.roadSegments.push({
                start: { x: segment.start.x, z: segment.start.z },
                end: { x: segment.end.x, z: segment.end.z },
                width: width,
                length: segLength,
                angle: segAngle,
                isCurved: isCurved
            });
        }
        
        // Create curves for each segment
        for (const segment of roadSegments) {
            const segmentStart = new THREE.Vector3(segment.start.x, roadHeight, segment.start.z);
            const segmentEnd = new THREE.Vector3(segment.end.x, roadHeight, segment.end.z);
            
            // If we have control points and this is the original road (not a split segment at intersection)
            // then use curved road, otherwise use straight
            if (controlPoints && 
                this.pointsAreClose(segmentStart, new THREE.Vector3(x1, roadHeight, z1)) &&
                this.pointsAreClose(segmentEnd, new THREE.Vector3(x2, roadHeight, z2))) {
                
                this.createCurvedRoadSegment(
                    segmentStart,
                    segmentEnd,
                    controlPoints,
                    width,
                    roadHeight,
                    roadMaterial,
                    lineMaterial,
                    type
                );
            } else {
                // For intersection segments, create straight roads
                this.createStraightRoadSegment(
                    segmentStart,
                    segmentEnd,
                    width,
                    roadHeight,
                    roadMaterial,
                    lineMaterial,
                    type
                );
            }
        }
    }
    
    pointsAreClose(p1, p2, threshold = 1.0) {
        return p1.distanceTo(p2) < threshold;
    }
    
    createCurvedRoadSegment(start, end, controlPoints, width, height, roadMaterial, lineMaterial, roadType) {
        // Create curve points including start, control points, and end
        const curvePoints = [
            start,
            ...controlPoints.map(cp => new THREE.Vector3(cp.x, height, cp.z)),
            end
        ];
        
        // Create a smooth curve through the points
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        curve.tension = 0.5; // Adjust tension for smoother curves (0.5 is default)
        
        // Calculate curve length for appropriate subdivision
        const approxLength = this.getApproximateCurveLength(curve, 10);
        const curveSegments = Math.max(20, Math.floor(approxLength / 5));
        
        // Store road segment data for passenger/destination placement
        this.roadSegments.push({
            start: { x: start.x, z: start.z },
            end: { x: end.x, z: end.z },
            controlPoints: controlPoints.map(cp => ({ x: cp.x, z: cp.z })),
            width: width,
            length: approxLength,
            type: 'curved',
            roadType: roadType,
            curve: curve
        });
        
        // Create a flat shape for the road width
        const roadShape = new THREE.Shape();
        roadShape.moveTo(-width/2, 0);
        roadShape.lineTo(width/2, 0);
        
        // Get geometry by extruding the shape along the curve
        const extrudeSettings = {
            steps: curveSegments,
            bevelEnabled: false,
            extrudePath: curve
        };
        
        const roadGeometry = new THREE.ExtrudeGeometry(roadShape, extrudeSettings);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        
        // Rotate the road to lay flat on the ground
        road.rotation.x = -Math.PI / 2;
        this.scene.add(road);
        
        // Add road lines (center lines) for curved roads
        if (roadType === "major") {
            // Double yellow line for major roads
            this.createCurvedRoadLine(curve, 0.4, 0.7, 0xFFFF00, height, curveSegments);
            this.createCurvedRoadLine(curve, 0.4, -0.7, 0xFFFF00, height, curveSegments);
        } else {
            // Dashed white line for secondary roads
            this.createDashedCurvedRoadLine(curve, 0.4, 0, 0xFFFFFF, height, curveSegments);
        }
    }
    
    createStraightRoadSegment(start, end, width, height, roadMaterial, lineMaterial, roadType) {
        // Calculate segment properties
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const angle = Math.atan2(direction.x, direction.z);
        
        // Store road segment data for passenger/destination placement
        this.roadSegments.push({
            start: { x: start.x, z: start.z },
            end: { x: end.x, z: end.z },
            width: width,
            length: length,
            angle: angle,
            type: 'straight',
            roadType: roadType
        });
        
        // Create road surface
        const roadGeometry = new THREE.BoxGeometry(width, 0.01, length);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.copy(center);
        road.rotation.y = angle;
        this.scene.add(road);
        
        // Add center lines
        if (roadType === "major") {
            // Double yellow line for major roads
            const lineWidth = 0.4;
            const lineSpacing = 0.7;
            const lineHeight = 0.01;
            
            const lineGeometry = new THREE.BoxGeometry(lineWidth, lineHeight, length * 0.98);
            const yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
            
            // Left line
            const leftLine = new THREE.Mesh(lineGeometry, yellowMaterial);
            leftLine.position.copy(center);
            leftLine.position.y += 0.001;
            leftLine.position.x -= Math.sin(angle) * lineSpacing/2;
            leftLine.position.z -= Math.cos(angle) * lineSpacing/2;
            leftLine.rotation.y = angle;
            this.scene.add(leftLine);
            
            // Right line
            const rightLine = new THREE.Mesh(lineGeometry, yellowMaterial);
            rightLine.position.copy(center);
            rightLine.position.y += 0.001;
            rightLine.position.x += Math.sin(angle) * lineSpacing/2;
            rightLine.position.z += Math.cos(angle) * lineSpacing/2;
            rightLine.rotation.y = angle;
            this.scene.add(rightLine);
        } else {
            // Dashed white center line for secondary roads
            const dashLength = 4;
            const gapLength = 4;
            const dashWidth = 0.4;
            const dashHeight = 0.01;
            const totalDashCycle = dashLength + gapLength;
            const numDashes = Math.floor(length / totalDashCycle);
            
            const dashGeometry = new THREE.BoxGeometry(dashWidth, dashHeight, dashLength);
            const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
            
            for (let i = 0; i < numDashes; i++) {
                const dashOffset = (i * totalDashCycle) - (length / 2) + (dashLength / 2);
                
                const dash = new THREE.Mesh(dashGeometry, whiteMaterial);
                dash.position.copy(center);
                dash.position.y += 0.001;
                dash.position.x += Math.sin(angle) * dashOffset;
                dash.position.z += Math.cos(angle) * dashOffset;
                dash.rotation.y = angle;
                this.scene.add(dash);
            }
        }
    }
    
    createCurvedRoadLine(curve, lineWidth, offset, color, height, segments) {
        // Create a smaller shape for the line
        const lineShape = new THREE.Shape();
        lineShape.moveTo(-lineWidth/2, offset);
        lineShape.lineTo(lineWidth/2, offset);
        
        // Extrude along curve
        const extrudeSettings = {
            steps: segments,
            bevelEnabled: false,
            extrudePath: curve
        };
        
        const lineMaterial = new THREE.MeshBasicMaterial({ color: color });
        const lineGeometry = new THREE.ExtrudeGeometry(lineShape, extrudeSettings);
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        
        // Position slightly above road to avoid z-fighting
        line.rotation.x = -Math.PI / 2;
        line.position.y += 0.001;
        
        this.scene.add(line);
    }
    
    createDashedCurvedRoadLine(curve, lineWidth, offset, color, height, segments) {
        // For curved dashed lines, we'll sample points along the curve and place individual dashes
        
        const lineMaterial = new THREE.MeshBasicMaterial({ color: color });
        const dashLength = 3;
        const gapLength = 3;
        const dashCycleLength = dashLength + gapLength;
        
        // Get approximate curve length for dash placement
        const curveLength = this.getApproximateCurveLength(curve, segments);
        const numDashes = Math.floor(curveLength / dashCycleLength);
        
        // Create dashes
        for (let i = 0; i < numDashes; i++) {
            const t = (i * dashCycleLength + dashLength/2) / curveLength;
            
            if (t > 1.0) break; // Don't exceed curve length
            
            // Get position and tangent at this point
            const pos = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t).normalize();
            
            // Create a small box for the dash
            const dashGeometry = new THREE.BoxGeometry(lineWidth, 0.01, dashLength);
            const dash = new THREE.Mesh(dashGeometry, lineMaterial);
            
            // Position dash
            dash.position.copy(pos);
            dash.position.y += 0.001; // Slightly above road
            
            // Orient dash along curve
            const lookTarget = new THREE.Vector3().addVectors(pos, tangent);
            dash.lookAt(lookTarget);
            
            // Rotate to lay flat on road and align with curve direction
            dash.rotation.x = -Math.PI / 2;
            
            // Shift to offset if needed (for parallel lines)
            if (offset !== 0) {
                const offsetVec = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize().multiplyScalar(offset);
                dash.position.add(offsetVec);
            }
            
            this.scene.add(dash);
        }
    }
    
    getApproximateCurveLength(curve, segments) {
        let length = 0;
        let prevPoint = curve.getPoint(0);
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const point = curve.getPoint(t);
            length += point.distanceTo(prevPoint);
            prevPoint = point;
        }
        
        return length;
    }
    
    getRoadSegments(x1, z1, x2, z2, width, intersections) {
        // Start with the full road as a segment
        let segments = [
            {
                start: { x: x1, z: z1 },
                end: { x: x2, z: z2 }
            }
        ];
        
        // Calculate intersections and split segments as needed
        for (const intersection of intersections) {
            const point = intersection.point;
            
            // Check if the intersection point lies on the *original* full road line
            const onOriginalRoadLine = this.isPointOnLine(x1, z1, x2, z2, point.x, point.z);
            
            if (onOriginalRoadLine) {
                // Apply splitting logic to potentially already split segments
                const newSegments = [];
                let splitOccurred = false;
                
                for (const segment of segments) {
                    // Check if the intersection point is on this *current* segment
                    const onSegment = this.isPointOnLine(
                        segment.start.x, segment.start.z,
                        segment.end.x, segment.end.z,
                        point.x, point.z
                    );
                    
                    if (onSegment) {
                        // Calculate distances to segment ends
                        const distToStart = this.getDistance(segment.start.x, segment.start.z, point.x, point.z);
                        const distToEnd = this.getDistance(segment.end.x, segment.end.z, point.x, point.z);

                        // --- Calculate Max Width for *this* intersection --- 
                        let maxWidthAtIntersection = 0;
                        for (const roadPair of intersection.roads) {
                           // Ensure we check both road widths in the pair, even if one is the current road
                           // This logic assumes intersection.roads structure correctly maps road indices
                           // It might need refinement if road indices aren't directly usable here
                           // For simplicity, we'll just use the intersection data directly
                            maxWidthAtIntersection = Math.max(
                                maxWidthAtIntersection, 
                                roadPair.roadA.width, 
                                roadPair.roadB.width
                            );
                        }
                        // --- End Max Width Calculation ---
                        
                        // Decision to split uses individual width (prevents tiny splits on wide roads near narrow ones)
                        const decisionBoxSize = width * 1.1; 

                        // Trimming amount uses the intersection's max width
                        const trimMultiplier = 1.0; // Keep at 1.0 for exact matching
                        const trimBoxSize = maxWidthAtIntersection * trimMultiplier;
                        
                        // Split the segment if both portions are substantial enough
                        if (distToStart > trimBoxSize / 2 && distToEnd > trimBoxSize / 2) {
                            // Calculate the offset points based on the intersection's max width
                            const segmentLength = this.getDistance(segment.start.x, segment.start.z, segment.end.x, segment.end.z);
                            // Avoid division by zero for zero-length segments (shouldn't happen)
                            const dirX = segmentLength > 0 ? (segment.end.x - segment.start.x) / segmentLength : 0;
                            const dirZ = segmentLength > 0 ? (segment.end.z - segment.start.z) / segmentLength : 0;
                            
                            // Create the first part of the split segment
                            newSegments.push({
                                start: segment.start,
                                end: {
                                    x: point.x - dirX * trimBoxSize / 2,
                                    z: point.z - dirZ * trimBoxSize / 2
                                }
                            });
                            
                            // Create the second part of the split segment
                            newSegments.push({
                                start: {
                                    x: point.x + dirX * trimBoxSize / 2,
                                    z: point.z + dirZ * trimBoxSize / 2
                                },
                                end: segment.end
                            });
                            splitOccurred = true; // Mark that a split happened in this iteration
                        } else {
                            // Segment is too short relative to intersection size, keep it as is
                            newSegments.push(segment);
                        }
                    } else {
                        // Intersection not on this segment, keep it
                        newSegments.push(segment);
                    }
                }
                
                // Update the segments array only if a split occurred for this intersection point
                if (splitOccurred) {
                    segments = newSegments;
                }
            }
        }
        
        return segments;
    }
    
    isPointOnLine(x1, z1, x2, z2, px, pz) {
        // Calculate if point (px, pz) is on line segment (x1,z1)-(x2,z2)
        const d1 = this.getDistance(x1, z1, px, pz);
        const d2 = this.getDistance(px, pz, x2, z2);
        const lineLen = this.getDistance(x1, z1, x2, z2);
        
        // Allow for small floating-point error
        const epsilon = 0.1; 
        return Math.abs(d1 + d2 - lineLen) < epsilon;
    }
    
    getDistance(x1, z1, x2, z2) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        return Math.sqrt(dx * dx + dz * dz);
    }
    
    createCircleRoad(centerX, centerZ, radius, segments, width, roadMaterial, lineMaterial, sidewalkMaterial) {
        const roadHeight = 0.3; // Match straight road height
        
        // Create a ring for the circular road
        const outerRadius = radius + width/2;
        const innerRadius = radius - width/2;
        
        const roadGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        
        // Rotate and position
        road.rotation.x = -Math.PI / 2; // Horizontal
        road.position.set(centerX, roadHeight, centerZ);
        this.scene.add(road);
        
        // Add center line
        const lineGeometry = new THREE.RingGeometry(
            radius - 0.4,
            radius + 0.4,
            segments
        );
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.set(centerX, roadHeight + 0.03, centerZ); // Slightly above road
        this.scene.add(line);

        // Add this circular road to roundabouts for building exclusion
        if (!this.roundabouts) {
            this.roundabouts = [];
        }
        
        // Store with a slightly larger radius to create a building exclusion zone
        const exclusionRadius = outerRadius * 1.5; // Make exclusion zone 50% larger than the circular road
        this.roundabouts.push({
            center: { x: centerX, z: centerZ },
            radius: exclusionRadius
        });
        
        return road;
    }
    
    // Basic AABB collision check (accounts for rotation via Box3.setFromObject)
    // Now also checks against the parent road segment
    checkCollision(newBuildingBox, parentSegmentBox) {
        // Check against other buildings
        for (const existingBuilding of this.buildings) {
            if (newBuildingBox.intersectsBox(existingBuilding.box)) {
                return true; // Collision with another building
            }
        }
        
        // Check against the parent road segment
        if (parentSegmentBox && newBuildingBox.intersectsBox(parentSegmentBox)) {
            return true; // Collision with the road
        }

        return false; // No collision
    }

    createSimpleBuildings() {
        // Define building types - simple boxes with different heights and colors
        const buildingTypes = [
            { width: 10, height: 20, depth: 10, color: 0x777777 }, // Regular Gray
            { width: 15, height: 30, depth: 15, color: 0x999999 }, // Light Gray
            { width: 20, height: 50, depth: 20, color: 0x555555 }, // Dark Gray Tall
            { width: 12, height: 25, depth: 12, color: 0xA5683A }, // Brownstone
            { width: 8,  height: 15, depth: 8,  color: 0xC2B280 }, // Sandstone Small
            { width: 18, height: 40, depth: 12, color: 0x6B7C85 }, // Slate Blue Medium
            { width: 14, height: 60, depth: 14, color: 0x464E54 }, // Dark Slate Tall
        ];

        // Add windows material
        const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x88CCFF });

        // Create road boundary polygon data for collision testing
        const roadBoundaries = [];
        for (const segment of this.roadSegments) {
            // Skip curved road segments for building placement
            if (segment.isCurved) continue;
            
            // Calculate the four corners of the road segment
            const dirX = Math.sin(segment.angle);
            const dirZ = Math.cos(segment.angle);
            const perpX = -dirZ;
            const perpZ = dirX;
            
            const halfWidth = segment.width / 2;
            
            // Calculate four corners of the road segment (with buffer)
            const buffer = 1.0; // Smaller buffer now, relies more on point check
            let width = halfWidth + buffer;
            
            // Check if diagonal (more precise check)
            const angleDeg = segment.angle * (180 / Math.PI);
            const isDiagonal = Math.abs(angleDeg % 90) > 5 && Math.abs(angleDeg % 90) < 85;
            
            // Increase buffer slightly for diagonal roads
            if (isDiagonal) {
                width *= 1.2; 
            }
            
            const corners = [
                { x: segment.start.x + perpX * width, z: segment.start.z + perpZ * width }, // Right side start
                { x: segment.end.x + perpX * width,   z: segment.end.z + perpZ * width },   // Right side end
                { x: segment.end.x - perpX * width,   z: segment.end.z - perpZ * width },   // Left side end
                { x: segment.start.x - perpX * width, z: segment.start.z - perpZ * width }  // Left side start
            ];
            
            roadBoundaries.push(corners);
        }
        
        // Function to check if a point is inside ANY road polygon
        const isPointInAnyRoad = (point, roadPolygons) => {
            for (const polygon of roadPolygons) {
                let inside = false;
                let j = polygon.length - 1;
                for (let i = 0; i < polygon.length; i++) {
                    const xi = polygon[i].x, yi = polygon[i].z;
                    const xj = polygon[j].x, yj = polygon[j].z;
                    const intersect = ((yi > point.z) !== (yj > point.z)) &&
                        (point.x < (xj - xi) * (point.z - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                    j = i;
                }
                if (inside) return true; // Point is inside this road polygon
            }
            return false; // Point is not inside any road polygon
        };
        
        // Function to check if a point is inside any roundabout or circular road exclusion zone
        const isPointInRoundabout = (point) => {
            if (!this.roundabouts) return false;
            
            for (const roundabout of this.roundabouts) {
                const dx = point.x - roundabout.center.x;
                const dz = point.z - roundabout.center.z;
                const distanceSquared = dx * dx + dz * dz;
                
                // Check if the point is within the roundabout's radius
                if (distanceSquared <= roundabout.radius * roundabout.radius) {
                    return true;
                }
            }
            
            return false;
        };
        
        // Function to check if a rotated building intersects any road polygon by checking its corners
        const doesBuildingIntersectRoad = (buildingPos, buildingSize, buildingAngle, roadPolygons) => {
            const halfWidth = buildingSize.w / 2;
            const halfDepth = buildingSize.d / 2;
            const cosA = Math.cos(buildingAngle);
            const sinA = Math.sin(buildingAngle);

            // Calculate world coordinates of the 4 corners
            const corners = [
                // Front-Right
                { x: buildingPos.x + halfWidth * cosA - halfDepth * sinA, 
                  z: buildingPos.z + halfWidth * sinA + halfDepth * cosA },
                // Back-Right
                { x: buildingPos.x + halfWidth * cosA + halfDepth * sinA, 
                  z: buildingPos.z + halfWidth * sinA - halfDepth * cosA },
                // Back-Left
                { x: buildingPos.x - halfWidth * cosA + halfDepth * sinA, 
                  z: buildingPos.z - halfWidth * sinA - halfDepth * cosA },
                // Front-Left
                { x: buildingPos.x - halfWidth * cosA - halfDepth * sinA, 
                  z: buildingPos.z - halfWidth * sinA + halfDepth * cosA }
            ];

            // Check if any corner is inside any road polygon or roundabout
            for (const corner of corners) {
                if (isPointInAnyRoad(corner, roadPolygons) || isPointInRoundabout(corner)) {
                    return true; // Intersection found
                }
            }
            
            // Also check the center of the building
            if (isPointInRoundabout(buildingPos)) {
                return true;
            }
            
            // Check additional points along the building perimeter for more robust detection
            // This helps catch cases where a corner might not intersect but part of the building still would
            
            // Check midpoints of each edge
            const midpoints = [
                // Front midpoint
                { x: buildingPos.x - halfDepth * sinA, 
                  z: buildingPos.z + halfDepth * cosA },
                // Right midpoint
                { x: buildingPos.x + halfWidth * cosA, 
                  z: buildingPos.z + halfWidth * sinA },
                // Back midpoint
                { x: buildingPos.x + halfDepth * sinA, 
                  z: buildingPos.z - halfDepth * cosA },
                // Left midpoint
                { x: buildingPos.x - halfWidth * cosA, 
                  z: buildingPos.z - halfWidth * sinA }
            ];
            
            for (const point of midpoints) {
                if (isPointInRoundabout(point)) {
                    return true;
                }
            }
            
            return false; // No intersection
        };
        
        // --- Placement along Road Segments --- 
        const placedBuildingPositions = []; // Track centers for proximity check
        const minDistanceBetweenBuildingsSq = 10*10; // Use squared distance
        const SIDEWALK_WIDTH = 5;
        const BUILDING_SPACING = 2; // Gap between buildings along road
        const MIN_SETBACK = 2;
        const MAX_SETBACK = 5;
        const ROAD_EDGE_BUFFER = 0.5; // Keep a small buffer

        for (const segment of this.roadSegments) {
            // Skip placing buildings on very short segments
            if (segment.length < 15) continue;
            
            // Skip curved road segments for building placement
            if (segment.isCurved) continue;

            const dirX = Math.sin(segment.angle);
            const dirZ = Math.cos(segment.angle);
            const perpX = -dirZ;
            const perpZ = dirX;
            const buildingRotation = segment.angle;

            let currentLength = BUILDING_SPACING / 2;

            while (currentLength < segment.length) {
                const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
                const placementLength = buildingType.width + BUILDING_SPACING;

                if (currentLength + placementLength > segment.length - BUILDING_SPACING / 2) {
                    break;
                }

                const centerAlongRoadX = segment.start.x + dirX * (currentLength + buildingType.width / 2);
                const centerAlongRoadZ = segment.start.z + dirZ * (currentLength + buildingType.width / 2);

                for (let side = -1; side <= 1; side += 2) {
                    if (side === 0) continue;

                    const setback = MIN_SETBACK + Math.random() * (MAX_SETBACK - MIN_SETBACK);
                    const offsetDist = segment.width / 2 + SIDEWALK_WIDTH + setback + buildingType.depth / 2 + ROAD_EDGE_BUFFER;

                    const buildingX = centerAlongRoadX + perpX * offsetDist * side;
                    const buildingZ = centerAlongRoadZ + perpZ * offsetDist * side;
                    const buildingPos = { x: buildingX, z: buildingZ };
                    const buildingSize = { w: buildingType.width, d: buildingType.depth };

                    // 1. Check proximity to other buildings
                    let tooClose = false;
                    for (const placedPos of placedBuildingPositions) {
                        const dx = placedPos.x - buildingX;
                        const dz = placedPos.z - buildingZ;
                        if ((dx*dx + dz*dz) < minDistanceBetweenBuildingsSq) {
                            tooClose = true;
                            break;
                        }
                    }
                    if (tooClose) continue;

                    // 2. Check collision with road boundaries and roundabouts
                    if (doesBuildingIntersectRoad(buildingPos, buildingSize, buildingRotation, roadBoundaries)) {
                        continue; // Skip if intersects road or roundabout
                    }

                    // --- Place Building --- 
                    const buildingHeight = buildingType.height * (1.0 + (Math.random() - 0.5) * 0.2);
                    const buildingY = buildingHeight / 2;
                    
                    const buildingGroup = new THREE.Group();
                    buildingGroup.position.set(buildingX, buildingY, buildingZ);
                    buildingGroup.rotation.y = buildingRotation;

                    const bodyGeometry = new THREE.BoxGeometry(buildingType.width, buildingHeight, buildingType.depth);
                    const bodyMaterial = new THREE.MeshLambertMaterial({ color: buildingType.color });
                    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
                    buildingGroup.add(body);

                    // Add windows (Simplified)
                    const windowSize = 1.5;
                    const windowSpacing = 4;
                    for (let y = windowSpacing; y < buildingHeight - windowSpacing/2; y += windowSpacing) {
                        for (let x = -buildingType.width/2 + windowSpacing; x < buildingType.width/2 - windowSpacing/2; x += windowSpacing) {
                            const frontWindow = new THREE.Mesh(new THREE.PlaneGeometry(windowSize, windowSize), windowMaterial);
                            frontWindow.position.set(x, y - buildingHeight/2, buildingType.depth/2 + 0.1);
                            body.add(frontWindow);
                            const backWindow = new THREE.Mesh(new THREE.PlaneGeometry(windowSize, windowSize), windowMaterial);
                            backWindow.position.set(x, y - buildingHeight/2, -buildingType.depth/2 - 0.1);
                            backWindow.rotation.y = Math.PI;
                            body.add(backWindow);
                        }
                    }

                    this.scene.add(buildingGroup);
                    placedBuildingPositions.push({ x: buildingX, z: buildingZ });
                    this.buildings.push({ // Keep storing full building data if needed elsewhere
                        position: buildingGroup.position.clone(),
                        rotation: buildingGroup.rotation.clone(),
                        size: {w: buildingType.width, h: buildingHeight, d: buildingType.depth}
                    });
                }
                currentLength += placementLength;
            }
        }
        
        // Add some decorative elements around roundabouts if they exist
        this.decorateRoundabouts();
    }
    
    decorateRoundabouts() {
        if (!this.roundabouts || this.roundabouts.length === 0) return;
        
        // Material for decorative elements
        const decorMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
        
        for (const roundabout of this.roundabouts) {
            const { center, radius } = roundabout;
            
            // Add some trees or decorative elements around the roundabout
            const numElements = Math.floor(radius / 3); // Scale with roundabout size
            
            for (let i = 0; i < numElements; i++) {
                const angle = (i / numElements) * Math.PI * 2;
                const distance = radius * 1.1; // Place just outside the exclusion zone
                
                const x = center.x + Math.cos(angle) * distance;
                const z = center.z + Math.sin(angle) * distance;
                
                // Create a tree-like shape
                const treeHeight = 1.5 + Math.random() * 2;
                const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, treeHeight, 6);
                const trunk = new THREE.Mesh(trunkGeometry, new THREE.MeshLambertMaterial({ color: 0x8B4513 }));
                trunk.position.set(x, treeHeight/2, z);
                
                const foliageSize = 1 + Math.random() * 0.5;
                const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
                const foliage = new THREE.Mesh(foliageGeometry, decorMaterial);
                foliage.position.set(x, treeHeight + foliageSize/2, z);
                
                this.scene.add(trunk);
                this.scene.add(foliage);
                
                // Store tree data for collision detection
                this.trees.push({
                    position: new THREE.Vector3(x, 0, z),
                    trunk: trunk,
                    foliage: foliage,
                    radius: 0.3,  // Collision radius
                    height: treeHeight,
                    foliageSize: foliageSize,
                    isDestroyed: false
                });
            }
        }
        
        // Also add random trees throughout the map
        this.addRandomTrees(100); // Add 100 random trees
    }
    
    addRandomTrees(count) {
        const treeColors = [0x228B22, 0x006400, 0x008000]; // Different green colors
        const mapSize = 500; // Adjust based on your map size
        
        for (let i = 0; i < count; i++) {
            // Random position within map bounds
            const x = (Math.random() * mapSize * 2) - mapSize;
            const z = (Math.random() * mapSize * 2) - mapSize;
            
            // Don't place trees on roads or buildings
            if (this.isPositionOnRoadOrBuilding(x, z)) {
                continue;
            }
            
            // Random tree properties
            const treeHeight = 1.5 + Math.random() * 2.5;
            const trunkWidth = 0.2 + Math.random() * 0.2;
            const foliageSize = 1 + Math.random() * 1.2;
            
            // Create trunk
            const trunkGeometry = new THREE.CylinderGeometry(trunkWidth * 0.8, trunkWidth, treeHeight, 6);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(x, treeHeight/2, z);
            
            // Create foliage (random green color)
            const colorIndex = Math.floor(Math.random() * treeColors.length);
            const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
            const foliageMaterial = new THREE.MeshLambertMaterial({ color: treeColors[colorIndex] });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.set(x, treeHeight + foliageSize/2, z);
            
            this.scene.add(trunk);
            this.scene.add(foliage);
            
            // Store tree data
            this.trees.push({
                position: new THREE.Vector3(x, 0, z),
                trunk: trunk,
                foliage: foliage,
                radius: trunkWidth,
                height: treeHeight,
                foliageSize: foliageSize,
                isDestroyed: false
            });
        }
    }
    
    isPositionOnRoadOrBuilding(x, z) {
        const point = new THREE.Vector3(x, 0, z);
        
        // Check buildings
        for (const building of this.buildings) {
            const buildingPos = building.position;
            const buildingSize = building.size;
            
            // Simple rectangular check
            if (Math.abs(x - buildingPos.x) < (buildingSize.w / 2 + 2) && 
                Math.abs(z - buildingPos.z) < (buildingSize.d / 2 + 2)) {
                return true;
            }
        }
        
        // Check roads
        for (const road of this.roadSegments) {
            // Calculate distance from point to road segment
            const roadStart = new THREE.Vector3(road.start.x, 0, road.start.z);
            const roadEnd = new THREE.Vector3(road.end.x, 0, road.end.z);
            
            // Distance from point to line segment
            const roadVector = new THREE.Vector3().subVectors(roadEnd, roadStart);
            const pointVector = new THREE.Vector3().subVectors(point, roadStart);
            
            const roadLength = roadVector.length();
            const roadDirection = roadVector.clone().normalize();
            
            const dotProduct = pointVector.dot(roadDirection);
            
            // Clamp projection to road segment
            const projection = Math.max(0, Math.min(dotProduct, roadLength));
            
            // Point on road closest to the given point
            const closestPoint = roadStart.clone().add(
                roadDirection.multiplyScalar(projection)
            );
            
            // Distance from point to road
            const distance = point.distanceTo(closestPoint);
            
            if (distance < (road.width / 2 + 5)) { // Road width plus margin
                return true;
            }
        }
        
        // Check roundabouts
        if (this.roundabouts) {
            for (const roundabout of this.roundabouts) {
                const { center, radius } = roundabout;
                const distance = Math.sqrt(
                    Math.pow(x - center.x, 2) + Math.pow(z - center.z, 2)
                );
                
                if (distance < (radius + 10)) { // Roundabout radius plus margin
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Add method to check collision between car and buildings/trees
    checkCollisions(carPosition, carRadius) {
        const collisions = {
            buildings: [],
            trees: []
        };
        
        // Check building collisions
        for (const building of this.buildings) {
            const buildingPos = building.position;
            const buildingSize = building.size;
            
            // Quick check using bounding circle
            const distance = Math.sqrt(
                Math.pow(carPosition.x - buildingPos.x, 2) + 
                Math.pow(carPosition.z - buildingPos.z, 2)
            );
            
            // If the car is close to the building, do more detailed check
            if (distance < Math.max(buildingSize.w, buildingSize.d) / 2 + carRadius) {
                // Detailed rectangle collision
                const carX = carPosition.x;
                const carZ = carPosition.z;
                
                // Adjust for rotation if building is rotated
                const buildingRotY = building.rotation.y;
                
                // Transform car position to building's local space
                const relX = carX - buildingPos.x;
                const relZ = carZ - buildingPos.z;
                
                // Rotate point to align with building
                const rotatedX = relX * Math.cos(-buildingRotY) - relZ * Math.sin(-buildingRotY);
                const rotatedZ = relX * Math.sin(-buildingRotY) + relZ * Math.cos(-buildingRotY);
                
                // Check if point is inside the building's AABB (in local space)
                if (Math.abs(rotatedX) < buildingSize.w / 2 + carRadius &&
                    Math.abs(rotatedZ) < buildingSize.d / 2 + carRadius) {
                    
                    // Calculate collision normal
                    let normalX = 0;
                    let normalZ = 0;
                    
                    // Find closest face and set normal
                    const distToLeft = Math.abs(rotatedX + buildingSize.w / 2);
                    const distToRight = Math.abs(rotatedX - buildingSize.w / 2);
                    const distToBottom = Math.abs(rotatedZ + buildingSize.d / 2);
                    const distToTop = Math.abs(rotatedZ - buildingSize.d / 2);
                    
                    // Find smallest distance to determine the closest face
                    const minDist = Math.min(distToLeft, distToRight, distToBottom, distToTop);
                    
                    if (minDist === distToLeft) {
                        normalX = -1;
                    } else if (minDist === distToRight) {
                        normalX = 1;
                    } else if (minDist === distToBottom) {
                        normalZ = -1;
                    } else {
                        normalZ = 1;
                    }
                    
                    // Rotate normal back to world space
                    const worldNormalX = normalX * Math.cos(buildingRotY) - normalZ * Math.sin(buildingRotY);
                    const worldNormalZ = normalX * Math.sin(buildingRotY) + normalZ * Math.cos(buildingRotY);
                    
                    collisions.buildings.push({
                        object: building,
                        normal: new THREE.Vector3(worldNormalX, 0, worldNormalZ).normalize(),
                        position: buildingPos,
                        penetration: minDist
                    });
                }
            }
        }
        
        // Check tree collisions
        for (const tree of this.trees) {
            if (tree.isDestroyed) continue;
            
            const treePos = tree.position;
            const treeRadius = tree.radius;
            
            const distance = Math.sqrt(
                Math.pow(carPosition.x - treePos.x, 2) + 
                Math.pow(carPosition.z - treePos.z, 2)
            );
            
            if (distance < treeRadius + carRadius) {
                // Calculate collision normal
                const normal = new THREE.Vector3(
                    carPosition.x - treePos.x,
                    0,
                    carPosition.z - treePos.z
                ).normalize();
                
                collisions.trees.push({
                    object: tree,
                    normal: normal,
                    position: treePos,
                    penetration: treeRadius + carRadius - distance
                });
            }
        }
        
        return collisions;
    }
    
    destroyTree(tree) {
        if (tree.isDestroyed) return;
        
        // Mark tree as destroyed
        tree.isDestroyed = true;
        
        // Create falling animation
        const fallDirection = Math.random() * Math.PI * 2;
        const fallSpeed = 2 + Math.random() * 2;
        
        // Create a group to hold the falling tree parts
        const treeGroup = new THREE.Group();
        this.scene.add(treeGroup);
        
        // Remove trunk and foliage from scene
        this.scene.remove(tree.trunk);
        this.scene.remove(tree.foliage);
        
        // Add them to the group
        treeGroup.add(tree.trunk);
        treeGroup.add(tree.foliage);
        
        // Reset positions relative to group
        tree.trunk.position.set(0, tree.height / 2, 0);
        tree.foliage.position.set(0, tree.height + tree.foliageSize / 2, 0);
        
        // Position group at tree position
        treeGroup.position.copy(tree.position);
        
        // Animate falling
        const fallAnimation = () => {
            // Increase rotation to simulate falling
            treeGroup.rotation.x += fallSpeed * 0.01;
            
            // If tree has fallen
            if (treeGroup.rotation.x >= Math.PI / 2) {
                // Stop animation
                cancelAnimationFrame(tree.fallAnimationId);
                
                // After some time, remove the fallen tree
                setTimeout(() => {
                    this.scene.remove(treeGroup);
                }, 10000); // Leave on ground for 10 seconds
                
                return;
            }
            
            // Continue animation
            tree.fallAnimationId = requestAnimationFrame(fallAnimation);
        };
        
        // Set fall rotation axis
        treeGroup.rotation.z = fallDirection;
        
        // Start animation
        tree.fallAnimationId = requestAnimationFrame(fallAnimation);
        
        return treeGroup;
    }

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
} 

