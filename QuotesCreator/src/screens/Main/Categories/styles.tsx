import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  categoryList: {
    width: '100%',
    paddingHorizontal: moderateScale(12),
  },
  categoryCard: {
    width: moderateScale(100),
  },
  categoryContent: {
    paddingVertical: moderateScale(2),
    paddingBottom: moderateScale(8),
  },

  categorySeparator: {
    height: moderateScale(12),
  },
  categoryItem: {
    width: '100%',
  },
  footerLoader: {
    paddingVertical: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
