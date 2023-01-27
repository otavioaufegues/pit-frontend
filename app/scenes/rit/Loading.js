import React from 'react';
import {Text, View} from 'react-native';
import { LinearProgress } from 'react-native-elements';

export default function Loading() {
  return (
    <View>
      <LinearProgress color="primary" />
      <Text>Carregando...</Text>
    </View>
  );
}
