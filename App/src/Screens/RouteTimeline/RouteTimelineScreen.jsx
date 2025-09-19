// src/Screens/RouteTimeline/RouteTimelineScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

const { width } = Dimensions.get('window');

const RouteTimelineScreen = ({ navigation, route }) => {
  const { selectedBus, source, destination } = route.params || {};
  
  const [busLocation, setBusLocation] = useState(null);
  const [routeStops, setRouteStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [busStatus, setBusStatus] = useState(selectedBus?.status || 'unknown');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock route stops data - replace with actual API call
  const generateMockStops = () => {
    const mockStops = [
      { id: 1, name: source || 'Start Stop', arrivalTime: '09:00 AM', status: 'completed', distance: 0, eta: 'Departed' },
      { id: 2, name: 'City Center', arrivalTime: '09:15 AM', status: 'completed', distance: 5.2, eta: 'Passed' },
      { id: 3, name: 'Mall Junction', arrivalTime: '09:30 AM', status: 'current', distance: 12.8, eta: '2 min' },
      { id: 4, name: 'University Gate', arrivalTime: '09:45 AM', status: 'upcoming', distance: 18.5, eta: '17 min' },
      { id: 5, name: 'Hospital Cross', arrivalTime: '10:00 AM', status: 'upcoming', distance: 25.1, eta: '32 min' },
      { id: 6, name: 'Industrial Area', arrivalTime: '10:15 AM', status: 'upcoming', distance: 31.7, eta: '47 min' },
      { id: 7, name: destination || 'End Stop', arrivalTime: '10:30 AM', status: 'upcoming', distance: 38.4, eta: '62 min' },
    ];
    
    // Set current stop index based on bus progress
    const currentIndex = mockStops.findIndex(stop => stop.status === 'current');
    setCurrentStopIndex(currentIndex >= 0 ? currentIndex : 0);
    
    return mockStops;
  };

  useEffect(() => {
    loadRouteData();
    startPulseAnimation();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshBusLocation();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadRouteData = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API calls
      const stops = generateMockStops();
      setRouteStops(stops);
      
      // Simulate bus location update
      setBusLocation({
        latitude: 30.7333 + (Math.random() - 0.5) * 0.01,
        longitude: 76.7794 + (Math.random() - 0.5) * 0.01,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('Failed to load route data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshBusLocation = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    try {
      // Simulate API call to get latest bus location
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update ETA times (simulate real-time updates)
      setRouteStops(prevStops => 
        prevStops.map(stop => {
          if (stop.status === 'upcoming') {
            const currentEta = parseInt(stop.eta);
            if (!isNaN(currentEta) && currentEta > 0) {
              return { ...stop, eta: `${Math.max(0, currentEta - 1)} min` };
            }
          }
          return stop;
        })
      );
      
      // Update bus location
      setBusLocation(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        timestamp: new Date().toISOString(),
      }));
      
    } catch (error) {
      console.error('Failed to refresh bus location:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStopIcon = (status, index) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'current':
        return 'radio-button-checked';
      case 'upcoming':
        return 'radio-button-unchecked';
      default:
        return 'radio-button-unchecked';
    }
  };

  const getStopColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'current':
        return '#2196F3';
      case 'upcoming':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const renderProgressLine = (index, status) => {
    if (index === routeStops.length - 1) return null;
    
    return (
      <View style={styles.progressLineContainer}>
        <View
          style={[
            styles.progressLine,
            {
              backgroundColor: status === 'completed' || 
                (status === 'current' && index < currentStopIndex) 
                ? '#4CAF50' : '#E0E0E0'
            }
          ]}
        />
      </View>
    );
  };

  const renderStopItem = (stop, index) => {
    const isCurrent = stop.status === 'current';
    
    return (
      <View key={stop.id} style={styles.stopItemContainer}>
        <View style={styles.stopItem}>
          <View style={styles.stopIconContainer}>
            <Animated.View
              style={[
                styles.stopIconWrapper,
                isCurrent && {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              <Icon
                name={getStopIcon(stop.status, index)}
                size={isCurrent ? 28 : 24}
                color={getStopColor(stop.status)}
              />
            </Animated.View>
            {renderProgressLine(index, stop.status)}
          </View>
          
          <View style={styles.stopDetails}>
            <View style={styles.stopHeader}>
              <Text style={[
                styles.stopName,
                isCurrent && styles.currentStopName
              ]}>
                {stop.name}
              </Text>
              <Text style={[
                styles.stopEta,
                { color: getStopColor(stop.status) }
              ]}>
                {stop.eta}
              </Text>
            </View>
            
            <View style={styles.stopMeta}>
              <View style={styles.metaItem}>
                <Icon name="schedule" size={14} color="#666" />
                <Text style={styles.metaText}>{stop.arrivalTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="straighten" size={14} color="#666" />
                <Text style={styles.metaText}>{stop.distance} km</Text>
              </View>
            </View>
            
            {isCurrent && (
              <View style={styles.currentStopIndicator}>
                <Icon name="location-on" size={16} color="#2196F3" />
                <Text style={styles.currentStopText}>Bus approaching</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading route timeline...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Route Timeline</Text>
          <Text style={styles.headerSubtitle}>
            Bus #{selectedBus?.bus_number || 'N/A'}
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={refreshBusLocation}
          style={styles.refreshButton}
        >
          <Icon name="refresh" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Bus Status Card */}
      <View style={styles.busStatusCard}>
        <View style={styles.busStatusHeader}>
          <View style={styles.busStatusLeft}>
            <Icon name="directions-bus" size={24} color="#2196F3" />
            <Text style={styles.busStatusTitle}>Live Status</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {busStatus === 'active' ? 'En Route' : 'At Stop'}
            </Text>
          </View>
        </View>
        
        <View style={styles.busLocationInfo}>
          <Text style={styles.locationText}>
            Last updated: {busLocation ? 
              new Date(busLocation.timestamp).toLocaleTimeString() : 
              'No data'
            }
          </Text>
        </View>
      </View>

      {/* Timeline */}
      <ScrollView
        style={styles.timelineContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshBusLocation}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>Route Stops</Text>
          <Text style={styles.timelineSubtitle}>
            {routeStops.filter(s => s.status === 'completed').length} of {routeStops.length} completed
          </Text>
        </View>
        
        {routeStops.map((stop, index) => renderStopItem(stop, index))}
        
        <View style={styles.timelineFooter}>
          <Text style={styles.footerText}>
            Pull down to refresh • Auto-updates every 30s
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  refreshButton: {
    padding: 4,
  },
  busStatusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  busLocationInfo: {
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
  },
  timelineContainer: {
    flex: 1,
  },
  timelineHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stopItemContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
  },
  stopItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  stopIconContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 32,
  },
  stopIconWrapper: {
    marginBottom: 8,
  },
  progressLineContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressLine: {
    width: 2,
    height: 40,
  },
  stopDetails: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  currentStopName: {
    fontWeight: '600',
    color: '#2196F3',
  },
  stopEta: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  stopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  currentStopIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  currentStopText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 4,
  },
  timelineFooter: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default RouteTimelineScreen;