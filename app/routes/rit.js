import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//IMPORT SCENES

import RITScreen from '../scenes/rit/RIT';
import ActivityFormScreen from '../scenes/rit/ActivityForm';

import { headerStyle, headerTitleStyle } from '../theme';

const RITStack = createStackNavigator(
	{
		RIT: RITScreen,
		ActivityForm: ActivityFormScreen,
	},
	{
		initialRouteName: 'RIT',
		defaultNavigationOptions: () => ({ headerStyle, headerTitleStyle }),
	}
);

export default RITStack;
