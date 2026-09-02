import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RendezVous, Participant, ChatMessage, UserProfile, AlertPreferences } from "@/lib/types";

interface AppContextType {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;

  // Rendez-vous
  rendezVousList: RendezVous[];
  currentRendezVous: RendezVous | null;
  createRendezVous: (rv: RendezVous) => void;
  joinRendezVous: (rvId: string, participant: Participant) => void;
  setCurrentRendezVous: (rvId: string | null) => void;
  updateParticipantStatus: (rvId: string, participantId: string, status: Participant["status"]) => void;
  updateParticipantLocation: (rvId: string, participantId: string, location: Participant["location"]) => void;

  // Chat
  messages: ChatMessage[];
  sendMessage: (rvId: string, text: string) => void;

  // Alerts
  updateAlertPreferences: (prefs: AlertPreferences) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppState {
  user: UserProfile | null;
  rendezVousList: RendezVous[];
  currentRendezVousId: string | null;
  messages: ChatMessage[];
}

type AppAction =
  | { type: "SET_USER"; payload: UserProfile }
  | { type: "CREATE_RENDEZ_VOUS"; payload: RendezVous }
  | { type: "JOIN_RENDEZ_VOUS"; payload: { rvId: string; participant: Participant } }
  | { type: "SET_CURRENT_RENDEZ_VOUS"; payload: string | null }
  | { type: "UPDATE_PARTICIPANT_STATUS"; payload: { rvId: string; participantId: string; status: Participant["status"] } }
  | { type: "UPDATE_PARTICIPANT_LOCATION"; payload: { rvId: string; participantId: string; location: Participant["location"] } }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "UPDATE_ALERT_PREFERENCES"; payload: AlertPreferences }
  | { type: "LOAD_STATE"; payload: AppState };

const initialState: AppState = {
  user: null,
  rendezVousList: [],
  currentRendezVousId: null,
  messages: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "CREATE_RENDEZ_VOUS":
      return { ...state, rendezVousList: [...state.rendezVousList, action.payload] };

    case "JOIN_RENDEZ_VOUS": {
      const { rvId, participant } = action.payload;
      return {
        ...state,
        rendezVousList: state.rendezVousList.map((rv) =>
          rv.id === rvId ? { ...rv, participants: [...rv.participants, participant] } : rv
        ),
      };
    }

    case "SET_CURRENT_RENDEZ_VOUS":
      return { ...state, currentRendezVousId: action.payload };

    case "UPDATE_PARTICIPANT_STATUS": {
      const { rvId, participantId, status } = action.payload;
      return {
        ...state,
        rendezVousList: state.rendezVousList.map((rv) =>
          rv.id === rvId
            ? {
                ...rv,
                participants: rv.participants.map((p) =>
                  p.id === participantId ? { ...p, status } : p
                ),
              }
            : rv
        ),
      };
    }

    case "UPDATE_PARTICIPANT_LOCATION": {
      const { rvId, participantId, location } = action.payload;
      return {
        ...state,
        rendezVousList: state.rendezVousList.map((rv) =>
          rv.id === rvId
            ? {
                ...rv,
                participants: rv.participants.map((p) =>
                  p.id === participantId ? { ...p, location } : p
                ),
              }
            : rv
        ),
      };
    }

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "UPDATE_ALERT_PREFERENCES":
      return {
        ...state,
        user: state.user ? { ...state.user, alertPreferences: action.payload } : null,
      };

    case "LOAD_STATE":
      return action.payload;

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    loadStateFromStorage();
  }, []);

  // Save state to storage whenever it changes
  useEffect(() => {
    saveStateToStorage();
  }, [state]);

  const loadStateFromStorage = async () => {
    try {
      const savedState = await AsyncStorage.getItem("appState");
      if (savedState) {
        dispatch({ type: "LOAD_STATE", payload: JSON.parse(savedState) });
      }
    } catch (error) {
      console.error("Failed to load state from storage:", error);
    }
  };

  const saveStateToStorage = async () => {
    try {
      await AsyncStorage.setItem("appState", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to storage:", error);
    }
  };

  const setUser = useCallback((user: UserProfile) => {
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const createRendezVous = useCallback((rv: RendezVous) => {
    dispatch({ type: "CREATE_RENDEZ_VOUS", payload: rv });
  }, []);

  const joinRendezVous = useCallback((rvId: string, participant: Participant) => {
    dispatch({ type: "JOIN_RENDEZ_VOUS", payload: { rvId, participant } });
  }, []);

  const setCurrentRendezVous = useCallback((rvId: string | null) => {
    dispatch({ type: "SET_CURRENT_RENDEZ_VOUS", payload: rvId });
  }, []);

  const updateParticipantStatus = useCallback(
    (rvId: string, participantId: string, status: Participant["status"]) => {
      dispatch({ type: "UPDATE_PARTICIPANT_STATUS", payload: { rvId, participantId, status } });
    },
    []
  );

  const updateParticipantLocation = useCallback(
    (rvId: string, participantId: string, location: Participant["location"]) => {
      dispatch({ type: "UPDATE_PARTICIPANT_LOCATION", payload: { rvId, participantId, location } });
    },
    []
  );

  const sendMessage = useCallback((rvId: string, text: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      rendezVousId: rvId,
      participantId: state.user?.id || "unknown",
      participantName: state.user?.name || "Unknown",
      text,
      timestamp: new Date(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: message });
  }, [state.user]);

  const updateAlertPreferences = useCallback((prefs: AlertPreferences) => {
    dispatch({ type: "UPDATE_ALERT_PREFERENCES", payload: prefs });
  }, []);

  const currentRendezVous = state.rendezVousList.find((rv) => rv.id === state.currentRendezVousId) || null;

  const value: AppContextType = {
    user: state.user,
    setUser,
    rendezVousList: state.rendezVousList,
    currentRendezVous,
    createRendezVous,
    joinRendezVous,
    setCurrentRendezVous,
    updateParticipantStatus,
    updateParticipantLocation,
    messages: state.messages,
    sendMessage,
    updateAlertPreferences,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
