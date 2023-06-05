import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ListItem, Icon } from 'react-native-elements';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ActivityListItem from './listItens/ActivityListItem';
import Loading from './Loading';
import { useAuth } from '../../providers/auth';

import styles from '../../styles/styles';
import * as api from '../../services/rit';

export default function RIT({ route, navigation }) {
  const { year, yearId } = route.params;
  const [collapsed, setCollapsed] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [activitiesByCategory, setActivitiesByCategory] = useState([]);
  const { getAuthState } = useAuth();

  const getActivities = async (year) => {
    try {
      const { data } = await api.getActivitiesService(year);
      setActivitiesByCategory(data.activitiesByCategory);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteActivity = async (activityId, userId, arr) => {
    try {
      await api.deleteActivityService(activityId, userId);
      navigation.navigate('RITScreen', arr);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getActivities(year);
  }, [route]);

  const deleteItem = async (item, index) => {
    const arr = [...activitiesByCategory];
    arr.splice(index, 1);
    setActivitiesByCategory(arr);
    setLoading(true);

    const { user } = await getAuthState();
    deleteActivity(item._id, user._id, arr);
  };

  const updateItem = (item) => {
    navigation.navigate('ActivityFormScreen', {
      activityId: item._id,
      description: item.description,
      details: item.details,
      activityCategoryId: item.category,
    });
  };

  const createItem = () => {
    navigation.navigate('ActivityFormScreen', {
      yearId: yearId,
      year: year,
    });
  };

  const renderItem = (item, index) => (
    <ActivityListItem
      key={item._id}
      item={item}
      navigation={navigation}
      handleDelete={() => deleteItem(item, index)}
      handleShow={() => updateItem(item)}
    />
  );

  const renderCategory = (item, index) => (
    <ListItem.Accordion
      key={`acc${index}`}
      isExpanded={!collapsed.has(index)}
      content={
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            if (collapsed.has(index)) {
              collapsed.delete(index);
              setCollapsed(new Set(collapsed));
            } else {
              collapsed.add(index);
              setCollapsed(new Set(collapsed));
            }
          }}
        >
          <Icon color="#b22d30" name={`${item.axis.icon}`} size={21} />

          <ListItem.Content>
            <ListItem.Title style={styles.categoryDescription}>
              {item.description}
            </ListItem.Title>
          </ListItem.Content>
        </TouchableOpacity>
      }
    >
      {item.activities.map(renderItem)}
    </ListItem.Accordion>
  );

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.addRowButton}
          onPress={() => createItem()}
        >
          <Text style={styles.addRowButtonText}>Adicionar atividade</Text>
        </TouchableOpacity>
        {loading ? <Loading /> : activitiesByCategory.map(renderCategory)}
      </ScrollView>
    </SafeAreaProvider>
  );
}
