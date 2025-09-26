import { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        router.replace({ pathname: "/report" }); // redirect if already logged in
      }
    };
    checkLogin();
  }, [router]);

  return (
    <View style={styles.container}>
      {/* Logo removed for now */}
      <Text style={styles.title}>Citizen App</Text>
      <Button title="Next" onPress={() => router.push({ pathname: "/loginpage" })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
});