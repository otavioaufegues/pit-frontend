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
import {useAuth} from '../../../providers/auth';
import Loading from '../Loading';

// import Clipboard from '@react-native-clipboard/clipboard';
// import Clipboard from 'expo-clipboard';

const screenWidth = Dimensions.get('window').width;

const wrap = s => s.replace(/(?![^\n]{1,23}$)([^\n]{1,23})\s/g, '$1\n');

export default function Report({route, navigation}) {
  const {year} = route.params;
  const [loading, setLoading] = useState(false);

  const [activitiesCountByCategory, setActivitiesCountByCategory] = useState([]);
  const [detailsCountByCategory, setDetailsCountByCategory] = useState([]); //details
  const [activitiesCountByAxis, setActivitiesCountByAxis] = useState([]);

  const [dataReportsByCategory, setDataReportsByCategory] = useState();
  const [dataReportsByCategoryByDetails, setDataReportsByCategoryDetails] = useState(); //details
  const [dataReportsByAxis, setDataReportsByAxis] = useState();

  const [activitiesCountByAxisAllUser, setActivitiesCountByAxisAllUser] = useState([]);
  const [dataReportsByAxisByUserRadar, setDataReportsByAxisByUserRadar] = useState();
  const [dataReportsByAxisAllUserRadar, setDataReportsByAxisAllUserRadar] = useState();

  const [detailsString, setDetailsString] = useState(); //details

  const [dataRadar, setDataRadar] = useState();
  const [maximaRadar, setMaximaRadar] = useState();

  const colors = ['red', 'blue', 'yellow', 'brown', 'dark', 'purple', 'green'];
  const [value, onChangeText] = useState();
  const {getAuthState} = useAuth();

  let categoryString = '';
  let axisString = '';
  // let detailsString = '';

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

  // const UselessTextInput = props => {
  //   return <TextInput {...props} editable maxLength={5000} />;
  // };

  const categoryReportHandler = data => {
    const dataResults = data.map((item, index) => {
      return {
        quantidade: item.totalActivitiesByCategory,
        categoria: item._id.category[0].description,
      };
    });

    setDataReportsByCategory(dataResults);
  };

  const categoryDetailsReportHandler = data => {
    let totalAlunos;
    let string = '';

    const newData = data.filter(v => {
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
    });

    const dataResults = newData.map(item => {
      totalAlunos = 0;

      item.activities.map(function (v) {
        v.details.Alunos ? (totalAlunos += parseInt(v.details.Alunos)) : (totalAlunos += 1);
      });

      return {quantidade: totalAlunos, categoria: item.description};
    });

    // console.log("dataresults", dataResults);
    dataResults.map(item => {
      string += item.categoria + ': ' + item.quantidade + '\n';
    });

    setDetailsString(string);
    setDataReportsByCategoryDetails(dataResults);
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

  const axisReportRadarHandler = (userData, userDepartmentData, allUserData) => {
    // console.log('userData', userData);
    // console.log('userDepartmentData', userDepartmentData);
    // console.log('allUserData', allUserData);
    let userTeaching;
    let userSearch;
    let userExtension;
    let userAdministrativeActivity;
    let userTrainingAndRepresentation;

    let userDepartmentTeaching = 0;
    let userDepartmentSearch = 0;
    let userDepartmentExtension = 0;
    let userDepartmentAdministrativeActivity = 0;
    let userDepartmentTrainingAndRepresentation = 0;

    let allUserTeaching = 0;
    let allUserSearch = 0;
    let allUserExtension = 0;
    let allUserAdministrativeActivity = 0;
    let allUserTrainingAndRepresentation = 0;
    const dataResults = [];

    userData.map(item => {
      if (item._id.axis[0].name == 'Ensino') userTeaching = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Pesquisa') userSearch = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Extensão') userExtension = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Atividade Administrativa') userAdministrativeActivity = item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Capacitação e Representação') userTrainingAndRepresentation = item.totalActivitiesByAxis;
    });

    const userDepartment = userDepartmentData.map(item => item._id.user);
    const userDept = userDepartment.reduce((arr, el) => arr.concat(arr.includes(el) ? [] : [el]), []);

    userDepartmentData.map(item => {
      if (item._id.axis[0].name == 'Ensino') userDepartmentTeaching += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Pesquisa') userDepartmentSearch += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Extensão') userDepartmentExtension += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Atividade Administrativa') userDepartmentAdministrativeActivity += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Capacitação e Representação') userDepartmentTrainingAndRepresentation += item.totalActivitiesByAxis;
    });

    const allUser = allUserData.map(item => item._id.user);
    const allUserUnique = allUser.reduce((arr, el) => arr.concat(arr.includes(el) ? [] : [el]), []);
    allUserData.map(item => {
      if (item._id.axis[0].name == 'Ensino') allUserTeaching += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Pesquisa') allUserSearch += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Extensão') allUserExtension += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Atividade Administrativa') allUserAdministrativeActivity += item.totalActivitiesByAxis;
      if (item._id.axis[0].name == 'Capacitação e Representação') allUserTrainingAndRepresentation += item.totalActivitiesByAxis;
    });

    // console.log('userDept', userDept.length);
    // console.log('allUserUnique', allUserUnique.length);
    // console.log('userTrainingAndRepresentation', userTrainingAndRepresentation);
    // console.log('userDepartmentTrainingAndRepresentation', userDepartmentTrainingAndRepresentation);
    // console.log('allUserTrainingAndRepresentation', allUserTrainingAndRepresentation);

    dataResults.push(
      {
        Ensino: userTeaching || 0,
        Pesquisa: userSearch || 0,
        Extensão: userExtension || 0,
        AtividadeAdministrativa: userAdministrativeActivity || 0,
        CapacitaçãoRepresentação: userTrainingAndRepresentation || 0,
      },

      // todos usuarios por departamento
      {
        Ensino: userDepartmentTeaching / userDept.length || 0,
        Pesquisa: userDepartmentSearch / userDept.length || 0,
        Extensão: userDepartmentExtension / userDept.length || 0,
        AtividadeAdministrativa: userDepartmentAdministrativeActivity / userDept.length || 0,
        CapacitaçãoRepresentação: userDepartmentTrainingAndRepresentation / userDept.length || 0,
      },

      // todos usuarios da instituição
      {
        Ensino: allUserTeaching / allUserUnique.length || 0,
        Pesquisa: allUserSearch / allUserUnique.length || 0,
        Extensão: allUserExtension / allUserUnique.length || 0,
        AtividadeAdministrativa: allUserAdministrativeActivity / allUserUnique.length || 0,
        CapacitaçãoRepresentação: allUserTrainingAndRepresentation / allUserUnique.length || 0,
      },

      // {
      //   Ensino: 12 || 0,
      //   Pesquisa: 3 || 0,
      //   Extensão: 19 || 0,
      //   AtividadeAdministrativa: 5 || 0,
      //   CapacitaçãoRepresentação: 6 || 0,
      //   // symbol: {fill: 'green'},
      // },
      // // todos usuarios por departamento
      // {
      //   Ensino: 34 || 0,
      //   Pesquisa: 54 || 0,
      //   Extensão: 65 || 0,
      //   AtividadeAdministrativa: 55 || 0,
      //   CapacitaçãoRepresentação: 43 || 0,
      //   // symbol: {fill: 'orange'},
      // },
      // // todos usuarios da instituição
      // {
      //   Ensino: 111 || 0,
      //   Pesquisa: 213 || 0,
      //   Extensão: 143 || 0,
      //   AtividadeAdministrativa: 99 || 0,
      //   CapacitaçãoRepresentação: 150 || 0,
      //   // symbol: {fill: 'gold'},
      // },
    );

    // console.log('dataResults', dataResults);
    setDataRadar(processData(dataResults));
    setMaximaRadar(getMaxima(dataResults));
  };

  const getActivitiesCountByCategory = async year => {
    try {
      const {data} = await api.getActivitiesCountByCategoryService(year);
      setActivitiesCountByCategory(data.totalActivitiesByCategory);
      categoryReportHandler(data.totalActivitiesByCategory);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getDetailsCountByCategory = async year => {
    try {
      const {data} = await api.getActivitiesService(year);
      setDetailsCountByCategory(data.activitiesByCategory);
      categoryDetailsReportHandler(data.activitiesByCategory);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getActivitiesCountByAxis = async year => {
    try {
      const {user} = await getAuthState();
      const userLogged = await api.getActivitiesCountByAxisService(year);
      const userDepartment = await api.getActivitiesCountByAxisByUserByDepartmentService(year, user.department);
      const allUser = await api.getActivitiesCountByAxisAllUserService(year);
      setActivitiesCountByAxis(userLogged.data.totalActivitiesByAxis);
      axisReportHandler(userLogged.data.totalActivitiesByAxis);
      axisReportRadarHandler(userLogged.data.totalActivitiesByAxis, userDepartment.data.totalActivitiesByAxis, allUser.data.totalActivitiesByAxis);
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
    getDetailsCountByCategory(year);
    // getActivitiesCountByAxisAllUser(year);
  }, [route]);

  // const concatElements = async ()=>{
  //   // await
  //   // let dataConcat = await dataReportsByAxisByUserRadar.concat(dataReportsByAxisAllUserRadar);
  //   let dataConcat = await dataReportsByAxisByUserRadar;

  //   setDataRadar(processData(dataConcat));
  //   setMaximaRadar(getMaxima(dataConcat));
  // }
  // concatElements();

  createCategoryStringData();
  createAxisStringData();

  const copyActivitiesToClipboard = categoryString => {
    Clipboard.setString(categoryString);
  };

  const copyAxisToClipboard = axisString => {
    Clipboard.setString(axisString);
  };

  // const renderReportByCategory = (item, index) => (
  //   <View key={`itm_category${item._id.category[0]._id}`}>
  //     <Text>Categoria: {item._id.category[0].description}</Text>
  //     <Text>Quantidade atividades por Categoria: {item.totalActivitiesByCategory}</Text>
  //   </View>
  // );

  // const renderReportByAxis = (item, index) => (
  //   <View key={`itm_axis${item._id.axis[0]._id}`}>
  //     <Text>Eixo: {item._id.axis[0].name}</Text>
  //     <Text>Quantidade atividades por Eixo: {item.totalActivitiesByAxis}</Text>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* begin details */}
        {dataReportsByCategoryByDetails == undefined || dataReportsByCategoryByDetails == 0 || detailsString == undefined || detailsString == 0 ? (
          <Loading />
        ) : (
          <View style={styles.alignVertical}>
            {/* <Text>{activitiesCountByCategory.map(renderReportByCategory)}</Text> */}
            {/* <UselessTextInput multiline numberOfLines={dataReportsByCategory.length * 2.5} onChangeText={text => onChangeText(text)} value={categoryString} /> */}
            <Text style={{fontSize: 16}}>
              Copie os dados do relatório abaixo. <Icon name="content-copy" size={21} onPress={() => copyActivitiesToClipboard(detailsString)} />
            </Text>
            <VictoryChart
              theme={VictoryTheme.colorScale}
              containerComponent={<VictoryVoronoiContainer />}
              domainPadding={{x: [50, 120], y: 50}}
              padding={{top: 20, left: 165}}
              horizontal
              width={315}
              height={(3 + dataReportsByCategoryByDetails.length) * 65}>
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
                data={dataReportsByCategoryByDetails}
                barWidth={dataReportsByCategoryByDetails.length * 2 + 15}
                x="categoria"
                y="quantidade"
                labels={({datum}) => `${datum.quantidade}`}
                labelComponent={<VictoryLabel dy={0} dx={5} />}
                sortKey="x"
              />
            </VictoryChart>
          </View>
        )}
        {/* end details */}

        {activitiesCountByCategory == undefined || dataReportsByCategory == undefined || activitiesCountByCategory == 0 || dataReportsByCategory == 0 ? (
          <Loading />
        ) : (
          <View style={styles.alignVertical}>
            {/* <Text>{activitiesCountByCategory.map(renderReportByCategory)}</Text> */}
            {/* <UselessTextInput multiline numberOfLines={dataReportsByCategory.length * 2.5} onChangeText={text => onChangeText(text)} value={categoryString} /> */}
            <Text style={{fontSize: 16}}>
              Copie os dados do relatório abaixo. <Icon name="content-copy" size={21} onPress={() => copyActivitiesToClipboard(categoryString)} />
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
            {/* <UselessTextInput multiline numberOfLines={dataReportsByAxis.length * 2.5} onChangeText={text => onChangeText(text)} value={axisString} /> */}
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
              height={(3 + dataReportsByAxis.length) * 45}>
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
              <VictoryGroup colorScale={['green', 'orange', 'tomato']} style={{data: {fillOpacity: 0.2, strokeWidth: 2}}}>
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
            <VictoryLegend
              x={25}
              orientation="vertical"
              gutter={20}
              data={[
                {name: 'Professor', symbol: {fill: 'green'}},
                {name: 'Professores do departamento', symbol: {fill: 'orange'}},
                {name: 'Professores da instituição', symbol: {fill: 'tomato'}},
              ]}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
