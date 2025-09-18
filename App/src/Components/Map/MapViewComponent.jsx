import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { io } from 'socket.io-client';
 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from '../../api/client';

const MapViewComponent = ({ selectedBus, buses }) => {
  const [busPositions, setBusPositions] = useState(() => {
    const initialPositions = {};
    buses.forEach(bus => {
      if (bus.coordinate) {
        initialPositions[String(bus.bus_id || bus.id)] = bus.coordinate;
      }
    });
    return initialPositions;
  });
  const [isTracking, setIsTracking] = useState(false);

  const mapRef = useRef(null);

  // Animate to selected bus location
  useEffect(() => {
    if (selectedBus && selectedBus.coordinate && mapRef.current) {
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
  
  // Force map to correct region on mount
  useEffect(() => {
    if (mapRef.current && buses.length > 0) {
      setTimeout(() => {
        const correctRegion = {
          latitude: 31.2240, // Phagwara
          longitude: 75.7739,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        };
        mapRef.current.animateToRegion(correctRegion, 2000);
        console.log('Forcing map to Punjab region:', correctRegion);
      }, 1000);
    }
  }, [buses]);

  useEffect(() => {
    let socket;
    const setupSocket = async () => {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) return;

      socket = io(SOCKET_URL, { auth: { token } });

      socket.on('bus-location-update', updatedBuses => {
        console.log('Real-time bus location update received:', updatedBuses);
        setIsTracking(true);
        
        const newPositions = updatedBuses.reduce((acc, bus) => {
          try {
            if (bus.current_location) {
              const coords = bus.current_location.split(',').map(Number);
              if (coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                acc[String(bus.bus_id)] = { 
                  latitude: coords[0], 
                  longitude: coords[1] 
                };
              }
            }
          } catch (error) {
            console.error('Error parsing bus location:', error);
          }
          return acc;
        }, {});
        
        setBusPositions(prevPositions => ({
          ...prevPositions,
          ...newPositions,
        }));
      });

      socket.on('connect', () => {
        console.log('Map socket connected for real-time tracking');
        setIsTracking(true);
      });
      
      socket.on('disconnect', () => {
        console.log('Map socket disconnected');
        setIsTracking(false);
      });
      
      socket.on('connect_error', err => {
        console.error('Map socket connection error:', err.message);
        setIsTracking(false);
      });
    };
    setupSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const getInitialRegion = () => {
    console.log('Getting initial region. Selected bus:', selectedBus);
    console.log('All buses:', buses.length);
    
    if (selectedBus && selectedBus.coordinate) {
      console.log('Using selected bus coordinate:', selectedBus.coordinate);
      return {
        ...selectedBus.coordinate,
        latitudeDelta: 0.05, // Closer zoom for selected bus
        longitudeDelta: 0.05,
      };
    }
    
    const busesWithCoords = buses.filter(bus => bus.coordinate);
    console.log('Buses with coordinates:', busesWithCoords.length);
    
    if (busesWithCoords.length > 0) {
      // Calculate center point of all buses
      const avgLat = busesWithCoords.reduce((sum, bus) => sum + bus.coordinate.latitude, 0) / busesWithCoords.length;
      const avgLng = busesWithCoords.reduce((sum, bus) => sum + bus.coordinate.longitude, 0) / busesWithCoords.length;
      
      console.log('Using calculated center:', { lat: avgLat, lng: avgLng });
      return {
        latitude: avgLat,
        longitude: avgLng,
        latitudeDelta: 0.15, // Wider view to show all buses
        longitudeDelta: 0.15,
      };
    }
    
    // Default to Punjab region to show the route
    console.log('Using default coordinates (Punjab region)');
    return {
      latitude: 31.2240, // Phagwara coordinates (center of route)
      longitude: 75.7739,
      latitudeDelta: 0.5, // Focused view on Punjab
      longitudeDelta: 0.5,
    };
  };

  const initialRegion = getInitialRegion();
  console.log('MapView will use initial region:', initialRegion);
  
  return (
    <View style={styles.container}>
      {isTracking && (
        <View style={styles.trackingIndicator}>
          <View style={styles.trackingDot} />
          <Text style={styles.trackingText}>Live Tracking Active</Text>
        </View>
      )}
      
      <View style={styles.mapInfo}>
        <Text style={styles.mapInfoText}>
          📍 {buses.length} buses | 🇮🇳 Punjab: {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
        </Text>
        {selectedBus && (
          <Text style={styles.selectedBusInfo}>
            📍 Tracking: {selectedBus.bus_number}
          </Text>
        )}
      </View>
      
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        onMapReady={() => console.log('Map is ready!')}
        onRegionChangeComplete={(region) => console.log('Region changed:', region)}
      >
        {buses.map((bus, index) => {
          const busId = String(bus.bus_id || bus.id);
          let currentPosition = busPositions[busId] || bus.coordinate;
          
          // Fallback: ensure bus has valid coordinates
          if (!currentPosition || !currentPosition.latitude || !currentPosition.longitude) {
            console.log(`Using fallback coordinates for bus ${bus.bus_number}`);
            currentPosition = {
              latitude: 31.2240 + (index * 0.01), // Phagwara with small offset
              longitude: 75.7739 + (index * 0.01)
            };
          }
          
          console.log(`✅ Bus ${bus.bus_number} - Position:`, currentPosition);

          const isSelected = selectedBus && (selectedBus.bus_id || selectedBus.id) === (bus.bus_id || bus.id);
          const isActive = bus.status?.toLowerCase() === 'active';
          
          return (
            <Marker
              key={busId}
              identifier={busId}
              coordinate={currentPosition}
              anchor={{ x: 0.5, y: 0.5 }}
              title={`Bus #${bus.bus_number}`}
              description={`${bus.status?.toUpperCase()} • ${bus.route_name || 'Route not assigned'}`}
            >
              <View style={[
                styles.markerContainer,
                isSelected && styles.selectedMarkerContainer
              ]}>
                {/* Bus Icon Background */}
                <View style={[
                  styles.busIconContainer,
                  isActive ? styles.activeBusContainer : styles.inactiveBusContainer,
                  isSelected && styles.selectedBusContainer
                ]}>
                  {/* Fallback: Use emoji if bus image doesn't exist */}
                  <Text style={[
                    styles.busEmoji,
                    isSelected && styles.selectedBusEmoji
                  ]}>
                    🚍
                  </Text>
                </View>
                
                {/* Bus Number Badge */}
                <View style={[
                  styles.busNumberBadge,
                  isActive ? styles.activeBadge : styles.inactiveBadge,
                  isSelected && styles.selectedBadge
                ]}>
                  <Text style={[
                    styles.busNumberText,
                    isSelected && styles.selectedBusNumberText
                  ]}>
                    {bus.bus_number.slice(-4)}
                  </Text>
                </View>
                
                {/* Live Indicator */}
                {isActive && (
                  <View style={styles.liveDot} />
                )}
                
                {/* Info Bubble for Selected Bus */}
                {isSelected && (
                  <View style={styles.infoBubble}>
                    <Text style={styles.infoBubbleText}>
                      {bus.route_name || bus.route || 'Route not assigned'}
                    </Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}
        
        {/* Route Line for Selected Bus */}
        {selectedBus && selectedBus.source_stop && selectedBus.destination_stop && (
          <Polyline
            coordinates={[
              { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh (source)
              { latitude: 31.2240, longitude: 75.7739 }, // Phagwara (current bus location)
              { latitude: 31.3260, longitude: 75.5762 }, // Jalandhar (destination)
            ]}
            strokeColor="#87CEEB" // Sky blue color
            strokeWidth={4}
            lineDashPattern={[10, 5]} // Dashed line pattern
          />
        )}
        
        {/* General Route Line if no bus selected but showing all buses */}
        {!selectedBus && buses.length > 0 && (
          <Polyline
            coordinates={[
              { latitude: 30.7333, longitude: 76.7794 }, // Chandigarh
              { latitude: 31.2240, longitude: 75.7739 }, // Phagwara
              { latitude: 31.3260, longitude: 75.5762 }, // Jalandhar
            ]}
            strokeColor="#87CEEB" // Sky blue color
            strokeWidth={3}
            strokeOpacity={0.7}
            lineDashPattern={[5, 5]} // Lighter dashed pattern
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  map: {
    height: 400,
    width: '100%',
  },
  trackingIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  trackingText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  mapInfo: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  mapInfoText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  selectedBusInfo: {
    fontSize: 11,
    color: '#2196F3',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 2,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarkerContainer: {
    transform: [{ scale: 1.2 }],
  },
  busIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  activeBusContainer: {
    backgroundColor: '#4CAF50',
  },
  inactiveBusContainer: {
    backgroundColor: '#FF5722',
  },
  selectedBusContainer: {
    backgroundColor: '#2196F3',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  busIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  selectedBusIcon: {
    width: 28,
    height: 28,
  },
  busEmoji: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  selectedBusEmoji: {
    fontSize: 24,
  },
  busNumberBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  activeBadge: {
    backgroundColor: '#2E7D32',
  },
  inactiveBadge: {
    backgroundColor: '#D84315',
  },
  selectedBadge: {
    backgroundColor: '#1565C0',
  },
  busNumberText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedBusNumberText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    borderWidth: 1,
    borderColor: 'white',
  },
  infoBubble: {
    marginTop: 8,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoBubbleText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default MapViewComponent;
