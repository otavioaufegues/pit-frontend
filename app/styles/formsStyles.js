import {StyleSheet, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  view: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  imageLogin: {
    marginTop: 40,
    marginBottom: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 250,
    height: 142,
  },

  loginButton: {
    alignSelf: 'center',
    width: 100,
    marginTop: 15,
  },

  formLogin: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 300,
  },

  formInput: {
    marginVertical: 15,
  },

  marginBottom: {
    marginBottom: 150,
  },

  errorMessages: {
    color: 'red',
    fontWeight: 'bold',
  },

  table: {
    marginTop: 15,
  },

  actionsButtons: {
    width: '100%',
    alignSelf: 'center',
    position: 'absolute', //Here is the trick
    bottom: 15, //Here is the trick
    paddingLeft: 16,
    paddingRight: 16,
  },

  space: {
    height: 5,
  },

  cancelButton: {
    width: SCREEN_WIDTH / 2 - 15,
  },

  saveButton: {
    width: SCREEN_WIDTH / 2 - 15,
  },

  headerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  colorWhite: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    justifyContent: 'center',
  },

  headerRightTitle: {},
});
