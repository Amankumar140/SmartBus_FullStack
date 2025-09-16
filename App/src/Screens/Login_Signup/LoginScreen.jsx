import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation, onLogin }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility
  const otpInputs = useRef([]);

  const handleGetOtp = () => {
    // In a real app, you'd send an API request here to get OTP
    console.log('Get OTP for:', mobileNumber);
    // For now, let's just simulate showing the OTP input
    setShowOtpInput(true);
    // You'd also start a resend timer here
  };

  const handleLogin = () => {
    const otpValue = otp.join('');
    console.log('Verifying OTP:', otpValue);
    onLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.backButton}>&lt;</Text>{' '}
            {/* Placeholder for back arrow */}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image
            source={require('../../Assets/Profile/avatarLogin.png')} // Make sure this path is correct
            style={styles.avatar}
          />

          <View style={styles.inputGroup}>
            <View style={styles.mobileInputContainer}>
              <Text style={styles.countryCode}>+91 |</Text>
              <TextInput
                style={styles.mobileInput}
                placeholder="Mobile"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              style={styles.getOtpButton}
              onPress={handleGetOtp}
              disabled={mobileNumber.length !== 10}
            >
              <Text style={styles.buttonText}>Get OTP</Text>
            </TouchableOpacity>

            {showOtpInput && (
              <View style={styles.otpSection}>
                <TouchableOpacity
                  onPress={() => console.log('Resend OTP pressed')}
                  style={styles.resendOtpButton}
                >
                  <Text style={styles.resendOtpText}>resend in 30s</Text>
                </TouchableOpacity>

                <Text style={styles.otpLabel}>Enter OTP</Text>
                <View style={styles.otpInputContainer}>
                  {/* For individual boxes, you'd render 6 TextInput components */}
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (otpInputs.current[index] = ref)}
                      style={styles.otpInputBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={text => {
                        const newOtp = [...otp];
                        newOtp[index] = text;
                        setOtp(newOtp);

                        if (text && index < 5) {
                          otpInputs.current[index + 1].focus(); // move to next box
                        }
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        if (
                          nativeEvent.key === 'Backspace' &&
                          !otp[index] &&
                          index > 0
                        ) {
                          otpInputs.current[index - 1].focus(); // move back
                        }
                      }}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={otp.length !== 6}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.signupLinkContainer}>
          <Text style={styles.signupText}>don't have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>&rarr; signup</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1', // Consistent background
  },
  keyboardAvoidingView: {
    flex: 1,
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
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes it circular
    marginBottom: 40,
    backgroundColor: '#E0E0E0', // Placeholder background for avatar
  },
  inputGroup: {
    width: '90%',
    alignItems: 'center',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  countryCode: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: 'bold',
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  getOtpButton: {
    width: '100%',
    backgroundColor: '#8E4DFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  otpSection: {
    width: '100%',
    alignItems: 'center',
  },
  resendOtpButton: {
    alignSelf: 'flex-end', // Aligns to the right
    marginBottom: 20,
    paddingRight: 5, // Small padding for better touch area
  },
  resendOtpText: {
    color: '#8E4DFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  otpLabel: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start', // Aligns to the left
    marginBottom: 10,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distributes boxes evenly
    width: '100%', // Take full width
    marginBottom: 30,
  },
  otpInputBox: {
    width: 45, // Fixed width for each box
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#8E4DFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto', // Pushes to the bottom
    marginBottom: 30,
  },
  signupText: {
    fontSize: 16,
    color: '#555',
  },
  signupLink: {
    fontSize: 16,
    color: '#8E4DFF',
    fontWeight: 'bold',
  },
});
