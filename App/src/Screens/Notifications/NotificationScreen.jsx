import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import apiClient from '../../api/client';
import NotificationItem from '../../Components/Notification/Notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_IP_ADDRESS } from '@env'; // You correctly imported this

const getIconForType = (type) => {
  if (!type) return 'information-outline';
  switch (type.toUpperCase()) {
    case 'DELAY_ALERT':
    case 'TEST_ALERT':
      return 'bus-alert';
    case 'PASS_EXPIRY':
      return 'ticket-confirmation-outline';
    case 'PROMOTION':
      return 'gift-outline';
    case 'TICKET_CONFIRM':
      return 'check-circle-outline';
    case 'ROUTE_UPDATE':
      return 'road-variant';
    default:
      return 'information-outline';
  }
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const transformData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    return apiData.map(item => ({
      id: item.notification_id.toString(),
      title: item.message,
      timestamp: new Date(item.sent_at).toLocaleString(),
      read: false,
      icon: getIconForType(item.type),
    }));
  };

  useEffect(() => {
    let socket;

    const connectAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const initialTransformedData = transformData(response.data);
        setNotifications(initialTransformedData);

        // --- THIS IS THE UPDATED LINE ---
        // Use the variable from .env to build the URL
        const socketUrl = `http://${API_IP_ADDRESS}:3001`;
        socket = io(socketUrl, {
          auth: { token },
        });

        socket.on('connect', () => {
          console.log('Connected to WebSocket server!');
        });
        
        socket.on('new_notification', (data) => {
          console.log('Real-time update received:', data);
          const transformedUpdate = transformData(data);
          setNotifications(transformedUpdate);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });

      } catch (error) {
        console.error('Failed to fetch initial notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    connectAndFetch();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bell-off-outline" size={60} color="#BDBDBD" />
      <Text style={styles.emptyText}>No new notifications</Text>
      <Text style={styles.emptySubText}>
        We'll let you know when something new comes up.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8E4DFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmptyList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default NotificationScreen;