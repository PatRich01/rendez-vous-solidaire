/**
 * Rendez-Vous Solidaire — Shared Type Definitions
 */

export type TransportMode = "walk" | "bike" | "car" | "transit";

export type ParticipantStatus = "present" | "late" | "absent" | "unknown";

export type AlertType = "visual" | "sound" | "vibration";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Participant {
  id: string;
  name: string;
  photoUrl?: string;
  status: ParticipantStatus;
  location: Location;
  transportMode: TransportMode;
  isOnBoard: boolean; // Detected automatically when moving with group
  delayEstimate?: number; // Minutes
}

export interface AlertConfig {
  intervalMinutes: number; // e.g., 10, 5, 2
  message?: string;
}

export interface RendezVous {
  id: string;
  creatorId: string;
  creatorName: string;
  destination: Location;
  destinationName: string;
  departureTime: Date;
  estimatedArrivalTime: Date;
  groupName?: string;
  participants: Participant[];
  route?: RouteSegment[];
  alerts: AlertConfig[];
  maxDetourMinutes: number;
  maxDetourKm: number;
  status: "pending" | "active" | "completed" | "cancelled";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface RouteSegment {
  latitude: number;
  longitude: number;
  order: number;
}

export interface ChatMessage {
  id: string;
  rendezVousId: string;
  participantId: string;
  participantName: string;
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  photoUrl?: string;
  emergencyContacts?: string[];
  defaultTransportMode: TransportMode;
  alertPreferences: AlertPreferences;
}

export interface AlertPreferences {
  enableVisual: boolean;
  enableSound: boolean;
  enableVibration: boolean;
  ringtone?: string; // Filename or URI
  volume: number; // 0-100
  doNotDisturbMode: boolean; // Only final alert
}
