import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-elements';
import {
  VictoryArea,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryTheme,
} from 'victory-native';
import { useAsync } from '../../../hooks/useAsync';
import { getPitDepartment } from '../../../services/pit';
import Loading from '../../rit/Loading';
import { useDataProvider } from '../../../providers/app';

export default function reportPitDepartment({ route }) {
  const { year } = route.params;
  const { axis } = useDataProvider();
  const { response, status } = useAsync(() => getPitDepartment(year));

  const [data, setData] = useState();
  const [maxima, setMaxima] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const getMaxima = (data) => {
    const groupedData = Object.keys(data[0]).reduce((memo, key) => {
      memo[key] = data.map((d) => d[key]);
      return memo;
    }, {});
    return Object.keys(groupedData).reduce((memo, key) => {
      memo[key] = axis.find((obj) => obj.ref === key).limit;
      return memo;
    }, {});
  };

  const processData = (data) => {
    const maxByGroup = getMaxima(data);
    const makeDataArray = (d) => {
      return Object.keys(d).map((key) => {
        return { x: key, y: d[key] / maxByGroup[key] || 0 };
      });
    };
    return data.map((datum) => makeDataArray(datum));
  };

  useEffect(() => {
    if (status === 'success') {
      setData(processData([response.data.resultPit]));
      setMaxima(getMaxima([response.data.resultPit]));
      setIsLoaded(true);
    }
  }, [status]);

  return (
    <Card containerStyle={styles.card}>
      <Card.Title>PIT Departamento {year}</Card.Title>
      <Card.Divider />
      <View>
        {!isLoaded && <Loading />}
        {isLoaded && (
          <VictoryChart
            polar
            theme={VictoryTheme.material}
            domain={{ y: [0, 1] }}
            width={330}
          >
            <VictoryGroup
              colorScale={['green', 'gold', 'cyan']}
              style={{ data: { fillOpacity: 0.2, strokeWidth: 1 } }}
            >
              {data.map((data, i) => {
                return <VictoryArea key={i} data={data} />;
              })}
            </VictoryGroup>
            {Object.keys(maxima).map((key, i) => {
              return (
                <VictoryPolarAxis
                  key={i}
                  dependentAxis
                  style={{
                    axisLabel: { padding: 20 },
                    axis: { stroke: 'none' },
                    grid: { stroke: 'grey', strokeWidth: 0.25, opacity: 0.2 },
                  }}
                  tickLabelComponent={
                    <VictoryLabel labelPlacement="perpendicular" />
                  }
                  labelPlacement="perpendicular"
                  axisValue={i + 1}
                  label={axis.find((obj) => obj.ref === key).name}
                  tickFormat={(t) => Math.ceil(t * maxima[key])}
                  tickValues={[0.25, 0.5, 0.75, 1]}
                />
              );
            })}
            <VictoryPolarAxis
              tickFormat={() => ''}
              style={{
                axis: { stroke: 'none' },
                grid: { stroke: 'grey', opacity: 0.2 },
              }}
            />
          </VictoryChart>
        )}
      </View>
      <Card.Divider />
      <View>
        <View style={styles.caption}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: 'green',
              marginRight: 5,
            }}
          />
          <Text>Média do departamento {year}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 0,
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
});
