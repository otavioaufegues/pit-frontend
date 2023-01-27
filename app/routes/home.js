import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//IMPORT SCENES
import HomeScreen from '../scenes/home/Home';
import UpdateProfileScreen from '../scenes/home/UpdateProfile';
import PITScreen from '../scenes/pit/PIT';
import CreatePITScreen from '../scenes/pit/CreatePIT';
import UpdatePITScreen from '../scenes/pit/UpdatePIT';
import RITScreen from '../scenes/rit/RIT';
import ActivityFormScreen from '../scenes/rit/ActivityForm';
import ReportScreen from '../scenes/pit/Report';

import { headerStyle, headerTitleStyle } from '../theme';

const HomeStack = createStackNavigator(
	{
		Home: HomeScreen,
		UpdateProfile: UpdateProfileScreen,
		PIT: PITScreen,
		CreatePIT: CreatePITScreen,
		UpdatePIT: UpdatePITScreen,
		RIT: RITScreen,
		ActivityForm: ActivityFormScreen,
		Report: ReportScreen,
	},
	{
		initialRouteName: 'Home',
		defaultNavigationOptions: () => ({ headerStyle, headerTitleStyle }),
	}
);

export default HomeStack;
