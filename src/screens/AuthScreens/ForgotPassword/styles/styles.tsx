import {StyleSheet} from 'react-native';
import COLORS from '../../../../config/COLORS';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    backgroundColor: COLORS.white,
  },
  pageTitleWrapper: {
    justifyContent: 'center',
    paddingVertical: 50,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
  },
  mainContainer: {
    height: '40%',
    justifyContent: 'center',
    gap: 16,
  },
  login: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 8,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  signUpWrapper: {marginLeft: 10},
  forgotPasswordWrapper: {width: '100%', paddingVertical: 10},
  footer: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: 10,
  },
});

export default styles;
