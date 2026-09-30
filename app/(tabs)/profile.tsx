import { ScrollView, Text, View, TouchableOpacity, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { UserProfile, AlertPreferences, TransportMode } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";

const TRANSPORT_MODES: { label: string; value: TransportMode }[] = [
  { label: "🚶 Walk", value: "walk" },
  { label: "🚴 Bike", value: "bike" },
  { label: "🚗 Car", value: "car" },
  { label: "🚌 Transit", value: "transit" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const { user, setUser, updateAlertPreferences } = useApp();
  const { logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [defaultTransport, setDefaultTransport] = useState<TransportMode>(user?.defaultTransportMode || "car");
  const [enableSound, setEnableSound] = useState(user?.alertPreferences.enableSound ?? true);
  const [enableVibration, setEnableVibration] = useState(user?.alertPreferences.enableVibration ?? true);
  const [volume, setVolume] = useState((user?.alertPreferences.volume ?? 70).toString());

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDefaultTransport(user.defaultTransportMode);
      setEnableSound(user.alertPreferences.enableSound);
      setEnableVibration(user.alertPreferences.enableVibration);
      setVolume(user.alertPreferences.volume.toString());
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!user) return;

    const updatedUser: UserProfile = {
      ...user,
      name,
      defaultTransportMode: defaultTransport,
    };

    setUser(updatedUser);
    alert("Profile updated!");
  };

  const handleSaveAlerts = () => {
    const prefs: AlertPreferences = {
      enableVisual: true,
      enableSound,
      enableVibration,
      volume: Math.min(100, Math.max(0, parseInt(volume) || 70)),
      doNotDisturbMode: false,
    };

    updateAlertPreferences(prefs);
    alert("Alert preferences updated!");
  };

  if (!user) {
    return (
      <ScreenContainer className="p-4 bg-background">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.foreground }}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 24, paddingBottom: 24 }}>
          {/* Header */}
          <View style={{ gap: 8, marginTop: 8 }}>
            <Text style={{ fontSize: 32, fontWeight: "700", color: colors.foreground }}>
              Profile
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Manage your settings and preferences
            </Text>
          </View>

          {/* Profile Section */}
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              Personal Information
            </Text>

            {/* Avatar */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 32 }}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* Name */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                Full Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
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

            {/* Default Transport Mode */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                Default Transport Mode
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {TRANSPORT_MODES.map((mode) => (
                  <TouchableOpacity
                    key={mode.value}
                    onPress={() => setDefaultTransport(mode.value)}
                    style={{
                      backgroundColor: defaultTransport === mode.value ? colors.primary : colors.surface,
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
                        color: defaultTransport === mode.value ? "white" : colors.foreground,
                      }}
                    >
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveProfile}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
                Save Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Alert Preferences Section */}
          <View style={{ gap: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              Alert Preferences
            </Text>

            {/* Sound Toggle */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>Enable Sound</Text>
              <TouchableOpacity
                onPress={() => setEnableSound(!enableSound)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: enableSound ? colors.success : colors.border,
                  justifyContent: "center",
                  paddingHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "white",
                    marginLeft: enableSound ? 24 : 2,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Vibration Toggle */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: colors.surface,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: colors.foreground }}>Enable Vibration</Text>
              <TouchableOpacity
                onPress={() => setEnableVibration(!enableVibration)}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: enableVibration ? colors.success : colors.border,
                  justifyContent: "center",
                  paddingHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "white",
                    marginLeft: enableVibration ? 24 : 2,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Volume */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.muted }}>
                Alert Volume: {volume}%
              </Text>
              <TextInput
                value={volume}
                onChangeText={setVolume}
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

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSaveAlerts}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>
                Save Alert Preferences
              </Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={{ gap: 8, paddingTop: 12 }}>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
              Rendez-Vous Solidaire v1.0.0
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, textAlign: "center" }}>
              Never leave anyone behind
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={async () => { await logout(); router.replace("/login"); }}
            style={{
              backgroundColor: colors.error,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "white" }}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
