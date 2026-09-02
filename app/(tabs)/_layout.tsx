import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useApp } from "@/lib/app-context";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;
  const { user, setUser } = useApp();

  useEffect(() => {
    if (Platform.OS === "web" && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    // Inject meta and manifest tags on web
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const head = document.head;
      if (head && !document.querySelector('link[rel="manifest"]')) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = '#0ea5a4';
        head.appendChild(meta);

        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = '/manifest.json';
        head.appendChild(link);

        const icon = document.createElement('link');
        icon.rel = 'icon';
        icon.href = '/icons/icon-192.svg';
        head.appendChild(icon);
      }
    }
  }, []);

  // Initialize user on first load
  if (!user) {
    setUser({
      id: "user-" + Date.now(),
      name: "User",
      defaultTransportMode: "car",
      alertPreferences: {
        enableVisual: true,
        enableSound: true,
        enableVibration: true,
        volume: 70,
        doNotDisturbMode: false,
      },
    });
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-rendez-vous"
        options={{
          href: null,
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="join-rendez-vous"
        options={{
          href: null,
          title: "Join",
        }}
      />
      <Tabs.Screen
        name="rendez-vous-detail"
        options={{
          href: null,
          title: "Detail",
        }}
      />
      <Tabs.Screen
        name="group-chat"
        options={{
          href: null,
          title: "Chat",
        }}
      />
      <Tabs.Screen
        name="alerts-settings"
        options={{
          href: null,
          title: "Alerts",
        }}
      />
      <Tabs.Screen
        name="map-view"
        options={{
          href: null,
          title: "Map",
        }}
      />
    </Tabs>
  );
}
