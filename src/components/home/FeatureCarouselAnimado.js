import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const CARD_WIDTH = 260;
const SPACING = 15;
const ITEM_SIZE = CARD_WIDTH + SPACING;

export default function FeatureCarousel({ data }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_SIZE}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingLeft: (width - CARD_WIDTH) / 2,
        paddingRight: (width - CARD_WIDTH) / 2, 
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      {data.map((item, index) => {
        const inputRange = [
          (index - 1) * ITEM_SIZE,
          index * ITEM_SIZE,
          (index + 1) * ITEM_SIZE,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1, 0.8],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={{
              transform: [{ scale }],
              opacity,
              width: CARD_WIDTH,
              marginRight: SPACING,
            }}
          >
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#e0f2fe",
    borderRadius: 40,
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#222",
  },
  description: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
  },
});
