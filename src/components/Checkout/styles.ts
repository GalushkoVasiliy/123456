import {StyleSheet} from 'react-native';
import COLORS from '../../config/COLORS';

export default StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 40,
  },
  deliveryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  deliveryBtn: {
    borderWidth: 2,
    // borderRadius: 4,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderColor: COLORS.gray,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  deliveryBtnSelected: {
    borderColor: COLORS.black,
  },
  deliveryLabel: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
  },
  deliveryLabelSelected: {
    color: COLORS.black,
  },
  checkoutLabel: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 20,
  },
});
