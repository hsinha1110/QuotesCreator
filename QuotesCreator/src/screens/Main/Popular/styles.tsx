import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // ==========================================
  // LIST
  // ==========================================

  listContainer: {
    paddingHorizontal: moderateScale(8),
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(30),
  },

  // ==========================================
  // ITEM GAP
  // ==========================================

  listSeparator: {
    height: moderateScale(12),
  },

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================
  // PAGINATION FOOTER LOADING
  // ==========================================

  footerLoader: {
    width: '100%',

    minHeight: moderateScale(60),

    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: moderateScale(12),
  },
});

export default styles;
