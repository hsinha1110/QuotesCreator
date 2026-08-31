import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#EAE4FF',
    borderRadius: moderateScale(14),
    padding: moderateScale(14),
    marginHorizontal: moderateScale(16),
    marginBottom: verticalScale(12),

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  quoteIconContainer: {
    position: 'absolute',
  },

  quoteText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(23),
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: moderateScale(36),
    marginTop: moderateScale(3),
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: verticalScale(10),
    gap: moderateScale(10),
  },

  actionButton: {
    width: moderateScale(34),
    height: moderateScale(34),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteIcon: {
    position: 'absolute',
    top: moderateScale(7),
    left: moderateScale(10),
    width: moderateScale(28),
    height: moderateScale(28),
  },
});

export default styles;
