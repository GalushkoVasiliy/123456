/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Image,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import COLORS from '../config/COLORS';
import IconComponent from './IconComponent';

interface HeaderProps {
  theme?: 'black' | 'white';
  nav?: any;
  style?: ViewStyle;
  iconSearch?: boolean;
  logoFalse?: boolean;
  backFalse?: boolean;
  text?: string;
  children?: any;
  onPressCustom?: boolean;
  iconRight?: any;
}

const btnSize = 55;
const iconSize = 18;

const Header = ({style, logoFalse, theme, backFalse}: HeaderProps) => {
  const {canGoBack, goBack, navigate} = useNavigation();
  const stylesTheme = themes[theme || 'black'];
  const colorIcon = theme === 'black' ? '#383838' : '#000';

  const isBackBtn = useMemo(() => {
    return canGoBack();
  }, [canGoBack]);

  return (
    <View style={[stylesTheme.headerContent, style]}>
      {isBackBtn && !backFalse ? (
        <TouchableOpacity style={stylesTheme.backBtn} onPress={goBack}>
          <IconComponent
            iconName="chevron-left"
            size={iconSize}
            color={colorIcon}
          />
        </TouchableOpacity>
      ) : (
        <View style={stylesTheme.backBtn} />
      )}

      {!logoFalse ? (
        <TouchableOpacity
          style={stylesTheme.backBtn}
          onPress={() => {
            navigate('Home', {
              screen: 'HomeScreen', params: {'timestamp': new Date().getTime()}
            });
          }}>
          <Image
            style={{width: 130, height: 20}}
            source={require('../assets/images/logo-small.png')}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <View style={stylesTheme.backBtn} />
    </View>
  );
};

const themes = {
  white: StyleSheet.create({
    headerContent: {
      backgroundColor: COLORS.white,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: btnSize,
      width: '100%',
      zIndex: 100,
    },
    cartBtn: {
      backgroundColor: COLORS.white,
      height: btnSize,
      width: btnSize,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    cartLabel: {
      color: COLORS.black,
      fontSize: 14,
    },
    backBtn: {
      height: btnSize,
      width: btnSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
  black: StyleSheet.create({
    headerContent: {
      backgroundColor: COLORS.alto,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: btnSize,
      width: '100%',
      zIndex: 100,
    },
    cartBtn: {
      backgroundColor: COLORS.black,
      height: btnSize,
      width: btnSize,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    cartLabel: {
      color: COLORS.white,
      fontSize: 14,
    },
    backBtn: {
      height: btnSize,
      width: btnSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
};

export default React.memo(Header);
