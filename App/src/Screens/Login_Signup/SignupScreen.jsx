import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../api/client'; // 1. Import our API client

const SignupScreen = ({ navigation, onLogin }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  // const [region, setRegion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // 2. Add state for the password
  const [error, setError] = useState('');       // 3. Add state to display errors

  const handleSignup = async () => {
    setError(''); // Clear previous errors before a new attempt
    const userDetails = {
      name: name,
      mobile_no: mobile,
      age: age ? parseInt(age) : undefined,
      // region_of_commute: region,
      email: email,
      password: password,
    };

    try {
      // 4. Make a POST request to the signup endpoint
      const response = await apiClient.post('/auth/signup', userDetails);

      console.log('Signup successful:', response.data.message);
      
      // 5. If signup succeeds, call onLogin() to enter the main app
      onLogin();

    } catch (err) {
      // 6. If the API call fails, catch the error
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      console.error('Signup failed:', errorMessage);
      setError(errorMessage); // Set the error message to display to the user
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.backButton}>&lt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={require('../../Assets/Profile/avatarLogin.png')}
            style={styles.avatar}
          />

          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} placeholderTextColor="#A9A9A9" />
          <TextInput style={styles.input} placeholder="Mobile" value={mobile} onChangeText={setMobile} placeholderTextColor="#A9A9A9" keyboardType="phone-pad" maxLength={10} />
          <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} placeholderTextColor="#A9A9A9" keyboardType="number-pad" />
          
          {/* <TouchableOpacity style={styles.input} onPress={() => console.log('Open Region Picker!')}>
            <Text style={region ? styles.inputText : styles.placeholderText}>{region || 'Region of daily commute'}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity> */}

          <TextInput style={styles.input} placeholder="Email (optional)" value={email} onChangeText={setEmail} placeholderTextColor="#A9A9A9" keyboardType="email-address" />
          
          {/* 7. Add the new password input field */}
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} placeholderTextColor="#A9A9A9" secureTextEntry />
          
          {/* 8. Conditionally display an error message if one exists */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign up now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 9. Add a style for the error text
const styles = StyleSheet.create({
  // ... your other styles ...
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1',
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
    paddingBottom: 40,
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
    justifyContent: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default SignupScreen;