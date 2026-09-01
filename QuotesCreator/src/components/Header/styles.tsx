import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: moderateScale(40),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
    backgroundColor: COLORS.white,
  },
  side: {
    width: moderateScale(45),
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  rightSide: {
    alignItems: 'flex-end',
  },
  rightButton: {
    minHeight: moderateScale(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: moderateScale(4),
  },

  rightText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: COLORS.accent,
    marginRight: moderateScale(6),
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(20),
    fontWeight: '700',
    color: COLORS.black,
  },
  iconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: moderateScale(3),
    right: moderateScale(5),
    minWidth: moderateScale(16),
    height: moderateScale(16),
    paddingHorizontal: moderateScale(4),
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: moderateScale(1.5),
    borderColor: COLORS.white,
  },
  badgeText: {
    fontSize: moderateScale(8),
    lineHeight: moderateScale(10),
    fontWeight: '800',
    color: COLORS.white,
  },
});

export default styles;
