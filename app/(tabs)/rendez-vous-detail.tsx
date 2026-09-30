import { useCallback } from "react";
import { ScrollView, Text, View, TouchableOpacity, FlatList, Share, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { Participant } from "@/lib/types";

export default function RendezVousDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { currentRendezVous, updateParticipantStatus, user } = useApp();

  const handleStatusUpdate = useCallback(
    (status: Participant["status"]) => {
      if (!currentRendezVous || !user) return;
      updateParticipantStatus(currentRendezVous.id, user.id, status);
    },
    [currentRendezVous, user, updateParticipantStatus]
  );

  const handleShare = useCallback(async () => {
    if (!currentRendezVous) return;
    try {
      const shareText = `${currentRendezVous.destinationName} — Join me on Rendez-vous Solidaire\n\n${typeof window !== "undefined" ? window.location.href : ""}`;
      if (Platform.OS === "web" && typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({
          title: currentRendezVous.destinationName,
          text: shareText,
          url: typeof window !== "undefined" ? window.location.href : undefined,
        });
      } else {
        await Share.share({ title: currentRendezVous.destinationName, message: shareText });
      }
    } catch (e) {
      console.warn("Share failed", e);
    }
  }, [currentRendezVous]);

  const renderParticipantItem = useCallback(
    ({ item }: { item: Participant }) => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 12,
          backgroundColor: colors.surface,
          borderRadius: 8,
          marginBottom: 8,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
            {item.transportMode === "car" ? "🚗" : item.transportMode === "walk" ? "🚶" : "🚌"}{" "}
            {item.transportMode}
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            backgroundColor:
              item.status === "present"
                ? colors.success
                : item.status === "late"
                  ? colors.warning
                  : item.status === "absent"
                    ? colors.error
                    : colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "600",
              color:
                item.status === "present" || item.status === "late" || item.status === "absent"
                  ? "white"
                  : colors.foreground,
            }}
          >
            {item.status === "present"
              ? "✓ HERE"
              : item.status === "late"
                ? "⏰ LATE"
                : item.status === "absent"
                  ? "✕ ABSENT"
                  : "?"}
          </Text>
        </View>

        {item.isOnBoard && (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: colors.primary,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "600", color: "white" }}>VU</Text>
          </View>
        )}
      </View>
    ),
    [colors]
  );

  if (!currentRendezVous || !user) {
    return (
      <ScreenContainer className="bg-background">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 38 }}>
          <Text style={{ color: colors.foreground }}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const currentParticipant = currentRendezVous.participants.find((p) => p.id === user.id);

  return (
    <ScreenContainer className="bg-background">
      <View style={{ flex: 1, paddingHorizontal: 38 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 20, paddingBottom: 24 }}>
            {/* Header */}
            <View style={{ gap: 8, marginTop: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "600" }}>← Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                  <Text style={{ fontSize: 14, color: colors.primary, fontWeight: "600" }}>Share ↗</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground, marginTop: 12 }}>
                {currentRendezVous.destinationName}
              </Text>
              {currentRendezVous.groupName && (
                <Text style={{ fontSize: 14, color: colors.muted }}>{currentRendezVous.groupName}</Text>
              )}
            </View>

            {/* Map Placeholder */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/map-view" as any)}
              style={{
                width: "100%",
                height: 200,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderColor: colors.border,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 32 }}>🗺️</Text>
              <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>Map View</Text>
              <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
                {currentRendezVous.participants.length} participants
              </Text>
            </TouchableOpacity>

            {/* Journey Info */}
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 12, gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Departure Time</Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                  {new Date(currentRendezVous.departureTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Status</Text>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                  {currentRendezVous.status === "active" ? "🟢 Active" : "🟡 Pending"}
                </Text>
              </View>
            </View>

            {/* Your Status */}
            {currentParticipant && (
              <View style={{ gap: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Your Status
                </Text>
                <View style={{ gap: 8 }}>
                  {(["present", "late", "absent"] as Participant["status"][]).map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => handleStatusUpdate(s)}
                      style={{
                        backgroundColor:
                          currentParticipant.status === s
                            ? s === "present"
                              ? colors.success
                              : s === "late"
                                ? colors.warning
                                : colors.error
                            : colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: currentParticipant.status === s ? "white" : colors.foreground,
                        }}
                      >
                        {s === "present" ? "✅ I'm Here" : s === "late" ? "⏰ I'm Late" : "❌ Can't Come"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Participants */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Participants ({currentRendezVous.participants.length})
                </Text>
                <TouchableOpacity onPress={() => router.push("/(tabs)/group-chat" as any)}>
                  <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600" }}>Open Chat</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={currentRendezVous.participants}
                renderItem={renderParticipantItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>

            {/* Alert Settings */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/alerts-settings" as any)}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                🔔 Alert Settings
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
