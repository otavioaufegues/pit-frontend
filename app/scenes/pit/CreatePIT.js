import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, Keyboard } from 'react-native';
import { useAuth } from '../../providers/auth';
import { Input, Slider } from 'react-native-elements';
import { createPIT, handler } from '../../services/pit';
import MaskInput, { Masks } from 'react-native-mask-input';
import { formatDate } from '../../helper/formatDate';
import { getLastDay } from '../../helper/getLastDay';
import DropDownPicker from 'react-native-dropdown-picker';

export default CreatePIT = ({ navigation }) => {
  const { state, createUser } = useAuth();
  const [regime, setRegime] = useState(state.user.regime);
  const [inputRegime, setInputRegime] = useState(0);
  const [date, setDate] = useState('');
  const [teaching, setTeaching] = useState(0);
  const [researching, setResearching] = useState(0);
  const [extension, setExtension] = useState(0);
  const [management, setManagement] = useState(0);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ]);

  useEffect(() => {
    let sumInput = teaching + researching + extension + management;
    setInputRegime(sumInput);
  }, [teaching, researching, extension, management]);

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
      <View style={styles.container}>
        <Text style={styles.subtitle}>O seu regime é de {regime} horas</Text>
        <View style={styles.InputContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateInputLabel}>Data de Início: </Text>

            <MaskInput
              value={date}
              onChangeText={(masked, unmasked) => {
                setDate(masked); // you can use the unmasked value as well
              }}
              mask={Masks.DATE_DDMMYYYY}
              style={styles.dateInput}
              keyboardType="numeric"
              onBlur={Keyboard.dismiss()}
            />
          </View>

          <View style={styles.InputContainer}>
            <Text style={styles.defaultFont}>
              Horas distribuídas:{' '}
              <Text
                style={
                  inputRegime > regime ? styles.limitColor : styles.defaultFont
                }
              >
                {inputRegime}
              </Text>
              /{regime}
            </Text>
          </View>
        </View>

        <View style={styles.InputContainer}>
          <Text style={styles.defaultFont}>Ensino (Aulas): {teaching}</Text>
          <Slider
            value={teaching}
            maximumValue={16}
            minimumValue={0}
            step={1}
            onValueChange={(value) => {
              setTeaching(value);
            }}
            thumbStyle={styles.thumbStyle}
          />
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.defaultFont}>Pesquisa: {researching}</Text>
          <Slider
            value={researching}
            maximumValue={24}
            minimumValue={0}
            step={1}
            onValueChange={(value) => {
              setResearching(value);
            }}
            thumbStyle={styles.thumbStyle}
          />
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.defaultFont}>Extensão/Inovação: {extension}</Text>
          <Slider
            value={extension}
            maximumValue={16}
            minimumValue={0}
            step={1}
            onValueChange={(value) => {
              setExtension(value);
            }}
            thumbStyle={styles.thumbStyle}
          />
        </View>
        <View style={styles.InputContainer}>
          <Text style={styles.defaultFont}>Gestão: {management}</Text>
          <Slider
            value={management}
            maximumValue={40}
            minimumValue={0}
            step={1}
            onValueChange={(value) => {
              setManagement(value);
            }}
            thumbStyle={styles.thumbStyle}
          />
        </View>

        <DropDownPicker
          multiple={true}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </View>
      <View style={styles.InputContainer}>
        <Button title="Enviar PIT" onPress={submitPit} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
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
    marginBottom: 10,
    marginTop: 10,
  },
  dateInputLabel: {
    fontSize: 18,
    alignSelf: 'center',
  },
});
