import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import { Text, Button, ListItem, Card } from 'react-native-elements';
import { useAuth } from '../../providers/auth';
import * as api from '../../services/pit';

export default function PIT({ route, navigation }) {
  const isFocused = useIsFocused();
  const { year } = route.params;
  const { state } = useAuth();
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
        <Text
          h4
          style={{
            paddingBottom: 10,
          }}
        >
          PITs enviados {year.year}
        </Text>
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
              navigation.navigate('pitChartsScreen', { year: year.year })
            }
          />
        </View>

        {isLoading ? (
          <Card width={'100%'}>
            <Text h4>Loading...</Text>
          </Card>
        ) : pit.pits.length > 0 ? (
          <Card width={'100%'} height={'80%'}>
            <FlatList
              data={pit.pits}
              renderItem={renderEntry}
              keyExtractor={(entry) => entry._id}
              style={{ height: '95%' }}
            ></FlatList>
          </Card>
        ) : (
          <Card width={'100%'}>
            <Text h5>Nenhum PIT Enviado</Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
