import React from 'react';
import { Avatar } from 'react-native-elements';
import { View, Button, Text, StyleSheet, StatusBar } from 'react-native';
import formsStyles from './styles/formsStyles';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//IMPORT AUTH
import RegisterScreen from './scenes/auth/Register';
import LoginScreen from './scenes/auth/Login';
import UsernameScreen from './scenes/auth/Username';
import ForgotPasswordScreen from './scenes/auth/ForgotPassword';

//IMPORT APP SCENES
import HomeScreen from './scenes/home/Home';
import UpdateProfileScreen from './scenes/home/UpdateProfile';

//IMPORT PIT SCENES
import PITScreen from './scenes/pit/PIT';
import UpdatePITScreen from './scenes/pit/UpdatePIT';
import CreatePITScreen from './scenes/pit/CreatePIT';
import pitChartsScreen from './scenes/pit/pitCharts';
import comparePitAnual from './scenes/pit/reports/comparePitAnual';
import comparePitDepartment from './scenes/pit/reports/comparePitDepartment';
import reportPitDepartment from './scenes/pit/reports/reportPitDepartment';

//IMPORT RIT SCENES
import RITScreen from './scenes/rit/RIT';
import ActivityFormScreen from './scenes/rit/ActivityForm';
import DepartmentScreen from './scenes/rit/Department';
import InstitutionScreen from './scenes/rit/Institution';
// import DetailsActivityScreen from './scenes/rit/DetailsActivity';
import ImportActivityScreen from './scenes/rit/ImportActivity';
//IMPORT RELATORIO SCENES
import ReportRitScreen from './scenes/rit/reports/Report';
import ReportDepartmentScreen from './scenes/rit/reports/ReportDepartment';
import ReportInstitutionScreen from './scenes/rit/reports/ReportInstitution';
import ReportUserScreen from './scenes/rit/reports/ReportUser';
import ReportEvolutionScreen from './scenes/rit/reports/ReportEvolution';

//IMPORT LOADING SCREEN
import AuthLoading from './scenes/auth/AuthLoading';

//IMPORT RESULT SCENES
import ResultScreen from './scenes/result/ResultScreen';

//import teachers scene
import TeacherScreen from './scenes/teacher/TeacherScreen';

//import teachers scene
import CommentScreen from './scenes/comment/CommentScreen';

import AuthProvider from './providers/auth';
import { AppProvider } from './providers/app';

const Stack = createStackNavigator();

import { Icon } from 'react-native-elements';
function LogoTitle() {
  return (
    <Avatar
      // rounded
      size="small"
      source={{
        uri: 'https://cdn.discordapp.com/attachments/821498104183783444/929214319135195226/logoUFJF.png',
        // uri: 'https://www.pngkey.com/png/detail/57-573187_bonecos-para-foto-de-perfil.png',
      }}
      containerStyle={{ backgroundColor: '#fff' }}
    />
  );
}

export default function Router() {
  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar backgroundColor="#b22d30" barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
              // headerTitle: props => <LogoTitle {...props} />,
              headerStyle: {
                backgroundColor: '#b22d30',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontSize: 20,
              },
            }}
          >
            <Stack.Screen name="Loading" component={AuthLoading} />

            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ title: 'Cadastro de Usuário' }}
            />

            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="UsernameScreen" component={UsernameScreen} />

            <Stack.Screen
              name="ForgotPasswordScreen"
              component={ForgotPasswordScreen}
              options={{ title: 'Esqueci minha senha' }}
            />

            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                title: 'UFJF',
                headerTitle: (props) => (
                  <View style={formsStyles.headerTitle}>
                    <Text style={formsStyles.colorWhite}>
                      Universidade Federal de Juiz de Fora
                    </Text>
                  </View>
                ),
              }}
            />

            <Stack.Screen
              name="UpdateProfileScreen"
              component={UpdateProfileScreen}
              options={{ title: 'Atualizar Perfil' }}
            />

            <Stack.Screen
              name="PITScreen"
              component={PITScreen}
              options={{ title: 'Plano individual de trabalho' }}
            />

            <Stack.Screen
              name="UpdatePITScreen"
              component={UpdatePITScreen}
              options={{ title: 'Editar plano de trabalho' }}
            />

            <Stack.Screen
              name="CreatePITScreen"
              component={CreatePITScreen}
              options={{ title: 'Cadastro de PIT' }}
            />

            <Stack.Screen
              name="pitChartsScreen"
              component={pitChartsScreen}
              options={{ title: 'Estatísticas' }}
            />

            <Stack.Screen
              name="comparePitAnual"
              component={comparePitAnual}
              options={{ title: '' }}
            />

            <Stack.Screen
              name="comparePitDepartment"
              component={comparePitDepartment}
              options={{ title: '' }}
            />

            <Stack.Screen
              name="reportPitDepartment"
              component={reportPitDepartment}
              options={{ title: '' }}
            />

            <Stack.Screen
              name="RITScreen"
              component={RITScreen}
              options={({ navigation, route }) => ({
                title: `Atividades - ${route.params.year}`,
                // headerRight: () => <Button onPress={() => navigation.navigate('ReportRitScreen', {year: route.params.year})} title="Relatório" color="blue" />,
                headerRight: () => (
                  <Icon
                    color="#fff"
                    name="insert-chart"
                    size={21}
                    onPress={() =>
                      navigation.navigate('ReportRitScreen', {
                        year: route.params.year,
                      })
                    }
                  />
                ),
                headerRightContainerStyle: {
                  margin: 15,
                },
                PITScreen,
              })}
            />

            <Stack.Screen
              name="ActivityFormScreen"
              component={ActivityFormScreen}
              options={{ title: 'Cadastro e atividade' }}
            />

            <Stack.Screen
              name="ReportRitScreen"
              component={ReportRitScreen}
              options={({ route }) => ({
                title: `Relatório - ${route.params.year}`,
              })}
            />

            <Stack.Screen
              name="ReportDepartmentScreen"
              component={ReportDepartmentScreen}
              options={({ route }) => ({
                title: `Relatório - ${route.params.year}`,
              })}
            />

            <Stack.Screen
              name="ReportInstitutionScreen"
              component={ReportInstitutionScreen}
              options={({ route }) => ({
                title: `Relatório - ${route.params.year}`,
              })}
            />

            <Stack.Screen
              name="ReportUserScreen"
              component={ReportUserScreen}
              options={({ route }) => ({
                title: `Relatório - ${route.params.year}`,
              })}
            />

            <Stack.Screen
              name="ReportEvolutionScreen"
              component={ReportEvolutionScreen}
              options={({ route }) => ({ title: 'Relatório de Evolução' })}
            />

            <Stack.Screen
              name="DepartmentScreen"
              component={DepartmentScreen}
              options={({ navigation, route }) => ({
                title: `Instituição - ${route.params.year}`,
                headerRight: () => (
                  <Icon
                    color="#fff"
                    name="insert-chart"
                    size={21}
                    onPress={() =>
                      navigation.navigate('ReportInstitutionScreen', {
                        year: route.params.year,
                      })
                    }
                  />
                ),
                headerRightContainerStyle: {
                  margin: 15,
                },
              })}
            />

            <Stack.Screen
              name="InstitutionScreen"
              component={InstitutionScreen}
              options={{ title: 'Instituição' }}
            />

            <Stack.Screen
              name="ImportActivityScreen"
              component={ImportActivityScreen}
              options={{ title: 'Importações' }}
            />

            <Stack.Screen
              name="ResultScreen"
              component={ResultScreen}
              options={{ title: 'Resultado' }}
            />

            <Stack.Screen
              name="TeacherScreen"
              component={TeacherScreen}
              options={{ title: 'Professores' }}
            />

            <Stack.Screen
              name="CommentScreen"
              component={CommentScreen}
              options={{ title: 'Comentários' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}
