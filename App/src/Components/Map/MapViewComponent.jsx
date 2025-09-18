import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { io } from 'socket.io-client';
 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '../../api/client';

const MapViewComponent = ({ selectedBus, buses }) => {
  const [busPositions, setBusPositions] = useState(() => {
    const initialPositions = {};
    buses.forEach(bus => {
      initialPositions[String(bus.id)] = bus.coordinate;
    });
    return initialPositions;
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedBus && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...selectedBus.coordinate,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
    }
  }, [selectedBus]);

  useEffect(() => {
    let socket;
    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) return;

      socket = io(SOCKET_URL, { auth: { token } });

      socket.on('bus-location-update', updatedBuses => {
        const newPositions = updatedBuses.reduce((acc, bus) => {
          const [latitude, longitude] = bus.current_location
            .split(',')
            .map(Number);
          acc[String(bus.bus_id)] = { latitude, longitude };
          return acc;
        }, {});
        setBusPositions(prevPositions => ({
          ...prevPositions,
          ...newPositions,
        }));
      });

      socket.on('connect_error', err =>
        console.error('Map socket connection error:', err.message),
      );
    };
    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={
        buses.length > 0
          ? {
              ...buses[0].coordinate,
              latitudeDelta: 0.2, // Zoom out a bit initially
              longitudeDelta: 0.2,
            }
          : undefined
      }
    >
      {buses.map(bus => {
        const currentPosition = busPositions[String(bus.id)];
        if (!currentPosition) return null; // Don't render a marker if we don't have its position

        const isSelected = selectedBus && selectedBus.id === bus.id;
        return (
          <Marker
            key={bus.id}
            identifier={String(bus.id)}
            coordinate={currentPosition}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require('../../Assets/Bus/busMarker.png')} // ✅ replace with your bus icon
                style={isSelected ? styles.busIconSelected : styles.busIcon}
              />
              {isSelected && (
                <View style={styles.etaBubble}>
                  <Text style={styles.etaText}>{bus.eta}</Text>
                </View>
              )}
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 400,
    width: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  busIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  busIconSelected: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  etaBubble: {
    marginTop: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 3,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});

export default MapViewComponent;
