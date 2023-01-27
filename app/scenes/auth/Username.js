import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

import * as api from '../../services/auth';
import {useAuth} from '../../providers/auth';

import {useForm, useController} from 'react-hook-form';
import {Input} from 'react-native-elements';
import {ErrorText} from '../../components/Shared';
import styles from '../../styles/formsStyles'

export default function Username({navigation}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {state, updateUser} = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();

  const TextField = ({label, name, control, placeholder}) => {
    const {field} = useController({
      control,
      defaultValue: '',
      name,
      rules: {required: true},
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input onChangeText={field.onChange} value={field.value} placeholder={placeholder} />
      </View>
    );
  };

  useEffect(() => {
    register('username');
  }, [register]);

  async function onSubmit(data) {
    setLoading(true);

    try {
      let response = await api.updateProfile(state.user._id, data.username);
      updateUser(response.user);

      setLoading(false);

      navigation.navigate('HomeScreen');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const onCancel = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.view}>
      <ErrorText error={error} />

      <TextField
        control={control}
        name={'username'}
        label={'Nome de usuário'}
        placeholder={'Digite seu nome de usuário'}
        onChangeText={text => setValue('username', text)}
        aria-invalid={errors.username ? 'true' : 'false'}
      />
      {errors.username && errors.username.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

      <View>
        <Button onPress={handleSubmit(onCancel)} title={'Cancelar'} />
        <Button onPress={handleSubmit(onSubmit)} title={'Salvar'} />
      </View>
    </View>
  );
}

