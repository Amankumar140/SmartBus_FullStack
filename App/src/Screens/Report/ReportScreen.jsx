import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReportScreen = ({navigation}) => {
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  // Simulate auto-detecting location when the screen loads
  useEffect(() => {
    setTimeout(() => {
      setLocation('Near Golden Temple, Amritsar'); // Placeholder location
    }, 1500); // Simulate a 1.5-second delay
  }, []);

  const handleSubmit = () => {
    const report = { incidentType, location, date, time, description };
     Alert.alert("Submit")
    // Add submission logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report an Accident</Text>
          <TouchableOpacity onPress={() => console.log('Settings')}>
            <Icon name="cog-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Incident Type Picker */}
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => console.log('Open Incident Type Picker')}>
            <Text style={styles.inputText}>
              {incidentType || 'Select Incident Type'}
            </Text>
          </TouchableOpacity>

          {/* Location Input */}
          <TextInput
            style={styles.inputContainer}
            value={location}
            onChangeText={setLocation}
            placeholder="Location (Auto-detecting...)"
          />

          {/* Date & Time Pickers */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.inputContainer, styles.halfInput]}
              onPress={() => console.log('Open Date Picker')}>
              <Text style={styles.inputText}>{date || 'Date'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.inputContainer, styles.halfInput]}
              onPress={() => console.log('Open Time Picker')}>
              <Text style={styles.inputText}>{time || 'Time'}</Text>
            </TouchableOpacity>
          </View>

          {/* Description Input */}
          <TextInput
            style={[styles.inputContainer, styles.descriptionInput]}
            placeholder="Describe the incident..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          {/* Media Uploader */}
          <Text style={styles.sectionTitle}>Upload Media</Text>
          <TouchableOpacity
            style={styles.mediaUploader}
            onPress={() => console.log('Open Image/Video Picker')}>
            <Icon name="cloud-upload-outline" size={30} color="#888" />
            <Text style={styles.uploaderText}>Tap to upload photos or videos</Text>
            <Text style={styles.optionalText}>Optional</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Submit Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    padding: 20,
  },
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top', // Ensures text starts from the top on Android
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  mediaUploader: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDFDFD',
  },
  uploaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  optionalText: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportScreen;