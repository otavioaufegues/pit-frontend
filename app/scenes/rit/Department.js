import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ListItem, Icon} from 'react-native-elements';
import Loading from './Loading';
import * as api from '../../services/rit';
import styles from '../../styles/styles';

export default function Department({route, navigation}) {
  const {year, yearId} = route.params;
  const [collapsed, setCollapsed] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [usersByDepartment, setUsersByDepartment] = useState([]);

  const getDepartments = async year => {
    try {
      const {data} = await api.getUsersByDepartmentService(year);
      setUsersByDepartment(data.usersByDepartment);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getDepartments(year);
  }, [route]);

  const departmentReport = (year, departmentId) => {
    navigation.navigate('ReportDepartmentScreen', {year: year, departmentId: departmentId});
  };

  const userReport = (year, username, departmentId) => {
    navigation.navigate('ReportUserScreen', {year: year, username: username, departmentId: departmentId});
  };

  const renderItem = (item, index) => (
    <ListItem bottomDivider key={`itm${item._id}`}>
      <Icon color="#bdbfc1" style={styles.iconTeacher} name="person" size={21} />
      <Text style={styles.text}>{item.firstName}</Text>
      <View style={styles.viewListItem}>
        <Icon color="#b22d30" name="insert-chart" size={21} onPress={() => userReport(year, item.username, item.departmentId)} />
      </View>
    </ListItem>
  );

  const renderCategory = (item, index) => (
    <ListItem.Accordion
      key={`acc${index}`}
      isExpanded={!collapsed.has(index)}
      content={
        <>
          <Icon
          color="#b22d30"
            name="home-work"
            size={21}
            onPress={() => {
              if (collapsed.has(index)) {
                collapsed.delete(index);
                setCollapsed(new Set(collapsed));
              } else {
                collapsed.add(index);
                setCollapsed(new Set(collapsed));
              }
            }}
          />

          <ListItem.Content>
            <ListItem.Title style={styles.departmentName}>{item.name}</ListItem.Title>
          </ListItem.Content>
          <Icon color="#b22d30" name="insert-chart" size={21} onPress={() => departmentReport(year, item._id)} />
        </>
      }>
      {item.users.map(renderItem)}
    </ListItem.Accordion>
  );

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>{loading ? <Loading /> : usersByDepartment.map(renderCategory)}</ScrollView>
    </SafeAreaProvider>
  );
}

