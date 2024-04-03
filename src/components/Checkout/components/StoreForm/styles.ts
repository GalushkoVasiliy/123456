import {StyleSheet} from 'react-native';
import COLORS from '../../../../config/COLORS';

export default StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 20,
  },
  desc: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  selectItem: {
    fontSize: 14,
    color: COLORS.black,
  },
  shippingContainer: {
    flex: 1,
    gap: 8,
    marginTop: 8,
  },
  shippingCard: {
    borderWidth: 2,
    // borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 70,
  },
  shippingCardActive: {
    borderColor: COLORS.black,
  },
  shippingCardBold: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.black,
  },
  shippingCardDesc: {
    fontSize: 12,
    color: COLORS.black,
    marginTop: 4,
  },
  shippingCardDistance: {
    fontWeight: '300',
    fontSize: 12,
    color: COLORS.black,
  },
  required: {
    color: COLORS.red,
  },
});
