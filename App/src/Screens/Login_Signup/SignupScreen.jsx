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
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import apiClient from '../../api/client';

// 1. Define your colors directly in this file for text and placeholders
const lightThemeColors = {
  text: '#333333',
  placeholder: '#050404ff',
};

const darkThemeColors = {
  text: '#100c0cff',
  placeholder: '#757575',
};

const SignupScreen = ({ navigation, onLogin }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Detect the theme and select the correct color palette
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;

  const handleSignup = async () => {
    setError('');
    setLoading(true);
    const userDetails = {
      name: name,
      mobile_no: mobile,
      age: age ? parseInt(age) : undefined,
      email: email,
      password: password,
    };

    try {
      const response = await apiClient.post('/auth/signup', userDetails);
      console.log('Signup successful:', response.data.message);
      onLogin();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background color is STATIC from the StyleSheet
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            {/* 3. Text color is DYNAMIC */}
            <Text style={ styles.backButton}>&lt;</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={require('../../Assets/Profile/avatarLogin.png')}
            style={styles.avatar}
          />
          {/* 4. Apply dynamic colors to all inputs */}
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Name"
            value={name}
            placeholderTextColor={theme.placeholder}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Mobile"
            value={mobile}
            onChangeText={setMobile}
            placeholderTextColor={theme.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            placeholderTextColor={theme.placeholder}
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email (optional)"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={theme.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={theme.placeholder}
            secureTextEntry
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign up now</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// All background styles are static here
const styles = StyleSheet.create({
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
    elevation: 2,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#8E4DFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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