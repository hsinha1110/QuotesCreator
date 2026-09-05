import { StyleSheet } from 'react-native';

import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  // =====================================================
  // CONTAINER
  // =====================================================

  container: {
    flex: 1,
  },

  flexContainer: {
    flex: 1,
  },

  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(30),
  },

  // =====================================================
  // SUBCATEGORY CARD
  // =====================================================

  subCategoryCard: {
    marginBottom: moderateScale(12),

    borderRadius: moderateScale(16),

    borderWidth: 1,

    overflow: 'hidden',

    elevation: moderateScale(2),

    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },

    shadowOpacity: 0.06,

    shadowRadius: moderateScale(4),
  },

  // =====================================================
  // SUBCATEGORY CONTENT
  // =====================================================

  subCategoryContent: {
    minHeight: moderateScale(72),

    paddingHorizontal: moderateScale(16),

    paddingVertical: moderateScale(12),

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  // =====================================================
  // TEXT CONTAINER
  // =====================================================

  subCategoryTextContainer: {
    flex: 1,

    marginRight: moderateScale(12),
  },

  // =====================================================
  // SUBCATEGORY NAME
  // =====================================================

  subCategoryName: {
    fontSize: moderateScale(16),

    fontWeight: '600',
  },

  // =====================================================
  // QUOTE COUNT
  // =====================================================

  subCategoryQuoteCount: {
    marginTop: moderateScale(5),

    fontSize: moderateScale(12),

    fontWeight: '400',
  },

  // =====================================================
  // LOADING
  // =====================================================

  loadingContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',
  },

  // =====================================================
  // FOOTER LOADER
  // =====================================================

  footerLoader: {
    height: moderateScale(60),

    alignItems: 'center',

    justifyContent: 'center',
  },

  // =====================================================
  // EMPTY
  // =====================================================

  emptyContainer: {
    flex: 1,

    minHeight: moderateScale(300),

    alignItems: 'center',

    justifyContent: 'center',
  },
});

export default styles;
