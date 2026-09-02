export type Participant = {
  id: string;
  name: string;
  transportMode?: 'car' | 'walk' | 'bus' | string;
  status?: 'present' | 'late' | 'absent' | string;
  isOnBoard?: boolean;
};

export type RendezVous = {
  id: string;
  destinationName: string;
  groupName?: string;
  participants: Participant[];
  departureTime: string;
  status?: 'active' | 'pending' | string;
};

export type User = {
  id: string;
  name: string;
  defaultTransportMode?: string;
};
