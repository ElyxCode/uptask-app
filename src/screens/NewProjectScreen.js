import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, FormControl, Input, useToast} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import globalStyles from '../theme/globalStyles';

// apollo
import {gql, useMutation} from '@apollo/client';

const NEW_PROJECT = gql`
  mutation newProject($input: ProjectInput) {
    newProject(input: $input) {
      name
      id
    }
  }
`;

/// update cache
const GET_PROJECTS = gql`
  query getProjects {
    getProjects {
      id
      name
    }
  }
`;

export const NewProjectScreen = () => {
  const [projectName, setProjectName] = useState('');

  // apollo
  const [newProject] = useMutation(NEW_PROJECT, {
    update(cache, {data: {newProject}}) {
      const {getProjects} = cache.readQuery({query: GET_PROJECTS});
      cache.writeQuery({
        query: GET_PROJECTS,
        data: {getProjects: getProjects.concat([newProject])},
      });
    },
  });

  const navigation = useNavigation();

  const toast = useToast();

  const handleSubmit = async () => {
    // validate field.
    if (projectName === '') {
      showMessage('Project name is required');
      return;
    }

    try {
      const {data} = await newProject({
        variables: {
          input: {
            name: projectName,
          },
        },
      });

      showMessage('project created successfully');
      setProjectName('');
      navigation.navigate('ProjectsScreen');

      console.log(data);
    } catch (error) {
      console.log(error);
      showMessage(error.message);
    }
  };

  /// save project name in DB.

  const showMessage = message => {
    toast.show({
      description: message,
      duration: 3000,
    });
  };
  return (
    <View style={[globalStyles.container, , {backgroundColor: '#E84347'}]}>
      <View style={globalStyles.content}>
        <Text style={globalStyles.subTitle}>New Project</Text>
        <FormControl>
          <View style={globalStyles.input}>
            <Input
              placeholder="Project name"
              style={styles.bgInput}
              onChangeText={text => setProjectName(text)}
            />
          </View>
        </FormControl>

        <Button
          style={[globalStyles.button, {marginTop: 30}]}
          onPress={() => handleSubmit()}>
          <Text style={globalStyles.buttonText}>Create Proyect</Text>
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
