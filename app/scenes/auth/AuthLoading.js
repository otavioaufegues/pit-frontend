import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { StackActions } from '@react-navigation/native';

import { useAuth } from '../../providers/auth';

export default function AuthLoading({ navigation }) {
  const { navigate } = navigation;
  const { getAuthState } = useAuth();

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      const { user } = await getAuthState();

      if (user) {
        //check if username exist
        let username = !!user.username;

        if (username) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    } catch (e) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
  }

  return (
    <View
      style={{
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
