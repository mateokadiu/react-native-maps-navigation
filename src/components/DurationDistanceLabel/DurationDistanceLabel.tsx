import React from "react";
import { View, Text } from "react-native";

import Styles from "./styles";
import { MODE_MAPPING } from "../../constants/TravelModes";

interface DurationDistanceLabelProps {
  style?: any;
  instructions?: string;
  fontFamily?: string;
  fontSize?: number;
  distance?: any;
  duration?: any;
  opacity?: number;
  withTravelModeIcon?: boolean;
  mode: keyof typeof MODE_MAPPING;
}

const DurationDistanceLabel = (props: DurationDistanceLabelProps) => {
  const {
    distance,
    duration,
    fontFamily,
    fontSize,
    instructions,
    opacity,
    style,
    withTravelModeIcon,
  } = props;

  const styles = Styles(props);

  const travelMode = MODE_MAPPING[props.mode];

  return (
    <Text style={[styles.durationDistanceText, props.style]}>
      {!props.withTravelModeIcon || !travelMode ? null : (
        <Text style={styles.durationDistanceTravelModeIcon}>
          {travelMode.icon}{" "}
        </Text>
      )}
      {distance ? distance.text : ""}
      {duration ? ["  (", duration.text, ")"].join("") : ""}
    </Text>
  );

  return (
    <View>
      <Text>DurationDistanceLabel</Text>
    </View>
  );
};

export default DurationDistanceLabel;
