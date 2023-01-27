import React, { useEffect, useState } from 'react';
import { Card } from 'react-native-elements';
import {
  VictoryArea,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryPolarAxis,
  VictoryTheme,
} from 'victory-native';
import { useAsync } from '../../hooks/useAsync';
import { getYearPit } from '../../services/pit';
import Loading from '../rit/Loading';

export default function pitCharts({ route }) {
  const { year } = route.params;
  const characterData = [
    { strength: 1, intelligence: 1, luck: 1, stealth: 1, charisma: 1 },
    { strength: 23, intelligence: 23, luck: 23, stealth: 23, charisma: 23 },
  ];

  const { execute, response, status, error } = useAsync(
    () => getYearPit(year),
    false,
  );

  const [data, setData] = useState();
  const [maxima, setMaxima] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const getMaxima = (data) => {
    const groupedData = Object.keys(data[0]).reduce((memo, key) => {
      memo[key] = data.map((d) => d[key]);
      return memo;
    }, {});
    return Object.keys(groupedData).reduce((memo, key) => {
      memo[key] = Math.max(...groupedData[key]);
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
    execute();
  }, []);

  useEffect(() => {
    if (status === 'success') {
      setData(processData([response.data.resultPit]));
      setMaxima(getMaxima([response.data.resultPit]));
      setIsLoaded(true);
    }
  }, [status]);

  return (
    <>
      {!isLoaded && <Loading />}
      {isLoaded && (
        <VictoryChart
          polar
          theme={VictoryTheme.material}
          domain={{ y: [0, 1] }}
        >
          <VictoryGroup
            colorScale={['gold', 'orange', 'tomato']}
            style={{ data: { fillOpacity: 0.2, strokeWidth: 2 } }}
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
                  grid: { stroke: 'grey', strokeWidth: 0.25, opacity: 0.5 },
                }}
                tickLabelComponent={<VictoryLabel labelPlacement="vertical" />}
                labelPlacement="perpendicular"
                axisValue={i + 1}
                label={key}
                tickFormat={(t) => Math.ceil(t * maxima[key])}
                tickValues={[0.25, 0.5, 0.75, 1]}
              />
            );
          })}
          <VictoryPolarAxis
            labelPlacement="parallel"
            tickFormat={() => ''}
            style={{
              axis: { stroke: 'none' },
              grid: { stroke: 'grey', opacity: 0.5 },
            }}
          />
        </VictoryChart>
      )}
    </>
  );
}
