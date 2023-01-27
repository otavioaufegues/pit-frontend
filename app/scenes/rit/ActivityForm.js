import React, {useEffect, useState} from 'react';
import {View, Button, Text, TextInput} from 'react-native';
import {useForm, useController} from 'react-hook-form';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useAuth} from '../../providers/auth';
import * as api from '../../services/rit';
import formsStyles from '../../styles/formsStyles';
// import EditableTable from 'react-native-editable-table';

export default function ActivityForm({route, navigation}) {
  const {categoryDetails, activityId, details, categoryId, description, setLoading, yearId, year} = route.params;
  const [data, setData] = useState();
  const [dataCategory, setDataCategory] = useState();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();
  const {getAuthState} = useAuth();

  const TextField = ({label, name, control, placeholder}) => {
    const {field} = useController({
      control,
      defaultValue: description || '',
      name,
      rules: {required: true},
    });

    return (
      <View>
        <Text>{label}</Text>
        <TextInput multiline={true} numberOfLines={4} onChangeText={field.onChange} value={field.value} placeholder={placeholder} />
      </View>
    );
  };

  const createActivity = async (userId, activity) => {
    try {
      await api.createActivityService(userId, activity);
      setLoading(true);
      navigation.navigate('RITScreen', {activity: activity, year: year});
    } catch (e) {
      console.log(e);
    }
  };

  // const createDetailsActivity = async (activityId, data) => {
  //   try {
  //     const newData = dataCategory.map(function (val) {
  //       return {
  //         key: val[0].value,
  //         value: val[1].value,
  //       };
  //     });

  //     await api.createDetailsActivityService(activityId, newData);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

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

  useEffect(() => {
    register('description');
  }, [register]);

  useEffect(() => {
    if (details != undefined)
      setData(
        Object.entries(details).map(v => [
          {value: v[0], editable: true},
          {value: v[1], editable: true},
        ]),
      );

    if (categoryDetails != undefined)
      setDataCategory(
        Object.entries(categoryDetails).map(v => [
          {value: v[0], editable: true},
          {value: v[1], editable: true},
        ]),
      );
  }, []);

  const onSubmit = async dataForm => {
    const {user} = await getAuthState();

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

  return (
    <View style={formsStyles.view}>
      <View style={formsStyles.formInput}>
        <TextField
          control={control}
          name={'description'}
          label={'Descrição'}
          placeholder={'Digite uma descrição'}
          onChangeText={text => setValue('description', text)}
          aria-invalid={errors.description ? 'true' : 'false'}
        />
        {errors.description && errors.description.type === 'required' && <Text style={formsStyles.errorMessages}>Campo obrigatório</Text>}

        {dataCategory == undefined ? (
          <Text></Text>
        ) : (
          // tela de create
          <Text></Text>
          // <EditableTable
          //   columns={[
          //     {value: 'Chave', input: 'c1', width: 40, sortable: true, reorder: true, editable: false, defaultSort: 'ASC'},
          //     {value: 'Valor', input: 'c2', width: 60, sortable: true, reorder: true, editable: false},
          //   ]}
          //   values={dataCategory}
          //   emptyRows={3}
          //   onCellChange={(value, column, row, unique_id) => {
          //     dataCategory[row][column].value = value;

          //     // if (dataCategory[row][0].value.length === 0 && dataCategory[row][1].value.length === 0) {
          //     //   let arr = [...dataCategory];
          //     //   const a = arr.splice(arr.indexOf(row), 1);
          //     //   setData(arr);
          //     // }
          //   }}
          //   onColumnChange={(value, oldVal, newVal) => {}}
          //   customStyles={{}}
          //   style={formsStyles.table}
          // />
        )}

        {data == undefined ? (
          <Text></Text>
        ) : (
          // tela de update
          <Text></Text>
          // <EditableTable
          //   columns={[
          //     // {value: 'Chave', input: 'c1', width: 40, sortable: true, reorder: true, editable: false, defaultSort: 'ASC'},
          //     // {value: 'Valor', input: 'c2', width: 60, sortable: true, reorder: true, editable: false},
          //     {value: 'Chave', input: 'c1', width: 40, sortable: false, reorder: false, editable: false, defaultSort: 'ASC'},
          //     {value: 'Valor', input: 'c2', width: 60, sortable: false, reorder: false, editable: false},
          //   ]}
          //   values={data}
          //   emptyRows={3}
          //   onCellChange={(value, column, row, unique_id) => {
          //     data[row][column].value = value;

          //     // if (data[row][0].value.length === 0 && data[row][1].value.length === 0) {
          //     // data.splice(row, 1);
          //     // }
          //   }}
          //   customStyles={{}}
          //   style={formsStyles.table}
          // />
        )}
      </View>
      <View style={formsStyles.actionsButtons}>
        <Button color="#b22d30" onPress={handleSubmit(onSubmit)} title={'Salvar'} />
        <View style={formsStyles.space}></View>
        <Button color="#bdbfc1" onPress={handleSubmit(onCancel)} title={'Cancelar'} />
      </View>
    </View>
  );
}
