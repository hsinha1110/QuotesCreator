import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = useMemo(
  () =>
    StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        width: moderateScale(200),
        height: moderateScale(200),
      },
      slogan: {
        fontSize: 24,
        color: COLORS.white,
        fontWeight: 'bold',
      },
      progressContainer: {
        position: 'absolute',
        bottom: moderateScale(70),
        width: moderateScale(100),
        height: moderateScale(4),
        borderRadius: moderateScale(10),
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.3)',
      },

      progress: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: moderateScale(10),
      },
    }),
  [],
);
export default styles;
