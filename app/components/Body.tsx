import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import floorplanDataCopy from '../assets/floorplan-data-copy.json';

import Path from './Path';

const { width, height } = Dimensions.get("window");
interface BodyProps {
  from: string;
  to: string;
}
interface Edge {
  id: string;
  from: string;
  to: string;
  floor: number; 
  points: { x: number | string; y: number | string }[];
}
export default function Body({ from, to }: BodyProps) {
  const [floorSelectorOpen, setFloorSelectorOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(1); // 1, 2, 3
  const scale = useRef(new Animated.Value(1)).current;
  const scaleRef = useRef(1);

  // Center the floor plan at start
  const initialX = (width - width * 2) / 2;
  const initialY = (height - height * 2) / 2;
  const translateX = useRef(new Animated.Value(initialX)).current;
  const translateY = useRef(new Animated.Value(initialY)).current;
  const translateRef = useRef({ x: initialX, y: initialY });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          // pinch start
          const dx =
            evt.nativeEvent.touches[0].pageX -
            evt.nativeEvent.touches[1].pageX;
          const dy =
            evt.nativeEvent.touches[0].pageY -
            evt.nativeEvent.touches[1].pageY;
          scaleRef.current = scaleRef.current; // keep last scale
          (panResponder as any).initialDistance = Math.sqrt(dx * dx + dy * dy);
        } else {
          // pan start: use current tracked values
          translateRef.current = {
            x: translateRef.current.x,
            y: translateRef.current.y
          };
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          // pinch zoom (1:1 scale)
          const dx =
            evt.nativeEvent.touches[0].pageX -
            evt.nativeEvent.touches[1].pageX;
          const dy =
            evt.nativeEvent.touches[0].pageY -
            evt.nativeEvent.touches[1].pageY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          let pinchScale = (distance / (panResponder as any).initialDistance) * scaleRef.current;
          pinchScale = Math.max(1, Math.min(pinchScale, 4));
          scale.setValue(pinchScale);
          scaleRef.current = pinchScale;
        } else if (evt.nativeEvent.touches.length === 1) {
          // pan move (1:1 scale, clamped)
          const imageWidth = width * 2 * scaleRef.current;
          const imageHeight = height * 2 * scaleRef.current;
          // Removed unused minX, maxX, minY, maxY
          // Further reduce pan sensitivity
          let newX = translateRef.current.x + gestureState.dx * 0.15;
          let newY = translateRef.current.y + gestureState.dy * 0.15;
          // Clamp so at least 1/4 of the plan is visible
          const visibleWidth = width / 4;
          const visibleHeight = height / 4;
          const minXQuarter = Math.min(0, width - imageWidth + visibleWidth);
          const maxXQuarter = Math.max(0, width - visibleWidth);
          // Limit top white space: maxYQuarter should never be > 0
          let minYQuarter = Math.min(0, height - imageHeight + visibleHeight);
          let maxYQuarter = Math.max(0, height - visibleHeight);
          maxYQuarter = Math.min(maxYQuarter, 0);
          if (minYQuarter > maxYQuarter) {
            // Swap if min > max
            const temp = minYQuarter;
            minYQuarter = maxYQuarter;
            maxYQuarter = temp;
          }
          newX = Math.max(minXQuarter, Math.min(newX, maxXQuarter));
          newY = Math.max(minYQuarter, Math.min(newY, maxYQuarter));
          translateX.setValue(newX);
          translateY.setValue(newY);
          translateRef.current = { x: newX, y: newY };
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // No need to update refs, already tracked in move
      },
    })
  ).current;

  const handleRecenter = () => {
    // Center on start of path
    const startPoint = pathPoints[0];
    const centerX = width / 2;
    const centerY = height / 2;
    const targetX = centerX - startPoint[0];
    const targetY = centerY - startPoint[1];
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: targetX,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: targetY,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    scaleRef.current = 1;
    translateRef.current = { x: targetX, y: targetY };
  };
  // Extract path points from JSON 
  // Define floor-specific image dimensions
  const floorDimensions: Record<number, { width: number; height: number }> = {
    1: { width: 2866, height: 3602 }, // Ground Floor dimensions
    2: { width: 2677, height: 3330 }, // First Floor dimensions
    3: { width: 2772, height: 3335 }, // Second Floor dimensions
  };

  // Get the dimensions for the selected floor
  const { width: imageWidth, height: imageHeight } = floorDimensions[selectedFloor];

  // Build graph for all edges but filter by floor when finding/using paths
  const buildGraph = (data: any) => {
    const graph = new Map<string, Edge[]>();

    data.edges.forEach((edge: Edge) => {
      const from = edge.from.toLowerCase();
      const to = edge.to.toLowerCase();

      if (!graph.has(from)) graph.set(from, []);
      if (!graph.has(to)) graph.set(to, []);

      graph.get(from)!.push({ ...edge, from, to });
      graph.get(to)!.push({ ...edge, from: to, to: from, points: [...edge.points].reverse() });
    });

    return graph;
  };

const findPath = (graph: Map<string, Edge[]>, start: string, goal: string) => {
  const startNode = start.toLowerCase();
  const goalNode = goal.toLowerCase();

  const queue: [string, Edge[]][] = [[startNode, []]];
  const visited = new Set<string>([startNode]);

  while (queue.length > 0) {
    const [node, path] = queue.shift()!;
    if (node === goalNode) return path;

    const edges = graph.get(node);
    if (!edges) continue;

    for (const edge of edges) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([edge.to, [...path, edge]]);
      }
    }
  }

  return null;
};



const graph = buildGraph(floorplanDataCopy);

// Define lift node mapping per floor
const LIFT_NODES: Record<number, string> = {
  1: "140", // Ground floor lift node
  2: "83", // First floor lift node
  3: "124", // Second floor lift node
};

// Helper: find which floor a node is on
const findNodeFloor = (nodeId: string): number | null => {
  for (const edge of floorplanDataCopy.edges) {
    if (
      edge.from.toLowerCase() === nodeId.toLowerCase() ||
      edge.to.toLowerCase() === nodeId.toLowerCase()
    ) {
      return edge.floor;
    }
  }
  return null;
};

const fromFloor = findNodeFloor(from);
const toFloor = findNodeFloor(to);

let matchedEdges: Edge[] | null = null;

// If user’s target is on another floor, handle via floor’s lift nodes
if (fromFloor && toFloor && fromFloor !== toFloor) {
  if (selectedFloor === fromFloor) {
    // On current floor → draw path from start to lift of this floor
    matchedEdges = findPath(graph, from, LIFT_NODES[fromFloor]);
  } else if (selectedFloor === toFloor) {
    // On destination floor → draw path from lift of that floor to destination
    matchedEdges = findPath(graph, LIFT_NODES[toFloor], to);
  } else {
    // If user is viewing an unrelated floor, no path
    matchedEdges = null;
  }
} else {
  // Same floor → draw direct path
  matchedEdges = findPath(graph, from, to);
}


  // Choose only edges that belong to the currently selected floor.
  const floorEdges = matchedEdges
    ? matchedEdges.filter((edge: Edge) => edge.floor === selectedFloor)
    : [];

const [imageLayout, setImageLayout] = useState({
  width: 1,
  height: 1,
  offsetX: 0,
  offsetY: 0,
});
// compute path points only when layout is known
  // Build path points only from the chosen floor edges and ensure numeric coords
  const pathPoints: [number, number][] =
    floorEdges.length > 0 && imageLayout.width > 1
      ? floorEdges.flatMap((edge: Edge) =>
          edge.points.map((pt) => {
            const xNum = typeof pt.x === 'string' ? parseFloat(pt.x) : (pt.x as number);
            const yNum = typeof pt.y === 'string' ? parseFloat(pt.y) : (pt.y as number);

            // Fallback to 0 if parsing fails
            const xVal = Number.isFinite(xNum) ? xNum : 0;
            const yVal = Number.isFinite(yNum) ? yNum : 0;

            const xScaled = (xVal / imageWidth) * imageLayout.width + imageLayout.offsetX;
            const yScaled = (yVal / imageHeight) * imageLayout.height + imageLayout.offsetY;

            return [xScaled, yScaled] as [number, number];
          })
        )
      : [];

  // Dummy floor images for demonstration
  const floorImages = [
    require("../assets/Ground_Floor.png"),
    require("../assets/First_Floor.png"),
    require("../assets/Second_Floor.png"),
  ];
  return (
    <View style={styles.mapScreen}>
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [
            { scale },
            { translateX },
            { translateY },
          ],
          width: width * 2,
          height: height * 2,
          alignSelf: "center",
        }}
      >
      <Image
        key={selectedFloor} // <--- force new mount on floor change
        source={floorImages[selectedFloor - 1]}
        style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        onLayout={(e) => {
          const containerWidth = e.nativeEvent.layout.width;
          const containerHeight = e.nativeEvent.layout.height;
          const aspectRatio = imageWidth / imageHeight;
          let displayedWidth = containerWidth;
          let displayedHeight = displayedWidth / aspectRatio;

          if (displayedHeight > containerHeight) {
            displayedHeight = containerHeight;
            displayedWidth = displayedHeight * aspectRatio;
          }

          const offsetX = (containerWidth - displayedWidth) / 2;
          const offsetY = (containerHeight - displayedHeight) / 2;

          setImageLayout({
            width: displayedWidth,
            height: displayedHeight,
            offsetX,
            offsetY,
          });
        }}
      />
      {/*svg pol pat la*/}
        {pathPoints.length > 0 && (
          <Path
            points={pathPoints}
            strokeColor="blue"
            arrowColor="red"
            duration={4000}
          />
        )}
      </Animated.View>

      {/* Floating navigation buttons */}
      <View style={styles.floatingNavigation}>
        <View style={styles.floorNav}>
          {/* Floor selector expanded buttons */}
          {floorSelectorOpen && (
            <View style={styles.floorSelectorContainer}>
              {[1, 2, 3].map(floor => (
                <TouchableOpacity
                  key={floor}
                  style={[styles.floorSelectorButton, selectedFloor === floor && styles.selectedFloorButton]}
                  onPress={() => {
                    setSelectedFloor(floor);
                    setFloorSelectorOpen(false);
                  }}
                >
                  <Ionicons name="layers-outline" size={30} color={selectedFloor === floor ? "white" : "black"} />
                  <View style={styles.floorLabel}>
                    <Animated.Text style={{color: selectedFloor === floor ? "white" : "black"}}>
                      {floor === 1 ? "Ground Floor" : `Floor ${floor - 1}`}
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Main floor button toggles selector */}
          <TouchableOpacity style={styles.floorButton} onPress={() => setFloorSelectorOpen(open => !open)}>
            <Ionicons name="layers-outline" size={50} color={"black"} />
          </TouchableOpacity>
        </View>
        <View style={styles.recenterNav}>
          <TouchableOpacity
            style={styles.recenterButton}
            onPress={handleRecenter}
          >
            <Ionicons name="locate-outline" size={50} color={"black"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapScreen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  floatingNavigation: {
    position: "absolute",
    right: 20,
    bottom: 60,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  floorNav: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  recenterNav: {
    justifyContent: "center",
  },
  floorButton: {
    height: 50,
    width: 50,
    backgroundColor: "#f5f5f7",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  floorSelectorContainer: {
    position: "absolute",
    bottom: 60,
    right: 0,
    flexDirection: "column",
    alignItems: "flex-end",
    zIndex: 3,
  },
  floorSelectorButton: {
    height: 40,
    width: 120,
    backgroundColor: "#f5f5f7",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFloorButton: {
    backgroundColor: "#757575",
  },
  floorLabel: {
    marginLeft: 10,
  },
  recenterButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: "#f5f5f7",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  overlay:{
    position:"absolute",
    top:0,
    left:0
    }
});
