import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/auth';
import * as api from '../../services/rit';
import formsStyles from '../../styles/formsStyles';
import EditableTable from './components/EditableTable';

export default function ActivityForm({ route, navigation }) {
  const {
    categoryDetails,
    activityId,
    details,
    categoryId,
    description,
    setLoading,
    yearId,
    year,
  } = route.params;
  const [data, setData] = useState();
  const [dataCategory, setDataCategory] = useState();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { getAuthState } = useAuth();

  const createActivity = async (userId, activity) => {
    try {
      await api.createActivityService(userId, activity);
      setLoading(true);
      navigation.navigate('RITScreen', { activity: activity, year: year });
    } catch (e) {
      console.log(e);
    }
  };

  const createDetailsActivity = async (activityId, data) => {
    try {
      const newData = dataCategory.map(function (val) {
        return {
          key: val[0].value,
          value: val[1].value,
        };
      });
      await api.createDetailsActivityService(activityId, newData);
    } catch (e) {
      console.log(e);
    }
  };

  const updateActivity = async (activityId, userId, activity) => {
    try {
      await api.updateActivityService(activityId, userId, activity);
      setLoading(true);
      navigation.navigate('RITScreen', activity);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDetailsActivity = async (activityId, data) => {
    try {
      const newData = data.map(function (val) {
        return {
          key: val[0].value,
          value: val[1].value,
        };
      });
      await api.updateDetailsActivityService(activityId, newData);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (dataForm) => {
    const { user } = await getAuthState();
    let activity = {};
    if (description == undefined) {
      const newData = dataCategory.map(function (val) {
        return {
          key: val[0].value,
          value: val[1].value,
        };
      });
      activity = {
        description: dataForm.description,
        category: categoryId,
        year: yearId,
        newData: newData,
        department: user.department,
      };
      createActivity(user._id, activity);
    } else {
      activity = {
        description: dataForm.description,
      };
      updateActivity(activityId, user._id, activity);
      updateDetailsActivity(activityId, data);
    }
  };

  const onCancel = () => {
    navigation.navigate('RITScreen');
  };

  useEffect(() => {
    register('description');
  }, [register]);

  useEffect(() => {
    if (details != undefined)
      setData(Object.entries(details).map((v) => [v[0], v[1]]));
    if (categoryDetails != undefined)
      setDataCategory(Object.entries(categoryDetails).map((v) => [v[0], v[1]]));
  }, []);

  const TextField = ({ label, name, control, placeholder }) => {
    const { field } = useController({
      control,
      defaultValue: description || '',
      name,
      rules: { required: true },
    });

    return (
      <View>
        <Text>{label}</Text>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={field.onChange}
          value={field.value}
          placeholder={placeholder}
          style={formsStyles.formInput}
        />
      </View>
    );
  };

  const tableColumns = ['Campo', 'Valor'];

  const [tableData, setTableData] = useState([
    ['John', 'Doe'],
    ['Jane', 'Smith'],
    ['Bob', 'Johnson'],
  ]);

  const handleTableDataChange = (newTableData) => {
    setTableData(newTableData);
  };

  return (
    <ScrollView style={formsStyles.container}>
      <TextField
        control={control}
        name={'description'}
        label={'Descrição'}
        placeholder={'Digite uma descrição'}
        onChangeText={(text) => setValue('description', text)}
        aria-invalid={errors.description ? 'true' : 'false'}
      />
      {errors.description && errors.description.type === 'required' && (
        <Text style={formsStyles.errorMessages}>Campo obrigatório</Text>
      )}
      {(dataCategory != undefined) ?? (
        <EditableTable
          data={tableData}
          columns={tableColumns}
          onTableDataChange={handleTableDataChange}
        />
      )}
      {(data != undefined) ?? (
        <EditableTable
          data={tableData}
          columns={tableColumns}
          onTableDataChange={handleTableDataChange}
        />
      )}
      {/* <View style={formsStyles.actionsButtons}>
        <Button
          color="#b22d30"
          onPress={handleSubmit(onSubmit)}
          title={'Salvar'}
        />
        <View style={formsStyles.space}></View>
        <Button
          color="#bdbfc1"
          onPress={handleSubmit(onCancel)}
          title={'Cancelar'}
        />
      </View> */}
    </ScrollView>
  );
}
