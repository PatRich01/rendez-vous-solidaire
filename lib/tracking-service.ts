/**
 * Tracking Service — Handles real-time location tracking, proximity detection, and route optimization
 */

import { Location, Participant, RendezVous } from "@/lib/types";

/**
 * Calculate distance between two coordinates (in kilometers)
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const dLon = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.latitude * Math.PI) / 180) *
      Math.cos((loc2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Simulate group movement along a route
 */
export function simulateGroupMovement(
  currentLocation: Location,
  destination: Location,
  speed: number = 0.01 // km per update
): Location {
  const distance = calculateDistance(currentLocation, destination);

  if (distance < 0.001) {
    return destination;
  }

  const ratio = speed / distance;
  const newLat = currentLocation.latitude + (destination.latitude - currentLocation.latitude) * ratio;
  const newLon = currentLocation.longitude + (destination.longitude - currentLocation.longitude) * ratio;

  return {
    latitude: newLat,
    longitude: newLon,
  };
}

/**
 * Detect if a participant is on board (moving with the group)
 */
export function detectOnBoard(
  participantLocation: Location,
  groupLocation: Location,
  threshold: number = 0.1 // km
): boolean {
  const distance = calculateDistance(participantLocation, groupLocation);
  return distance < threshold;
}

/**
 * Check if group has passed a participant's location
 */
export function hasGroupPassed(
  groupCurrentLocation: Location,
  groupPreviousLocation: Location,
  participantLocation: Location,
  threshold: number = 0.05 // km
): boolean {
  const currentDist = calculateDistance(groupCurrentLocation, participantLocation);
  const previousDist = calculateDistance(groupPreviousLocation, participantLocation);

  // If distance was decreasing and now increasing, group has passed
  return previousDist < threshold && currentDist > threshold;
}

/**
 * Calculate time to arrival at a location
 */
export function calculateTimeToArrival(
  currentLocation: Location,
  destination: Location,
  speedKmPerHour: number = 40
): number {
  const distance = calculateDistance(currentLocation, destination);
  const hours = distance / speedKmPerHour;
  return Math.round(hours * 60); // Return in minutes
}

/**
 * Determine proximity alert status
 */
export enum ProximityAlertStatus {
  FAR = "far", // > 5 km
  APPROACHING = "approaching", // 1-5 km
  NEAR = "near", // 200m-1km
  VERY_NEAR = "very_near", // < 200m
  ARRIVED = "arrived", // < 50m
}

export function getProximityStatus(distanceKm: number): ProximityAlertStatus {
  if (distanceKm > 5) return ProximityAlertStatus.FAR;
  if (distanceKm > 1) return ProximityAlertStatus.APPROACHING;
  if (distanceKm > 0.2) return ProximityAlertStatus.NEAR;
  if (distanceKm > 0.05) return ProximityAlertStatus.VERY_NEAR;
  return ProximityAlertStatus.ARRIVED;
}

/**
 * Get alert intensity based on proximity
 */
export function getAlertIntensity(status: ProximityAlertStatus): {
  frequency: number; // ms between alerts
  volume: number; // 0-100
  vibrationPattern: number[];
} {
  switch (status) {
    case ProximityAlertStatus.FAR:
      return { frequency: 30000, volume: 30, vibrationPattern: [100] };
    case ProximityAlertStatus.APPROACHING:
      return { frequency: 15000, volume: 50, vibrationPattern: [100, 100] };
    case ProximityAlertStatus.NEAR:
      return { frequency: 5000, volume: 70, vibrationPattern: [100, 50, 100] };
    case ProximityAlertStatus.VERY_NEAR:
      return { frequency: 1000, volume: 90, vibrationPattern: [100, 100, 100, 100] };
    case ProximityAlertStatus.ARRIVED:
      return { frequency: 500, volume: 100, vibrationPattern: [200, 100, 200] };
  }
}

/**
 * Optimize route to include all participants' starting points
 */
export function optimizeRoute(participants: Participant[], destination: Location): Location[] {
  // Simple implementation: start from all participants, then go to destination
  // In production, this would use a real routing algorithm (TSP, etc.)

  const route: Location[] = [];

  // Add all participant starting locations
  participants.forEach((p) => {
    if (p.location) {
      route.push(p.location);
    }
  });

  // Add destination
  route.push(destination);

  return route;
}

/**
 * Check if route modification is within tolerance
 */
export function isRouteModificationAcceptable(
  originalRoute: Location[],
  proposedRoute: Location[],
  maxDetourKm: number
): boolean {
  // Calculate total distance of both routes
  let originalDistance = 0;
  let proposedDistance = 0;

  for (let i = 0; i < originalRoute.length - 1; i++) {
    originalDistance += calculateDistance(originalRoute[i], originalRoute[i + 1]);
  }

  for (let i = 0; i < proposedRoute.length - 1; i++) {
    proposedDistance += calculateDistance(proposedRoute[i], proposedRoute[i + 1]);
  }

  const detour = proposedDistance - originalDistance;
  return detour <= maxDetourKm;
}
