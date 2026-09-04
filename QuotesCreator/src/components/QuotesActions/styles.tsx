import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
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
    color: COLORS.black,
  },
});

export default styles;
