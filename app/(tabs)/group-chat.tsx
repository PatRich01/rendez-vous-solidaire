import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useColors } from "@/hooks/use-colors";
import { useState, useRef, useEffect } from "react";

export default function GroupChatScreen() {
  const router = useRouter();
  const colors = useColors();
  const { currentRendezVous, messages, sendMessage, user } = useApp();
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!currentRendezVous || !user) {
    return (
      <ScreenContainer className="p-4 bg-background">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.foreground }}>Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const rendezVousMessages = messages.filter((m) => m.rendezVousId === currentRendezVous.id);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(currentRendezVous.id, messageText);
      setMessageText("");
    }
  };

  const renderMessageItem = ({ item }: any) => {
    const isCurrentUser = item.participantId === user.id;
    return (
      <View
        style={{
          flexDirection: isCurrentUser ? "row-reverse" : "row",
          marginBottom: 12,
          paddingHorizontal: 12,
          gap: 8,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 10 }}>
            {item.participantName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Message Bubble */}
        <View style={{ flex: 1, maxWidth: "75%" }}>
          <View
            style={{
              backgroundColor: isCurrentUser ? colors.primary : colors.surface,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderBottomLeftRadius: isCurrentUser ? 12 : 0,
              borderBottomRightRadius: isCurrentUser ? 0 : 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: isCurrentUser ? "white" : colors.muted,
                marginBottom: 4,
              }}
            >
              {item.participantName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isCurrentUser ? "white" : colors.foreground,
              }}
            >
              {item.text}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 10,
              color: colors.muted,
              marginTop: 4,
              textAlign: isCurrentUser ? "right" : "left",
            }}
          >
            {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
              gap: 4,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 16, color: colors.primary, fontWeight: "600" }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 8 }}>
              {currentRendezVous.destinationName}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {currentRendezVous.participants.length} participants
            </Text>
          </View>

          {/* Messages List */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {rendezVousMessages.length === 0 ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48 }}>
                <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
                  No messages yet. Start the conversation!
                </Text>
              </View>
            ) : (
              <FlatList
                data={rendezVousMessages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            )}
          </ScrollView>

          {/* Input Area */}
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              backgroundColor: colors.background,
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              <TextInput
                placeholder="Type a message..."
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
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
                  maxHeight: 100,
                }}
                placeholderTextColor={colors.muted}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!messageText.trim()}
                style={{
                  backgroundColor: messageText.trim() ? colors.primary : colors.border,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 16 }}>📤</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 10, color: colors.muted, textAlign: "right" }}>
              {messageText.length}/500
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
