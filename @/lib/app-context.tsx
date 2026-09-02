import { useState } from 'react';
import { Participant, RendezVous, UserProfile } from '@/lib/types';

type AppContext = {
  user: UserProfile | null;
  setUser: (u: UserProfile) => void;
  currentRendezVous: RendezVous | null;
  updateParticipantStatus: (rendezVousId: string, participantId: string, status: Participant['status']) => void;
};

export const useApp = (): AppContext => {
  const [user, setUserState] = useState<UserProfile | null>({ id: 'user-1', name: 'User', defaultTransportMode: 'car', alertPreferences: { enableVisual: true, enableSound: true, enableVibration: true, volume: 70, doNotDisturbMode: false } });

  const sample: RendezVous = {
    id: 'rdv-1',
    creatorId: 'user-1',
    creatorName: 'User',
    destination: { latitude: 0, longitude: 0, address: 'Community Center' },
    destinationName: 'Community Center',
    departureTime: new Date(),
    estimatedArrivalTime: new Date(Date.now() + 60 * 60 * 1000),
    participants: [
      { id: 'user-1', name: 'User', photoUrl: undefined, status: 'present', location: { latitude: 0, longitude: 0 }, transportMode: 'car', isOnBoard: true },
    ],
    alerts: [],
    route: [],
    groupName: 'Neighbors',
    maxDetourMinutes: 10,
    maxDetourKm: 5,
    status: 'active',
    createdAt: new Date(),
  };

  const updateParticipantStatus = (_rendezVousId: string, _participantId: string, _status: Participant['status']) => {
    // no-op stub for editor/compile correctness
  };

  return {
    user,
    setUser: setUserState,
    currentRendezVous: sample,
    updateParticipantStatus,
  };
};

export default useApp;
