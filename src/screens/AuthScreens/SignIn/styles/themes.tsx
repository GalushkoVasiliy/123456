import {StyleSheet} from 'react-native';
import COLORS from '../../../../config/COLORS';

const themes = {
  white: StyleSheet.create({
    container: {
      backgroundColor: COLORS.white,
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
    },
    textAreaContainer: {
      borderColor: COLORS.codGray,
      borderBottomWidth: 0.5,
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 15,
      width: '100%',
    },
    textArea: {
      justifyContent: 'flex-start',
      flex: 1,
      color: COLORS.black,
    },
    inputField: {marginBottom: 5, color: COLORS.doveGray},
  }),
  black: StyleSheet.create({
    container: {
      backgroundColor: COLORS.codGray,
      flex: 1,
      width: '100%',
      height: '100%',
      alignItems: 'center',
    },
    inputField: {marginBottom: 5, color: COLORS.white},
    textAreaContainer: {
      borderColor: COLORS.codGray,
      borderBottomWidth: 0.5,
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 15,
      width: '100%',
    },
    textArea: {
      justifyContent: 'flex-start',
      flex: 1,
      color: COLORS.white,
    },
  }),
};

export default themes;
