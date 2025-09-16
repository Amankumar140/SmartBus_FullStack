import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
   
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = ({navigation, onLogin }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [region, setRegion] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    const userDetails = { name, mobile, age, region, email };
    console.log('Signing up with details:', userDetails);
    onLogin();
    // In a real app, you'd send this data to your backend
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() =>  navigation.navigate("Login")}>
            <Text style={styles.backButton}>&lt;</Text>
          </TouchableOpacity>
        </View>

        {/* ScrollView allows content to scroll when keyboard is open */}
        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={require('../../Assets/Profile/avatarLogin.png')} // Reusing the same asset
            style={styles.avatar}
          />

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            placeholderTextColor="#A9A9A9"
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor="#A9A9A9"
            keyboardType="phone-pad"
            maxLength={10}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            placeholderTextColor="#A9A9A9"
            keyboardType="number-pad"
          />

          {/* This is a placeholder for the Region dropdown */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => console.log('Open Region Picker!')}>
            <Text style={region ? styles.inputText : styles.placeholderText}>
              {region || 'Region of daily commute'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Email (optional)"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#A9A9A9"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign up now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1', // Consistent background
  },
  header: {
    padding: 20,
    alignItems: 'flex-start',
  },
  backButton: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40, // Add padding at the bottom
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    backgroundColor: '#E0E0E0',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'center', // For the dropdown placeholder
  },
  placeholderText: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  inputText: {
    color: '#333',
    fontSize: 16,
  },
  dropdownArrow: {
    position: 'absolute',
    right: 20,
    fontSize: 12,
    color: '#888',
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#8E4DFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen;