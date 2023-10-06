import React from "react";
import { View, Text } from "react-native";
import { MODE_MAPPING } from "../../constants/TravelModes";
import Styles from "./styles";

interface TravelModelLabelProps {
  size?: number;
  opacity?: number;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  useIcon?: boolean;
  useLabel?: boolean;
  mode: keyof typeof MODE_MAPPING;
}

const TravelModelLabel = ({
  color,
  opacity = 0.8,
  fontSize = 25,
  fontFamily,
  useIcon = true,
  useLabel = true,
  mode,
}: TravelModelLabelProps) => {
  const props = {
    color,
    opacity,
    fontSize,
    fontFamily,
    useIcon,
    useLabel,
    mode,
  };

  const styles = Styles(props);

  const travelMode = MODE_MAPPING[mode];

  if (!travelMode) return null;

  return (
    <View style={styles.travelModeLabelContainer}>
      {useIcon ? null : (
        <Text style={styles.travelModeLabelIcon}>{travelMode.icon}</Text>
      )}

      {useLabel ? null : (
        <Text style={styles.travelModeLabelText}>{travelMode.name}</Text>
      )}
    </View>
  );
};

export default TravelModelLabel;
