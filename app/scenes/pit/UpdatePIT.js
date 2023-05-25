import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../providers/auth';
import { Slider, Button } from 'react-native-elements';
import {
  getDropdownList,
  getPIT,
  handler,
  removePIT,
  updatePIT,
} from '../../services/pit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAsync } from '../../hooks/useAsync';
import moment from 'moment';
import { useDataProvider } from '../../providers/app';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

export default UpdatePIT = ({ navigation, route }) => {
  const { state } = useAuth();
  const { axis } = useDataProvider();
  const { pitId, year } = route.params;
  const [regime, setRegime] = useState(state.user.regime);
  const [inputRegime, setInputRegime] = useState(0);
  const [pit, setPit] = useState(
    axis.reduce((acc, eixo) => {
      acc[eixo.ref] = 0;
      return acc;
    }, {}),
  );

  const [date, setDate] = useState();
  const [show, setShow] = useState(false);

  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [items, setItems] = useState([]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showPicker = () => {
    setShow(true);
  };

  const { response, status } = useAsync(() => getPIT(pitId));

  const { response: responseDropdownList, status: statusDropdownList } =
    useAsync(() => getDropdownList());

  useEffect(() => {
    if (status === 'success') {
      const dt = new Date(response.data.pit.dt_inicial);
      setDate(dt);
      const keysToExtract = axis.map((obj) => obj.ref);
      const extractedValues = Object.fromEntries(
        Object.entries(response.data.pit).filter(([key, value]) =>
          keysToExtract.includes(key),
        ),
      );
      setPit(extractedValues);
      setActivities(response.data.pit.activities);
    }
  }, [status]);

  useEffect(() => {
    const sumRegime = Object.values(pit).reduce((sum, valor) => sum + valor, 0);
    setInputRegime(sumRegime);
  }, [pit]);

  useEffect(() => {
    if (statusDropdownList === 'success') {
      setItems(responseDropdownList.data);
    }
  }, [statusDropdownList]);

  const submitPit = () => {
    try {
      if (inputRegime > regime) {
        Alert.alert('Atenção', 'Número de horas excedido!');
        return;
      }
      if (inputRegime < regime) {
        Alert.alert('Atenção', 'Número de horas insuficiente!');
        return;
      }
      if (!date) {
        Alert.alert('Atenção', 'Escolha uma data de início!');
        return;
      }
      const dt_inicial = moment.utc(date).format('YYYY-MM-DD');
      const dt_final = moment.utc(new Date(year, 11, 31)).format('YYYY-MM-DD');

      updatePIT(pitId, {
        ...pit,
        dt_inicial: dt_inicial,
        dt_final: dt_final,
        activities: activities,
      });
      navigation.navigate('PITScreen');
    } catch (e) {
      throw handler(e);
    }
  };

  const remove = () => {
    Alert.alert('Atenção', 'Tem certeza que deseja remover esta versão Pit?', [
      {
        text: 'Cancelar',
      },
      {
        text: 'Sim',
        onPress: () => {
          removePIT(pitId);
          navigation.navigate('PITScreen');
        },
      },
    ]);
  };

  return (
    <>
      {axis && (
        <ScrollView style={styles.container}>
          <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.subtitle}>
                Defina a data de início do PIT {year}
              </Text>
              <View style={styles.dateContainer}>
                <Text style={styles.dateInputLabel}>
                  Início do plano: {moment.utc(date).format('DD/MM/YYYY')}
                </Text>
                <Button
                  icon={<Icon name="calendar" size={15} color="white" />}
                  title=""
                  onPress={showPicker}
                />
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChange}
                    maximumDate={new Date(year, 11, 31)}
                    minimumDate={new Date(year, 0, 1)}
                  />
                )}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.subtitle}>
                Defina a quantidade de horas do seu PIT {year}
              </Text>
              <View style={styles.InputContainer}>
                <Text style={styles.defaultFont}>
                  Horas distribuídas:{' '}
                  <Text
                    style={
                      inputRegime > regime
                        ? styles.limitColor
                        : styles.defaultFont
                    }
                  >
                    {inputRegime}
                  </Text>
                  /{regime}
                </Text>
              </View>
              {axis.map((elem) => (
                <View key={'v-' + elem.ref} style={styles.InputContainer}>
                  <Text key={'t-' + elem.ref} style={styles.defaultFont}>
                    {elem.name}: {pit[`${elem.ref}`] ?? 0} Horas
                  </Text>
                  <Slider
                    key={'s-' + elem.ref}
                    value={pit[`${elem.ref}`]}
                    maximumValue={elem.limit}
                    minimumValue={0}
                    step={1}
                    onValueChange={(value) => {
                      setPit((prevState) => ({
                        ...prevState,
                        [elem.ref]: value,
                      }));
                    }}
                    thumbStyle={styles.thumbStyle}
                  />
                </View>
              ))}
            </View>
            <View style={styles.section}>
              {statusDropdownList === 'success' && (
                <View>
                  <Text style={styles.subtitle}>
                    Defina as atividades do seu PIT {year}
                  </Text>
                  <DropDownPicker
                    searchable={true}
                    loading={status === 'idle'}
                    open={open}
                    value={activities}
                    items={items}
                    setOpen={setOpen}
                    setValue={setActivities}
                    setItems={setItems}
                    listMode="MODAL"
                    mode="SIMPLE"
                    multiple={true}
                    style={styles.dropDownPicker}
                    translation={{
                      PLACEHOLDER: 'Selecione as atividades do PIT',
                      SEARCH_PLACEHOLDER: 'Buscar atividade...',
                      SELECTED_ITEMS_COUNT_TEXT: {
                        1: '1 atividade selecionada',
                        n: '{count} atividades selecionadas',
                      },
                      NOTHING_TO_SHOW: 'Nenhuma atividade para mostrar',
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
                      backgroundColor: '#d48888',
                    }}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.InputContainer}>
            <Button title="Atualizar PIT" onPress={submitPit} />
            <Button
              title="Excluir PIT"
              onPress={remove}
              buttonStyle={{ backgroundColor: '#d00000' }}
              containerStyle={{
                marginVertical: 10,
              }}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginBottom: 10,
  },
  section: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 5,
  },
  InputContainer: {
    paddingVertical: 5,
  },
  defaultFont: {
    fontSize: 18,
    color: '#000',
  },
  limitColor: {
    color: '#d00000',
  },
  thumbStyle: {
    backgroundColor: '#b32c33',
    height: 25,
    width: 25,
  },
  dateInput: {
    fontSize: 20,
  },
  dateContainer: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  dateInputLabel: {
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 10,
  },
  dropDownPicker: {
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});
