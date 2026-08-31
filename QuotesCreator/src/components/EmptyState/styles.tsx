import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(30),
  },

  emptyIconContainer: {
    width: moderateScale(85),
    height: moderateScale(85),
    borderRadius: moderateScale(42),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light_grey,
    marginBottom: moderateScale(18),
  },

  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },

  emptyDescription: {
    fontSize: moderateScale(14),
    color: COLORS.black,
    textAlign: 'center',
    lineHeight: moderateScale(21),
    fontWeight: '400',
  },
});

export default styles;
