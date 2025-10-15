import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle, Polygon, Polyline } from 'react-native-svg';

type PathOverlayProps = {
  points: [number, number][];
  strokeColor?: string;
  strokeWidth?: number;
  arrowColor?: string;
  duration?: number; // animation duration in ms
};

export default function PathOverlay({
  points,
  strokeColor = 'red',
  strokeWidth = 4,
  arrowColor = 'blue',
  duration = 4000,
}: PathOverlayProps) {
  const progress = useRef(new Animated.Value(0)).current;

  // Precompute segment lengths and cumulative lengths (memoized)
  const { segmentLengths, totalLength } = React.useMemo(() => {
    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1][0] - points[i][0];
      const dy = points[i + 1][1] - points[i][1];
      const length = Math.sqrt(dx * dx + dy * dy);
      segmentLengths.push(length);
      totalLength += length;
    }
    return { segmentLengths, totalLength };
  }, [points]);

  const [arrowPos, setArrowPos] = useState({ x: points[0][0], y: points[0][1], angle: 0 });

  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      const traveled = value * totalLength;
      let remaining = traveled;
      for (let i = 0; i < segmentLengths.length; i++) {
        if (remaining <= segmentLengths[i]) {
          const [x1, y1] = points[i];
          const [x2, y2] = points[i + 1];
          const ratio = remaining / segmentLengths[i];
          const x = x1 + (x2 - x1) * ratio;
          const y = y1 + (y2 - y1) * ratio;
          // Interpolate angle between current and next segment for smooth rotation
          let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
          if (i < segmentLengths.length - 1) {
            const [nx1, ny1] = points[i + 1];
            const [nx2, ny2] = points[i + 2];
            const nextAngle = Math.atan2(ny2 - ny1, nx2 - nx1) * (180 / Math.PI);
            angle = angle + (nextAngle - angle) * ratio;
          }
          setArrowPos({ x, y, angle });
          break;
        } else {
          remaining -= segmentLengths[i];
        }
      }
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration,
          useNativeDriver: false,
          easing: Easing.linear,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        })
      ])
    ).start();

    return () => progress.removeListener(listenerId);
  }, [points, segmentLengths, totalLength, progress, duration]);

  const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
  const arrowPoints = '0,-6 12,0 0,6'; // triangle arrow

  return (
    <Svg height="100%" width="100%" style={styles.overlay}>
      {/* Path */}
      <Polyline
        points={points.map(p => p.join(',')).join(' ')}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Points */}
      {points.map(([x, y], idx) => (
        <Circle key={idx} cx={x} cy={y} r={6} fill="green" />
      ))}

      {/* Animated arrow */}
      <AnimatedPolygon
        points={arrowPoints}
        fill={arrowColor}
        originX={6} // center for rotation
        originY={0}
        transform={[
          { translateX: arrowPos.x },
          { translateY: arrowPos.y },
          { rotate: `${arrowPos.angle}deg` },
        ]}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
