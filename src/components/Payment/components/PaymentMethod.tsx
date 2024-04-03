import React, {ReactNode} from 'react';
import COLORS from '../../../config/COLORS';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import CheckBox from '../../CheckBox/CheckBox';
import Button from '../../button';

interface Props {
  onSelectMethod: () => void;
  onPay: () => void;
  isSelected: boolean;
  title: string;
  payBtnStyle?: TouchableOpacityProps['style'];
  payBtnLabel?: ReactNode;
  payBtn?: ReactNode;
  isLoading?: boolean;
}

const PaymentMethod = ({
  onSelectMethod,
  onPay,
  isSelected,
  title,
  isLoading,
  payBtn,
  payBtnStyle,
  payBtnLabel = 'Place order',
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onSelectMethod}
      style={[styles.container, isSelected && styles.containerSelected]}>
      <View style={styles.row}>
        <CheckBox checked={isSelected} />

        <Text style={{color: COLORS.black}}>{title}</Text>
      </View>

      {isSelected && !payBtn && (
        <Button
          onPress={onPay}
          label={payBtnLabel}
          style={[styles.payBtn, payBtnStyle]}
          isLoading={isLoading}
        />
      )}
      {isSelected && payBtn}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    height: 70,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
    borderColor: COLORS.gray,
  },
  containerSelected: {
    borderColor: COLORS.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  payBtn: {
    height: 40,
    paddingHorizontal: 16,
  },
});

export default PaymentMethod;
