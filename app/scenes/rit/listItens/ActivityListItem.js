import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ListItem, Icon, Button} from 'react-native-elements';
import styles from '../../../styles/styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ActivityListItem({item, handleShow, handleDelete, navigation}) {
  const leftSwipe = () => {
    return (
      <View style={styles.actions}>
        <Icon name="edit" size={21} color="orange" onPress={handleShow} />
      </View>
    );
  };

  const rightSwipe = () => {
    return (
      <View style={styles.actions}>
        <Icon name="delete-forever" size={21} color="red" onPress={handleDelete} />
      </View>
    );
  };

  // const handleActivityDetails = (activityId, details) => {
  //   console.log('details', details);
  //   navigation.navigate('DetailsActivityScreen', {activityId: activityId, details: details});
  // };

  return (
    <Swipeable renderRightActions={rightSwipe} renderLeftActions={leftSwipe}>
      <ListItem bottomDivider key={`itm${item._id}`}>
        <Icon color="#bdbfc1" style={styles.iconActivity} name="check-circle" size={21} />
        <ListItem.Content>
          <ListItem.Title>{item.description}</ListItem.Title>
          {/* <ListItem.Subtitle>{item.details.periodo}</ListItem.Subtitle>*/}
        </ListItem.Content>
        {/* <Icon name="list" size={21} onPress={() => handleActivityDetails(item._id, item.details)} /> */}
      </ListItem>
    </Swipeable>
  );
}
