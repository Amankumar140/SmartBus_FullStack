// src/components/NotificationItem.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationItem = ({ item }) => {
  // Choose a different background style if the notification is unread
  const containerStyle = item.read
    ? styles.container
    : [styles.container, styles.unreadContainer];

  return (
    <TouchableOpacity style={containerStyle}>
      <Icon name={item.icon} size={28} color="#555" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  unreadContainer: {
    backgroundColor: '#F4F6FF', // A light blue to indicate unread
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default NotificationItem;