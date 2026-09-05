import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: moderateScale(10),
    },

    actionButton: {
      width: moderateScale(32),
      height: moderateScale(32),
      alignItems: 'center',
      justifyContent: 'center',
    },

    likeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    likesText: {
      marginLeft: moderateScale(4),
      fontSize: moderateScale(12),
      color: colors.textPrimary,
    },
  });

export default createStyles;
