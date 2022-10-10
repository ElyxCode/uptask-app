import React from 'react';
import {View, StyleSheet, Pressable, Alert} from 'react-native';
import {Text, useToast} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

// apollo
import {gql, useMutation} from '@apollo/client';

const UPDATE_TASK = gql`
  mutation updateTask($id: ID!, $input: TaskInput, $status: Boolean) {
    updateTask(id: $id, input: $input, status: $status) {
      name
      id
      project
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

const GET_TASKS = gql`
  query getTasks($input: ProjectIdInput) {
    getTasks(input: $input) {
      name
      id
      status
    }
  }
`;

export const Task = ({item, idProject}) => {
  // apollo
  const [updateTask] = useMutation(UPDATE_TASK);

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache) {
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
          getTasks: getTasks.filter(currentTask => currentTask.id !== item.id),
        },
      });
    },
  });

  const toast = useToast();

  // change task status
  const changeTaskStatus = async () => {
    try {
      const {data} = await updateTask({
        variables: {
          id: item.id,
          input: {
            name: item.name,
          },
          status: !item.status,
        },
      });

      showMessage('Task updated');
    } catch (error) {
      console.log(error);
      showMessage(error.message);
    }
  };

  /// delete task
  const showDeleteTask = () => {
    Alert.alert('Uptask', 'Do you want to delete the task?', [
      {
        text: 'Accept',
        onPress: () => deleteTaskDB(),
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  const deleteTaskDB = async () => {
    try {
      const {data} = await deleteTask({
        variables: {
          id: item.id,
        },
      });
      //console.log(data);
      showMessage(data.deleteTask);
    } catch (error) {
      console.log(error.message);
      showMessage(error.message);
    }
  };

  const showMessage = message => {
    toast.show({
      description: message,
      duration: 1000,
    });
  };

  return (
    <Pressable
      onPress={() => changeTaskStatus()}
      onLongPress={() => showDeleteTask()}>
      <View
        style={{
          ...styles.containerList,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text>{item.name}</Text>
        </View>
        <View>
          {item.status ? (
            <Icon
              name="checkmark-circle"
              style={[styles.icon, styles.complete]}
            />
          ) : (
            <Icon
              name="checkmark-circle"
              style={[styles.icon, styles.incomplete]}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
  },
  complete: {
    color: '#5AAB61',
  },
  incomplete: {
    color: '#E1E1E1',
  },
  containerList: {
    backgroundColor: '#FFF',
    marginHorizontal: '2.5%',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#aeaeae',
  },
});
