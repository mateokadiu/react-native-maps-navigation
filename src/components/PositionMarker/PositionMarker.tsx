import React from "react";
import { View, Text } from "react-native";
import { Marker } from "react-native-maps";
import connectTheme from "../../themes";
import { POSITION_DOT, POSITION_ARROW } from "../../constants/MarkerTypes";
import Styles from "./styles";

interface PositionMarkerProps {
  coordinate?: any;
  size?: number;
  fontSize?: number;
  type?: any;
  color?: string;
  angle?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  theme?: any;
}

const PositionMarker = ({
  coordinate,
  size = 40,
  fontSize = 30,
  type = POSITION_DOT,
  color = "#252525",
  angle = 60,
  borderWidth = 0,
  borderColor,
  backgroundColor = "#252525",
  theme,
}: PositionMarkerProps) => {
  const props = {
    coordinate,
    size,
    fontSize,
    type,
    color,
    angle,
    borderWidth,
    borderColor,
    backgroundColor,
    theme,
  };
  const renderArrow = (styles: any) => {
    return (
      <Marker coordinate={coordinate} flat={false}>
        <View style={styles.positionMarkerArrow}>
          <Text style={styles.positionMarkerText}></Text>
        </View>
      </Marker>
    );
  };

  const renderDot = (styles: any) => {
    return (
      <Marker coordinate={coordinate} flat={false}>
        <Text style={styles.positionMarkerText}></Text>
      </Marker>
    );
  };

  if (!coordinate) return null;

  theme = connectTheme(theme).Markers[type];

  const styles = Styles(Object.assign({}, props, theme));

  return type == POSITION_ARROW ? renderArrow(styles) : renderDot(styles);
};

export default PositionMarker;
