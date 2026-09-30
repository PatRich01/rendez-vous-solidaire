import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { useTracking } from "@/hooks/use-tracking";
import { calculateDistance } from "@/lib/tracking-service";
import { Participant } from "@/lib/types";

export default function MapViewScreen() {
  const router = useRouter();
  const colors = useColors();
  const { currentRendezVous, user } = useApp();
  const { startTracking, stopTracking, getGroupLocation, getProximityAlert } = useTracking();
  const [isTracking, setIsTracking] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking();
  }, [isTracking, startTracking, stopTracking]);

  if (!currentRendezVous || !user) {
    return (
      <ScreenContainer className="p-4 bg-background">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.foreground }}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const groupLocation = getGroupLocation();

  const renderParticipantMarker = ({ item }: { item: Participant }) => {
    if (zoomLevel < 0.5) return <View key={item.id} />;

    const distance = calculateDistance(groupLocation, item.location);
    const proximityStatus = getProximityAlert(item.id);

    return (
      <View
        key={item.id}
        style={{
          marginBottom: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: colors.surface,
          borderRadius: 8,
          borderLeftColor:
            item.status === "present"
              ? colors.success
              : item.status === "late"
                ? colors.warning
                : item.status === "absent"
                  ? colors.error
                  : colors.border,
          borderLeftWidth: 4,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
            {item.name}
          </Text>
          {item.isOnBoard && (
            <View style={{ backgroundColor: colors.success, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: "600", color: "white" }}>VU</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 11, color: colors.muted }}>
          {proximityStatus} • {(distance * 1000).toFixed(0)}m away
        </Text>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 16, paddingBottom: 24 }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 8 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "600" }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground, marginTop: 12 }}>
              Live Map
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              {currentRendezVous.destinationName}
            </Text>
          </View>

          {/* Map Placeholder */}
          <View
            style={{
              width: "100%",
              height: 300,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderColor: colors.border,
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 24 }}>🚌</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              Group Location
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              Lat: {groupLocation.latitude.toFixed(4)}, Lon: {groupLocation.longitude.toFixed(4)}
            </Text>
          </View>

          {/* Zoom Controls */}
          <View style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>🔍−</Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {(zoomLevel * 100).toFixed(0)}%
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>🔍+</Text>
            </TouchableOpacity>
          </View>

          {/* Tracking Control */}
          <TouchableOpacity
            onPress={() => setIsTracking(!isTracking)}
            style={{
              backgroundColor: isTracking ? colors.success : colors.primary,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
              {isTracking ? "🛑 Stop Tracking" : "▶️ Start Tracking"}
            </Text>
          </TouchableOpacity>

          {/* Journey Info */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
              Journey Status
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>Status</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {isTracking ? "🟢 Tracking" : "⚪ Idle"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>Participants</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {currentRendezVous.participants.length}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>On Board</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                {currentRendezVous.participants.filter((p) => p.isOnBoard).length}
              </Text>
            </View>
          </View>

          {/* Participants List */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
              Participants
            </Text>
            <FlatList
              data={currentRendezVous.participants}
              renderItem={renderParticipantMarker}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
