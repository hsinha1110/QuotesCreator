import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(22),
    marginBottom: moderateScale(12),
  },

  title: {
    fontSize: moderateScale(14),

    fontWeight: '700',

    color: COLORS.black,
  },

  viewAll: {
    fontSize: moderateScale(12),

    fontWeight: '600',

    color: COLORS.accent,
  },
});

export default styles;
