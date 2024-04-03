import ReactNativeHapticFeedback, {
  HapticOptions,
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {useCallback} from 'react';

const options: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export default function useHapticFeedback(
  type: HapticFeedbackTypes = HapticFeedbackTypes.impactLight,
) {
  return useCallback(() => {
    ReactNativeHapticFeedback.trigger(type, options);
  }, [type]);
}
