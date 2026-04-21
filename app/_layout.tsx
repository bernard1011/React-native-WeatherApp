import { Tabs } from "expo-router";
import { Text } from "react-native";

const RootLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e67e22",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarStyle: {
      backgroundColor: "#ffffff",
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
      height: 60,
      paddingBottom: 8,
    },
      }}
      
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Пошук",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: "Історія",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🕓</Text>,
        }}
      />
    </Tabs>
  );
}

export default RootLayout