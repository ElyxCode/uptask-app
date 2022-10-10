import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';

const httpLink = new createHttpLink({
  uri: 'http://192.168.50.9:4000/',
});

const authLink = setContext(async (_, {headers}) => {
  // read token
  const token = await AsyncStorage.getItem('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
// problema al actualizar el cache en apollo al borrar un elemento y actualizar la lista.
// https://medium.com/@dexiouz/fix-cache-data-may-be-lost-when-replacing-the-getallposts-field-of-a-query-object-in-apollo-client-7973a87a1b43
const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getTasks: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
});

export default client;
