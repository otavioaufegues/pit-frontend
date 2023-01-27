import React, {useState, useEffect} from 'react';
import {Text, View, Dimensions, ScrollView, Clipboard} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  VictoryPie,
  VictoryLabel,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryGroup,
  VictoryPolarAxis,
  VictoryArea,
  VictoryLegend,
} from './Victory';
import styles from '../../../styles/reportsStyles';
import * as api from '../../../services/rit';
import Loading from '../Loading';

const screenWidth = Dimensions.get('window').width;

const wrap = s => s.replace(/(?![^\n]{1,23}$)([^\n]{1,23})\s/g, '$1\n');

const data = [
  {quantidade: 3, categoria: 'Categoria 1'},
  {quantidade: 2, categoria: 'Categoria inconstitucionalissimamente 2'},
  {quantidade: 1, categoria: 'Categoria com nome grande 3'},
  {quantidade: 4, categoria: 'Categoria 4'},
  {quantidade: 3, categoria: 'Categoria 1a'},
  {quantidade: 2, categoria: 'Categoria inconstitucionalissimamente 2a'},
  {quantidade: 1, categoria: 'Categoria com nome grande 3a'},
  {quantidade: 4, categoria: 'Categoria 4a'},
  {quantidade: 11, categoria: 'Categoria 1b'},
  {quantidade: 2, categoria: 'Categoria inconstitucionalissimamente 2b'},
  {quantidade: 1, categoria: 'Categoria com nome grande 3b'},
  {quantidade: 4, categoria: 'Categoria 4b'},
  {quantidade: 3, categoria: 'Categoria 1a'},
  {quantidade: 2, categoria: 'Categoria inconstitucionalissimamente 2a'},
  {quantidade: 12, categoria: 'Categoria com nome grande 3a'},
  {quantidade: 10, categoria: 'Categoria 4d'},
  {quantidade: 3, categoria: 'Categoria 1d'},
  {quantidade: 2, categoria: 'Categoria inconstitucionalissimamente 2d'},
  {quantidade: 7, categoria: 'Categoria com nome grande 3d'},
  {quantidade: 15, categoria: 'Categoria 4e teste inconstitucionalissimamente 2d'},
];

export default function ReportInstitution({route, navigation}) {
  const {year} = route.params;
  const [loading, setLoading] = useState(false);
  const [activitiesCountByCategory, setActivitiesCountByCategory] = useState([]);
  const [activitiesCountByAxis, setActivitiesCountByAxis] = useState([]);
  const [dataReportsByAxis, setDataReportsByAxis] = useState();
  const [dataReportsByCategory, setDataReportsByCategory] = useState();

  const [dataRadar, setDataRadar] = useState();
  const [maximaRadar, setMaximaRadar] = useState();

  const colors = ['red', 'blue', 'yellow', 'brown', 'dark', 'purple', 'green'];

  let categoryString = '';
  let axisString = '';

  const getMaxima = data => {
    const groupedData = Object.keys(data[0]).reduce((memo, key) => {
      memo[key] = data.map(d => d[key]);
      return memo;
    }, {});
    return Object.keys(groupedData).reduce((memo, key) => {
      memo[key] = Math.max(...groupedData[key]);
      return memo;
    }, {});
  };

  const processData = data => {
    const maxByGroup = getMaxima(data);
    const makeDataArray = d => {
      return Object.keys(d).map(key => {
        return {x: key, y: d[key] / maxByGroup[key] || 0};
      });
    };
    return data.map(datum => makeDataArray(datum));
  };

  const categoryReportHandler = data => {
    const dataResults = data.map((item, index) => {
      return {
        quantidade: item.totalActivitiesByCategory,
        categoria: item._id.category[0].description,
      };
    });

    setDataReportsByCategory(dataResults);
  };

  const axisReportHandler = data => {
    const dataResults = data.map((item, index) => {
      return {
        x: item._id.axis[0].name,
        y: item.totalActivitiesByAxis,
      };
    });

    setDataReportsByAxis(dataResults);
  };

  const axisReportRadarHandler = data => {
    let teaching;
    let search;
    let extension;
    let administrativeActivity;
    let trainingAndRepresentation;
    const dataResults = [];

    data.map(item => {
      if (item._id.axis[0].name == 'Ensino') teaching = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Pesquisa') search = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Extensão') extension = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Atividade Administrativa') administrativeActivity = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Capacitação e Representação') trainingAndRepresentation = item.totalActivitiesByAxis;
    });

    dataResults.push({
      Ensino: teaching || 0,
      Pesquisa: search || 0,
      Extensão: extension || 0,
      AtividadeAdministrativa: administrativeActivity || 0,
      CapacitaçãoRepresentação: trainingAndRepresentation || 0,
    });

    setDataRadar(processData(dataResults));
    setMaximaRadar(getMaxima(dataResults));
  };

  const getActivitiesCountByCategory = async year => {
    try {
      const {data} = await api.getActivitiesCountByCategoryByInstitutionService(year);
      setActivitiesCountByCategory(data.totalActivitiesByCategory);
      categoryReportHandler(data.totalActivitiesByCategory);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getActivitiesCountByAxis = async year => {
    try {
      const {data} = await api.getActivitiesCountByAxisByInstitutionService(year);
      setActivitiesCountByAxis(data.totalActivitiesByAxis);
      axisReportHandler(data.totalActivitiesByAxis);
      axisReportRadarHandler(data.totalActivitiesByAxis);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const createCategoryStringData = () => {
    activitiesCountByCategory.map(item => {
      categoryString += item._id.category[0].description + ': ' + item.totalActivitiesByCategory + '\n';
    });
  };

  const createAxisStringData = () => {
    activitiesCountByAxis.map(item => {
      axisString += item._id.axis[0].name + ': ' + item.totalActivitiesByAxis + '\n';
    });
  };

  useEffect(() => {
    setLoading(true);
    getActivitiesCountByCategory(year);
    getActivitiesCountByAxis(year);
  }, [route]);

  createCategoryStringData();
  createAxisStringData();

  const copyActivitiesToClipboard = categoryString => {
    Clipboard.setString(categoryString);
  };

  const copyAxisToClipboard = axisString => {
    Clipboard.setString(axisString);
  };

  const renderReportByCategory = (item, index) => (
    <View key={`itm_category${item._id.category[0]._id}`}>
      <Text>Categoria: {item._id.category[0].description}</Text>
      <Text>Quantidade atividades por Categoria: {item.totalActivitiesByCategory}</Text>
    </View>
  );

  const renderReportByAxis = (item, index) => (
    <View key={`itm_axis${item._id.axis[0]._id}`}>
      <Text>Eixo: {item._id.axis[0].name}</Text>
      <Text>Quantidade atividades por Eixo: {item.totalActivitiesByAxis}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {activitiesCountByCategory == undefined || dataReportsByCategory == undefined || activitiesCountByCategory == 0 || dataReportsByCategory == 0 ? (
          <Loading />
        ) : (
          <View style={styles.alignVertical}>
            {/* <Text>{activitiesCountByCategory.map(renderReportByCategory)}</Text> */}
            <Text style={{fontSize: 16}}>
              Copie os dados do relatório abaixo. <Icon name="content-copy" size={20} onPress={() => copyActivitiesToClipboard(categoryString)} />
            </Text>
            <VictoryChart
              theme={VictoryTheme.colorScale}
              containerComponent={<VictoryVoronoiContainer />}
              domainPadding={{x: [50, 120], y: 50}}
              padding={{top: 20, left: 165}}
              horizontal
              width={315}
              height={(3 + dataReportsByCategory.length) * 65}>
              <VictoryAxis
                label=""
                standalone={false}
                invertAxis
                tickFormat={t => `${wrap(t, 20)}`}
                style={{axisLabel: {padding: 160}, tickLabels: {angle: -40}}}
              />
              <VictoryAxis
                dependentAxis
                label="Quantidade"
                standalone={false}
                tickFormat={t => `${Math.round(t.quantidade)}`}
                style={{axisLabel: {padding: 30}}}
              />
              <VictoryBar
                data={dataReportsByCategory}
                barWidth={dataReportsByCategory.length * 2 + 15}
                x="categoria"
                y="quantidade"
                labels={({datum}) => `${datum.quantidade}`}
                labelComponent={<VictoryLabel dy={0} dx={5} />}
                sortKey="x"
              />
            </VictoryChart>
          </View>
        )}
        {activitiesCountByAxis == undefined || dataReportsByAxis == undefined || dataRadar == undefined || maximaRadar == undefined ? (
          <Loading />
        ) : (
          <View style={styles.alignVertical}>
            {/* <Text>{activitiesCountByAxis.map(renderReportByAxis)}</Text> */}
            {/* <UselessTextInput multiline numberOfLines={dataReportsByAxis.length} onChangeText={text => onChangeText(text)} value={axisString} /> */}
            <Text style={{fontSize: 16}}>
              Copie os dados do relatório abaixo. <Icon name="content-copy" size={21} onPress={() => copyAxisToClipboard(axisString)} />
            </Text>
            <VictoryChart
              theme={VictoryTheme.colorScale}
              containerComponent={<VictoryVoronoiContainer />}
              domainPadding={{x: [50, 120], y: 50}}
              padding={{top: 20, left: 165}}
              horizontal
              width={315}
              height={(3 + dataReportsByAxis.length) * 65}>
              <VictoryAxis
                label=""
                standalone={false}
                invertAxis
                tickFormat={t => `${wrap(t, 20)}`}
                style={{axisLabel: {padding: 160}, tickLabels: {angle: -40}}}
              />
              <VictoryAxis dependentAxis label="Quantidade" standalone={false} tickFormat={t => `${Math.round(t.y)}`} style={{axisLabel: {padding: 30}}} />
              <VictoryBar
                data={dataReportsByAxis}
                barWidth={dataReportsByAxis.length * 2 + 15}
                x="x"
                y="y"
                labels={({datum}) => `${datum.y}`}
                labelComponent={<VictoryLabel dy={0} dx={5} />}
                sortKey="x"
              />
            </VictoryChart>
            <VictoryChart polar theme={VictoryTheme.material} domain={{y: [0, 1]}}>
              <VictoryGroup colorScale={['tomato']} style={{data: {fillOpacity: 0.2, strokeWidth: 2}}}>
                {dataRadar.map((dataRadar, i) => {
                  return <VictoryArea key={i} data={dataRadar} />;
                })}
              </VictoryGroup>
              {Object.keys(maximaRadar).map((key, i) => {
                return (
                  <VictoryPolarAxis
                    key={i}
                    dependentAxis
                    style={{
                      axisLabel: {padding: 10},
                      axis: {stroke: 'none'},
                      grid: {stroke: 'grey', strokeWidth: 0.25, opacity: 0.5},
                    }}
                    tickLabelComponent={<VictoryLabel labelPlacement="vertical" />}
                    labelPlacement="perpendicular"
                    axisValue={i + 1}
                    label={key}
                    tickFormat={t => Math.ceil(t * maximaRadar[key])}
                    tickValues={[0.25, 0.5, 0.75]}
                  />
                );
              })}
              <VictoryPolarAxis
                labelPlacement="parallel"
                tickFormat={() => ''}
                style={{
                  axis: {stroke: 'none'},
                  grid: {stroke: 'grey', opacity: 0.5},
                }}
              />
            </VictoryChart>
            <VictoryLegend x={25} orientation="vertical" gutter={20} data={[{name: 'Instituição', symbol: {fill: 'orange'}}]} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
