import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, FormControl, Input, useToast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

import globalStyles from '../theme/globalStyles';

// apollo
import {gql, useMutation} from '@apollo/client';

const AUTH_USER = gql`
  mutation authUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // react navigation
  const navigation = useNavigation();

  const toast = useToast();

  // mutation from apollo
  const [authUser] = useMutation(AUTH_USER);

  const handleSubmit = () => {
    if (email === '' || password === '') {
      showMessage('All fields are required');
      return;
    }

    const result = async () => {
      try {
        const {data} = await authUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        const {token} = data.authUser;

        // save local storage
        await AsyncStorage.setItem('token', token);

        // navigation
        navigation.navigate('ProjectsScreen');
      } catch (error) {
        console.log(error);
        showMessage(error.message);
      }
    };

    result();
  };

  const showMessage = message => {
    toast.show({
      description: message,
      duration: 3000,
    });
  };

  return (
    <View style={[globalStyles.container, styles.bgContainer]}>
      <View style={globalStyles.content}>
        <Text style={globalStyles.title}>UpTask</Text>
        <FormControl>
          <View style={globalStyles.input}>
            <Input
              placeholder="Email"
              style={styles.bgInput}
              onChangeText={text => setEmail(text.toLowerCase())}
              value={email}
              keyboardType="email-address"
            />
          </View>
          <View style={globalStyles.input}>
            <Input
              placeholder="Password"
              secureTextEntry={true}
              style={styles.bgInput}
              onChangeText={text => setPassword(text)}
            />
          </View>
        </FormControl>
        <Button style={globalStyles.button} onPress={() => handleSubmit()}>
          <Text style={globalStyles.buttonText}>Log In</Text>
        </Button>
        <Text
          style={globalStyles.link}
          onPress={() => navigation.navigate('RegisterScreen')}>
          Sign In
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bgContainer: {
    backgroundColor: '#e84347',
  },
  bgInput: {
    backgroundColor: '#FFF',
  },
});
