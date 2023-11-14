import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // geral
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },

  text: {
    fontSize: 16,
  },

  subtitle: {
    fontSize: 20,
    marginBottom: 10,
  },

  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //home
  textUser: {
    fontSize: 20,
  },

  textDepartment: {
    fontSize: 16,
    width: '100%',
    paddingTop: 8,
  },

  viewCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 15,
  },

  viewFirstColumn: {
    flex: 1.5,
    margin: 0,
    padding: 0,
    alignItems: 'flex-start',
  },

  viewSecondColumn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  viewThirdColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // activityListItem
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },

  iconActivity: {
    paddingLeft: 15,
  },

  // department list
  departmentName: {
    paddingLeft: 15,
  },

  iconTeacher: {
    paddingLeft: 15,
  },

  viewListItem: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },

  buttonHome: {
    backgroundColor: '#fff',
    borderColor: '#444',
    color: '#444',
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
  },

  buttonHomeTitle: { fontWeight: '400', color: '#444' },

  buttonHomeContainer: {
    width: '48%',
    marginBottom: 10,
  },

  buttonHomeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    paddingTop: 5,
    paddingBottom: 15,
  },

  // year list
  iconPit: {
    paddingRight: 50,
  },
  iconDate: {
    paddingRight: 15,
  },

  // rit list
  categoryDescription: {
    paddingLeft: 15,
  },

  addRowButton: {
    backgroundColor: '#d48888',
    paddingHorizontal: 20,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    alignSelf: 'flex-start',
    borderRadius: 5,
  },
  addRowButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
