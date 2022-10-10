import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Button, Text} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import globalStyles from '../theme/globalStyles';

// apollo
import {gql, useQuery} from '@apollo/client';
import {FlatList} from 'react-native-gesture-handler';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const GET_PROJECTS = gql`
  query getProjects {
    getProjects {
      id
      name
    }
  }
`;

export const ProjectsScreen = () => {
  const {data, loading, error} = useQuery(GET_PROJECTS);

  if (error) {
    console.log(error);
    return <Text>Error!</Text>;
  }

  const navigation = useNavigation();

  const renderItemList = ({item}) => {
    return (
      <Pressable onPress={() => navigation.navigate('ProjectScreen', item)}>
        <View style={styles.containerList}>
          <Text>{item.name}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[globalStyles.container, {backgroundColor: '#E84347'}]}>
      <Button
        style={[globalStyles.button, {marginTop: 30}]}
        onPress={() => navigation.navigate('NewProjectScreen')}>
        <Text style={globalStyles.buttonText}>New Proyect</Text>
      </Button>

      <Text style={globalStyles.subTitle}>Select a project</Text>

      <View style={globalStyles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <FlatList
            data={data.getProjects}
            renderItem={renderItemList}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerList: {
    backgroundColor: '#FFF',
    marginHorizontal: '2.5%',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#aeaeae',
  },
});
