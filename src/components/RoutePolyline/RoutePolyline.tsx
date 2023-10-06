import React from "react";
import { View, Text } from "react-native";
import { Polyline } from "react-native-maps";
import connectTheme from "../../themes";

const RoutePolyline = ({
  theme,
  type,
  coordinates,
}: {
  theme: any;
  type: any;
  coordinates: any;
}) => {
  const routePolylineTheme = connectTheme(theme).Polylines[type];

  if (!coordinates) return null;

  if (!routePolylineTheme) {
    throw new Error("RoutePolyline does not support type " + type + ".");
  }

  const components = [
    <Polyline
      key={0}
      strokeWidth={routePolylineTheme.strokeWidth}
      strokeColor={routePolylineTheme.strokeColor}
      coordinates={coordinates}
      lineCap={"round"}
    />,
  ];

  if (routePolylineTheme.fillColor) {
    const borderWidth =
      routePolylineTheme.strokeWidth - (routePolylineTheme.borderWidth || 3);

    components.push(
      <Polyline
        key={1}
        strokeWidth={borderWidth}
        strokeColor={routePolylineTheme.fillColor}
        coordinates={coordinates}
        lineCap={"round"}
      />
    );
  }

  return components;
};

export default RoutePolyline;
