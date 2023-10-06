import React from "react";
import {
  DEFAULT_MODES,
  MODE_MAPPING,
  DRIVING,
} from "../../constants/TravelModes";
import OptionGroupBox from "react-native-optiongroup";
import { NavigationIconsFont } from "../../constants/NavigationIcons";

interface TravelModelBoxProps {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  contentPadding?: number;
  inverseTextColor?: string;
  selected?: any;
  defaultValue?: any;
  style?: any;
  onChange?: () => void;
  theme?: string;
  invertKeyLabel?: boolean;
  fontFamily?: string;
  fontSize?: number;
  useIcons?: boolean;
  modes?: any[];
}

const TravelModelBox = ({
  backgroundColor = "transparent",
  borderColor = "#FFFFFF",
  borderWidth = 1,
  borderRadius = 3,
  contentPadding = 10,
  inverseTextColor = "#FFFFFF",
  defaultValue = DRIVING,
  selected,
  style = {},
  onChange,
  theme,
  invertKeyLabel = false,
  fontSize = 25,
  fontFamily,
  useIcons = true,
  modes = DEFAULT_MODES,
}: TravelModelBoxProps) => {
  const props = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
    contentPadding,
    inverseTextColor,
    defaultValue,
    selected,
    style,
    onChange,
    theme,
    invertKeyLabel,
    fontSize,
    fontFamily,
    useIcons,
    modes,
  };

  const options: any[] = [];

  modes.map((mode: keyof typeof MODE_MAPPING) => {
    if (MODE_MAPPING[mode]) {
      options.push(MODE_MAPPING[mode]);
    }
  });

  return (
    <OptionGroupBox
      {...props}
      fontFamily={useIcons ? NavigationIconsFont.fontFamily : fontFamily}
      options={options}
      useKeyValue={"mode"}
      useLabelValue={"icon"}
    />
  );
};

export default TravelModelBox;
