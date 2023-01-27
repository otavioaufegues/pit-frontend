import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {Card, ListItem, Icon} from 'react-native-elements';

import styles from '../../styles/styles';
import * as api from '../../services/rit';

export default function Institution({route, navigation}) {
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);

  const getYears = async () => {
    try {
      const {data} = await api.getYearsService();
      setYears(data.years);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getYears();
  }, [route]);

  const department = (yearId, year) => {
    navigation.navigate('DepartmentScreen', {yearId: yearId, year: year});
  };

  return (
    <View style={styles.container}>
      <Card>
        {years.map(item => (
          <ListItem bottomDivider key={`itm${item._id}`}>
            <View style={styles.view}>
              <Icon style={styles.iconDate} name="event-available" size={21} />
              <Text style={styles.text}>{item.year}</Text>
              <View style={styles.viewListItem}>
                <Icon name="trending-up" size={21} onPress={() => project(item._id)} />
                <Icon name="insights" size={21} onPress={() => department(item._id, item.year)} />
              </View>
            </View>
          </ListItem>
        ))}
      </Card>
    </View>
  );
}
