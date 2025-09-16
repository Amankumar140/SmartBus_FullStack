import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notifications } from '../../Utils/Notification';
import NotificationItem from '../../Components/Notification/Notification';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationScreen = () => {
  // To test the empty state, you can use an empty array:
  // const dataToShow = [];
  const dataToShow = notifications;

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="bell-off-outline" size={60} color="#BDBDBD" />
      <Text style={styles.emptyText}>No new notifications</Text>
      <Text style={styles.emptySubText}>
        We'll let you know when something new comes up.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <FlatList
        data={dataToShow}
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
