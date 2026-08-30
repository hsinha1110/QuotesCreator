import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: moderateScale(95),
    height: moderateScale(95),
    marginBottom: moderateScale(20),
  },

  title: {
    fontSize: moderateScale(28),
    fontWeight: '800',
    color: '#111111',
  },

  highlight: {
    color: '#6C2BD9',
  },

  subtitle: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  pagination: {
    position: 'absolute',
    bottom: moderateScale(55),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#6C2BD9',
  },
});

export default styles;
