import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//IMPORT SCENES

import PITScreen from '../scenes/pit/PIT';
import UpdatePITScreen from '../scenes/pit/UpdatePIT';
import CreatePITScreen from '../scenes/pit/CreatePIT';
import ReportScreen from '../scenes/pit/Report';

import { headerStyle, headerTitleStyle } from '../theme';

const PITStack = createStackNavigator(
	{
		PIT: PITScreen,
		UpdatePIT: UpdatePITScreen,
		CreatePIT: CreatePITScreen,
		Report: ReportScreen,
	},
	{
		initialRouteName: 'PIT',
		defaultNavigationOptions: () => ({ headerStyle, headerTitleStyle }),
	}
);

export default PITStack;
