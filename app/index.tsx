import {ScrollView, Text, View } from "react-native";
import TextWeather from "../components/TextWeather"

export default function Index() {
  return (
    <ScrollView style={{
      backgroundImage: 'linear-gradient(to bottom, #79aed2, #acc3d1)',
    }}>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: "15px"
      }}
    >
     <TextWeather name="Simon"/>
     <TextWeather name="Jerry"/>
    </View>
    </ScrollView>
  );
}
