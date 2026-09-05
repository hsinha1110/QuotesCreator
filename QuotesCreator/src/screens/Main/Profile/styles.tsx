import { StyleSheet } from 'react-native';

import { moderateScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  // =====================================================
  // CONTAINER
  // =====================================================

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: moderateScale(30),
  },

  // =====================================================
  // PROFILE HEADER
  // =====================================================

  profileHeader: {
    marginHorizontal: moderateScale(16),

    marginTop: moderateScale(8),

    paddingVertical: moderateScale(26),

    borderRadius: moderateScale(20),

    backgroundColor: COLORS.accent,

    alignItems: 'center',

    elevation: moderateScale(4),

    shadowColor: COLORS.black,

    shadowOffset: {
      width: 0,
      height: moderateScale(3),
    },

    shadowOpacity: 0.12,

    shadowRadius: moderateScale(6),
  },

  // =====================================================
  // PROFILE IMAGE WRAPPER
  // =====================================================

  profileImageWrapper: {
    width: moderateScale(88),

    height: moderateScale(88),

    borderRadius: moderateScale(44),

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: moderateScale(3),

    borderColor: '#E7DEFF',

    overflow: 'hidden',
  },

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  profileImage: {
    width: '100%',

    height: '100%',

    borderRadius: moderateScale(44),
  },

  // =====================================================
  // DEFAULT PROFILE
  // =====================================================

  defaultProfile: {
    width: '100%',

    height: '100%',

    borderRadius: moderateScale(44),

    alignItems: 'center',

    justifyContent: 'center',
  },

  // =====================================================
  // PROFILE NAME
  // =====================================================

  profileName: {
    marginTop: moderateScale(12),

    fontSize: moderateScale(18),

    fontWeight: '700',

    color: COLORS.white,
  },

  // =====================================================
  // PROFILE EMAIL
  // =====================================================

  profileEmail: {
    marginTop: moderateScale(4),

    fontSize: moderateScale(11),

    color: '#EDE8FF',
  },

  // =====================================================
  // SECTION TITLE
  // =====================================================

  sectionTitle: {
    marginHorizontal: moderateScale(16),

    marginTop: moderateScale(24),

    marginBottom: moderateScale(10),

    fontSize: moderateScale(15),

    fontWeight: '700',

    color: COLORS.accent,
  },

  // =====================================================
  // CARD
  // =====================================================

  card: {
    marginHorizontal: moderateScale(16),

    borderRadius: moderateScale(16),

    borderWidth: 1,

    overflow: 'hidden',

    elevation: moderateScale(2),

    shadowColor: COLORS.black,

    shadowOffset: {
      width: 0,

      height: moderateScale(2),
    },

    shadowOpacity: 0.06,

    shadowRadius: moderateScale(4),
  },

  // =====================================================
  // PROFILE ROW
  // =====================================================

  profileRow: {
    minHeight: moderateScale(62),

    paddingHorizontal: moderateScale(14),

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  rowLeft: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  // =====================================================
  // ROW ICON
  // =====================================================

  rowIconContainer: {
    width: moderateScale(38),

    height: moderateScale(38),

    borderRadius: moderateScale(19),

    alignItems: 'center',

    justifyContent: 'center',
  },

  // =====================================================
  // ROW TITLE
  // =====================================================

  rowTitle: {
    marginLeft: moderateScale(12),

    fontSize: moderateScale(14),

    fontWeight: '500',
  },

  // =====================================================
  // DIVIDER
  // =====================================================

  divider: {
    height: 1,

    marginLeft: moderateScale(64),
  },

  // =====================================================
  // DANGER
  // =====================================================

  dangerIconContainer: {
    backgroundColor: '#FFF1F1',
  },

  dangerText: {
    color: '#E53935',
  },

  // =====================================================
  // LOGOUT
  // =====================================================

  logoutButton: {
    marginHorizontal: moderateScale(16),

    marginTop: moderateScale(24),

    height: moderateScale(54),

    borderRadius: moderateScale(14),

    borderWidth: 1,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: moderateScale(8),
  },

  logoutText: {
    fontSize: moderateScale(15),

    fontWeight: '600',

    color: '#E53935',
  },
});

export default styles;
