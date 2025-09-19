// src/Components/Route/RouteTimelineCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RouteTimelineCard = ({ 
  source, 
  destination, 
  selectedBus, 
  totalStops = 0, 
  estimatedTime = '0 min',
  onPress 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock route stops data
  const routeStops = [
    { id: 1, name: source || 'Start Stop', status: 'completed', eta: 'Departed', time: '09:00 AM' },
    { id: 2, name: 'City Center', status: 'completed', eta: 'Passed', time: '09:15 AM' },
    { id: 3, name: 'Mall Junction', status: 'current', eta: '2 min', time: '09:30 AM' },
    { id: 4, name: 'University Gate', status: 'upcoming', eta: '17 min', time: '09:45 AM' },
    { id: 5, name: 'Hospital Cross', status: 'upcoming', eta: '32 min', time: '10:00 AM' },
    { id: 6, name: 'Industrial Area', status: 'upcoming', eta: '47 min', time: '10:15 AM' },
    { id: 7, name: destination || 'End Stop', status: 'upcoming', eta: '62 min', time: '10:30 AM' },
  ];

  // Calculate progress based on bus status
  const getProgressPercentage = () => {
    const currentIndex = routeStops.findIndex(stop => stop.status === 'current');
    if (currentIndex === -1) return 0;
    return (currentIndex / (routeStops.length - 1)) * 100;
  };

  const progressPercentage = getProgressPercentage();

  useEffect(() => {
    // Start pulse animation for current stop
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
  }, []);

  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (onPress) {
      onPress();
    }
  };

  const getStopIcon = (status) => {
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

  const renderDetailedTimeline = () => {
    return (
      <Animated.View 
        style={[
          styles.expandedContent,
          {
            maxHeight: animatedHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 400],
            }),
            opacity: animatedHeight,
          }
        ]}
      >
        <View style={styles.timelineHeader}>
          <Text style={styles.timelineTitle}>Detailed Timeline</Text>
          <Text style={styles.timelineSubtitle}>
            {routeStops.filter(s => s.status === 'completed').length} of {routeStops.length} completed
          </Text>
        </View>
        
        <ScrollView style={styles.stopsContainer} nestedScrollEnabled={true}>
          {routeStops.map((stop, index) => {
            const isCurrent = stop.status === 'current';
            return (
              <View key={stop.id} style={styles.stopItem}>
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
                      name={getStopIcon(stop.status)}
                      size={isCurrent ? 20 : 18}
                      color={getStopColor(stop.status)}
                    />
                  </Animated.View>
                  {index < routeStops.length - 1 && (
                    <View style={[
                      styles.connectingLine,
                      { backgroundColor: stop.status === 'completed' ? '#4CAF50' : '#E0E0E0' }
                    ]} />
                  )}
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
                  <Text style={styles.stopTime}>{stop.time}</Text>
                  {isCurrent && (
                    <View style={styles.currentIndicator}>
                      <Icon name="location-on" size={12} color="#2196F3" />
                      <Text style={styles.currentText}>Bus approaching</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity 
      style={styles.cardContent}
      onPress={toggleExpansion}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="timeline" size={24} color="#2196F3" />
          <Text style={styles.headerTitle}>Route Timeline</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.estimatedTime}>{estimatedTime}</Text>
          <Icon 
            name={isExpanded ? "expand-less" : "expand-more"} 
            size={24} 
            color="#666" 
          />
        </View>
      </View>

      {/* Route Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.routeInfo}>
          <View style={styles.stopPoint}>
            <View style={[styles.stopDot, styles.sourceDot]} />
            <Text style={styles.stopText} numberOfLines={1}>
              {source || 'Source'}
            </Text>
          </View>
          
          <View style={styles.progressTrack}>
            <View style={styles.progressBackground} />
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
            {selectedBus && selectedBus.status?.toLowerCase() === 'running' && (
              <View style={[styles.busIndicator, { left: `${progressPercentage}%` }]}>
                <Text style={styles.busEmoji}>🚍</Text>
              </View>
            )}
          </View>
          
          <View style={styles.stopPoint}>
            <View style={[styles.stopDot, styles.destinationDot]} />
            <Text style={styles.stopText} numberOfLines={1}>
              {destination || 'Destination'}
            </Text>
          </View>
        </View>
      </View>

      {/* Route Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.statText}>
            {totalStops} stops
          </Text>
        </View>
        
        {selectedBus && (
          <View style={styles.statItem}>
            <Icon name="directions-bus" size={16} color="#666" />
            <Text style={styles.statText}>
              Bus #{selectedBus.bus_number}
            </Text>
          </View>
        )}
        
        <View style={styles.statItem}>
          <Icon name="access-time" size={16} color="#666" />
          <Text style={styles.statText}>
            Live tracking
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      {selectedBus && (
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            selectedBus.status?.toLowerCase() === 'running' ? 
              styles.runningBadge : styles.idleBadge
          ]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>
              {selectedBus.status?.toLowerCase() === 'running' ? 'En Route' : 'At Stop'}
            </Text>
          </View>
        </View>
      )}

      {/* Tap hint */}
      <View style={styles.tapHint}>
        <Text style={styles.tapHintText}>
          {isExpanded ? 'Tap to collapse' : 'Tap to view detailed timeline'}
        </Text>
      </View>
    </TouchableOpacity>
    
    {/* Expandable Timeline Content */}
    {renderDetailedTimeline()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
    marginRight: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopPoint: {
    alignItems: 'center',
    minWidth: 80,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  sourceDot: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  destinationDot: {
    backgroundColor: '#FF5722',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  stopText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    marginHorizontal: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  busIndicator: {
    position: 'absolute',
    top: -8,
    transform: [{ translateX: -12 }],
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  busEmoji: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  runningBadge: {
    backgroundColor: '#E8F5E8',
  },
  idleBadge: {
    backgroundColor: '#FFF3E0',
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
  tapHint: {
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  // Expandable timeline styles
  expandedContent: {
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  timelineHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timelineSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  stopsContainer: {
    maxHeight: 300,
  },
  stopItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stopIconContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 24,
  },
  stopIconWrapper: {
    marginBottom: 4,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  stopDetails: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  currentStopName: {
    fontWeight: '600',
    color: '#2196F3',
  },
  stopTime: {
    fontSize: 12,
    color: '#666',
  },
  currentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  currentText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2196F3',
    marginLeft: 4,
  },
});

export default RouteTimelineCard;