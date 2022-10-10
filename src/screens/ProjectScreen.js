import React, {useState} from 'react';
import {View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';

import {Button, FormControl, Input, useToast, Text} from 'native-base';

import {Task} from '../components/Task';

import globalStyles from '../theme/globalStyles';

import {gql, useMutation, useQuery} from '@apollo/client';

// create task
const NEW_TASK = gql`
  mutation newTask($input: TaskInput) {
    newTask(input: $input) {
      name
      id
      project
      status
    }
  }
`;

// get project tasks
const GET_TASKS = gql`
  query getTasks($input: ProjectIdInput) {
    getTasks(input: $input) {
      name
      id
      status
    }
  }
`;

export const ProjectScreen = ({route}) => {
  // id project
  const {id: idProject, name} = route.params;

  const toast = useToast();

  const [taskName, setTaskName] = useState('');

  const {data, loading, error} = useQuery(GET_TASKS, {
    variables: {
      input: {
        project: idProject,
      },
    },
  });

  const [newTask] = useMutation(NEW_TASK, {
    update(cache, {data: {newTask}}) {
      const {getTasks} = cache.readQuery({
        query: GET_TASKS,
        variables: {
          input: {
            project: idProject,
          },
        },
      });

      cache.writeQuery({
        query: GET_TASKS,
        variables: {
          input: {
            project: idProject,
          },
        },
        data: {
          getTasks: [...getTasks, newTask],
        },
      });
    },
  });

  if (error) {
    console.log(error);
    return <Text>Error!</Text>;
  }

  // validate and create task
  const handleSubmit = async () => {
    if (taskName === '') {
      showMessage('Task name is required');
      return;
    }

    // save DB
    try {
      const {data} = await newTask({
        variables: {
          input: {
            name: taskName,
            project: idProject,
          },
        },
      });
      showMessage('Task created');
      setTaskName('');
    } catch (error) {
      console.log(error);
      showMessage(error.message);
    }
  };

  const showMessage = message => {
    toast.show({
      description: message,
      duration: 3000,
    });
  };

  return (
    <View style={[globalStyles.container, {backgroundColor: '#E84347'}]}>
      <View style={{marginTop: 20, marginHorizontal: '2.5%'}}>
        <FormControl>
          <View style={globalStyles.input}>
            <Input
              placeholder="Task name"
              style={styles.bgInput}
              onChangeText={text => setTaskName(text)}
              value={taskName}
            />
          </View>
        </FormControl>

        <Button style={globalStyles.button} onPress={() => handleSubmit()}>
          <Text style={globalStyles.buttonText}>Create Task</Text>
        </Button>
        <Text style={globalStyles.subTitle}>Tasks: {name}</Text>
        <View style={{marginTop: 20}}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <FlatList
              data={data.getTasks}
              renderItem={({item}) => (
                <Task item={item} idProject={idProject} />
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
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
  containerList: {
    backgroundColor: '#FFF',
    marginHorizontal: '2.5%',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#aeaeae',
  },
});
