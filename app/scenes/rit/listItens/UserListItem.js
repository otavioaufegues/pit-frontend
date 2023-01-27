import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {ListItem, Icon} from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;


const UserListItem = ({item, year, navigation}) => {
  
  const userReport = (year, username) => { 
    navigation.navigate('ReportUserScreen', {year: year, username: username});
  };

  return (
    <Swipeable>
      <ListItem bottomDivider key={`itm${item._id}`}>
        <Icon color="#bdbfc1" name="person" size={30} />
        <ListItem.Content>
        {item.firstName} <Icon color="#bdbfc1" name="bar-chart" size={30} onPress={() => userReport(year, item.username)} />
          {/*<ListItem.Subtitle>{item.description}</ListItem.Subtitle>*/}
        </ListItem.Content>
      </ListItem>
    </Swipeable>
  );
};




export default UserListItem;

const styles = StyleSheet.create({
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
});
