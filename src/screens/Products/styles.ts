import {Dimensions, StyleSheet} from 'react-native';
import COLORS from '../../config/COLORS';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  card: {
    backgroundColor: 'red',
    height: 230,
    width: Dimensions.get('screen').width / 2 - 30,
    padding: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  touchableCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  list: {
    paddingHorizontal: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
  },
  textName: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  textPrice: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noDataText: {
    color: COLORS.gray,
    fontSize: 28,
  },
});
