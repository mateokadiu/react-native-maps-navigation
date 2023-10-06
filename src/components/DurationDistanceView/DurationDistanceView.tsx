/**
 * @imports
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Styles from "./styles";
import CloseButton from "../CloseButton/CloseButton";

interface DurationDistanceViewProps {
  step: any;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  arrowSize?: number;
  arrowColor?: string;
  withCloseButton?: boolean;
  onClose?: any;
  onPress?: any;
}

const DurationDistanceView = (props: DurationDistanceViewProps) => {
  const styles = Styles(props);

  const step = props.step;

  if (!step) return null;

  return (
    <TouchableOpacity style={styles.durationDistanceView}>
      <View style={styles.durationDistanceContent}>
        <Text>{step.distance ? step.distance.text : ""}</Text>

        <Text>{step.duration ? step.duration.text : ""}</Text>
      </View>
      {!props.withCloseButton ? null : (
        <View style={styles.durationDistanceClose}>
          <CloseButton onPress={() => props.onClose && props.onClose()} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DurationDistanceView;
