import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../providers/auth';
import { useDataProvider } from '../../providers/app';
import { Slider, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createPIT, handler } from '../../services/pit';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default CreatePIT = ({ route, navigation }) => {
  const { state } = useAuth();
  const { axis } = useDataProvider();
  const { year } = route.params;
  const regime = state.user.regime;
  const [inputRegime, setInputRegime] = useState(0);
  const [pit, setPit] = useState(
    axis.reduce((acc, eixo) => {
      acc[eixo.ref] = 0;
      return acc;
    }, {}),
  );
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showPicker = () => {
    setShow(true);
  };
  // const [open, setOpen] = useState(false);
  // const [value, setValue] = useState(null);
  // const [items, setItems] = useState([
  //   { label: 'Apple', value: 'apple' },
  //   { label: 'Banana', value: 'banana' },
  // ]);
  useEffect(() => {
    const sumRegime = Object.values(pit).reduce((sum, valor) => sum + valor, 0);
    setInputRegime(sumRegime);
  }, [pit]);

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

      createPIT({ ...pit, dt_inicial: dt_inicial, dt_final: dt_final });
      navigation.navigate('PITScreen');
    } catch (e) {
      throw handler(e);
    }
  };

  return (
    <>
      {axis && (
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.subtitle}>
              Defina as horas e atividades do seu Plano de Trabalho {year}
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
          <View style={styles.InputContainer}>
            <Button title="Enviar PIT" onPress={submitPit} />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 20,
    padding: 10,
  },
  InputContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
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
    flexDirection: 'row',
    marginTop: 20,
  },
  dateInputLabel: {
    fontSize: 18,
    alignSelf: 'center',
    marginRight: 10,
  },
});
