import { useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
const HISTORY_KEY = "weather_history";

type WeatherData = {
  name: string;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
};

type HistoryItem = {
  id: string;
  city: string;
  temp: number;
  description: string;
  timestamp: number;
};

export const saveToHistory = async (weather: WeatherData) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history: HistoryItem[] = existing ? JSON.parse(existing) : [];

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      city: weather.name,
      temp: Math.round(weather.main.temp),
      description: weather.weather[0].description,
      timestamp: Date.now(),
    };

    const filtered = history.filter(
      (item) => item.city.toLowerCase() !== newItem.city.toLowerCase()
    );

    const updated = [newItem, ...filtered].slice(0, 10);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

const SearchScreen = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`
      );

      if (!response.ok) {
        throw new Error("City not found. Please check the name.");
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      await saveToHistory(data); 

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherEmoji = (description: string) => {
    if (description.includes("clear")) return "☀️";
    if (description.includes("cloud")) return "☁️";
    if (description.includes("rain")) return "🌧️";
    if (description.includes("snow")) return "❄️";
    if (description.includes("storm")) return "⛈️";
    return "🌤️";
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Weather</Text>
      <Text style={styles.subtitle}>Check the forecast anywhere</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter city..."
          placeholderTextColor="#aaa"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={fetchWeather}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#2980b9" style={{ marginTop: 40 }} />
      )}

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      {weather && (
        <View style={styles.card}>
          <Text style={styles.weatherEmoji}>
            {getWeatherEmoji(weather.weather[0].description)}
          </Text>
          <Text style={styles.cityName}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>

          <View style={styles.divider} />

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💧</Text>
              <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
              <Text style={styles.detailLabel}>Humidity</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💨</Text>
              <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
              <Text style={styles.detailLabel}>Wind</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f6fb",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: "#999",
    marginBottom: 32,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    backgroundColor: "#2980b9",
    borderRadius: 16,
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2980b9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 32,
  },
  weatherEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  temp: {
    fontSize: 72,
    fontWeight: "800",
    color: "#2980b9",
    letterSpacing: -2,
    lineHeight: 80,
  },
  description: {
    fontSize: 16,
    color: "#888",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: "row",
    gap: 40,
  },
  detailItem: {
    alignItems: "center",
    gap: 4,
  },
  detailIcon: {
    fontSize: 22,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  detailLabel: {
    fontSize: 12,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  errorBox: {
    backgroundColor: "#f0f6fb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
  },
});

export default SearchScreen;