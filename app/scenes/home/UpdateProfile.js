import React, {useState, useEffect} from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';

import * as api from '../../services/auth';
import {useAuth} from '../../providers/auth';

import {useForm, useController} from 'react-hook-form';
import {Input} from 'react-native-elements';

import styles from '../../styles/formsStyles';

export default function UpdateProfile(props) {
  const {navigation} = props;

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

  const TextFieldBasic = ({label, name, control, placeholder}) => {
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

  const TextFieldRegime = ({label, name, control, placeholder}) => {
    const {field} = useController({
      control,
      defaultValue: '',
      name,
      rules: {required: true, maxLength: 2},
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input onChangeText={field.onChange} value={field.value} placeholder={placeholder} />
      </View>
    );
  };

  useEffect(() => {
    if (state.user) {
      setValue('firstName', state.user.firstName);
      setValue('lastName', state.user.lastName);
      setValue('regime', String(state.user.regime));
      setValue('username', state.user.username);
      setValue('siape', state.user.siape);
    }
  }, [state.user]);

  useEffect(() => {
    register('firstName');
    register('lastName');
    register('regime');
    register('username');
    register('siape');
  }, [register]);

  const onSubmit = async data => {
    setLoading(true);

    try {
      let response = await api.updateProfile(state.user._id, data);
      updateUser(response.user);

      setLoading(false);

      navigation.goBack();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.view}>
      <View style={styles.formInput}>
        <TextFieldBasic
          control={control}
          name={'firstName'}
          label={'Primeiro nome'}
          onChangeText={text => setValue('firstName', text)}
          aria-invalid={errors.firstName ? 'true' : 'false'}
        />
        {errors.firstName && errors.firstName.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextFieldBasic
          control={control}
          name={'lastName'}
          label={'Sobrenome'}
          onChangeText={text => setValue('lastName', text)}
          aria-invalid={errors.lastName ? 'true' : 'false'}
        />
        {errors.lastName && errors.lastName.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextFieldBasic
          control={control}
          name={'siape'}
          label={'Siape'}
          onChangeText={text => setValue('siape', text)}
          aria-invalid={errors.siape ? 'true' : 'false'}
        />
        {errors.siape && errors.siape.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}

        <TextFieldRegime
          control={control}
          name={'regime'}
          label={'Regime'}
          onChangeText={text => setValue('regime', text)}
          aria-invalid={errors.regime ? 'true' : 'false'}
        />
        {errors.regime && errors.regime.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}
        {errors.regime && errors.regime.type === 'maxLength' && <Text style={styles.errorMessages}>Tamanho máximo excedido</Text>}

        <TextFieldBasic
          control={control}
          name={'username'}
          label={'Nome de usuário'}
          onChangeText={text => setValue('username', text)}
          aria-invalid={errors.username ? 'true' : 'false'}
        />
        {errors.username && errors.username.type === 'required' && <Text style={styles.errorMessages}>Campo obrigatório</Text>}
      </View>
      <View style={styles.actionsButtons}>
        <Button color="#b22d30" onPress={handleSubmit(onSubmit)} title={'Salvar'} />
        <View style={styles.space}></View>
        <Button color="#bdbfc1" onPress={handleSubmit(onCancel)} title={'Cancelar'} />
      </View>
    </View>
  );
}
