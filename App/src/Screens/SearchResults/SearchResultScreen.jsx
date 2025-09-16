// src/screens/SearchResultsScreen.jsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // 1. Import Icon
import { buses } from '../../Utils/DummyDataBus';
import BusCard from '../../Components/Buses/BusCard';
import MapViewComponent from '../../Components/Map/MapViewComponent';

// 2. Accept the 'navigation' prop
const SearchResultsScreen = ({ navigation }) => {
  const [selectedBus, setSelectedBus] = useState(null);

  const availableBuses = buses.filter(bus => bus.type === 'available');
  const alternateBuses = buses.filter(bus => bus.type === 'alternate');

  const handleBusSelect = bus => {
    setSelectedBus(bus);
  };

  const openChatbotLink = () => {
    const chatbotUrl = 'https://google.com';
    Linking.openURL(chatbotUrl).catch(err =>
      console.error("Couldn't load page", err),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 3. Add the new Header View */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={{ width: 28 }} />{/* Empty view for spacing */}
      </View>

      {selectedBus && <MapViewComponent selectedBus={selectedBus} />}

      <ScrollView>
        {/* ... The rest of your ScrollView content remains the same ... */}
        <Text style={styles.sectionTitle}>Available Buses</Text>
        {availableBuses.map(bus => (
          <BusCard key={bus.id} bus={bus} onPress={handleBusSelect} />
        ))}
        <Text style={styles.sectionTitle}>Alternate Buses</Text>
        {alternateBuses.map(bus => (
          <BusCard key={bus.id} bus={bus} onPress={handleBusSelect} />
        ))}
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

// 4. Add the new styles for the header
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F4F2F1', // Match container background
  },
  headerTitle: {
    fontSize: 20,
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
    bottom: 90, // Adjusted for the bottom tab bar
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
});

export default SearchResultsScreen;