import React from 'react';
import { Text } from 'react-native';
import connectTheme from '../../themes';
import { Marker } from 'react-native-maps';
import Styles from './styles';

const RouteMarker = ({
  theme,
  type,
  coordinate,
}: {
  theme: any;
  type: any;
  coordinate: any;
}) => {
  const routeMarkerTheme = connectTheme(theme).Markers[type];
  console.log(theme, 'THEMMEEEEE');

  const styles = Styles(routeMarkerTheme);
  return (
    <Marker coordinate={coordinate}>
      {/* <Text style={styles.markerText}>
        {theme['Markers']['POSITION_DOT']?.icon}
      </Text> */}
    </Marker>
  );
};

export default RouteMarker;
