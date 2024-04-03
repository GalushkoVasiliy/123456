import {StyleSheet} from 'react-native';
import COLORS from '../../../config/COLORS';

const themes = {
  white: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    textTitleWhite: {
      color: '#383838',
      fontSize: 23,
      marginBottom: 15,
    },
    textWhite16: {
      color: '#383838',
      fontSize: 16,
      marginBottom: 8,
    },
  }),
  black: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.darkCodGray,
    },
    textTitleWhite: {
      color: COLORS.white,
      fontSize: 23,
      marginBottom: 15,
    },
    textWhite16: {
      color: COLORS.white,
      fontSize: 16,
      marginBottom: 8,
    },
  }),
};

export default themes;
