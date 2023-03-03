import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, Keyboard } from 'react-native';
import { useAuth } from '../../providers/auth';
import { AppContext } from '../../providers/app';
import MaskInput, { Masks } from 'react-native-mask-input';
import { Slider } from 'react-native-elements';
import { createPIT, handler } from '../../services/pit';
import { formatDate } from '../../helper/formatDate';
import { getLastDay } from '../../helper/getLastDay';
import DropDownPicker from 'react-native-dropdown-picker';

export default CreatePIT = ({ navigation }) => {
  const { state, createUser } = useAuth();
  const axis = useContext(AppContext);
  const regime = state.user.regime;
  const [inputRegime, setInputRegime] = useState(0);
  const [date, setDate] = useState('');
  const [pit, setPit] = useState({});

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
    if (date.length < 10) {
      Alert.alert('Atenção', 'Insira a data de início!');
      return;
    }
    if (inputRegime > regime) {
      Alert.alert('Atenção', 'Número de horas excedido!');
      return;
    }
    const dt_inicial = formatDate(date);
    const dt_final = getLastDay(date);
    try {
      createPIT({
        dt_inicial: dt_inicial,
        dt_final: dt_final,
        teaching: teaching,
        researching: researching,
        extension: extension,
        management: management,
        vacation: false,
        leave: false,
      });
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
              Defina as horas e atividades do seu Plano de Trabalho
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
                <Text style={styles.dateInputLabel}>Data de Início: </Text>
                <MaskInput
                  value={date}
                  onChangeText={(masked) => {
                    setDate(masked); // you can use the unmasked value as well
                  }}
                  mask={Masks.DATE_DDMMYYYY}
                  style={styles.dateInput}
                  keyboardType="numeric"
                  // onBlur={Keyboard.dismiss()}
                />
              </View>
            </View>
            {axis.map((elem) => (
              <View style={styles.InputContainer}>
                <Text style={styles.defaultFont}>
                  {elem.name} : {pit[`${elem.ref}`]} Horas
                </Text>
                <Slider
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
  },
});
