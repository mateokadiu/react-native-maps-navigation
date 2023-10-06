import React from "react";
import { View, Text, ScrollView } from "react-native";

import DirectionListViewItem from "./item";
import Styles from "./styles";
interface DirectionsListViewProps {
  showOriginDestinationHeader?: boolean;
  route: any;
  fontFamily?: string;
  fontFamilyBold?: string;
  displayTravelMode?: boolean;
}

const DirectionsListView = ({
  showOriginDestinationHeader = true,
  displayTravelMode = false,
  route,
  fontFamily,
  fontFamilyBold,
}: DirectionsListViewProps) => {
  const styles = Styles({
    showOriginDestinationHeader,
    displayTravelMode,
    route,
    fontFamily,
    fontFamilyBold,
  });

  return (
    <ScrollView>
      {!showOriginDestinationHeader && !route ? null : (
        <View style={styles.directionDetailHeader}>
          <View style={styles.directionDetailHeaderSection}>
            <Text style={styles.directionDetailHeaderAddressLabel}>FROM</Text>
            <Text style={styles.directionDetailHeaderAddressText}>
              {route.origin.address}
            </Text>
          </View>
          <View style={styles.directionDetailHeaderSection}>
            <Text style={styles.directionDetailHeaderAddressLabel}>TO</Text>
            <Text style={styles.directionDetailHeaderAddressText}>
              {route.destination.address}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.directionDetailTravel}>
        <Text style={styles.directionDetailTravelDuration}>
          {route.duration.text}
        </Text>
        <Text style={styles.directionDetailTravelDistance}>
          {route.distance.text}
        </Text>
      </View>

      <View style={styles.directionDetailSectionContainer}>
        {route?.steps?.map((step: any, index: number) => (
          <DirectionListViewItem
            showOriginDestinationHeader={showOriginDestinationHeader}
            route={route}
            fontFamily={fontFamily}
            fontFamilyBold={fontFamilyBold}
            displayTravelMode={displayTravelMode}
            key={index}
            {...step}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default DirectionsListView;
