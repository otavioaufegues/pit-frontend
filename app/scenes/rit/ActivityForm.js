import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useForm, useController } from 'react-hook-form';
import { useAuth } from '../../providers/auth';
import * as api from '../../services/rit';
import formsStyles from '../../styles/formsStyles';
import EditableTable from './components/EditableTable';
import { useAsync } from '../../hooks/useAsync';
import { getDropdownList } from '../../services/pit';
import { getCategory } from '../../services/rit';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ActivityForm({ route, navigation }) {
  const { activityId, details, description, yearId, year, activityCategoryId } =
    route.params;
  const [data, setData] = useState([]);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { getAuthState } = useAuth();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState();

  const { response, status } = useAsync(() => getDropdownList());
  const {
    execute: executeCategory,
    response: responseCategory,
    status: statusCategory,
  } = useAsync(() => getCategory(category), false);

  const createActivity = async (userId, activity) => {
    try {
      await api.createActivityService(userId, activity);
      navigation.navigate('RITScreen', { activity: activity, year: year });
    } catch (e) {
      console.log(e);
    }
  };

  const updateActivity = async (activityId, userId, activity) => {
    try {
      await api.updateActivityService(activityId, userId, activity);
      navigation.navigate('RITScreen', activity);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDetailsActivity = async (activityId, data) => {
    try {
      const newData = data.reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
      await api.updateDetailsActivityService(activityId, newData);
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (dataForm) => {
    const { user } = await getAuthState();
    let activity = {};
    if (description == undefined) {
      const newData = data.map(function (val) {
        return {
          key: val[0],
          value: val[1],
        };
      });
      activity = {
        description: dataForm.description,
        category: category,
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

  useEffect(() => {
    if (category) executeCategory();
  }, [category]);

  useEffect(() => {
    if (status === 'success') {
      setItems(response.data);
    }
  }, [status]);

  useEffect(() => {
    if (statusCategory === 'success') {
      const details = responseCategory.data.category.details;
      const detailsArray = Object.entries(details).map((v) => [v[0], v[1]]);
      const mergedArray = Object.assign(detailsArray, data);
      setData(mergedArray);
    }
  }, [statusCategory]);

  useEffect(() => {
    register('description');
  }, [register]);

  useEffect(() => {
    if (activityCategoryId) setCategory(activityCategoryId);
    if (details != undefined)
      setData(Object.entries(details).map((v) => [v[0], v[1]]));
  }, []);

  const TextField = ({ label, name, control, placeholder }) => {
    const { field } = useController({
      control,
      defaultValue: description ?? '',
      name,
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      <ScrollView style={formsStyles.container}>
        <View>
          <Text style={formsStyles.subtitle}>
            Escolha a categoria da atividade
          </Text>
          {status === 'success' && (
            <DropDownPicker
              searchable={true}
              loading={status === 'idle'}
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              listMode="MODAL"
              mode="SIMPLE"
              style={formsStyles.dropDownPicker}
              translation={{
                PLACEHOLDER: 'Selecione',
                SEARCH_PLACEHOLDER: 'Buscar categoria...',
                SELECTED_ITEMS_COUNT_TEXT: {
                  1: '1 categoria selecionada',
                  n: '{count} categorias selecionadas',
                },
                NOTHING_TO_SHOW: 'Nenhuma categoria para mostrar',
              }}
              listParentLabelStyle={{
                fontWeight: 'bold',
              }}
              listChildContainerStyle={{
                paddingLeft: 5,
                padding: 5,
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
                height: 'auto',
                minHeight: 40,
              }}
              selectedItemContainerStyle={{
                backgroundColor: '#d48888',
              }}
            />
          )}
        </View>
        {category && (
          <TextField
            control={control}
            name={'description'}
            label={'Descrição'}
            placeholder={'Digite uma descrição'}
            onChangeText={(text) => setValue('description', text)}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
        )}
        {category && (
          <EditableTable
            data={data}
            columns={tableColumns}
            onTableDataChange={setData}
          />
        )}
      </ScrollView>
      <View style={formsStyles.actionsButtons}>
        <Button
          color="#b22d30"
          onPress={handleSubmit(onSubmit)}
          title={'Salvar'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
