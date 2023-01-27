import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, StyleSheet} from 'react-native';

import * as api from '../../services/auth';

import {useForm, useController} from 'react-hook-form';
import {Input} from 'react-native-elements';
import {ErrorText} from '../../components/Shared';

import styles from '../../styles/formsStyles';

export default function ForgotPassword({navigation}) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
    register('email');
  }, [register]);

  const onSubmit = async data => {
    setLoading(true);

    let email = {email: data.email};

    try {
      let response = await api.forgotPassword(email);
      setLoading(false);

      Alert.alert('Recover Password', response.message, [{text: 'OK', onPress: () => navigation.goBack()}], {cancelable: false});
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.view}>
      <ErrorText error={error} />

      <View style={styles.formInput}>
        <TextField
          control={control}
          name={'email'}
          label={'Email'}
          placeholder={'Digite seu email'}
          onChangeText={text => setValue('email', text)}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && errors.email.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}
      </View>

      <View style={styles.actionsButtons}>
        <Button color="#b22d30" onPress={handleSubmit(onSubmit)} title={'Enviar'} />
        <View style={styles.space}></View>
        <Button color="#bdbfc1" onPress={handleSubmit(onCancel)} title={'Cancelar'} />
      </View>
    </View>
  );
}
