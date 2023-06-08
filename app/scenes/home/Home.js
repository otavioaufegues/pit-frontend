import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, ListItem, Icon, Avatar } from 'react-native-elements';

import { useAuth } from '../../providers/auth';
import { updateProfile } from '../../services/auth';
import * as api from '../../services/rit';
import styles from '../../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Home({ route, navigation }) {
  const { state, handleLogout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [year, setYear] = useState();
  const [yearValue, setYearValue] = useState();
  const [departmentData, setDepartmentData] = useState();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

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

  useEffect(() => {
    if (years.length > 0) {
      const yearDropdown = years.map((year) => {
        return {
          value: year._id,
          label: year.year,
        };
      });
      setItems(yearDropdown);

      const currentYear = new Date().getFullYear();
      const currentYearObject = years.find((obj) => obj.year === currentYear);
      if (currentYearObject) setYear(currentYearObject._id);
    }
  }, [years]);

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
    <View style={styles.container}>
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
        <Text style={styles.subtitle}>Escolha o ano das atividades</Text>
        <DropDownPicker
          loading={loading}
          open={open}
          value={year}
          items={items}
          setOpen={setOpen}
          setValue={setYear}
          setItems={setItems}
          listMode="MODAL"
          mode="SIMPLE"
          style={styles.dropDownPicker}
          translation={{
            PLACEHOLDER: 'Selecione',
            SEARCH_PLACEHOLDER: 'Buscar Anos...',
            SELECTED_ITEMS_COUNT_TEXT: {
              1: '1 ano selecionado',
              n: '{count} anos selecionados',
            },
            NOTHING_TO_SHOW: 'Nenhuma ano para mostrar',
          }}
          listParentLabelStyle={{
            fontWeight: 'bold',
          }}
          listChildContainerStyle={{
            paddingLeft: 5,
            padding: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
            height: 'auto',
            minHeight: 40,
          }}
          selectedItemContainerStyle={{
            backgroundColor: '#bcbcc3',
            color: '#fff',
          }}
          onChangeValue={(value) => {
            setYearValue(years.find((obj) => obj._id === value));
          }}
        />
      </Card>

      <View style={styles.buttonHomeView}>
        <Button
          title="PIT"
          icon={{
            name: 'tasks',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 10 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
          onPress={() => project(yearValue)}
        />
        <Button
          title="RIT"
          icon={{
            name: 'list-ul',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{
            marginLeft: 10,
          }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
          onPress={() => rit(yearValue._id, yearValue.year)}
        />
        <Button
          title="Resultado"
          icon={{
            name: 'bar-chart',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 5 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
        />
        <Button
          title="Comentários"
          icon={{
            name: 'comments-o',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 5 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
        />
        <Button
          title="Professores"
          icon={{
            name: 'users',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 5 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
        />
        <Button
          title="UFJF"
          icon={{
            name: 'university',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 10 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
          onPress={() => institution()}
        />
        <Button
          title="Evolução"
          icon={{
            name: 'line-chart',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 5 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
          onPress={() => evolution()}
        />
        <Button
          title="Importar"
          icon={{
            name: 'download',
            type: 'font-awesome',
            size: 20,
            color: '#222',
          }}
          iconRight
          iconContainerStyle={{ marginLeft: 5 }}
          titleStyle={styles.buttonHomeTitle}
          buttonStyle={styles.buttonHome}
          containerStyle={styles.buttonHomeContainer}
          onPress={() => importData()}
        />
      </View>
    </View>
  );
}
