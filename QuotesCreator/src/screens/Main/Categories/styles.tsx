import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  categoryList: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(30),
  },

  categoryItem: {
    width: '100%',
  },

  categorySeparator: {
    height: moderateScale(12),
  },

  footerLoader: {
    height: moderateScale(70),
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerSpace: {
    height: moderateScale(30),
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default styles;
