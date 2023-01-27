import React, {useState, useEffect} from 'react';
import {Text, View, Dimensions, ScrollView, Clipboard} from 'react-native';
import {VictoryChart, VictoryVoronoiContainer, VictoryGroup, VictoryLine, VictoryTooltip, VictoryScatter, VictoryLegend} from './Victory';
import styles from '../../../styles/reportsStyles';
import * as api from '../../../services/rit';
import Loading from '../Loading';

const screenWidth = Dimensions.get('window').width;

export default function ReportEvolution({route, navigation}) {
  const [loading, setLoading] = useState(false);
  const [activitiesCountByAxis, setActivitiesCountByAxis] = useState([]);
  const [teaching, setTeaching] = useState();
  const [search, setSearch] = useState();
  const [extension, setExtension] = useState();
  const [administrativeActivity, setAdministrativeActivity] = useState();
  const [trainingAndRepresentation, setTrainingAndRepresentation] = useState();
  const [myLegends, setMyLegends] = useState([]);

  const [detailsCountByCategory, setDetailsCountByCategory] = useState([]); //details
  const [dataReportsByCategoryByDetails, setDataReportsByCategoryDetails] = useState(); //details

  const [dataRadar, setDataRadar] = useState();
  const [maximaRadar, setMaximaRadar] = useState();

  const colors = ['red', 'blue', 'yellow', 'purple', 'green', 'dark', 'green', 'pink', 'gray'];

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

  const axisReportHandler = data => {
    let dataTeaching = [];
    let dataSearch = [];
    let dataExtension = [];
    let dataAdministrativeActivity = [];
    let dataTrainingAndRepresentation = [];
    let dataLegends = [];

    // console.log("data", data)
    data.map(item => {
      if (item._id.axis[0].name == 'Ensino')
        dataTeaching.push({
          x: new Date(item._id.year[0].year, 1, 1),
          y: item.totalActivitiesByAxis,
          axis: item._id.axis[0].name,
        });
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Pesquisa')
        dataSearch.push({
          x: new Date(item._id.year[0].year, 1, 1),
          y: item.totalActivitiesByAxis,
          axis: item._id.axis[0].name,
        });
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Extensão')
        dataExtension.push({
          x: new Date(item._id.year[0].year, 1, 1),
          y: item.totalActivitiesByAxis,
          axis: item._id.axis[0].name,
        });
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Atividade Administrativa')
        dataAdministrativeActivity.push({
          x: new Date(item._id.year[0].year, 1, 1),
          y: item.totalActivitiesByAxis,
          axis: item._id.axis[0].name,
        });
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Capacitação e Representação')
        dataTrainingAndRepresentation.push({
          x: new Date(item._id.year[0].year, 1, 1),
          y: item.totalActivitiesByAxis,
          axis: item._id.axis[0].name,
        });
    });

    if (dataTeaching.length == 0)
      dataTeaching.push(
        {x: new Date(2018, 1, 1), y: 0, axis: 'Ensino'},
        {x: new Date(2019, 1, 1), y: 0, axis: 'Ensino'},
        {x: new Date(2020, 1, 1), y: 0, axis: 'Ensino'},
      );

    if (dataSearch.length == 0)
      dataSearch.push(
        {x: new Date(2018, 1, 1), y: 0, axis: 'Pesquisa'},
        {x: new Date(2019, 1, 1), y: 0, axis: 'Pesquisa'},
        {x: new Date(2020, 1, 1), y: 0, axis: 'Pesquisa'},
      );

    if (dataExtension.length == 0)
      dataExtension.push(
        {x: new Date(2018, 1, 1), y: 0, axis: 'Extensão'},
        {x: new Date(2019, 1, 1), y: 0, axis: 'Extensão'},
        {x: new Date(2020, 1, 1), y: 0, axis: 'Extensão'},
      );

    if (dataAdministrativeActivity.length == 0)
      dataAdministrativeActivity.push(
        {x: new Date(2018, 1, 1), y: 0, axis: 'Atividade Administrativa'},
        {x: new Date(2019, 1, 1), y: 0, axis: 'Atividade Administrativa'},
        {x: new Date(2020, 1, 1), y: 0, axis: 'Atividade Administrativa'},
      );

    if (dataTrainingAndRepresentation.length == 0)
      dataTrainingAndRepresentation.push(
        {x: new Date(2018, 1, 1), y: 0, axis: 'Capacitação e Representação'},
        {x: new Date(2019, 1, 1), y: 0, axis: 'Capacitação e Representação'},
        {x: new Date(2020, 1, 1), y: 0, axis: 'Capacitação e Representação'},
      );

    // retornar quando legenda for somente os eixos que usuario tiver (eixo nao existente = 0)

    // const auxLegend = data.reduce((prevVal, elem, index, array) => {
    //   !prevVal[elem._id.axis[0].name] ? (prevVal[elem._id.axis[0].name] = 1) : prevVal[elem._id.axis[0].name]++;
    //   return prevVal;
    // }, {});

    // let i = 0;
    // Object.keys(auxLegend).forEach(item => {
    //   dataLegends.push({
    //     name: item,
    //     symbol: {fill: colors[i]},
    //   });
    //   i++;
    // });

    dataLegends.push(
      {name: 'Ensino', symbol: {fill: colors[0]}},
      {name: 'Pesquisa', symbol: {fill: colors[1]}},
      {name: 'Extensão', symbol: {fill: colors[2]}},
      {name: 'Atividade Administrativa', symbol: {fill: colors[3]}},
      {name: 'Capacitação e Representação', symbol: {fill: colors[4]}},
    );

    // console.log('line', dataTeaching);
    // console.log('dataSearch', dataSearch);
    // console.log('dataExtension', dataExtension);
    // console.log('dataAdministrativeActivity', dataAdministrativeActivity);
    // console.log('dataTrainingAndRepresentation', dataTrainingAndRepresentation);

    setTeaching(dataTeaching);
    setSearch(dataSearch);
    setExtension(dataExtension);
    setAdministrativeActivity(dataAdministrativeActivity);
    setTrainingAndRepresentation(dataTrainingAndRepresentation);
    setMyLegends(dataLegends);
  };

  // TODO: adicionar legenda
  const axisReportRadarHandler = data => {
    let dataTeaching = [];
    let dataSearch = [];
    let dataExtension = [];
    let dataAdministrativeActivity = [];
    let dataTrainingAndRepresentation = [];
    let dataLegends = [];
    const dataResults = [];

    data.map(item => {
      if (item._id.axis[0].name == 'Ensino') {
        dataTeaching.push({
          name: item._id.axis[0].name,
          year: item._id.year[0].year,
          quantity: item.totalActivitiesByAxis,
        });
      }
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Pesquisa') {
        dataSearch.push({
          name: item._id.axis[0].name,
          year: item._id.year[0].year,
          quantity: item.totalActivitiesByAxis,
        });
      }
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Extensão') {
        dataExtension.push({
          name: item._id.axis[0].name,
          year: item._id.year[0].year,
          quantity: item.totalActivitiesByAxis,
        });
      }
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Atividade Administrativa') {
        dataAdministrativeActivity.push({
          name: item._id.axis[0].name,
          year: item._id.year[0].year,
          quantity: item.totalActivitiesByAxis,
        });
      }
    });

    data.map(item => {
      if (item._id.axis[0].name == 'Capacitação e Representação') {
        dataTrainingAndRepresentation.push({
          name: item._id.axis[0].name,
          year: item._id.year[0].year,
          quantity: item.totalActivitiesByAxis,
        });
      }
    });

    dataTeaching.sort((a, b) => {
      return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
    });

    dataSearch.sort((a, b) => {
      return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
    });

    dataExtension.sort((a, b) => {
      return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
    });

    dataAdministrativeActivity.sort((a, b) => {
      return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
    });

    dataTrainingAndRepresentation.sort((a, b) => {
      return a.year < b.year ? -1 : a.year > b.year ? 1 : 0;
    });

    if (dataTeaching.length == 0) {
      dataTeaching.push({name: 'Ensino', year: 2018, quantity: 0}, {name: 'Ensino', year: 2019, quantity: 0}, {name: 'Ensino', year: 2020, quantity: 0});
    }

    if (dataSearch.length == 0) {
      dataSearch.push({name: 'Pesquisa', year: 2018, quantity: 0}, {name: 'Pesquisa', year: 2019, quantity: 0}, {name: 'Pesquisa', year: 2020, quantity: 0});
    }

    if (dataExtension.length == 0) {
      dataExtension.push({name: 'Extensão', year: 2018, quantity: 0}, {name: 'Extensão', year: 2019, quantity: 0}, {name: 'Extensão', year: 2020, quantity: 0});
    }

    if (dataAdministrativeActivity.length == 0) {
      dataAdministrativeActivity.push(
        {name: 'Atividade Administrativa', year: 2018, quantity: 0},
        {name: 'Atividade Administrativa', year: 2019, quantity: 0},
        {name: 'Atividade Administrativa', year: 2020, quantity: 0},
      );
    }

    if (dataTrainingAndRepresentation.length == 0) {
      dataTrainingAndRepresentation.push(
        {name: 'Capacitação e Representação', year: 2018, quantity: 0},
        {name: 'Capacitação e Representação', year: 2019, quantity: 0},
        {name: 'Capacitação e Representação', year: 2020, quantity: 0},
      );
    }

    // console.log('dataTeaching', dataTeaching);
    // console.log('dataSearch', dataSearch);
    // console.log('dataExtension', dataExtension);
    // console.log('dataAdministrativeActivity', dataAdministrativeActivity);
    // console.log('dataTrainingAndRepresentation', dataTrainingAndRepresentation);

    let i = 0;
    let j = 1;
    let k = 2;

    dataResults.push(
      {
        Ensino: dataTeaching[i].quantity || 0,
        Pesquisa: dataSearch[i].quantity || 0,
        Extensão: dataExtension[i].quantity || 0,
        AtividadeAdministrativa: dataAdministrativeActivity[i].quantity || 0,
        CapacitaçãoRepresentação: dataTrainingAndRepresentation[i].quantity || 0,
      },
      {
        Ensino: dataTeaching[j].quantity || 0,
        Pesquisa: dataSearch[j].quantity || 0,
        Extensão: dataExtension[j].quantity || 0,
        AtividadeAdministrativa: dataAdministrativeActivity[j].quantity || 0,
        CapacitaçãoRepresentação: dataTrainingAndRepresentation[j].quantity || 0,
      },
      {
        Ensino: dataTeaching[k].quantity || 0,
        Pesquisa: dataSearch[k].quantity || 0,
        Extensão: dataExtension[k].quantity || 0,
        AtividadeAdministrativa: dataAdministrativeActivity[k].quantity || 0,
        CapacitaçãoRepresentação: dataTrainingAndRepresentation[k].quantity || 0,
      },
      // {
      //   Ensino: 10,
      //   Pesquisa: 23,
      //   Extensão: 43,
      //   AtividadeAdministrativa: 23,
      //   CapacitaçãoRepresentação: 56,
      // },
    );

    console.log('radar', dataResults);

    setDataRadar(processData(dataResults));
    setMaximaRadar(getMaxima(dataResults));
  };

  const categoryDetailsReportHandler = (data, dataYear) => {
    let totalAlunos;
    let year;
    const dataResults = [];

    const newData = data
      .filter(v => {
        return (
          (v.activities.length > 0 &&
            (v.description == 'Ministrar aulas' ||
              v.description == 'Orientar monografias, dissertação e tese' ||
              v.description == 'Orientar e supervisionar estágios' ||
              v.description == 'Orientar aos programas de bolsas de ensino da Instituição ou convênio' ||
              v.description == 'Co-orientação monografia, dissertação e tese' ||
              v.description == 'Orientação e supervisão de estágio curricular e não curricular' ||
              v.description == 'Orientação de monitoria e/ou treinamento profissional' ||
              v.description == 'Orientação em universalização das línguas e idiomas sem fronteiras')) ||
          v.description == 'Orientação em iniciação científica'
        );
      })
      .map(a => a.activities);

    dataYear = dataYear.map(y => y.year);

    const dataResultsA = newData
      .map(item => {
        let filter = item.filter(v => {
          return v.year.year == dataYear[0];
        });
        return filter;
      })
      .filter(x => x.length > 0)
      .map(item => {
        totalAlunos = 0;
        item.map(function (v) {
          year = v.year.year;
          v.details.Alunos ? (totalAlunos += parseInt(v.details.Alunos)) : (totalAlunos += 1);
        });

        return totalAlunos;
      });

    const dataResultsB = newData
      .map(item => {
        let filter = item.filter(v => {
          return v.year.year == dataYear[1];
        });
        return filter;
      })
      .filter(x => x.length > 0)
      .map(item => {
        totalAlunos = 0;
        item.map(function (v) {
          year = v.year.year;
          v.details.Alunos ? (totalAlunos += parseInt(v.details.Alunos)) : (totalAlunos += 1);
        });
        return totalAlunos;
      });

    const dataResultsC = newData
      .map(item => {
        let filter = item.filter(v => {
          return v.year.year == dataYear[2];
        });
        return filter;
      })
      .filter(x => x.length > 0)
      .map(item => {
        totalAlunos = 0;
        item.map(function (v) {
          year = v.year.year;
          v.details.Alunos ? (totalAlunos += parseInt(v.details.Alunos)) : (totalAlunos += 1);
        });
        return totalAlunos;
      });

    // console.log('dataResultsA', dataResultsA);
    // console.log('dataResultsB', dataResultsB);
    // console.log('dataResultsC', dataResultsC);

    if (dataResultsA == 0) dataResultsA.push(0);
    if (dataResultsB == 0) dataResultsB.push(0);
    if (dataResultsC == 0) dataResultsC.push(0);

    const t0 = dataResultsA.reduce((acumulado, x) => acumulado + x);
    const t1 = dataResultsB.reduce((acumulado, x) => acumulado + x);
    const t2 = dataResultsC.reduce((acumulado, x) => acumulado + x);

    // console.log('t0', t0);
    // console.log('t1', t1);
    // console.log('t2', t2);

    dataResults.push(
      {x: new Date(dataYear[0], 1, 1), y: t0, axis: 'Quantidade de alunos'},
      {x: new Date(dataYear[1], 1, 1), y: t1, axis: 'Quantidade de alunos'},
      {x: new Date(dataYear[2], 1, 1), y: t2, axis: 'Quantidade de alunos'},
    );
    console.log('dataResults', dataResults);

    setDataReportsByCategoryDetails(dataResults);
  };

  const getActivitiesCountByAxis = async () => {
    try {
      const {data} = await api.getActivitiesCountByAxisEvolutionService();
      setActivitiesCountByAxis(data.totalActivitiesByAxis);
      axisReportHandler(data.totalActivitiesByAxis);
      // axisReportRadarHandler(data.totalActivitiesByAxis);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getDetailsEvolution = async () => {
    try {
      const {data} = await api.getDetailsEvolutionService();
      const year = await api.getYearsService();
      setDetailsCountByCategory(data.activitiesByCategory);
      categoryDetailsReportHandler(data.activitiesByCategory, year.data.years);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getActivitiesCountByAxis();
    getDetailsEvolution();
  }, [route]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {dataReportsByCategoryByDetails == undefined ? (
          <Loading />
        ) : (
          <View>
            <VictoryChart height={400} width={330} scale={{x: 'time'}} domainPadding={{x: 30, y: [0, 1]}} containerComponent={<VictoryVoronoiContainer />}>
              <VictoryGroup
                labels={({datum}) => `quantidade: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} renderInPortal={false} />}
                data={dataReportsByCategoryByDetails}>
                <VictoryLine style={{data: {stroke: colors[0]}}} />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>
            </VictoryChart>

            <VictoryLegend
              // width={100}
              // x={125}
              // y={50}
              title=""
              // centerTitle
              orientation="vertical"
              gutter={20}
              // style={{border: {stroke: 'black'}, title: {fontSize: 20}}}
              data={[{name: 'Quantidade de alunos', symbol: {fill: colors[0]}}]}
            />
          </View>
        )}
        {teaching == undefined ||
        search == undefined ||
        extension == undefined ||
        administrativeActivity == undefined ||
        trainingAndRepresentation == undefined ||
        myLegends == undefined ||
        search == undefined ? (
          // {activitiesCountByAxis == undefined || dataRadar == undefined || maximaRadar == undefined ? (
          <Loading />
        ) : (
          <View>
            <VictoryChart height={400} width={330} scale={{x: 'time'}} domainPadding={{x: 30, y: [0, 30]}} containerComponent={<VictoryVoronoiContainer />}>
              <VictoryGroup
                labels={({datum}) => `quantidade: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} renderInPortal={false} />}
                data={teaching}>
                <VictoryLine style={{data: {stroke: colors[0]}}} />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>

              <VictoryGroup
                labels={({datum}) => `eixo: ${datum.axis}, quantidade: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} />}
                data={search}>
                <VictoryLine style={{data: {stroke: colors[1]}}} />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>

              <VictoryGroup
                labels={({datum}) => `eixo: ${datum.axis}, quantidade: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} />}
                data={extension}>
                <VictoryLine style={{data: {stroke: colors[2]}}} />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>

              <VictoryGroup
                labels={({datum}) => `eixo: ${datum.axis}, quantidade: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} />}
                data={administrativeActivity}>
                <VictoryLine style={{data: {stroke: colors[3]}}} />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>

              <VictoryGroup
                labels={({datum}) => `eixo: ${datum.axis}, quantidade: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} />}
                data={trainingAndRepresentation}>
                <VictoryLine style={{data: {stroke: colors[4]}}} />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>
            </VictoryChart>
            <VictoryLegend
              // width={100}
              // x={125}
              // y={50}
              title=""
              // centerTitle
              orientation="vertical"
              gutter={20}
              // style={{border: {stroke: 'black'}, title: {fontSize: 20}}}
              data={myLegends}
            />
            {/* <VictoryChart polar theme={VictoryTheme.material} domain={{y: [0, 1]}}>
              <VictoryGroup colorScale={['gold', 'orange', 'tomato']} style={{data: {fillOpacity: 0.2, strokeWidth: 2}}}>
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
            </VictoryChart> */}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

{
  /* <VictoryChart height={400} width={350} scale={{x: 'time'}} domainPadding={{x: 30, y: [0, 30]}} containerComponent={<VictoryVoronoiContainer />}>

              <VictoryGroup
                color="#c43a31"
                labels={({datum}) => `y: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} />}
                // domain={{ x: [2018,2021], y: [0, 10] }}
                data={[
                  {x: new Date(2018, 1, 1), y: 2},
                  {x: new Date(2019, 1, 1), y: 7},
                  {x: new Date(2020, 1, 1), y: 21},
                  {x: new Date(2021, 1, 1), y: 14},
                ]}>
                <VictoryLine />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>

              <VictoryGroup
                labels={({datum}) => `y: ${datum.y}`}
                labelComponent={<VictoryTooltip style={{fontSize: 10}} />}
                data={[
                  {x: new Date(2018, 1, 1), y: 5},
                  {x: new Date(2019, 1, 1), y: 6},
                  {x: new Date(2020, 1, 1), y: 3},
                  {x: new Date(2021, 1, 1), y: 9},
                ]}>
                <VictoryLine />
                <VictoryScatter size={({active}) => (active ? 8 : 3)} />
              </VictoryGroup>
            </VictoryChart> */
}
