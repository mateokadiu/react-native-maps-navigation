import React from "react";
import { Text } from "react-native";
import Styles from "./styles";
import { DEFAULT_DIRECTION_TYPE } from "../../constants/DirectionTypes";
import NavigationIcons from "../../constants/NavigationIcons";

interface ManeuverArrowProps {
  maneuver?: any;
  size?: number;
  opacity?: number;
  color?: any;
}

const ManeuverArrow = ({
  color = "#000",
  opacity = 1,
  size = 25,
  maneuver,
}: ManeuverArrowProps) => {
  const styles = Styles({ color, opacity, size, maneuver });

  const icon: keyof typeof NavigationIcons =
    maneuver && (maneuver?.name || DEFAULT_DIRECTION_TYPE);
  return <Text style={styles.maneuverArrow}>{NavigationIcons[icon]}</Text>;
};

export default ManeuverArrow;
