import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',

      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    tab: {
      flex: 1,
      height: moderateScale(48),

      marginHorizontal: moderateScale(22),

      alignItems: 'center',
      justifyContent: 'center',

      position: 'relative',
    },

    tabText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      color: colors.textSecondary,
    },

    activeTabText: {
      color: colors.accent,
      fontWeight: 'bold',
    },

    activeLine: {
      position: 'absolute',

      bottom: 0,
      left: 0,
      right: 0,

      height: 2,

      backgroundColor: colors.accent,
    },
  });

export default createStyles;
