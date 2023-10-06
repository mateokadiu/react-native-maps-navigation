import React, { useMemo } from "react";
import { View, Text } from "react-native";
import Styles from "./styles";
import ManeuverArrow from "../ManeuverArrow/ManeuverArrow";
import ManeuverLabel from "../ManeuverLabel/ManeuverLabel";
import DurationDistanceLabel from "../DurationDistanceLabel/DurationDistanceLabel";

interface DirectionListViewItemProps {
  instructions?: string;
  distance?: object;
  duration?: object;
  maneuver?: object;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  displayTravelMode?: boolean;
}

const DirectionsListViewItem = (props: DirectionListViewItemProps) => {
  const styles = useMemo(() => Styles(props), []);

  return (
    <View style={styles.directionDetailSection}>
      <View style={styles.directionDetailIconContainer}>
        <ManeuverArrow maneuver={props.maneuver} size={24} />
      </View>
      <View style={styles.directionDetailContent}>
        <ManeuverLabel
          fontFamily={props.fontFamily}
          fontFamilyBold={props.fontFamilyBold}
          fontSize={props.fontSize}
          instructions={props.instructions as string}
        />
        <DurationDistanceLabel
          {...props}
          style={{ marginTop: 4 }}
          withTravelModeIcon={props.displayTravelMode}
        />
      </View>
    </View>
  );
};

export default DirectionsListViewItem;
