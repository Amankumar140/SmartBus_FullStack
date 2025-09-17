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
  useColorScheme,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color definitions for light and dark mode
const lightThemeColors = {
  text: '#0d0c0cff',
  placeholder: '#A9A9A9',
  icon: '#333333',
};

const darkThemeColors = {
  text: '#0f0c0cff',
  placeholder: '#8a7b7bff',
  icon: '#0c0b0bff',
};

const ReportScreen = ({ navigation }) => {
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Detect theme
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;

  useEffect(() => {
    // In a real app, you would use a geolocation service here
    setLocation('');
  }, []);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
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
    if (!description || !incidentType || !location) {
      return Alert.alert(
        'Missing Information',
        'Please fill out all fields before submitting.',
      );
    }
    setLoading(true);

    const token = await AsyncStorage.getItem('user_token');
    const formData = new FormData();

    formData.append('incidentType', incidentType);
    formData.append('location', location);
    formData.append('description', description);

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
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Success', 'Report submitted successfully!');
      setIncidentType('');
      setLocation('');
      setDescription('');
      setImage(null);
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
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={theme.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Report an Accident
          </Text>
          <TouchableOpacity onPress={() => console.log('Settings')}>
            <Icon name="cog-outline" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.label, { color: theme.text }]}>
            Incident Type
          </Text>
          <TextInput
            style={[styles.inputContainer, { color: theme.text }]}
            value={incidentType}
            onChangeText={setIncidentType}
            placeholder="e.g., Bus Breakdown, Traffic Jam"
            placeholderTextColor={theme.placeholder}
          />

          <Text style={[styles.label, { color: theme.text }]}>Location</Text>
          <TextInput
            style={[styles.inputContainer, { color: theme.text }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Location of incident"
            placeholderTextColor={theme.placeholder}
          />

          <Text style={[styles.label, { color: theme.text }]}>Description</Text>
          <TextInput
            style={[
              styles.inputContainer,
              styles.descriptionInput,
              { color: theme.text },
            ]}
            placeholder="Describe the incident..."
            placeholderTextColor={theme.placeholder}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Upload Media
          </Text>
          <TouchableOpacity
            style={styles.mediaUploader}
            onPress={handleChoosePhoto}
          >
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
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
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
  },
  scrollContent: {
    padding: 20,
  },
  inputContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
