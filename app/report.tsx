import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Video } from "expo-av";

export default function ReportScreen() {
  const [hazardType, setHazardType] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  // Pick image
  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("Limit Reached", "You can add up to 3 images only.");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  // Pick video
  const pickVideo = async () => {
    if (video) {
      Alert.alert("Limit Reached", "You can add only 1 video.");
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.5,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  // Fetch location on button press
  const getMyLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required. Please enable it in settings."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc);

      // Get human-readable address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geocode.length > 0) {
        const g = geocode[0];
        const addr = `${g.name || ""}, ${g.city || ""}, ${g.region || ""}, ${g.country || ""}`;
        setAddress(addr);
      }

      Alert.alert(
        "Location Acquired",
        `Coordinates: ${loc.coords.latitude.toFixed(
          5
        )}, ${loc.coords.longitude.toFixed(5)}\nAddress: ${address}`
      );
    } catch (error) {
      console.log("Location error:", error);
      Alert.alert(
        "Error",
        "Unable to get current location. Make sure location services are enabled."
      );
    }
  };

  // Submit report
  const submitReport = () => {
    if (!hazardType || !description) {
      Alert.alert("Error", "Please select hazard type and add description.");
      return;
    }

    Alert.alert(
      "Report Submitted",
      `Hazard: ${hazardType}\nDescription: ${description}\nImages: ${
        images.length
      }\nVideo: ${video ? "Yes" : "No"}\nLocation: ${
        location
          ? `${location.coords.latitude.toFixed(5)}, ${location.coords.longitude.toFixed(
              5
            )}\n${address}`
          : "N/A"
      }`
    );

    // Reset
    setHazardType("");
    setDescription("");
    setImages([]);
    setVideo(null);
    setLocation(null);
    setAddress("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Citizen Report</Text>

      <Text style={styles.label}>Select Hazard Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={hazardType} onValueChange={setHazardType}>
          <Picker.Item label="Select Hazard" value="" />
          <Picker.Item label="Tropical Cyclones" value="Tropical Cyclones" />
          <Picker.Item label="Storm Surges" value="Storm Surges" />
          <Picker.Item label="Tsunamis" value="Tsunamis" />
          <Picker.Item label="Coastal Erosion" value="Coastal Erosion" />
          <Picker.Item label="Sea Level Rise" value="Sea Level Rise" />
        </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe the hazard"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Add Media</Text>
      <View style={styles.mediaContainer}>
        {[0, 1, 2].map((i) => (
          <TouchableOpacity key={i} style={styles.square} onPress={pickImage}>
            {images[i] ? (
              <Image source={{ uri: images[i] }} style={styles.squareImage} />
            ) : (
              <Text style={styles.plusText}>+</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.square} onPress={pickVideo}>
          {video ? (
            <Video
              source={{ uri: video }}
              style={styles.squareImage}
              resizeMode={"cover" as any}
              useNativeControls
            />
          ) : (
            <Text style={styles.plusText}>🎬</Text>
          )}
        </TouchableOpacity>
      </View>

      <Button title="Use My Location" onPress={getMyLocation} color="#007bff" />

      {location && (
        <Text style={styles.location}>
          Coordinates: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
          {"\n"}
          Address: {address}
        </Text>
      )}

      <Button title="Submit Report" onPress={submitReport} color="#28a745" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  mediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  squareImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  plusText: {
    fontSize: 30,
    color: "#999",
  },
  location: {
    marginTop: 15,
    fontStyle: "italic",
  },
});
