import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
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
  actionLike: {
    flexDirection: 'row',
  },

  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  likesText: {
    marginLeft: moderateScale(5),
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.black,
  },
});

export default styles;
