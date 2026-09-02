import { ScrollView, Text, View, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { Participant } from "@/lib/types";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function RendezVousDetailScreen() {
  const router = useRouter();
  const colors = useColors();
  const { currentRendezVous, updateParticipantStatus, user } = useApp();
  const [showChat, setShowChat] = useState(false);

  if (!currentRendezVous || !user) {
    return (
      <ScreenContainer className="p-4 bg-background">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.foreground }}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const currentParticipant = currentRendezVous.participants.find((p) => p.id === user.id);
  const otherParticipants = currentRendezVous.participants.filter((p) => p.id !== user.id);

  const handleStatusUpdate = (status: Participant["status"]) => {
    updateParticipantStatus(currentRendezVous.id, user.id, status);
  };

  const renderParticipantItem = ({ item }: { item: Participant }) => (
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
      {/* Avatar */}
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

      {/* Name and Status */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
          {item.transportMode === "car" ? "🚗" : item.transportMode === "walk" ? "🚶" : "🚌"} {item.transportMode}
        </Text>
      </View>

      {/* Status Badge */}
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
            color: item.status === "present" || item.status === "late" || item.status === "absent" ? "white" : colors.foreground,
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

      {/* Vu Badge */}
      {item.isOnBoard && (
        <View style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.primary, borderRadius: 6 }}>
          <Text style={{ fontSize: 10, fontWeight: "600", color: "white" }}>VU</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 20, paddingBottom: 24 }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 8 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "600" }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground, marginTop: 12 }}>
              {currentRendezVous.destinationName}
            </Text>
            {currentRendezVous.groupName && (
              <Text style={{ fontSize: 14, color: colors.muted }}>
                {currentRendezVous.groupName}
              </Text>
            )}
          </View>

          {/* Simple Map Placeholder */}
          <View
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
          >
            <Text style={{ fontSize: 32 }}>🗺️</Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Map View
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
              {currentRendezVous.participants.length} participants
            </Text>
          </View>

          {/* Journey Info */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 12,
              gap: 8,
            }}
          >
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

          {/* Your Status Section */}
          {currentParticipant && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Your Status
              </Text>
              <View style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => handleStatusUpdate("present")}
                  style={{
                    backgroundColor: currentParticipant.status === "present" ? colors.success : colors.surface,
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
                      color: currentParticipant.status === "present" ? "white" : colors.foreground,
                    }}
                  >
                    ✅ I'm Here
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStatusUpdate("late")}
                  style={{
                    backgroundColor: currentParticipant.status === "late" ? colors.warning : colors.surface,
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
                      color: currentParticipant.status === "late" ? "white" : colors.foreground,
                    }}
                  >
                    ⏰ I'm Late
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStatusUpdate("absent")}
                  style={{
                    backgroundColor: currentParticipant.status === "absent" ? colors.error : colors.surface,
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
                      color: currentParticipant.status === "absent" ? "white" : colors.foreground,
                    }}
                  >
                    ❌ Can't Come
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Participants Section */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                Participants ({currentRendezVous.participants.length})
              </Text>
              <TouchableOpacity onPress={() => setShowChat(!showChat)}>
                <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600" }}>
                  {showChat ? "Hide Chat" : "Show Chat"}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={currentRendezVous.participants}
              renderItem={renderParticipantItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Chat Preview */}
          {showChat && (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.foreground }}>
                Group Chat
              </Text>
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  padding: 8,
                  minHeight: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
                  💬 Group chat coming soon
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
