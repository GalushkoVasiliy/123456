import {StyleSheet} from 'react-native';
import COLORS from '../../config/COLORS';

export default StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 20,
    color: COLORS.black,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderColor: COLORS.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxMark: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.black,
  },
  required: {
    color: COLORS.red,
  },
  billingCard: {
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
  billingCardActive: {
    borderColor: COLORS.black,
  },
  billingCardBold: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.black,
  },
  billingCardDesc: {
    fontSize: 12,
    color: COLORS.black,
    marginTop: 4,
  },

  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 15,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
    borderColor: COLORS.gray,
  },
  containerSelected: {
    borderColor: COLORS.black,
  },
  paymentRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  payBtn: {
    height: 40,
    paddingHorizontal: 16,
  },
});
