import { useEffect, useRef, useCallback } from "react";
import { useApp } from "@/lib/app-context";
import {
  calculateDistance,
  simulateGroupMovement,
  detectOnBoard,
  hasGroupPassed,
  getProximityStatus,
  ProximityAlertStatus,
} from "@/lib/tracking-service";
import { Location } from "@/lib/types";

/**
 * Hook for managing real-time tracking and proximity alerts
 * Simulates group movement and detects when participants are on board or left behind
 */
export function useTracking() {
  const { currentRendezVous, updateParticipantLocation, user } = useApp();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const groupLocationRef = useRef<Location>({ latitude: 0, longitude: 0 });
  const previousGroupLocationRef = useRef<Location>({ latitude: 0, longitude: 0 });
  const proximityAlertsRef = useRef<Map<string, ProximityAlertStatus>>(new Map());

  const startTracking = useCallback(() => {
    if (!currentRendezVous || !user) return;

    // Initialize group location at first participant's location
    if (currentRendezVous.participants.length > 0) {
      const firstParticipant = currentRendezVous.participants[0];
      groupLocationRef.current = { ...firstParticipant.location };
    }

    // Simulate group movement every 2 seconds
    intervalRef.current = setInterval(() => {
      if (!currentRendezVous) return;

      // Store previous location
      previousGroupLocationRef.current = { ...groupLocationRef.current };

      // Simulate group moving towards destination
      groupLocationRef.current = simulateGroupMovement(
        groupLocationRef.current,
        currentRendezVous.destination,
        0.005 // Simulate ~18 km/h
      );

      // Update each participant's tracking status
      currentRendezVous.participants.forEach((participant) => {
        // Calculate distance from group
        const distance = calculateDistance(groupLocationRef.current, participant.location);
        const proximityStatus = getProximityStatus(distance);

        // Check if participant is on board
        const isOnBoard = detectOnBoard(participant.location, groupLocationRef.current, 0.1);

        // Check if group has passed participant
        const passed = hasGroupPassed(
          groupLocationRef.current,
          previousGroupLocationRef.current,
          participant.location
        );

        // Store proximity alert status for UI
        proximityAlertsRef.current.set(participant.id, proximityStatus);

        // Log tracking events (in production, trigger actual alerts)
        if (proximityStatus === ProximityAlertStatus.VERY_NEAR) {
          console.log(`🔔 ${participant.name} is very near! Distance: ${(distance * 1000).toFixed(0)}m`);
        }

        if (passed && participant.status !== "present") {
          console.log(`🚨 ${participant.name} was left behind!`);
        }

        if (isOnBoard && !participant.isOnBoard) {
          console.log(`✅ ${participant.name} is now on board!`);
        }
      });
    }, 2000);
  }, [currentRendezVous, user]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const getProximityAlert = useCallback((participantId: string) => {
    return proximityAlertsRef.current.get(participantId) || ProximityAlertStatus.FAR;
  }, []);

  const getGroupLocation = useCallback(() => {
    return groupLocationRef.current;
  }, []);

  useEffect(() => {
    return () => stopTracking();
  }, [stopTracking]);

  return {
    startTracking,
    stopTracking,
    getProximityAlert,
    getGroupLocation,
  };
}
