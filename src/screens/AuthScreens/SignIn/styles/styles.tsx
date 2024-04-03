import {StyleSheet} from 'react-native';
import COLORS from '../../../../config/COLORS';

const styles = StyleSheet.create({
  footerContainer: {height: 100, backgroundColor: COLORS.white},
  page: {width: '100%', height: '100%', backgroundColor: COLORS.white},
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 25,
    backgroundColor: COLORS.white,
  },
  pageTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 30,
    height: 140,
    maxHeight: 140,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
  },
  mainContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    zIndex: 100,
    paddingBottom: 50,
  },
  login: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 8,
    marginTop: 20,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 30,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  privacyPolicy: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  privacyPolicyText: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.black,
  },
});

export default styles;
