import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, ListItem, Icon, Avatar } from 'react-native-elements';

import { useAuth } from '../../providers/auth';
import { updateProfile } from '../../services/auth';
import * as api from '../../services/rit';
import styles from '../../styles/styles';

export default function Home({ route, navigation }) {
  const { state, handleLogout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [departmentData, setDepartmentData] = useState();

  const user = state.user;

  const getDepartment = async () => {
    try {
      const { data } = await api.getDepartmentUserService(user._id);
      setDepartmentData(data.department);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getYears = async () => {
    try {
      const { data } = await api.getYearsService();
      setYears(data.years);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getYears();
    getDepartment();
  }, [route]);

  const rit = (yearId, year) => {
    navigation.navigate('RITScreen', { yearId: yearId, year: year });
  };

  const institution = () => {
    navigation.navigate('InstitutionScreen');
  };

  const evolution = () => {
    navigation.navigate('ReportEvolutionScreen');
  };

  const importData = () => {
    navigation.navigate('ImportActivityScreen');
  };

  const project = (year) => {
    navigation.navigate('PITScreen', { year: year });
  };

  const updateProfile = () => {
    navigation.navigate('UpdateProfileScreen');
  };

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.viewCard}>
          <View style={styles.viewFirstColumn}>
            <Icon name="person" size={70} />
          </View>
          <Text
            style={styles.textUser}
            onPress={() => updateProfile()}
          >{`${user.firstName} ${user.lastName}`}</Text>

          <View style={styles.viewThirdColumn}>
            <Icon
              name="exit-to-app"
              size={21}
              onPress={() => {
                handleLogout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'LoginScreen' }],
                });
              }}
            />
          </View>
        </View>
        {departmentData && (
          <Text style={styles.text}>{departmentData.name}</Text>
        )}
      </Card>

      <Card>
        <View style={styles.viewSecondColumn}>
          <Button title="UFJF" type="outline" onPress={() => institution()} />
          <Button title="Evolução" type="outline" onPress={() => evolution()} />
          <Button
            title="Importar"
            type="outline"
            onPress={() => importData()}
          />
        </View>
      </Card>

      <Card>
        {years.map((item) => (
          <ListItem bottomDivider key={`itm${item._id}`}>
            <View style={styles.view}>
              <Icon name="event-available" size={21} />
              <Text style={styles.text}>{item.year}</Text>
              <View style={styles.viewListItem}>
                <View style={styles.buttonPitRit}>
                  <Button
                    buttonStyle={{ backgroundColor: '#d48888' }}
                    onPress={() => project(item.year)}
                    title={'PIT'}
                  />
                </View>
                <View style={styles.buttonPitRit}>
                  <Button
                    buttonStyle={{ backgroundColor: '#876c6f' }}
                    onPress={() => rit(item._id, item.year)}
                    title={'RIT'}
                  />
                </View>
                {/* 
                <Icon name="trending-up" size={21} onPress={() => project(item.year)} />
                <Icon name="insights" size={21} onPress={() => rit(item._id, item.year)} /> */}
              </View>
            </View>
          </ListItem>
        ))}
      </Card>
    </ScrollView>
  );
}

// .color1 { #b32c33 };
// .color2 { #d48888 };
// .color3 { #982e35 };
// .color4 { #876c6f };
// .color5 { #bcbcc3 };
