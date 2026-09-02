import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { TransportMode, Participant } from "@/lib/types";

const TRANSPORT_MODES: { label: string; value: TransportMode }[] = [
  { label: "🚶 Walk", value: "walk" },
  { label: "🚴 Bike", value: "bike" },
  { label: "🚗 Car", value: "car" },
  { label: "🚌 Transit", value: "transit" },
];

export default function JoinRendezVousScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, rendezVousList, joinRendezVous, setCurrentRendezVous } = useApp();

  const [selectedRendezVousId, setSelectedRendezVousId] = useState<string | null>(null);
  const [departurePoint, setDeparturePoint] = useState("");
  const [transportMode, setTransportMode] = useState<TransportMode>("car");
  const [maxDepartureTime, setMaxDepartureTime] = useState("08:30");

  const handleJoin = () => {
    if (!selectedRendezVousId || !departurePoint || !user) {
      alert("Please select a rendez-vous and enter departure point");
      return;
    }

    const participant: Participant = {
      id: user.id,
      name: user.name,
      photoUrl: user.photoUrl,
      status: "unknown",
      location: { latitude: 0, longitude: 0, address: departurePoint },
      transportMode,
      isOnBoard: false,
    };

    joinRendezVous(selectedRendezVousId, participant);
    setCurrentRendezVous(selectedRendezVousId);
    router.push("/rendez-vous-detail");
  };

  const availableRendezVous = rendezVousList.filter((rv) => rv.status === "pending");

  const renderRendezVousOption = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => setSelectedRendezVousId(item.id)}
      style={{
        backgroundColor: selectedRendezVousId === item.id ? colors.primary : colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
      }}
      activeOpacity={0.7}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: selectedRendezVousId === item.id ? "white" : colors.foreground,
          marginBottom: 4,
        }}
      >
        {item.destinationName}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: selectedRendezVousId === item.id ? "rgba(255,255,255,0.8)" : colors.muted,
        }}
      >
        Led by {item.creatorName} • {item.participants.length} participant{item.participants.length !== 1 ? "s" : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 24, paddingBottom: 24 }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 8 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "600" }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 32, fontWeight: "700", color: colors.foreground, marginTop: 12 }}>
              Join Rendez-Vous
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            {/* Select Rendez-Vous */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Select Rendez-Vous *
              </Text>
              {availableRendezVous.length > 0 ? (
                <FlatList
                  data={availableRendezVous}
                  renderItem={renderRendezVousOption}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center", paddingVertical: 16 }}>
                  No available rendez-vous to join
                </Text>
              )}
            </View>

            {/* Departure Point */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Your Departure Point *
              </Text>
              <TextInput
                placeholder="Enter your starting location"
                value={departurePoint}
                onChangeText={setDeparturePoint}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  fontSize: 14,
                }}
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Transport Mode */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Transport Mode
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {TRANSPORT_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode.value}
                    onPress={() => setTransportMode(mode.value)}
                    style={{
                      backgroundColor: transportMode === mode.value ? colors.primary : colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: transportMode === mode.value ? "white" : colors.foreground,
                      }}
                    >
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Max Departure Time */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Latest Departure Time
              </Text>
              <TextInput
                placeholder="HH:MM"
                value={maxDepartureTime}
                onChangeText={setMaxDepartureTime}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.foreground,
                  fontSize: 14,
                }}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          {/* Join Button */}
          <TouchableOpacity
            onPress={handleJoin}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 12,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
              Join Rendez-Vous
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
