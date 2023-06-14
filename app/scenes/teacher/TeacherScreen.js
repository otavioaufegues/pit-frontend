import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListItem, Icon } from 'react-native-elements';
import styles from '../../styles/styles';
import { getTeachers } from '../../services/user';
import Loading from '../rit/Loading';
import { useAsync } from '../../hooks/useAsync';

const TeacherScreen = ({ route, navigation }) => {
  const { year } = route.params;
  const [collapsed, setCollapsed] = useState(new Set());
  const { execute, response, status, error } = useAsync(() => getTeachers());

  const renderTeachers = (item, index) => (
    <ListItem.Accordion
      key={`acc${index}`}
      isExpanded={collapsed.has(index)}
      content={
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            if (collapsed.has(index)) {
              collapsed.delete(index);
              setCollapsed(new Set(collapsed));
            } else {
              collapsed.add(index);
              setCollapsed(new Set(collapsed));
            }
          }}
        >
          <Icon color="#b22d30" name={'person'} size={21} />

          <ListItem.Content>
            <ListItem.Title style={styles.categoryDescription}>
              {item.firstName + '  ' + item.lastName}
            </ListItem.Title>
          </ListItem.Content>
        </TouchableOpacity>
      }
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ResultScreen', {
            year: year,
            user: item,
          })
        }
      >
        <ListItem bottomDivider key={`itm${item._id}`}>
          <Icon
            color="#1B74EC"
            style={styles.iconActivity}
            name="bar-chart"
            size={24}
          />
          <ListItem.Content>
            <ListItem.Title>Ver resultado</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </ListItem.Accordion>
  );

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        {status === 'pending' && <Loading />}
        {status === 'success' && response.data.teachers.map(renderTeachers)}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default TeacherScreen;
