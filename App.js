import React from 'react';
import 'react-native-gesture-handler';
import {NativeBaseProvider, Root} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {UpTaskApp} from './src/UpTaskApp';
import client from './src/config/apollo';
import {ApolloProvider} from '@apollo/client';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <NativeBaseProvider>
        <NavigationContainer>
          <UpTaskApp />
        </NavigationContainer>
      </NativeBaseProvider>
    </ApolloProvider>
  );
};

export default App;
