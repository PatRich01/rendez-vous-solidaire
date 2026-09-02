import { ScrollView, Text, View, TouchableOpacity, TextInput, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { AlertPreferences } from "@/lib/types";

export default function AlertsSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, updateAlertPreferences } = useApp();

  const [enableVisual, setEnableVisual] = useState(user?.alertPreferences.enableVisual ?? true);
  const [enableSound, setEnableSound] = useState(user?.alertPreferences.enableSound ?? true);
  const [enableVibration, setEnableVibration] = useState(user?.alertPreferences.enableVibration ?? true);
  const [volume, setVolume] = useState((user?.alertPreferences.volume ?? 70).toString());
  const [doNotDisturb, setDoNotDisturb] = useState(user?.alertPreferences.doNotDisturbMode ?? false);
  const [ringtone, setRingtone] = useState(user?.alertPreferences.ringtone ?? "default");

  useEffect(() => {
    if (user) {
      setEnableVisual(user.alertPreferences.enableVisual);
      setEnableSound(user.alertPreferences.enableSound);
      setEnableVibration(user.alertPreferences.enableVibration);
      setVolume(user.alertPreferences.volume.toString());
      setDoNotDisturb(user.alertPreferences.doNotDisturbMode);
      setRingtone(user.alertPreferences.ringtone ?? "default");
    }
  }, [user]);

  const handleSave = () => {
    const prefs: AlertPreferences = {
      enableVisual,
      enableSound,
      enableVibration,
      volume: Math.min(100, Math.max(0, parseInt(volume) || 70)),
      doNotDisturbMode: doNotDisturb,
      ringtone,
    };

    updateAlertPreferences(prefs);
    alert("Alert preferences saved!");
  };

  const ringtoneOptions = [
    { label: "🔔 Default", value: "default" },
    { label: "🎵 Chime", value: "chime" },
    { label: "🎶 Bell", value: "bell" },
    { label: "📢 Alert", value: "alert" },
  ];

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
              Alert Settings
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted }}>
              Customize how you receive notifications
            </Text>
          </View>

          {/* Alert Types Section */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              Alert Types
            </Text>

            {/* Visual Alerts */}
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
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Visual Alerts
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  Screen flash and notifications
                </Text>
              </View>
              <Switch
                value={enableVisual}
                onValueChange={setEnableVisual}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={enableVisual ? colors.success : colors.muted}
              />
            </View>

            {/* Sound Alerts */}
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
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Sound Alerts
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  Play notification sound
                </Text>
              </View>
              <Switch
                value={enableSound}
                onValueChange={setEnableSound}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={enableSound ? colors.success : colors.muted}
              />
            </View>

            {/* Vibration Alerts */}
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
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Vibration
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  Device vibration feedback
                </Text>
              </View>
              <Switch
                value={enableVibration}
                onValueChange={setEnableVibration}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={enableVibration ? colors.success : colors.muted}
              />
            </View>
          </View>

          {/* Volume Section */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              Volume Control
            </Text>

            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 14, color: colors.foreground }}>Alert Volume</Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.primary }}>
                  {volume}%
                </Text>
              </View>

              {/* Volume Slider Simulation */}
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>0%</Text>
                <TextInput
                  value={volume}
                  onChangeText={setVolume}
                  keyboardType="numeric"
                  style={{
                    flex: 1,
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
                <Text style={{ fontSize: 12, color: colors.muted }}>100%</Text>
              </View>
            </View>
          </View>

          {/* Ringtone Section */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              Ringtone
            </Text>

            <View style={{ gap: 8 }}>
              {ringtoneOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setRingtone(option.value)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    backgroundColor: ringtone === option.value ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    gap: 12,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderColor: ringtone === option.value ? "white" : colors.border,
                      borderWidth: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {ringtone === option.value && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: ringtone === option.value ? "white" : colors.foreground,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Do Not Disturb Section */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>
              Do Not Disturb Mode
            </Text>

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
              <View style={{ gap: 4, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground }}>
                  Critical Alerts Only
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  Only receive final approach alerts
                </Text>
              </View>
              <Switch
                value={doNotDisturb}
                onValueChange={setDoNotDisturb}
                trackColor={{ false: colors.border, true: colors.success }}
                thumbColor={doNotDisturb ? colors.success : colors.muted}
              />
            </View>
          </View>

          {/* Test Alert Button */}
          <TouchableOpacity
            onPress={() => alert("🔔 Test alert! This is how your notifications will appear.")}
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
              🔊 Test Alert
            </Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
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
              Save Alert Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
