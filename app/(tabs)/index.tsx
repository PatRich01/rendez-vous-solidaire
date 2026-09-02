import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { rendezVousList, setCurrentRendezVous } = useApp();

  const activeRendezVous = rendezVousList.filter((rv) => rv.status === "active" || rv.status === "pending");
  const completedRendezVous = rendezVousList.filter((rv) => rv.status === "completed");

  const handleCreateNew = () => {
    router.push("/(tabs)/create-rendez-vous" as any);
  };

  const handleJoinExisting = () => {
    router.push("/(tabs)/join-rendez-vous" as any);
  };

  const handleSelectRendezVous = (rvId: string) => {
    setCurrentRendezVous(rvId);
    router.push("/(tabs)/rendez-vous-detail" as any);
  };

  const renderRendezVousCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => handleSelectRendezVous(item.id)}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginBottom: 4 }}>
            {item.destinationName}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            {item.groupName || "Group Journey"}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: item.status === "active" ? colors.success : colors.primary,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: "600", color: "white" }}>
            {item.status === "active" ? "ACTIVE" : "PENDING"}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          {item.participants.length} participant{item.participants.length !== 1 ? "s" : ""}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          {new Date(item.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 24 }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 8 }}>
            <Text style={{ fontSize: 32, fontWeight: "700", color: colors.foreground }}>
              Rendez-Vous
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Stay together, never leave anyone behind
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleCreateNew}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>
                Create New Rendez-Vous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleJoinExisting}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                borderWidth: 2,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.primary }}>
                Join Existing Rendez-Vous
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Rendez-Vous Section */}
          {activeRendezVous.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Active Journeys
              </Text>
              <FlatList
                data={activeRendezVous}
                renderItem={renderRendezVousCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Completed Rendez-Vous Section */}
          {completedRendezVous.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                Completed Journeys
              </Text>
              <FlatList
                data={completedRendezVous}
                renderItem={renderRendezVousCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Empty State */}
          {rendezVousList.length === 0 && (
            <View style={{ alignItems: "center", paddingVertical: 48, gap: 12 }}>
              <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center" }}>
                No rendez-vous yet
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
                Create a new one or join an existing group to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
