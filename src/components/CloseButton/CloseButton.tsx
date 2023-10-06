import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import NavigationIcons from "../../constants/NavigationIcons";

interface CustomButtonProps {
  maneuver?: any;
  size?: number;
  opacity?: number;
  color?: string;
  onPress?: any;
}

const CloseButton = ({
  color = "#000",
  maneuver = undefined,
  opacity = 1,
  size = 25,
  onPress,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={[styles.closeButtonText, { fontSize: size, color, opacity }]}
      >
        {NavigationIcons.close}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButtonText: {
    // fontFamily: "Navigation",
    textAlign: "center",
  },
});

export default CloseButton;
