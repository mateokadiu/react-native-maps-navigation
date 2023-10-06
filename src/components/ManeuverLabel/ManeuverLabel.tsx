import React from "react";
import { View, Text } from "react-native";
import Styles from "./styles";

interface ManeuverLabelProps {
  instructions: string;
  fontFamily?: string;
  fontFamilyBold?: string;
  fontSize?: number;
  fontColor?: string;
}

const ManeuverLabel = (props: ManeuverLabelProps) => {
  const getParsedInstructions = (styles: any) => {
    const parts = [];

    const regex = /(\w+)|<(.*?)>(.*?)<\/.*?>/g;

    const mapping = {
      r: styles.regular,
      b: styles.bold,
      d: styles.durationDistance,
      div: styles.extra,
    };

    let m;
    let last = false;
    while ((m = regex.exec(props.instructions))) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
        last = true;
      }

      if (m[2]) {
        let tag = m[2].split(" ")[0] as "r" | "d" | "b" | "div";

        if (tag == "div") m[3] = "\n" + m[3];

        parts.push(
          <Text key={m.index} style={mapping[tag]}>
            {m[3]}
            {last ? "." : " "}
          </Text>
        );
      } else {
        parts.push(
          <Text key={m.index} style={mapping.r}>
            {m[0]}
            {last ? "." : " "}
          </Text>
        );
      }
    }

    return <Text style={{ flexWrap: "wrap", color: "red" }}>{parts}</Text>;
  };

  const styles = Styles(props);

  return (
    <View style={styles.maneuverLabel}>{getParsedInstructions(styles)}</View>
  );
};

export default ManeuverLabel;
