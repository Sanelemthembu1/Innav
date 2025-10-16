import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Body from "./components/Body";
import BottomBar from "./components/BottomBar";
import NavBar from "./components/NavBar";
// merged imports

export default function Index() {
  const [showDestination, setShowDestination] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeInfo, setRouteInfo] = useState<{ hasRoute: boolean; steps: string[]; floor: number | null }>({ hasRoute: false, steps: [], floor: null });
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // Keep instructionsOpen synced when route appears/disappears
  useEffect(() => {
    if (routeInfo.hasRoute) setInstructionsOpen(true);
    else setInstructionsOpen(false);
  }, [routeInfo.hasRoute]);

  const { fromLocation } = useLocalSearchParams();

  // When returning from scan, automatically set the "from" field
  useEffect(() => {
    if (fromLocation) {
      setFrom(fromLocation as string);
    }
  }, [fromLocation]);

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

      <View style={styles.bodyWrapper}>
        <Body from={from} to={to} onRouteChange={(info) => setRouteInfo({ hasRoute: info.hasRoute, steps: info.steps, floor: info.floor })} />

        {showDestination && (
          <TouchableWithoutFeedback onPress={() => setShowDestination(false)}>
            <View style={StyleSheet.absoluteFillObject} />
          </TouchableWithoutFeedback>
        )}
      </View>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  bodyWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  instructionsContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 80,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  instructionsTitle: { fontWeight: 'bold', fontSize: 16 },
  instructionsToggle: { color: '#007AFF', fontWeight: '600' },
  instructionsBody: { maxHeight: 140 },
  instructionText: { fontSize: 13, marginVertical: 2 },
  instructionsSubtitle: { fontSize: 13, marginBottom: 6 },
});
