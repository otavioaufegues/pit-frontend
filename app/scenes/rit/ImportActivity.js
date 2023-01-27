import React, {useState, useEffect} from 'react';
import {Text, View, Button} from 'react-native';
import {Card} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {useForm, useController} from 'react-hook-form';
import {Input} from 'react-native-elements';
import formsStyles from '../../styles/formsStyles';

import * as api from '../../services/rit';
import styles from '../../styles/styles';

import * as DocumentPicker from 'expo-document-picker';

export default function ImportActivity({navigation, route}) {
  const [docLattes, setDocLattes] = useState();

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
      // rules: {required: true},
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input onChangeText={field.onChange} value={field.value} placeholder={placeholder} />
      </View>
    );
  };

  const TextFieldLattes = ({label, name, control, placeholder}) => {
    const {field} = useController({
      control,
      defaultValue: '',
      name,
      // rules: {required: true},
    });

    return (
      <View>
        <Text>{label}</Text>
        <Input onChangeText={field.onChange} value={field.value} placeholder={placeholder} />
      </View>
    );
  };

  useEffect(() => {
    register('yearNumber');
    register('yearNumberLattes');
  }, [register]);

  const addDetailsActivity = async year => {
    try {
      await api.addDetailsActivityService(year);
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async dataForm => {
    addDetailsActivity(dataForm);
  };

  const onCancel = () => {
    navigation.navigate('HomeScreen');
  };

  const pickDocument = async () => {
    await DocumentPicker.getDocumentAsync({type: '*/*', copyToCacheDirectory: false}).then(response => {
      if (response.type == 'success') setDocLattes(response);
    });
  };

  const onSubmitLattes = async year => {
    const formData = new FormData();
    formData.append('document', docLattes.file, docLattes.name);
    formData.append('yearNumberLattes', year.yearNumberLattes);
    await api.addDetailsActivityLattesService(formData);
  };

  return (
    <SafeAreaProvider style={formsStyles.container}>
      <Card>
        <Card.Title>Importação por SIAPE</Card.Title>
        <Card.Divider />

        <TextField
          control={control}
          name={'yearNumber'}
          label={'Ano'}
          placeholder={'Digite o ano'}
          onChangeText={text => setValue('yearNumber', text)}
          // aria-invalid={errors.yearNumber ? 'true' : 'false'}
        />
        <Button color="#b22d30" onPress={handleSubmit(onSubmit)} title={'Importar'} />
      </Card>

      <Card>
        <Card.Title>Importação Lattes</Card.Title>
        <Card.Divider />

        <TextFieldLattes
          control={control}
          name={'yearNumberLattes'}
          label={'Ano'}
          placeholder={'Digite o ano'}
          onChangeText={text => setValue('yearNumberLattes', text)}
          // aria-invalid={errors.yearNumber ? 'true' : 'false'}
        />
        {/* {errors.yearNumber && errors.yearNumber.type === 'required' && <Text style={formsStyles.errorMessages}>Campo obrigatório</Text>} */}
        <Button color="#bdbfc1" title="Selecione o documento" onPress={pickDocument} />
        <View style={formsStyles.space}></View>
        <Button color="#b22d30" onPress={handleSubmit(onSubmitLattes)} title={'Importar'} />
      </Card>
    </SafeAreaProvider>
  );
}
