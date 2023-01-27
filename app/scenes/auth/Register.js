import React, {useState, useEffect} from 'react';
import {Alert, View, Text, Button, StyleSheet} from 'react-native';

import * as api from '../../services/auth';

import {useForm, useController} from 'react-hook-form';
import {Input} from 'react-native-elements';
import {ErrorText} from '../../components/Shared';
import CTA from '../../components/CTA';
import styles from '../../styles/formsStyles';

export default function Register({navigation}) {
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

  const TextFieldPassword = ({label, name, control, placeholder}) => {
    const {field} = useController({
      control,
      defaultValue: '',
      name,
      rules: {required: true, minLength: 6},
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input onChangeText={field.onChange} value={field.value} placeholder={placeholder} secureTextEntry={true} />
      </View>
    );
  };

  useEffect(() => {
    register('firstName');
    register('lastName');
    register('email');
    register('username');
    register('password');
    register('siape');
  }, [register]);

  const onSubmit = async data => {
    setLoading(true);

    let user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      password: data.password,
      siape: data.siape,
    };

    try {
      let response = await api.register(user);
      setLoading(false);
      Alert.alert('Registration Successful', response.message, [{text: 'OK', onPress: () => navigation.replace('Login')}], {cancelable: false});
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
      <View style={styles.formInput}>
        <ErrorText error={error} />

        <TextField
          control={control}
          name={'firstName'}
          label={'Primeiro nome'}
          placeholder={'Digite seu primeiro nome'}
          onChangeText={text => setValue('firstName', text)}
          aria-invalid={errors.firstName ? 'true' : 'false'}
        />
        {errors.firstName && errors.firstName.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextField
          control={control}
          name={'lastName'}
          label={'Último nome'}
          placeholder={'Digite seu último nome'}
          onChangeText={text => setValue('lastName', text)}
          aria-invalid={errors.lastName ? 'true' : 'false'}
        />
        {errors.lastName && errors.lastName.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextField
          control={control}
          name={'siape'}
          label={'Siape'}
          placeholder={'Digite seu siape'}
          onChangeText={text => setValue('siape', text)}
          aria-invalid={errors.siape ? 'true' : 'false'}
        />
        {errors.siape && errors.siape.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextField
          control={control}
          name={'email'}
          label={'Email'}
          placeholder={'Digite seu email'}
          onChangeText={text => setValue('email', text)}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && errors.email.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextField
          control={control}
          name={'username'}
          label={'Nome de usuário'}
          placeholder={'Digite seu nome de usuário'}
          onChangeText={text => setValue('username', text)}
          aria-invalid={errors.username ? 'true' : 'false'}
        />
        {errors.username && errors.username.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextFieldPassword
          control={control}
          name={'password'}
          label={'Senha'}
          placeholder={'Digite sua senha'}
          onChangeText={text => setValue('password', text)}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && errors.password.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}
        {errors.password && errors.password.type === 'minLength' && <Text style={styles.errorMessages}>Tamanho mínimo é 6 caracteres</Text>}
      </View>
      <View style={styles.actionsButtons}>
        <Button color="#b22d30" onPress={handleSubmit(onSubmit)} title={'Salvar'} />
        <View style={styles.space}></View>
        <Button color="#bdbfc1" onPress={handleSubmit(onCancel)} title={'Cancelar'} />
      </View>
      {/* <CTA title={'Já possui uma conta?'} ctaText={'Login'} onPress={() => navigation.navigate('LoginScreen')} style={{marginTop: 50}} /> */}
    </View>
  );
}
