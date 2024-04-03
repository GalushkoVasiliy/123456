import React from 'react';
import PaginationLib from '@cherry-soft/react-native-basic-pagination';
import {StyleSheet} from 'react-native';
import COLORS from '../config/COLORS';

interface Props {
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const Pagination = (props: Props) => {
  if (props.totalItems > props.pageSize) {
    return (
      <PaginationLib
        {...props}
        btnStyle={styles.btnStyle}
        activeBtnStyle={styles.activeBtnStyle}
        textStyle={styles.textStyle}
        activeTextStyle={styles.activeTextStyle}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderRadius: 4,
  },
  activeBtnStyle: {
    borderColor: COLORS.black,
  },
  textStyle: {
    color: COLORS.black,
    fontWeight: '400',
  },
  activeTextStyle: {
    fontWeight: '700',
  },
});

export default Pagination;
