import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {HomeScreen} from '../screens/HomeScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {LoginScreen} from '../screens/LoginScreen';
import {ProjectsScreen} from '../screens/ProjectsScreen';
import {NewProjectScreen} from '../screens/NewProjectScreen';
import {ProjectScreen} from '../screens/ProjectScreen';

const Stack = createStackNavigator();

export const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{title: 'Log In', headerShown: false}}
      />

      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Create Account',
          headerStyle: {backgroundColor: '#28303B'},
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Stack.Screen
        name="ProjectsScreen"
        component={ProjectsScreen}
        options={{title: 'Projects', headerShown: false}}
      />

      <Stack.Screen
        name="NewProjectScreen"
        component={NewProjectScreen}
        options={{title: 'New Project', headerShown: false}}
      />

      <Stack.Screen
        name="ProjectScreen"
        component={ProjectScreen}
        options={({route}) => ({title: route.params.name})}
      />
    </Stack.Navigator>
  );
};
