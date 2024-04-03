import {StyleSheet} from 'react-native';
import COLORS from '../../../../config/COLORS';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 25,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 15,
  },

  pageTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
    height: 140,
    minHeight: 140,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    gap: 8,
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
  signUp: {
    color: COLORS.black,
    fontWeight: '700',
  },
  signUpWrapper: {marginLeft: 10},
  forgotPasswordWrapper: {width: '100%', paddingVertical: 10},
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
});

export default styles;
