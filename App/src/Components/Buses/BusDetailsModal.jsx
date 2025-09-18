// src/components/Buses/BusDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

const BusDetailsModal = ({ visible, bus, onClose, onTrackBus }) => {
  const [loading, setLoading] = useState(false);
  const [busDetails, setBusDetails] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [realTimeLocation, setRealTimeLocation] = useState(null);

  useEffect(() => {
    if (visible && bus) {
      // Only fetch basic details, skip complex API calls for now
      // fetchBusDetails();
      // fetchRouteStops(); 
      // fetchRealTimeLocation();
      console.log('Bus details modal opened with bus:', bus);
    }
  }, [visible, bus]);

  const fetchBusDetails = async () => {
    if (!bus) return;
    
    const busId = bus.bus_id || bus.id;
    if (!busId) {
      console.log('No valid bus ID found:', bus);
      return;
    }
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) {
        console.log('No token found');
        return;
      }
      
      console.log('Fetching bus details for ID:', busId);
      const response = await apiClient.get(`/buses/${busId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBusDetails(response.data.bus);
    } catch (error) {
      console.error('Error fetching bus details:', error);
      console.log('Bus data causing error:', bus);
      // Don't show alert, just log the error
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteStops = async () => {
    if (!bus) return;
    
    const busId = bus.bus_id || bus.id;
    if (!busId) {
      console.log('No valid bus ID for route stops:', bus);
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) {
        console.log('No token found for route stops');
        return;
      }
      
      console.log('Fetching route stops for bus ID:', busId);
      const response = await apiClient.get(`/buses/${busId}/route`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRouteStops(response.data.stops || []);
    } catch (error) {
      console.error('Error fetching route stops:', error.message);
    }
  };

  const fetchRealTimeLocation = async () => {
    if (!bus) return;
    
    const busId = bus.bus_id || bus.id;
    if (!busId) {
      console.log('No valid bus ID for real-time location:', bus);
      return;
    }
    
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) {
        console.log('No token found for real-time location');
        return;
      }
      
      console.log('Fetching real-time location for bus ID:', busId);
      const response = await apiClient.get(`/buses/${busId}/location`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRealTimeLocation(response.data);
    } catch (error) {
      console.error('Error fetching real-time location:', error.message);
    }
  };

  const handleCallDriver = () => {
    if (busDetails && busDetails.driver_phone) {
      Linking.openURL(`tel:${busDetails.driver_phone}`);
    } else {
      Alert.alert('Unavailable', 'Driver contact information is not available');
    }
  };

  const handleTrackBus = () => {
    if (onTrackBus) {
      onTrackBus(bus);
    }
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#FF5722';
      case 'maintenance': return '#FF9800';
      default: return '#757575';
    }
  };

  if (loading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>Loading bus details...</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  
  // If no bus data, don't show modal
  if (!bus) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Bus #{bus?.bus_number}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bus?.status) }]}>
                <Text style={styles.statusText}>{bus?.status?.toUpperCase()}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Route Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="route" size={20} color="#2196F3" />
                <Text style={styles.sectionTitle}>Route Information</Text>
              </View>
              <View style={styles.routeCard}>
                <Text style={styles.routeName}>
                  {busDetails?.route_name || bus?.route_name || bus?.route || 'Route not assigned'}
                </Text>
                <Text style={styles.routeDistance}>
                  Distance: {busDetails?.distance_km || bus?.distance_km || 'Unknown'} km
                </Text>
                <View style={styles.routePoints}>
                  <View style={styles.routePoint}>
                    <Icon name="my-location" size={16} color="#4CAF50" />
                    <Text style={styles.routePointText}>
                      {busDetails?.start_stop_name || bus?.source_stop || bus?.from || 'Start point'}
                    </Text>
                  </View>
                  <Icon name="arrow-downward" size={16} color="#666" style={styles.routeArrow} />
                  <View style={styles.routePoint}>
                    <Icon name="location-on" size={16} color="#FF5722" />
                    <Text style={styles.routePointText}>
                      {busDetails?.end_stop_name || bus?.destination_stop || bus?.to || 'End point'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Driver Information */}
            {(busDetails?.driver_name || bus?.driver_name) && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="person" size={20} color="#2196F3" />
                  <Text style={styles.sectionTitle}>Driver Information</Text>
                </View>
                <View style={styles.driverCard}>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>
                      {busDetails?.driver_name || bus?.driver_name}
                    </Text>
                    {busDetails?.driver_phone && (
                      <TouchableOpacity onPress={handleCallDriver} style={styles.callButton}>
                        <Icon name="phone" size={16} color="#4CAF50" />
                        <Text style={styles.callButtonText}>Call Driver</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Live Location Status */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="gps-fixed" size={20} color="#2196F3" />
                <Text style={styles.sectionTitle}>Location Status</Text>
              </View>
              <View style={styles.locationCard}>
                {realTimeLocation?.is_live ? (
                  <View style={styles.liveStatus}>
                    <View style={styles.liveIndicator}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>Live Tracking Active</Text>
                    </View>
                    <Text style={styles.locationDetails}>
                      Speed: {realTimeLocation.real_time_location?.speed || '0'} km/h
                    </Text>
                    <Text style={styles.locationDetails}>
                      Last Update: {new Date(realTimeLocation.real_time_location?.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.offlineStatus}>
                    <Icon name="location-off" size={24} color="#FF9800" />
                    <Text style={styles.offlineText}>Live tracking not available</Text>
                    <Text style={styles.offlineSubtext}>
                      Showing last known location
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Route Stops Timeline */}
            {routeStops.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="timeline" size={20} color="#2196F3" />
                  <Text style={styles.sectionTitle}>Route Timeline</Text>
                </View>
                <View style={styles.timelineContainer}>
                  {routeStops.map((stop, index) => (
                    <View key={stop.stop_id} style={styles.timelineItem}>
                      <View style={styles.timelineMarker}>
                        <View style={[
                          styles.timelineDot,
                          index === 0 && styles.timelineStartDot,
                          index === routeStops.length - 1 && styles.timelineEndDot
                        ]} />
                        {index < routeStops.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.stopName}>{stop.stop_name}</Text>
                        <Text style={styles.stopTime}>
                          {stop.arrival_time || `Stop ${stop.stop_order}`}
                        </Text>
                        <Text style={styles.stopLocation}>{stop.location}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Bus Specifications */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="info" size={20} color="#2196F3" />
                <Text style={styles.sectionTitle}>Bus Information</Text>
              </View>
              <View style={styles.specsCard}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Capacity:</Text>
                  <Text style={styles.specValue}>
                    {busDetails?.capacity || bus?.capacity || '50'} passengers
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Bus Number:</Text>
                  <Text style={styles.specValue}>{bus?.bus_number}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Status:</Text>
                  <Text style={[styles.specValue, { color: getStatusColor(bus?.status) }]}>
                    {bus?.status?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            {bus?.status?.toLowerCase() === 'active' && (
              <TouchableOpacity onPress={handleTrackBus} style={styles.trackButton}>
                <Icon name="my-location" size={20} color="white" />
                <Text style={styles.trackButtonText}>Track on Map</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  routeCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routeDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  routePoints: {
    alignItems: 'flex-start',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routePointText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  routeArrow: {
    marginLeft: 8,
    marginVertical: 4,
  },
  driverCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  driverInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  callButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  liveStatus: {
    alignItems: 'flex-start',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  locationDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  offlineStatus: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  offlineText: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
    marginTop: 8,
  },
  offlineSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  timelineStartDot: {
    backgroundColor: '#4CAF50',
  },
  timelineEndDot: {
    backgroundColor: '#FF5722',
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  stopTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  stopLocation: {
    fontSize: 12,
    color: '#999',
  },
  specsCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  trackButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trackButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BusDetailsModal;