import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, FormControl, Input, useToast} from 'native-base';

import globalStyles from '../theme/globalStyles';

// apollo
import {gql, useMutation} from '@apollo/client';

const NEW_ACCOUNT = gql`
  mutation createUser($input: UserInput) {
    createUser(input: $input)
  }
`;

export const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // mutation from apollo
  const [createUser] = useMutation(NEW_ACCOUNT);

  // react navigation
  const navigation = useNavigation();
  const toast = useToast();

  // When user create account
  const handleSubmit = () => {
    // empty fields validation
    if (name === '' || email === '' || password === '') {
      //setMessage();
      showMessage('All fields are required');
      return;
    }
    // password almost 6 character
    if (password.length < 6) {
      showMessage('The password must be at least 6 characters');
    }
    // save user
    const result = async () => {
      try {
        const {data} = await createUser({
          variables: {
            input: {
              name,
              email,
              password,
            },
          },
        });

        showMessage(data.createUser);
        navigation.navigate('LoginScreen');
      } catch (error) {
        showMessage(error.message);
      }
    };

    result();
  };

  // show a toast message
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
              placeholder="Name"
              style={styles.bgInput}
              onChangeText={text => setName(text)}
            />
          </View>
          <View style={globalStyles.input}>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              style={styles.bgInput}
              onChangeText={text => setEmail(text)}
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
          <Text style={globalStyles.buttonText}>Create Account</Text>
        </Button>
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
