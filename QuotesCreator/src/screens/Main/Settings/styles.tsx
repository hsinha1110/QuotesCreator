import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  // =====================================================
  // CONTAINER
  // =====================================================

  container: {
    flex: 1,
  },

  // =====================================================
  // CONTENT
  // =====================================================

  content: {
    paddingHorizontal: moderateScale(18),

    paddingBottom: moderateScale(30),
  },

  // =====================================================
  // SWITCH
  // =====================================================

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },

  languageValue: {
    fontSize: moderateScale(12),
  },

  // =====================================================
  // SECTION TITLE
  // =====================================================

  sectionTitle: {
    fontSize: moderateScale(12),

    fontWeight: '700',

    letterSpacing: 0.5,

    marginTop: moderateScale(8),

    marginBottom: moderateScale(10),

    marginLeft: moderateScale(4),
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    borderRadius: moderateScale(16),

    borderWidth: 1,

    overflow: 'hidden',

    marginBottom: moderateScale(22),

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 8,

    elevation: 2,
  },

  // =====================================================
  // ROW
  // =====================================================

  row: {
    minHeight: moderateScale(76),

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: moderateScale(14),

    borderBottomWidth: 1,
  },

  // =====================================================
  // ICON
  // =====================================================

  iconContainer: {
    width: moderateScale(42),

    height: moderateScale(42),

    borderRadius: moderateScale(12),

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: moderateScale(12),
  },

  icon: {
    fontSize: moderateScale(21),

    fontWeight: '600',
  },

  // =====================================================
  // CONTENT
  // =====================================================

  rowContent: {
    flex: 1,

    paddingVertical: moderateScale(10),
  },

  rowTitle: {
    fontSize: moderateScale(15),

    fontWeight: '600',

    marginBottom: moderateScale(4),
  },

  rowSubtitle: {
    fontSize: moderateScale(12),

    lineHeight: moderateScale(17),
  },

  // =====================================================
  // RIGHT
  // =====================================================

  rightContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    marginLeft: moderateScale(8),
  },

  value: {
    fontSize: moderateScale(12),

    marginRight: moderateScale(7),
  },

  arrow: {
    fontSize: moderateScale(25),

    fontWeight: '300',
  },

  // =====================================================
  // LOGOUT
  // =====================================================

  logoutButton: {
    height: moderateScale(58),

    borderRadius: moderateScale(15),

    borderWidth: 1,

    alignItems: 'center',

    justifyContent: 'center',

    flexDirection: 'row',

    marginTop: moderateScale(2),
  },

  logoutIcon: {
    fontSize: moderateScale(23),

    color: '#EF3340',

    marginRight: moderateScale(9),
  },

  logoutText: {
    fontSize: moderateScale(15),

    fontWeight: '600',

    color: '#EF3340',
  },

  // =====================================================
  // VERSION
  // =====================================================

  version: {
    textAlign: 'center',

    fontSize: moderateScale(11),

    marginTop: moderateScale(18),
  },
});

export default styles;
