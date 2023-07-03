import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from '../../styles/styles';
import { useAsync } from '../../hooks/useAsync';
import { getResult } from '../../services/user';
import Loading from '../rit/Loading';
import { Icon, ListItem, Text } from 'react-native-elements';
import { useDataProvider } from '../../providers/app';

const ResultScreen = ({ route }) => {
  const { year, user } = route.params;
  const { axis } = useDataProvider();
  const [activitiesResult, setActivitiesResult] = useState([]);
  const [collapsed, setCollapsed] = useState(new Set());
  const [axisCollapsed, setAxisCollapsed] = useState(new Set());

  const ActivityStatus = {
    ok: {
      icon: 'check-circle-outline',
      color: 'green',
      description: 'Atividades do PIT desta categoria foram realizadas!',
    },
    miss: {
      icon: 'highlight-remove',
      color: 'red',
      description: 'Categoria selecionada no PIT sem atividades!',
    },
    plus: {
      icon: 'warning',
      color: 'gold',
      description: 'Atividades realizadas desta categoria não estavam no PIT!',
    },
  };

  const { execute, response, status, error } = useAsync(() =>
    getResult(year._id, user._id),
  );

  useEffect(() => {
    if (status === 'success') {
      setActivitiesResult(response.data.result);
    }
    if (status === 'error') {
      console.log('request error:', error);
    }
  }, [status]);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <Text
          h4
          style={{
            padding: 10,
          }}
        >
          Resultado {year.year} de {user.firstName}
        </Text>
        {status === 'pending' && <Loading />}
        {status === 'success' &&
          axis.map((axis) => (
            <ListItem.Accordion
              key={`ax-${axis._id}`}
              isExpanded={axisCollapsed.has(axis._id)}
              bottomDivider
              content={
                <>
                  <Icon
                    name={axis.icon}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  <ListItem.Content>
                    <ListItem.Title>{axis.name}</ListItem.Title>
                  </ListItem.Content>
                </>
              }
              onPress={() => {
                if (axisCollapsed.has(axis._id)) {
                  axisCollapsed.delete(axis._id);
                  setAxisCollapsed(new Set(axisCollapsed));
                } else {
                  axisCollapsed.add(axis._id);
                  setAxisCollapsed(new Set(axisCollapsed));
                }
              }}
            >
              {activitiesResult
                .filter((activity) => activity.axis.ref === axis.ref)
                .map((activity) => (
                  <ListItem key={`it-${activity._id}`} bottomDivider noIcon>
                    <ListItem.Content>
                      <Text>{activity.description}</Text>
                      <ListItem.Subtitle key={`sub-${activity._id}`}>
                        {ActivityStatus[activity.status].description}
                      </ListItem.Subtitle>
                      {activity.activities &&
                        activity.activities.map((ritActivity) => (
                          <ListItem.Subtitle key={`sb-${ritActivity._id}`}>
                            <Icon
                              name="circle"
                              size={8}
                              color="gray"
                              style={{ paddingHorizontal: 10 }}
                            />
                            {ritActivity.description}
                          </ListItem.Subtitle>
                        ))}
                    </ListItem.Content>
                    <Icon
                      name={ActivityStatus[activity.status].icon}
                      size={28}
                      color={ActivityStatus[activity.status].color}
                    />
                  </ListItem>
                ))}
            </ListItem.Accordion>
          ))}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ResultScreen;
