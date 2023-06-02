import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // paddingBottom: 30,
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
    borderColor: '#ddd',
    borderWidth: 1,
    marginVertical: 15,
    textAlignVertical: 'top',
    padding: 5,
  },

  marginBottom: {
    marginBottom: 150,
  },

  errorMessages: {
    color: 'red',
    fontWeight: 'bold',
  },

  actionsButtons: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 15,
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
    fontSize: 18,
    justifyContent: 'center',
  },

  headerRightTitle: {},
});
