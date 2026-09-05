import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/constants/Colors';
import { moderateScale } from '@/styles/scaling';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    logo: {
      width: moderateScale(56),
      height: moderateScale(56),
      borderRadius: moderateScale(14),
      alignSelf: 'center',
      marginBottom: moderateScale(20),
      backgroundColor: colors.light_grey,
    },
  });

export default createStyles;
