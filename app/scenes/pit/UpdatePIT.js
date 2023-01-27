import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, Button, Keyboard } from 'react-native';
import { useAuth } from '../../providers/auth';
import { Input, Slider } from 'react-native-elements';
import {
  createPIT,
  getPIT,
  handler,
  removePIT,
  updatePIT,
} from '../../services/pit';
import MaskInput, { Masks } from 'react-native-mask-input';
import { formatDate } from '../../helper/formatDate';
import { getLastDay } from '../../helper/getLastDay';
import { useAsync } from '../../hooks/useAsync';
import { useIsFocused } from '@react-navigation/native';

export default UpdatePIT = ({ navigation, route }) => {
  const { state, createUser } = useAuth();
  const pitId = route.params.pitId;
  const [regime, setRegime] = useState(state.user.regime);
  const [inputRegime, setInputRegime] = useState(0);
  const [date, setDate] = useState('');
  const [teaching, setTeaching] = useState(0);
  const [researching, setResearching] = useState(0);
  const [extension, setExtension] = useState(0);
  const [management, setManagement] = useState(0);
  const isFocused = useIsFocused();

  const { execute, response, status, error } = useAsync(
    () => getPIT(pitId),
    false,
  );

  useEffect(() => {
    if (isFocused) {
      execute();
    }
  }, [isFocused]);

  useEffect(() => {
    if (status === 'success') {
      setTeaching(response.data.pit.teaching);
      setManagement(response.data.pit.management);
      setExtension(response.data.pit.extension);
      setResearching(response.data.pit.researching);
      const dt = new Date(response.data.pit.dt_inicial);
      setDate(dt.toLocaleDateString('pt-BR', { timeZone: 'UTC' }).toString());
    }
  }, [status]);

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
    try {
      updatePIT(pitId, {
        dt_inicial: dt_inicial,
        teaching: teaching,
        researching: researching,
        extension: extension,
        management: management,
        leave: false,
      });

      navigation.navigate('PITScreen');
    } catch (e) {
      throw handler(e);
    }
  };

  const removePit = () => {
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
      {status === 'pending' && <Text h4>Loading...</Text>}
      {status === 'success' && (
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
                // onBlur={Keyboard.dismiss()}
              />
            </View>

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
            <Text style={styles.defaultFont}>
              Extensão/Inovação: {extension}
            </Text>
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
          <View style={styles.InputContainer}>
            <Button title="Atualizar PIT" onPress={submitPit} />
          </View>

          <Button title="Remover PIT" color="#d00000" onPress={removePit} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 20,
  },

  subtitle: {
    fontSize: 24,
    padding: 10,
    marginBottom: 10,
  },
  InputContainer: {
    marginBottom: 10,
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
