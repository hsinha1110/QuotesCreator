import {StyleSheet} from 'react-native';

import COLORS from '@/constants/Colors';
import {moderateScale} from '@/styles/scaling';

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: moderateScale(46),
    borderRadius: moderateScale(10),
    backgroundColor: COLORS.white,
    borderWidth: moderateScale(1),
    borderColor: '#E8E4F2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: moderateScale(8),
  },

  icon: {
    width: moderateScale(19),
    height: moderateScale(19),
  },

  text: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.black,
  },
});

export default styles;