import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';

const pitCharts = ({ route, navigation }) => {
  const { year } = route.params;
  return (
    <>
      <Card>
        <View style={styles.buttonContainer}>
          <Button
            title={`Comparar PIT ${year} x ${year - 1}`}
            onPress={() =>
              navigation.navigate('comparePitAnual', { year: year })
            }
            buttonStyle={styles.transparentButton}
            titleStyle={styles.buttonTitle}
            type="clear"
            icon={
              <Icon
                name="chevron-right"
                type="material"
                size={20}
                color="#444"
              />
            }
            iconRight
          />
          <Card.Divider style={styles.divider} />
          <Button
            title="Seu PIT x PIT do Departamento"
            onPress={() =>
              navigation.navigate('comparePitDepartment', { year: year })
            }
            buttonStyle={styles.transparentButton}
            titleStyle={styles.buttonTitle}
            type="clear"
            icon={
              <Icon
                name="chevron-right"
                type="material"
                size={20}
                color="#444"
              />
            }
            iconRight
          />
          <Card.Divider style={styles.divider} />
          <Button
            title="PIT do departamento"
            onPress={() =>
              navigation.navigate('reportPitDepartment', { year: year })
            }
            buttonStyle={styles.transparentButton}
            titleStyle={styles.buttonTitle}
            type="clear"
            icon={
              <Icon
                name="chevron-right"
                type="material"
                size={20}
                color="#444"
              />
            }
            iconRight
          />
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  transparentButton: {
    justifyContent: 'space-between',
  },
  buttonTitle: {
    textAlign: 'left',
    color: '#444',
  },
  divider: {
    marginVertical: 15,
  },
});

export default pitCharts;
