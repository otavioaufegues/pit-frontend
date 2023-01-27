import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import * as api from '../../services/auth';
import { useAuth } from '../../providers/auth';

import { useForm, useController } from 'react-hook-form';
import { Input, Avatar, Image } from 'react-native-elements';
import { ErrorText } from '../../components/Shared';
import CTA from '../../components/CTA';
import styles from '../../styles/formsStyles';

export default function Login({ navigation }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const TextField = ({ label, name, control, placeholder }) => {
    const { field } = useController({
      control,
      defaultValue: '',
      name,
      rules: { required: true },
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input
          onChangeText={field.onChange}
          value={field.value}
          placeholder={placeholder}
        />
      </View>
    );
  };

  const TextFieldPassword = ({ label, name, control, placeholder }) => {
    const { field } = useController({
      control,
      defaultValue: '',
      name,
      rules: { required: true, minLength: 6 },
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input
          onChangeText={field.onChange}
          value={field.value}
          placeholder={placeholder}
          secureTextEntry={true}
        />
      </View>
    );
  };

  useEffect(() => {
    register('email');
    register('password');
  }, [register]);

  const onSubmit = async (data) => {
    setLoading(true);

    let user = {
      email: data.email,
      password: data.password,
    };

    try {
      let response = await api.login(user);
      await handleLogin(response);

      setLoading(false);

      //check if username is null
      let username = response.user.username !== null;
      if (username) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      } else navigation.replace('UsernameScreen');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.view}>
      <View>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Logo_da_UFJF.png',
          }}
          containerStyle={styles.imageLogin}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>

      <View styles={styles.formLogin}>
        <ErrorText error={error} />
        <TextField
          control={control}
          name={'email'}
          label={'Email'}
          placeholder={'Digite seu email'}
          onChangeText={(text) => setValue('email', text)}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && errors.email.type === 'required' && (
          <Text style={styles.errorMessages}>Campo obrigatório</Text>
        )}

        <TextFieldPassword
          control={control}
          name={'password'}
          label={'Senha'}
          placeholder={'Digite sua senha'}
          onChangeText={(text) => setValue('password', text)}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && errors.password.type === 'required' && (
          <Text style={styles.errorMessages}>Campo obrigatório</Text>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <Text style={styles.errorMessages}>
            Tamanho mínimo é 6 caracteres
          </Text>
        )}

        <View style={styles.loginButton}>
          <Button
            color="#b22d30"
            onPress={handleSubmit(onSubmit)}
            title={'Entrar'}
          />
        </View>

        <CTA
          ctaText={'Esqueceu sua senha?'}
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
          style={{ marginTop: 20 }}
        />

        <CTA
          title={'Ainda não possui uma conta?'}
          ctaText={'Registrar'}
          onPress={() => navigation.navigate('RegisterScreen')}
          style={{ marginTop: 50 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
