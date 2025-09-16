// src/components/BusCard.jsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const BusCard = ({ bus, onPress }) => {
  return (
    // 2. Call the onPress function when the card is tapped, passing the bus data back
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(bus)}>
      <View style={styles.textContainer}>
        <Text style={styles.busId}>Bus ID: {bus.busId}</Text>
        {bus.changeInfo && (
          <Text style={styles.changeInfo}>{bus.changeInfo}</Text>
        )}
        <Text style={styles.eta}>ETA: {bus.eta}</Text>
      </View>
      <Image source={bus.imageUrl} style={styles.busImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1, // Allows text to take available space
  },
  busId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  changeInfo: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginVertical: 4,
  },
  eta: {
    fontSize: 14,
    color: 'gray',
  },
  busImage: {
    width: 100,
    height: 75,
    borderRadius: 12,
    marginLeft: 10,
  },
});

export default BusCard;
