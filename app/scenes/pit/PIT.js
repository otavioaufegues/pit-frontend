import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import { Text, Button, ListItem, Card } from 'react-native-elements';
import { useAuth } from '../../providers/auth';
import * as api from '../../services/pit';

export default function PIT({ route, navigation }) {
  const { state } = useAuth();
  const user = state.user;
  const isFocused = useIsFocused();
  const { year } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pit, setPIT] = useState({
    pits: [],
  });

  useEffect(() => {
    if (isFocused) {
      (async () => {
        setIsLoading(true);
        try {
          const pitlist = await api.listPIT(year.year);
          setPIT(pitlist.data);
        } catch (e) {
          setIsLoading(false);
          setError(e);
        }
        setIsLoading(false);
      })();
    }
  }, [isFocused]);

  const renderEntry = ({ item, index }) => (
    <ListItem
      bottomDivider
      onPress={() => {
        navigation.navigate('UpdatePITScreen', {
          year: year.year,
          yearId: year._id,
          pitId: item._id,
        });
      }}
    >
      <ListItem.Content>
        <ListItem.Title>Plano de Trabalho {index + 1}</ListItem.Title>
        <ListItem.Subtitle>
          {'Início ' + moment.utc(item.dt_inicial).format('DD/MM/YYYY')}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );
  const renderActivities = ({ item, index }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        padding: 15,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Button
            title="Adicionar novo plano (PIT)"
            onPress={() =>
              navigation.navigate('CreatePITScreen', {
                year: year.year,
                yearId: year._id,
              })
            }
          />
          <Button
            title="Estatísticas"
            onPress={() =>
              navigation.navigate('pitChartsScreen', {
                year: year.year,
                userId: user._id,
              })
            }
          />
        </View>

        {isLoading ? (
          <Card width={'100%'}>
            <Text h4>Loading...</Text>
          </Card>
        ) : pit.pits.length > 0 ? (
          <>
            <Card width={'100%'}>
              <Card.Title> PITs enviados {year.year}</Card.Title>
              <Card.Divider />
              <FlatList
                data={pit.pits}
                renderItem={renderEntry}
                keyExtractor={(entry) => entry._id}
              ></FlatList>
            </Card>
            {pit.allActivities.length > 0}
            <Card width={'100%'}>
              <Card.Title>Atividades a realizar</Card.Title>
              <Card.Divider />
              <FlatList
                data={pit.allActivities}
                renderItem={renderActivities}
                keyExtractor={(entry) => entry._id}
              ></FlatList>
            </Card>
          </>
        ) : (
          <Card width={'100%'}>
            <Text h5>Nenhum PIT Enviado</Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
