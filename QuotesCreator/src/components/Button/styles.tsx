import { StyleSheet } from 'react-native';

import COLORS from '@/constants/Colors';
import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  loginButton: {
    width: '100%',
    height: moderateScale(45),
    borderRadius: moderateScale(12),
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.white,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default styles;