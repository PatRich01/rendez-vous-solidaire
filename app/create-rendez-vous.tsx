import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { RendezVous } from "@/lib/types";

export default function CreateRendezVousScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, createRendezVous, setCurrentRendezVous } = useApp();

  const [destination, setDestination] = useState("");
  const [groupName, setGroupName] = useState("");
  const [departureTime, setDepartureTime] = useState("09:00");
  const [maxDetourMinutes, setMaxDetourMinutes] = useState("5");
  const [maxDetourKm, setMaxDetourKm] = useState("2");
  const [alerts, setAlerts] = useState("10,5,2");

  const handleCreate = () => {
    if (!destination || !user) {
      alert("Please fill in all required fields");
      return;
    }

    const now = new Date();
    const [hours, minutes] = departureTime.split(":").map(Number);
    const depTime = new Date(now);
    depTime.setHours(hours, minutes, 0);

    const estimatedArrival = new Date(depTime);
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 30);

    const alertIntervals = alerts.split(",").map((a) => ({ intervalMinutes: parseInt(a.trim()) }));

    const newRendezVous: RendezVous = {
      id: Date.now().toString(),
      creatorId: user.id,
      creatorName: user.name,
      destination: { latitude: 0, longitude: 0, address: destination },
      destinationName: destination,
      departureTime: depTime,
      estimatedArrivalTime: estimatedArrival,
      groupName: groupName || undefined,
      participants: [
        {
          id: user.id,
          name: user.name,
          photoUrl: user.photoUrl,
          status: "present",
          location: { latitude: 0, longitude: 0 },
          transportMode: user.defaultTransportMode,
          isOnBoard: false,
        },
      ],
      alerts: alertIntervals,
      maxDetourMinutes: parseInt(maxDetourMinutes),
      maxDetourKm: parseInt(maxDetourKm),
      status: "pending",
      createdAt: now,
    };

    createRendezVous(newRendezVous);
    setCurrentRendezVous(newRendezVous.id);
    router.push("/(tabs)");
  };

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
              Create Rendez-Vous
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 16 }}>
            {/* Destination */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Destination *
              </Text>
              <TextInput
                placeholder="Enter destination address"
                value={destination}
                onChangeText={setDestination}
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

            {/* Group Name */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Group Name (Optional)
              </Text>
              <TextInput
                placeholder="e.g., Office Carpool"
                value={groupName}
                onChangeText={setGroupName}
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

            {/* Departure Time */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Departure Time *
              </Text>
              <TextInput
                placeholder="HH:MM"
                value={departureTime}
                onChangeText={setDepartureTime}
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

            {/* Max Detour Minutes */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Max Detour (Minutes)
              </Text>
              <TextInput
                placeholder="5"
                value={maxDetourMinutes}
                onChangeText={setMaxDetourMinutes}
                keyboardType="numeric"
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

            {/* Max Detour KM */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Max Detour (KM)
              </Text>
              <TextInput
                placeholder="2"
                value={maxDetourKm}
                onChangeText={setMaxDetourKm}
                keyboardType="numeric"
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

            {/* Alert Intervals */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Alert Intervals (Minutes, comma-separated)
              </Text>
              <TextInput
                placeholder="10,5,2"
                value={alerts}
                onChangeText={setAlerts}
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

          {/* Create Button */}
          <TouchableOpacity
            onPress={handleCreate}
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
              Create Rendez-Vous
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
