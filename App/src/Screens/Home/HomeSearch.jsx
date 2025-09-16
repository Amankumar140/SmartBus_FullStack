import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image, // Correctly imported here
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeSearch = ({ navigation }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    if (!source || !destination) {
      alert('Please enter both source and destination.');
      return;
    }
    console.log(`Searching for buses from ${source} to ${destination}`);
    navigation.navigate('SearchResults');
    // Here we would navigate to a results screen with the bus list
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SmartBus</Text>
        {/* Placeholder for a profile icon */}
        <View style={styles.profileIconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={require('../../Assets/Profile/avatarLogin.png')}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Search Card */}
        <View style={styles.searchCard}>
          <Text style={styles.searchTitle}> Where are you going? </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}> FROM </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter source location"
              value={source}
              onChangeText={setSource}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>TO</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination location"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}> Find Buses </Text>
          </TouchableOpacity>
        </View>

        {/* Landing Page Text */}
        <View style={styles.taglineContainer}>
          <Text style={styles.taglineTitle}> Never miss your Bus again </Text>
          <Text style={styles.taglineSubtitle}> Apka Safar Sarthi</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, // Half of width/height to make it a circle
    overflow: 'hidden', // Hides the parts of the image that go outside the circle
    backgroundColor: '#E0E0E0', // Shows a placeholder color if the image fails to load
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#8E4DFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taglineContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  taglineTitle: {
    fontFamily: 'serif',
    fontSize: 26,
    color: '#333',
    textAlign: 'center',
  },
  taglineSubtitle: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeSearch;
