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
  Alert,
  Image, // Import Image
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker'; // Import the image picker
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportScreen = ({ navigation }) => {
  const [incidentType, setIncidentType] = useState('Bus Breakdown'); // Default value
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // State to hold the selected image
  const [loading, setLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    // This is just a placeholder, in a real app you'd use geolocation
    setLocation('Near Golden Temple, Amritsar');
  }, []);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0]);
      }
    });
  };

  const handleSubmit = async () => {
    if (!description) {
      return Alert.alert('Missing Information', 'Please provide a description of the incident.');
    }
    setLoading(true);
    
    const token = await AsyncStorage.getItem('user_token');
    // We must use FormData to send files
    const formData = new FormData();

    // Append text data
    formData.append('incidentType', incidentType);
    formData.append('location', location);
    formData.append('description', description);

    // Append image data if an image was selected
    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    }

    try {
      await apiClient.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This header is crucial for file uploads
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Report submitted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to submit report:', error.response?.data || error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Report an Accident</Text>
            <View style={{width: 24}} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput style={styles.inputContainer} value={incidentType} onChangeText={setIncidentType} placeholder="Incident Type"/>
          <TextInput style={styles.inputContainer} value={location} onChangeText={setLocation} placeholder="Location"/>
          <TextInput
            style={[styles.inputContainer, styles.descriptionInput]}
            placeholder="Describe the incident..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.sectionTitle}>Upload Media</Text>
          <TouchableOpacity style={styles.mediaUploader} onPress={handleChoosePhoto}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            ) : (
              <>
                <Icon name="cloud-upload-outline" size={30} color="#888" />
                <Text style={styles.uploaderText}>Tap to upload a photo</Text>
                <Text style={styles.optionalText}>Optional</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Add/Update the following styles
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
    },
    descriptionInput: {
        height: 120,
        textAlignVertical: 'top',
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
        minHeight: 150,
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
    imagePreview: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        resizeMode: 'cover',
    },
});

export default ReportScreen;