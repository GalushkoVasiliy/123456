import {StyleSheet} from 'react-native';
import COLORS from '../../../../config/COLORS';

export default StyleSheet.create({
  container: {
    paddingTop: 16,
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
  or: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
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
    minHeight: 65,
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
  required: {
    color: COLORS.red,
  },
});
