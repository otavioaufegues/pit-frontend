import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../providers/auth';
import { Slider, Button } from 'react-native-elements';
import { getPIT, handler, removePIT, updatePIT } from '../../services/pit';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MaskInput, { Masks } from 'react-native-mask-input';
// import { formatDate } from '../../helper/formatDate';
// import { getLastDay } from '../../helper/getLastDay';
import { useAsync } from '../../hooks/useAsync';
// import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { useDataProvider } from '../../providers/app';
import DateTimePicker from '@react-native-community/datetimepicker';

export default UpdatePIT = ({ navigation, route }) => {
  const { state } = useAuth();
  const { axis } = useDataProvider();
  const { pitId, year } = route.params;
  const [regime, setRegime] = useState(state.user.regime);
  const [inputRegime, setInputRegime] = useState(0);
  const [date, setDate] = useState();
  const [pit, setPit] = useState(
    axis.reduce((acc, eixo) => {
      acc[eixo.ref] = 0;
      return acc;
    }, {}),
  );
  const [show, setShow] = useState(false);

  // // const isFocused = useIsFocused();
  // useEffect(() => {
  //   if (isFocused) {
  //     execute();
  //   }
  // }, [isFocused]);

  const showPicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const { execute, response, status, error } = useAsync(() => getPIT(pitId));

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
    }
  }, [status]);

  useEffect(() => {
    const sumRegime = Object.values(pit).reduce((sum, valor) => sum + valor, 0);
    setInputRegime(sumRegime);
  }, [pit]);

  // const submitPit = () => {
  //   if (date.length < 10) {
  //     Alert.alert('Atenção', 'Insira a data de início!');
  //     return;
  //   }

  //   if (inputRegime > regime) {
  //     Alert.alert('Atenção', 'Número de horas excedido!');
  //     return;
  //   }

  //   const dt_inicial = formatDate(date);
  //   try {
  //     updatePIT(pitId, {
  //       dt_inicial: dt_inicial,
  //       teaching: teaching,
  //       researching: researching,
  //       extension: extension,
  //       management: management,
  //       leave: false,
  //     });

  //     navigation.navigate('PITScreen');
  //   } catch (e) {
  //     throw handler(e);
  //   }
  // };

  // const removePit = () => {
  //   Alert.alert('Atenção', 'Tem certeza que deseja remover esta versão Pit?', [
  //     {
  //       text: 'Cancelar',
  //     },
  //     {
  //       text: 'Sim',
  //       onPress: () => {
  //         removePIT(pitId);
  //         navigation.navigate('PITScreen');
  //       },
  //     },
  //   ]);
  // };

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
            <Button
              title="Enviar PIT"
              //  onPress={submitPit}
            />
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
