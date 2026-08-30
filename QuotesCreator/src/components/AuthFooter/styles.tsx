import { StyleSheet } from 'react-native';

import COLORS from '@/constants/Colors';
import { moderateScale } from '../../styles/scaling';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(22),
  },

  text: {
    fontSize: moderateScale(14),
    color: COLORS.black,
  },

  link: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: COLORS.accent,
  },
});

export default styles;