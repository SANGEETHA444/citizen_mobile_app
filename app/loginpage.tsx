import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = () => {
  if (!mobile) {
    Alert.alert("Error", "Please enter mobile number");
    return;
  }
  // Generate 4-digit OTP
  const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
  setGeneratedOtp(newOtp);
  setOtpSent(true);

  // Show OTP (for testing). In real app, send via SMS API
  Alert.alert("OTP Sent", `Your OTP is: ${newOtp}`);
};


  const handleLogin = async () => {
    if (!username || !mobile || !otp) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (otp !== generatedOtp) {
      Alert.alert("Error", "Invalid OTP");
      return;
    }

    // Persist login
    await AsyncStorage.setItem("isLoggedIn", "true");
    router.replace({ pathname: "/report" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      {!otpSent ? (
        <Button title="Send OTP" onPress={sendOtp} color="#007bff" />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />
          <Button title="Login" onPress={handleLogin} color="#28a745" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
});