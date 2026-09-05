import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScale(22),
      marginBottom: moderateScale(12),
    },

    title: {
      fontSize: moderateScale(12),
      fontWeight: '700',
      color: colors.accent,
    },

    viewAll: {
      fontSize: moderateScale(12),
      fontWeight: '600',
      color: colors.accent,
    },
  });

export default createStyles;
