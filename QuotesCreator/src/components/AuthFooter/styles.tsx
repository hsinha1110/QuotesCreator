import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/constants/Colors';

import { moderateScale } from '../../styles/scaling';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: moderateScale(22),
    },

    text: {
      fontSize: moderateScale(14),
      color: colors.textPrimary,
    },

    link: {
      fontSize: moderateScale(14),
      fontWeight: '700',
      color: colors.accent,
    },
  });

export default createStyles;
