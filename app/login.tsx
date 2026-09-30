import { useCallback, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { ScreenContainer } from "@/components/screen-container";

type Mode = "login" | "register";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const result =
        mode === "register"
          ? await Api.register(name.trim(), email.trim(), password)
          : await Api.login(email.trim(), password);

      if (result.sessionToken) {
        await Auth.setSessionToken(result.sessionToken);
      }
      if (result.user) {
        await Auth.setUserInfo({
          id: result.user.id,
          openId: result.user.openId,
          name: result.user.name,
          email: result.user.email,
          loginMethod: result.user.loginMethod,
          lastSignedIn: new Date(result.user.lastSignedIn || Date.now()),
        });
      }
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [mode, name, email, password, router]);

  const inputStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.foreground,
    fontSize: 15,
  };

  return (
    <ScreenContainer className="bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 32, paddingVertical: 48 }} showsVerticalScrollIndicator={false}>
          {/* Logo / Title */}
          <View style={{ alignItems: "center", marginBottom: 40, gap: 8 }}>
            <Text style={{ fontSize: 36 }}>🤝</Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground }}>
              Rendez-Vous Solidaire
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Never leave anyone behind
            </Text>
          </View>

          {/* Tab switcher */}
          <View style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(["login", "register"] as Mode[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: mode === m ? colors.primary : "transparent",
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: mode === m ? "white" : colors.muted }}>
                  {m === "login" ? "Sign In" : "Register"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={{ gap: 14 }}>
            {mode === "register" && (
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted }}>Full Name</Text>
                <TextInput
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  style={inputStyle}
                  placeholderTextColor={colors.muted}
                />
              </View>
            )}

            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted }}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={inputStyle}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.muted }}>Password</Text>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={inputStyle}
                placeholderTextColor={colors.muted}
              />
            </View>

            {error && (
              <View style={{ backgroundColor: colors.error + "20", borderRadius: 8, padding: 12 }}>
                <Text style={{ color: colors.error, fontSize: 13, textAlign: "center" }}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={{
                backgroundColor: loading ? colors.muted : colors.primary,
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 8,
              }}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: "700", color: "white" }}>
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
