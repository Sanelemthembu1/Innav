import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomBar from './components/BottomBar';
import NavBar from "./components/NavBar";

const ScanScreen = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showDestination, setShowDestination] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeInfo, setRouteInfo] = useState<{ hasRoute: boolean; steps: string[]; floor: number | null }>({ hasRoute: false, steps: [], floor: null });

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>No access to camera</Text>
        <Text onPress={requestPermission}>Grant Permission</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavBar
        showDestination={showDestination}
        setShowDestination={setShowDestination}
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
        routeInfo={routeInfo} // Pass route info to NavBar
      />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowDestination(false);
        }}
      >
        <View style={styles.scanArea}>
          <CameraView
            style={styles.scanAreaCam}
            facing="back"
            onBarcodeScanned={({ data }) => {
              let location = data;
              if (data.startsWith('QRCODE-ROOM-')) {
                location = 'Room ' + data.replace('QRCODE-ROOM-', '');
              }
              Alert.alert('QR Code Detected', `Location: ${location}`, [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate back to index and pass location as param
                    router.replace({
                      pathname: '/',
                      params: { fromLocation: location },
                    });
                  },
                },
              ]);
              console.log("QR Code scanned:", data);
            }}
          />
        </View>
      </TouchableWithoutFeedback>

      <BottomBar />
    </SafeAreaView>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scanArea: {
    flex: 1,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scanAreaCam: {
    height: 300,
    width: 300,
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 30,
    overflow: "hidden",
  }
});
