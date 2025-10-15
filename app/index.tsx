import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Body from "./components/Body";
import BottomBar from "./components/BottomBar";
import NavBar from "./components/NavBar";

export default function Index() {
  const [showDestination, setShowDestination] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

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
      />

      <View style={styles.bodyWrapper}>
        <Body from={from} to={to} />

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
});
