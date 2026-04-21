# 🌤️ WeatherApp

A clean, minimal weather app built with **React Native** and **Expo**. Search any city and get real-time weather data — temperature, humidity, wind speed, and more. Your search history is saved locally between sessions.

---

## 📱 Screenshots

> Search screen with live weather data and history tab with recent searches.

---

## ✨ Features

- 🔍 Search weather by city name
- 🌡️ Real-time data: temperature, humidity, wind speed
- 🕓 Search history saved locally (last 10 cities)
- 🗑️ Clear history with confirmation dialog
- 📱 Works on iOS and Android

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native 0.81 | Mobile UI framework |
| Expo SDK 54 | Development platform & build tools |
| Expo Router | File-based navigation |
| TypeScript | Type safety |
| AsyncStorage | Local data persistence |
| OpenWeatherMap API | Weather data |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/WeatherApp.git
cd WeatherApp

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

> ⚠️ Never commit your `.env` file. It's already in `.gitignore`.

### Run the app

```bash
npx expo start
```

Then scan the QR code with **Expo Go** on your phone.

---

## 📁 Project Structure

```
WeatherApp/
├── app/
│   ├── _layout.tsx        # Tab navigation setup
│   ├── index.tsx          # Search screen (entry point)
│   └── history.tsx        # Search history screen
├── components/
│   └── SearchScreen.tsx   # Main weather search component
├── .env                   # API key (not committed)
├── .env.example           # Environment template
└── app.json               # Expo config
```

---

## 🔑 API

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current).

```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric
```

The free tier includes 60 calls/minute — more than enough for personal use.

---

## 📦 Key Dependencies

```json
{
  "expo": "~54.0.33",
  "expo-router": "~6.0.23",
  "react-native": "0.81.5",
  "@react-native-async-storage/async-storage": "latest"
}
```

---

## 🧠 What I Learned

- Setting up React Native with Expo and file-based routing
- Fetching and handling REST API responses with `async/await`
- Managing multiple UI states: loading, error, success
- Persisting data locally with `AsyncStorage`
- TypeScript typing for API responses
- Using `useFocusEffect` to refresh data on tab focus

---

## 📄 License

MIT License — feel free to use this project as a learning reference.
