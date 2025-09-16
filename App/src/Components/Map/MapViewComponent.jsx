import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// 1. The component now accepts 'selectedBus' as a prop
const MapViewComponent = ({ selectedBus }) => {
  // 2. State is now derived from the prop
  const [busPosition, setBusPosition] = useState(selectedBus.coordinate);
  const [eta, setEta] = useState(parseInt(selectedBus.eta));

  useEffect(() => {
    // This effect runs whenever a NEW bus is selected from the list
    setBusPosition(selectedBus.coordinate);
    setEta(parseInt(selectedBus.eta));

    // This interval simulates the selected bus moving and its ETA changing
    const interval = setInterval(() => {
      setEta(prevEta => (prevEta > 1 ? prevEta - 1 : 0));
      setBusPosition(prevPos => ({
        latitude: prevPos.latitude - 0.001,
        longitude: prevPos.longitude + 0.001,
      }));
    }, 20000); // 3. Update interval is now 20 seconds

    return () => clearInterval(interval);
  }, [selectedBus]); // 4. The effect re-runs if the 'selectedBus' prop changes

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        // The map region now centers on the selected bus
        region={{
          ...busPosition,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={busPosition}>
          <View style={styles.markerContainer}>
            <Text style={styles.busIcon}>🚌</Text>
            <View style={styles.etaBubble}>
              <Text style={styles.etaText}>{eta} min</Text>
            </View>
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Defines the size of the map view on the screen.
  container: {
    marginHorizontal: 12,
    padding: 5,
    backgroundColor: '#fff', // card-like background
    borderRadius: 15, // smooth rounded corners
    borderWidth: 1,
    borderColor: '#e0e0e0', // subtle border
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  map: {
    height: 400,
    width: '100%',
  },
  // A container for our custom marker to center the icon and bubble.
  markerContainer: {
    alignItems: 'center',
  },
  // Makes the bus emoji larger and more visible on the map.
  busIcon: {
    fontSize: 30,
  },
  // Styles for the small white bubble that displays the ETA.
  etaBubble: {
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderColor: '#8E4DFF',
    borderWidth: 1,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  // Styles for the text (e.g., "9 min") inside the ETA bubble.
  etaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MapViewComponent;
