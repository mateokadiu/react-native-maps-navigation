import React from "react";
import { View, TouchableOpacity } from "react-native";
import ManeuverArrow from "../ManeuverArrow/ManeuverArrow";
import ManeuverLabel from "../ManeuverLabel/ManeuverLabel";
import Styles from "./styles";
import CloseButton from "../CloseButton/CloseButton";

interface ManeuverViewProps {
  step: any;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  arrowSize?: number;
  arrowColor?: string;
  backgroundColor?: string;
  withCloseButton?: boolean;
  onClose?: any;
  onPress?: any;
  fontColor?: any;
}

const ManeuverView = (props: ManeuverViewProps) => {
  const styles = Styles(props);

  const {
    step,
    arrowColor,
    arrowSize,
    backgroundColor,
    fontColor,
    fontFamily,
    fontFamilyBold,
    fontSize,
    onClose,
    onPress,
    withCloseButton,
  } = props;

  if (!step) return null;

  const maneuver = step.maneuver;

  return (
    <TouchableOpacity style={styles.maneuverView}>
      <View style={styles.maneuverViewArrow}>
        <ManeuverArrow
          size={arrowSize}
          color={arrowColor}
          maneuver={maneuver}
        />
      </View>
      <View style={styles.maneuverViewDirection}>
        <ManeuverLabel {...props} instructions={step.instructions} />
      </View>
      {!withCloseButton ? null : (
        <View style={styles.maneuverClose}>
          <CloseButton onPress={() => onClose && onClose()} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ManeuverView;
