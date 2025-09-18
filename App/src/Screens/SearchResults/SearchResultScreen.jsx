import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BusCard from '../../Components/Buses/BusCard';
import MapViewComponent from '../../Components/Map/MapViewComponent';
import BusPlaceholderImage from '../../Assets/Bus/Bus1.png';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchResultsScreen = ({ navigation, route }) => {
  const { source, destination } = route.params || {};
  
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [alternateBuses, setAlternateBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const transformApiData = (apiBus) => {
    // Gracefully handle cases where current_location might be invalid
    const coords = apiBus.current_location ? apiBus.current_location.split(',').map(Number) : [0, 0];
    const latitude = coords[0] || 0;
    const longitude = coords[1] || 0;
    
    return {
      id: apiBus.bus_id,
      busId: apiBus.bus_number,
      coordinate: { latitude, longitude },
      type: apiBus.status === 'active' ? 'available' : 'alternate',
      eta: '20 mins', // Placeholder
      imageUrl: BusPlaceholderImage,
      changeInfo: apiBus.status !== 'active' ? `Status: ${apiBus.status}` : null,
    };
  };

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      if (!source || !destination) {
        setLoading(false);
        return;
      }
      try {
        const token = await AsyncStorage.getItem('user_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/buses', {
          params: { source, destination },
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformedAvailable = response.data.available.map(transformApiData);
        const transformedAlternate = response.data.alternate.map(transformApiData);

        setAvailableBuses(transformedAvailable);
        setAlternateBuses(transformedAlternate);
      } catch (error) {
        console.error('Failed to fetch buses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [source, destination]);

  const handleBusSelect = bus => {
    setSelectedBus(bus);
  };
  
  const openChatbotLink = () => {
    const chatbotUrl = 'https://google.com';
    Linking.openURL(chatbotUrl).catch(err => console.error("Couldn't load page", err));
  };

  const allBuses = [...availableBuses, ...alternateBuses];

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#8E4DFF" />
        <Text style={styles.loadingText}>Fetching Buses...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${source} to ${destination}`}</Text>
        <View style={{ width: 28 }} />
      </View>
      
      {selectedBus && (
        <MapViewComponent
          selectedBus={selectedBus}
          buses={allBuses}
        />
      )}

      <ScrollView style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>Available Buses</Text>
        {availableBuses.length > 0 ? (
          availableBuses.map(bus => <BusCard key={bus.id} bus={bus} onPress={handleBusSelect} />)
        ) : (
          <Text style={styles.noBusesText}>No direct buses found for this route.</Text>
        )}
        <Text style={styles.sectionTitle}>Alternate Buses</Text>
        {alternateBuses.length > 0 ? (
          alternateBuses.map(bus => <BusCard key={bus.id} bus={bus} onPress={handleBusSelect} />)
        ) : (
          <Text style={styles.noBusesText}>No alternate buses found.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={openChatbotLink}>
        <Image
          source={require('../../Assets/ChatBot/bot.png')}
          style={styles.chatbotIconImage}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F2F1',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F4F2F1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 10,
  },
  chatbotIconImage: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  noBusesText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
    fontSize: 16,
  },
});

export default SearchResultsScreen;