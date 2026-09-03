import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLoader: {
    width: '100%',
    minHeight: moderateScale(60),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(12),
  },
  latestList: {
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(30),
  },
});
export default styles;
