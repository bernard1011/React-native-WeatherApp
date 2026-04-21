import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

const HISTORY_KEY = "weather_history";

type HistoryItem = {
  id: string;
  city: string;
  temp: number;
  description: string;
  timestamp: number;
};

const getWeatherEmoji = (description: string) => {
  if (description.includes("clear")) return "☀️";
  if (description.includes("cloud")) return "☁️";
  if (description.includes("rain")) return "🌧️";
  if (description.includes("snow")) return "❄️";
  if (description.includes("storm")) return "⛈️";
  return "🌤️";
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (data) setHistory(JSON.parse(data));
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const clearHistory = () => {
    Alert.alert("Clear History", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(HISTORY_KEY);
          setHistory([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>{history.length} searches</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>No searches yet</Text>
          <Text style={styles.emptySubtext}>Your searched cities will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          renderItem={({ item, index }) => (
            <View style={[styles.item, index === 0 && styles.itemFirst]}>
              <Text style={styles.itemEmoji}>
                {getWeatherEmoji(item.description)}
              </Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemCity}>{item.city}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemTime}>{formatTime(item.timestamp)}</Text>
              </View>
              <Text style={styles.itemTemp}>{item.temp}°C</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ee",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: "#fff0ec",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearText: {
    color: "#e67e22",
    fontWeight: "600",
    fontSize: 13,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemFirst: {
    borderWidth: 1.5,
    borderColor: "#e67e22",
  },
  itemEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  itemInfo: {
    flex: 1,
  },
  itemCity: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  itemDescription: {
    fontSize: 13,
    color: "#888",
    textTransform: "capitalize",
    marginTop: 2,
  },
  itemTime: {
    fontSize: 11,
    color: "#bbb",
    marginTop: 4,
  },
  itemTemp: {
    fontSize: 22,
    fontWeight: "800",
    color: "#e67e22",
    letterSpacing: -0.5,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 6,
    textAlign: "center",
  },
});