import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LandingScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2F1" />

      {/* Main content container stacks elements from the top */}
      <View style={styles.content}>
        <Image
          source={require('../Assets/LandingPage/Punjab.png')}
          style={styles.logo}
        />
        <View style={styles.textSlogan}>
          <Text style={styles.title}>Never miss your Bus again</Text>
          <Text style={styles.subtitle}>Apka Safar Sarthi</Text>
        </View>
        <View style={styles.busIconContainer}>
          <Image
            source={require('../Assets/LandingPage/locationIcon.png')}
            style={styles.busIcon}
          />
        </View>
      </View>

      {/* Background road graphic is positioned absolutely at the bottom */}
      <Image
        source={require('../Assets/LandingPage/Road.png')}
        style={styles.roadImage}
      />

      {/* The button is positioned absolutely to float on top */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.getStartedButtonText}> Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop:40
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 60,      // Pushes the logo down from the top
    marginBottom: 40,   // Creates space below the logo
  },
  textSlogan: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 26,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  busIconContainer: {
    position: 'absolute', // Allows precise positioning
    top: 465,             // Positions it vertically
    right: 40,            // Positions it horizontally
  },
  busIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  roadImage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',       // Takes up the bottom 40% of the screen
    resizeMode: 'stretch',
  },
  getStartedButton: {
    position: 'absolute',
    bottom: 80,          // Positioned a fixed distance from the bottom
    left: '10%',
    width: '80%',
    backgroundColor: '#8E4DFF',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingScreen;